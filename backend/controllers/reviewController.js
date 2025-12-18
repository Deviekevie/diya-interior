import Review from "../models/Review.js";

// POST /api/reviews - create a new review
export const createReview = async (req, res) => {
  try {
    const { name, rating, message } = req.body;

    if (!name || !rating || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Name, rating and message are required." });
    }

    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5." });
    }

    const review = await Review.create({
      name: name.trim(),
      rating: numericRating,
      message: message.trim(),
    });

    return res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("Create review error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to submit review. Please try again." });
  }
};

// GET /api/reviews - list reviews (newest first)
export const getReviews = async (_req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load reviews." });
  }
};




