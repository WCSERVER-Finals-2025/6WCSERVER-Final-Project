// routes/users.ts
import express from "express";
import mongoose from "mongoose";
import Project from "../models/Project";
import { ensureAuth } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User";

const router = express.Router();

// Multer setup for resume uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${file.originalname}`);
  },
});
// Allow only common resume types and limit size to 5MB
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type. Only PDF/DOC/DOCX allowed."));
  },
});

// GET /api/users/:id/stats
router.get("/:id/stats", ensureAuth, async (req, res) => {
  try {
    const userId = req.params.id;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // ✅ Single aggregation for both count and thumbsUp sum
    const stats = await Project.aggregate([
      { $match: { uploadedBy: new mongoose.Types.ObjectId(userId) } },
      { 
        $group: { 
          _id: null,
          projectsCount: { $sum: 1 },
          totalThumbsUp: { $sum: "$thumbsUp" }
        } 
      }
    ]);

    const { projectsCount = 0, totalThumbsUp: rating = 0 } = stats[0] || {};

    res.json({ projectsCount, rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

// Upload resume
router.post("/:id/resume", ensureAuth, upload.single("resume"), async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.session.user;
    if (currentUser?.id !== userId && !(currentUser?.role === "admin" || currentUser?.role === "teacher"))
      return res.status(403).json({ message: "Not authorized" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.resume = {
      name: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
    };

    await user.save();
    res.json({ message: "Resume uploaded", resume: user.resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get resume info
router.get("/:id/resume", ensureAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("resume");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.resume || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Secure promote endpoint - requires PROMOTE_SECRET header
router.post("/:id/promote", async (req, res) => {
  try {
    const secret = req.headers["x-promote-secret"] || req.body?.secret;
    if (!secret || secret !== process.env.PROMOTE_SECRET) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "admin";
    await user.save();
    res.json({ message: "User promoted to admin", user: { id: user._id, role: user.role } });
  } catch (err) {
    console.error("Promote error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
