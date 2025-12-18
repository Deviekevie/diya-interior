// backend/utils/cloudinaryUtils.js
import cloudinary from "../config/cloudinary.js";

/**
 * Generate optimized Cloudinary URL with transformations
 * @param {string} publicId - Cloudinary public_id
 * @param {Object} options - Transformation options
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = null,
    height = null,
    quality = "auto:good",
    format = "auto",
    crop = "limit",
  } = options;

  const transformations = {
    quality,
    fetch_format: format,
  };

  if (width) transformations.width = width;
  if (height) transformations.height = height;
  if (crop) transformations.crop = crop;

  return cloudinary.url(publicId, {
    transformation: [transformations],
    secure: true,
  });
};

/**
 * Generate thumbnail URL
 * @param {string} publicId - Cloudinary public_id
 * @returns {string} Thumbnail URL
 */
export const getThumbnailUrl = (publicId) => {
  return getOptimizedImageUrl(publicId, {
    width: 300,
    height: 300,
    crop: "fill",
    quality: "auto:good",
  });
};

/**
 * Generate optimized gallery image URL
 * @param {string} publicId - Cloudinary public_id
 * @returns {string} Optimized URL
 */
export const getGalleryImageUrl = (publicId) => {
  return getOptimizedImageUrl(publicId, {
    width: 800,
    height: 600,
    crop: "limit",
    quality: "auto:good",
  });
};



