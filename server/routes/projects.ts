import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Project from "../models/Project";
import { ensureAuth } from "./auth";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${file.originalname}`);
  },
});
const upload = multer({ storage });

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
        status: "pending", // ✅ default status
        thumbsUp: 0,
        thumbsDown: 0,
        votes: [],
        comments: [],
      });

      await project.save();

      res.json({ message: "Project uploaded successfully", project });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.patch("/:id", ensureAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected: "approved" | "rejected" | "pending"

    if (!["approved", "rejected", "pending"].includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.status = status;
    await project.save();

    res.json({ message: `Project ${status}`, project });
  } catch (err) {
    console.error("Error updating project status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { userId, status } = req.query;
    const currentUser = req.session.user;
    const isAdmin = currentUser?.role === "admin";

    const query: any = {};

    if (userId) query.uploadedBy = userId;
    if (status) query.status = status;

    // For guests, only show approved projects
    if (!currentUser) {
      query.status = "approved";
    } else if (!isAdmin) {
      // Normal users see approved + their own pending
      query.$or = [
        { status: "approved" },
        { status: "pending", uploadedBy: currentUser.id },
      ];
    }

    const projects = await Project.find(query)
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 })
      .limit(50); // safety limit

    res.json(projects);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ───────────────────────────────
// Comments
// ───────────────────────────────
router.post("/:id/comments", async (req, res) => {
  try {
    const { author, text } = req.body;
    if (!text || !author) return res.status(400).json({ message: "Author and text required" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const newComment = { author, text, createdAt: new Date() };
    project.comments.unshift(newComment);
    await project.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).select("comments");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/vote", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, userId } = req.body;

    if (!["up", "down"].includes(type))
      return res.status(400).json({ message: "Invalid vote type" });

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const existingVote = project.votes.find(v => v.userId === userId);

    if (existingVote) {
      if (existingVote.type === type) {
        project.votes = project.votes.filter(v => v.userId !== userId);
        if (type === "up") project.thumbsUp -= 1;
        else project.thumbsDown -= 1;
      } else {
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
      project.votes.push({ userId, type });
      if (type === "up") project.thumbsUp += 1;
      else project.thumbsDown += 1;
    }

    await project.save();
    res.json({ thumbsUp: project.thumbsUp, thumbsDown: project.thumbsDown, message: "Vote updated" });
  } catch (err) {
    console.error("Vote error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.session.user;
    const project = await Project.findById(id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    const isOwner = project.uploadedBy?.toString() === currentUser?.id?.toString();
    const isAdmin = currentUser?.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "Not authorized" });

    await Project.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id", ensureAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, status } = req.body;
    const currentUser = req.session.user;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Authorization: only owner or admin can edit
    const isOwner = project.uploadedBy?.toString() === currentUser?.id?.toString();
    const isAdmin = currentUser?.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "Not authorized" });

    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.tags = tags ?? project.tags;
    project.status = status ?? project.status;

    await project.save();

    res.json({ message: "Project updated", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
