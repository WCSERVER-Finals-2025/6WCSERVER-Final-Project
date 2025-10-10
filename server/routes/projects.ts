import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Project from "../models/Project";
import { ensureAuth } from "./auth"; // make sure this export exists in auth.ts

const router = express.Router();

// ───────────────────────────────
// 🗂  SETUP MULTER FOR FILE UPLOADS
// ───────────────────────────────
const uploadDir = path.join(process.cwd(), "uploads");

// create "uploads" folder if it doesn’t exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ───────────────────────────────
// 🔒  MIDDLEWARE TO CHECK LOGIN
// ───────────────────────────────
// function ensureAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   next();
// }

// ───────────────────────────────
// 🚀  POST /api/projects/upload
// ───────────────────────────────
router.post(
  "/upload",
  ensureAuth,
  upload.array("files", 10),
  async (req, res) => {
    try {
      const { title, description, course, tags } = req.body;
      const user = req.session.user;

      if (!title || !description || !course) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const fileInfos = (req.files as Express.Multer.File[]).map((file) => ({
        name: file.originalname,
        path: `/uploads/${file.filename}`,
        size: file.size,
      }));

      const project = new Project({
        title,
        description,
        course,
        tags: tags ? tags.split(",") : [],
        files: fileInfos,
        uploadedBy: user?.id,
        createdAt: new Date(),
      });

      await project.save();

      res.json({ message: "Project uploaded successfully", project });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post("/:id/comments", async (req, res) => {
  try {
    const { author, text } = req.body;
    if (!text || !author)
      return res.status(400).json({ message: "Author and text are required." });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });

    const newComment = { author, text };
    project.comments.unshift(newComment);
    await project.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// --- VOTING (THUMBS UP / DOWN) ---
router.post("/:id/vote", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, userId } = req.body; // type = "up" | "down"

    if (!["up", "down"].includes(type)) {
      return res.status(400).json({ message: "Invalid vote type." });
    }

    // Fetch the project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Check if user already voted
    const existingVote = project.votes.find(v => v.userId === userId);

    if (existingVote) {
      if (existingVote.type === type) {
        // ✅ Remove vote if same vote is clicked again (toggle off)
        project.votes = project.votes.filter(v => v.userId !== userId);
        if (type === "up") project.thumbsUp -= 1;
        else project.thumbsDown -= 1;
      } else {
        // ✅ Switch vote from up → down or down → up
        existingVote.type = type;
        if (type === "up") {
          project.thumbsUp += 1;
          project.thumbsDown -= 1;
        } else {
          project.thumbsDown += 1;
          project.thumbsUp -= 1;
        }
      }
    } else {
      // ✅ New vote
      project.votes.push({ userId, type });
      if (type === "up") project.thumbsUp += 1;
      else project.thumbsDown += 1;
    }

    await project.save();

    res.json({
      thumbsUp: project.thumbsUp,
      thumbsDown: project.thumbsDown,
      message: "Vote updated successfully.",
    });
  } catch (err) {
    console.error("Error updating vote:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ───────────────────────────────
// 📜  GET /api/projects
// ───────────────────────────────
router.get("/", ensureAuth, async (req, res) => {
  try {
    const { userId, status } = req.query;
    const query: any = {};

    // ✅ If ?userId=xxx is provided, filter by uploader
    if (userId) {
      query.uploadedBy = userId;
    }

    // ✅ Optional status filtering (e.g., ?status=approved)
    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 }); // newest first

    res.json(projects);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).select("comments");
    if (!project) return res.status(404).json({ message: "Project not found." });
    res.json(project.comments);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/", ensureAuth, async (req, res) => {
  try {
    const { course, tags, q } = req.query;
    const query: any = {};

    // Filter by course
    if (course) query.course = course;

    // Filter by tags (any match)
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : (tags as string).split(",");
      query.tags = { $in: tagArray };
    }

    // Search by title, author, or description (case-insensitive)
    if (q) {
      const regex = new RegExp(q as string, "i");
      query.$or = [
        { title: regex },
        { author: regex },
        { description: regex },
      ];
    }

    const projects = await Project.find(query)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 }); // newest first

    res.json(projects);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
