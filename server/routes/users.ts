// routes/users.ts
import express from "express";
import Project from "../models/Project";
import { ensureAuth } from "./auth";

const router = express.Router();

// GET /api/users/:id/stats
router.get("/:id/stats", ensureAuth, async (req, res) => {
  try {
    const userId = req.params.id;

    const projectsCount = await Project.countDocuments({ uploadedBy: userId });
    const ratingAggregate = await Project.aggregate([
      { $match: { uploadedBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalThumbsUp: { $sum: "$thumbsUp" } } },
    ]);

    const rating = ratingAggregate[0]?.totalThumbsUp || 0;

    res.json({ projectsCount, rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
