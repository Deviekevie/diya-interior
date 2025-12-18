// backend/controllers/galleryController.js
import Gallery from "../models/Gallery.js";
import cloudinary from "../config/cloudinary.js";
import { getGalleryImageUrl } from "../utils/cloudinaryUtils.js";

/**
 * Upload image to Cloudinary and save to database
 * Admin-only
 * POST /api/admin/gallery
 */
export const uploadImage = async (req, res) => {
  try {
    const { category, description, title, altText } = req.body;

    // Validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // Cloudinary file info from multer-storage-cloudinary
    // path  -> secure URL
    // filename -> public_id
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    if (!imageUrl || !publicId) {
      return res.status(500).json({
        success: false,
        message: "Upload failed: missing Cloudinary data.",
      });
    }

    // Create gallery entry
    const image = await Gallery.create({
      imageUrl,
      publicId,
      title: title?.trim() || "",
      category: category.toLowerCase().trim(),
      description: description?.trim() || "",
      altText:
        altText?.trim() ||
        title?.trim() ||
        description?.trim() ||
        `${category} project`,
    });

    res.status(201).json({
      success: true,
      image,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    // If database save fails, try to delete from Cloudinary
    if (req.file?.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (cloudErr) {
        console.error("Failed to cleanup Cloudinary:", cloudErr);
      }
    }

    res.status(500).json({
      success: false,
      message: "Upload failed. Please try again.",
    });
  }
};

/**
 * Update image metadata and optionally replace Cloudinary image
 * Admin-only
 * PUT /api/admin/gallery/:id
 */
export const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, altText } = req.body;

    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    let oldPublicId = null;

    // If a new file is uploaded, replace the Cloudinary image
    if (req.file) {
      const newImageUrl = req.file.path;
      const newPublicId = req.file.filename;

      if (!newImageUrl || !newPublicId) {
        return res.status(500).json({
          success: false,
          message: "Image replacement failed: missing Cloudinary data.",
        });
      }

      // Store old publicId for cleanup
      oldPublicId = image.publicId;

      // Update to new image
      image.imageUrl = newImageUrl;
      image.publicId = newPublicId;
    }

    // Update editable fields if provided
    if (typeof title === "string") image.title = title.trim();
    if (typeof description === "string")
      image.description = description.trim();
    if (typeof category === "string" && category.trim())
      image.category = category.toLowerCase().trim();
    if (typeof altText === "string" && altText.trim())
      image.altText = altText.trim();

    await image.save();

    // After successful DB save, delete old Cloudinary asset (if replaced)
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (cloudErr) {
        console.error("Cloudinary delete error (old image):", cloudErr);
        // Not fatal for the API response
      }
    }

    res.json({
      success: true,
      image,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Update failed. Please try again.",
    });
  }
};

/**
 * Get all images (public endpoint with pagination)
 * GET /api/gallery?page=1&limit=20&category=kitchen
 */
export const getAllImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    // Build query
    const query = category ? { category: category.toLowerCase() } : {};

    // Get images with pagination
    const [images, total] = await Promise.all([
      Gallery.find(query)
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Gallery.countDocuments(query),
    ]);

    // Add optimized URLs
    const optimizedImages = (images || []).map((img) => ({
      ...img,
      optimizedUrl: img.publicId
        ? getGalleryImageUrl(img.publicId)
        : img.imageUrl, // Fallback to original URL
    }));

    res.json({
      success: true,
      images: optimizedImages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch images",
      images: [],
    });
  }
};

/**
 * Get images by category (public endpoint)
 * GET /api/gallery/:category
 */
export const getGalleryByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const images = await Gallery.find({ category: category.toLowerCase() })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    // Add optimized URLs
    const optimizedImages = (images || []).map((img) => ({
      ...img,
      optimizedUrl: img.publicId
        ? getGalleryImageUrl(img.publicId)
        : img.imageUrl, // Fallback to original URL
    }));

    res.json({
      success: true,
      images: optimizedImages,
    });
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch images",
      images: [],
    });
  }
};

/**
 * Delete image from Cloudinary and database (protected)
 * DELETE /api/admin/gallery/:id
 */
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find image in database
    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Delete from Cloudinary
    if (image.publicId) {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (cloudErr) {
        console.error("Cloudinary delete error:", cloudErr);
        // Continue with DB deletion even if Cloudinary fails
      }
    }

    // Delete from database
    await Gallery.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Delete failed. Please try again.",
    });
  }
};
