import express from "express";
import { createReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router();

// Public routes
router.post("/", createReview);
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Reviews fetch error:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});


export default router;




