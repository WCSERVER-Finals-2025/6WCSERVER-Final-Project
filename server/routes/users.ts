import express from "express";
import mongoose from "mongoose";
import Project from "../models/Project";
import { ensureAuth } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User";

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

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/tiff",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

const imageUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/stats", ensureAuth, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const stats = await Project.aggregate([
      { $match: { uploadedBy: new mongoose.Types.ObjectId(userId) } },
      { 
        $group: { 
          _id: null,
          projectsCount: { $sum: 1 },
          totalThumbsUp: { $sum: "$thumbsUp" },
          totalThumbsDown: { $sum: "$thumbsDown" }
        } 
      }
    ]);

    const { projectsCount = 0, totalThumbsUp: rating = 0, totalThumbsDown = 0 } = stats[0] || {};

    res.json({ projectsCount, rating, totalThumbsDown });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/resumes", ensureAuth, upload.array("resumes", 10), async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.session.user;
    if (currentUser?.id !== userId && !(currentUser?.role === "admin" || currentUser?.role === "teacher"))
      return res.status(403).json({ message: "Not authorized" });

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) 
      return res.status(400).json({ message: "No files uploaded" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newResumes = (req.files as Express.Multer.File[]).map(file => ({
      name: file.originalname,
      path: `/uploads/${file.filename}`,
      size: file.size,
      uploadedAt: new Date(),
    }));

    newResumes.forEach(resume => user.resumes.push(resume));
    await user.save();
    res.json({ message: "Resumes uploaded", resumes: user.resumes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/resumes", ensureAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("resumes");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.resumes || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id/resumes/:resumeId", ensureAuth, async (req, res) => {
  try {
    const { id: userId, resumeId } = req.params;
    const currentUser = req.session.user;
    if (currentUser?.id !== userId && !(currentUser?.role === "admin" || currentUser?.role === "teacher"))
      return res.status(403).json({ message: "Not authorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const resumeIndex = parseInt(resumeId);
    if (user.resumes && user.resumes[resumeIndex]) {
      user.resumes.splice(resumeIndex, 1);
    }
    await user.save();
    res.json({ message: "Resume deleted", resumes: user.resumes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/profile-picture", ensureAuth, imageUpload.single("profilePicture"), async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.session.user;
    if (currentUser?.id !== userId && !(currentUser?.role === "admin" || currentUser?.role === "teacher"))
      return res.status(403).json({ message: "Not authorized" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePicture = {
      name: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
    };

    await user.save();
    res.json({ message: "Profile picture uploaded", profilePicture: user.profilePicture });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/profile", ensureAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.session.user;
    if (currentUser?.id !== userId && !(currentUser?.role === "admin" || currentUser?.role === "teacher"))
      return res.status(403).json({ message: "Not authorized" });

    const { name, bio } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;

    await user.save();
    res.json({ message: "Profile updated", user: { id: user._id, name: user.name, bio: user.bio } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

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

export default router;
