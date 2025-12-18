// backend/routes/galleryRoutes.js
import express from "express";
import {
  uploadImage,
  getAllImages,
  getGalleryByCategory,
  deleteImage,
} from "../controllers/galleryController.js";
import { parser } from "../middleware/cloudinaryUpload.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllImages); // GET /api/gallery?page=1&limit=20&category=kitchen
router.get("/:category", getGalleryByCategory); // GET /api/gallery/:category

// Protected admin routes
router.post("/upload", verifyAdmin, parser.single("file"), uploadImage);
router.delete("/:id", verifyAdmin, deleteImage);

export default router;
