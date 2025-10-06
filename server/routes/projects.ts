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

// ───────────────────────────────
// 📜  GET /api/projects
// ───────────────────────────────
router.get("/", ensureAuth, async (req, res) => {
  try {
    const projects = await Project.find().populate("uploadedBy", "name email");
    res.json(projects);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
