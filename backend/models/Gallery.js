// backend/models/Gallery.js
import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    // Optimized image URL from Cloudinary
    imageUrl: { type: String, required: true },

    // Cloudinary public_id for deletion and transformations
    publicId: { type: String, required: true },

    // Display fields
    title: { type: String, default: "" },
    description: { type: String, default: "" },

    // Category for filtering (e.g. kitchen, living, etc.)
    category: { type: String, required: true, index: true },

    // SEO-friendly alternative text for images
    altText: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound index for faster category + date queries
gallerySchema.index({ category: 1, createdAt: -1 });

export default mongoose.model("Gallery", gallerySchema);
