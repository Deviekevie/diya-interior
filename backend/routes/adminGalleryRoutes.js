// backend/routes/adminGalleryRoutes.js
import express from "express";
import {
  uploadImage,
  updateImage,
  deleteImage,
} from "../controllers/galleryController.js";
import { parser } from "../middleware/cloudinaryUpload.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// POST /api/admin/gallery - upload image
router.post("/", verifyAdmin, parser.single("file"), uploadImage);

// PUT /api/admin/gallery/:id - edit image / metadata (optionally replace image)
router.put("/:id", verifyAdmin, parser.single("file"), updateImage);

// DELETE /api/admin/gallery/:id - delete image (Cloudinary + DB)
router.delete("/:id", verifyAdmin, deleteImage);

export default router;



