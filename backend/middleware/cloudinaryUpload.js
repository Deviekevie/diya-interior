// backend/middleware/cloudinaryUpload.js
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Use centralized Cloudinary config from config/cloudinary.js
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gallery",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        quality: "auto:good", // Auto quality with good compression
        fetch_format: "auto", // Auto format (webp when supported)
        width: 1920, // Max width
        height: 1080, // Max height
        crop: "limit", // Don't crop, just limit dimensions
      },
    ],
  },
});

export const parser = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      file.originalname.toLowerCase().split(".").pop()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed!"));
  },
});
