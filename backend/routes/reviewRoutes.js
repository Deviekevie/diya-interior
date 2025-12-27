import express from "express";
import { createReview, getReviews, deleteReview } from "../controllers/reviewController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/", createReview);
router.get("/", getReviews);
// Protected admin route
router.delete("/:id", verifyAdmin, deleteReview);

export default router;





