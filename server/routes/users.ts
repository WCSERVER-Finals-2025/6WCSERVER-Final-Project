// routes/users.ts
import express from "express";
import mongoose from "mongoose";
import Project from "../models/Project";
import { ensureAuth } from "./auth";

const router = express.Router();

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
