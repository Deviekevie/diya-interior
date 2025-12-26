import express from "express";
import { createReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router();

// Public routes
router.post("/", createReview);
router.get("/", getReviews);

export default router;





