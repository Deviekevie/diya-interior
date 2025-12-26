
import axios from "axios";

// API base URL configuration
// Production: Use VITE_API_BASE_URL (can be with or without /api suffix)
// Local dev: Fallback to localhost:5000/api
let API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : null);

if (!API_BASE_URL) {
  const errorMsg =
    "VITE_API_BASE_URL is not defined. Please set it in Vercel environment variables to your backend base URL, e.g. https://diya-interior.onrender.com/api";
  console.error(errorMsg);
  throw new Error(errorMsg);
}

// Ensure baseURL ends with /api for consistent routing
// If user provides https://diya-interior.onrender.com, append /api
// If user provides https://diya-interior.onrender.com/api, keep as is
if (!API_BASE_URL.endsWith("/api")) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, "") + "/api";
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      if (window.location.pathname !== "/admin-login") {
        window.location.href = "/admin-login";
      }
    }
    return Promise.reject(error);
  }
);

// ==================== ADMIN API ====================

/**
 * Admin login
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
export const adminLogin = async (email, password) => {
  const response = await api.post("/admin/login", { email, password });
  return response.data;
};

/**
 * Get current admin info
 * @returns {Promise}
 */
export const getAdminInfo = async () => {
  const response = await api.get("/admin/me");
  return response.data;
};

// ==================== GALLERY API ====================

/**
 * Get all images with pagination
 * @param {Object} params - { page, limit, category }
 * @returns {Promise}
 */
export const getAllImages = async (params = {}) => {
  const response = await api.get("/gallery", { params });
  return response.data;
};

/**
 * Get images by category
 * @param {string} category
 * @returns {Promise}
 */
export const getImagesByCategory = async (category) => {
  const response = await api.get(`/gallery/${category}`);
  return response.data;
};

/**
 * Upload image (admin only)
 * @param {FormData} formData
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise}
 */
export const uploadImage = async (formData, onUploadProgress) => {
  const response = await api.post("/gallery/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(percentCompleted);
      }
    },
  });
  return response.data;
};

/**
 * Delete image (admin only)
 * @param {string} imageId
 * @returns {Promise}
 */
export const deleteImage = async (imageId) => {
  const response = await api.delete(`/gallery/${imageId}`);
  return response.data;
};

// ==================== CONTACT API ====================

/**
 * Submit contact form
 * @param {Object} data - { name, email, phone, message }
 * @returns {Promise}
 */
export const submitContact = async (data) => {
  const response = await api.post("/contact", data);
  return response.data;
};

// ==================== REVIEWS API ====================

/**
 * Fetch all reviews
 * @returns {Promise<Array>} Array of review objects
 */
export const getReviews = async () => {
  const response = await api.get("/reviews");
  // Backend returns { success: true, reviews: [...] }
  // Extract and return the reviews array with safe fallback
  return Array.isArray(response.data?.reviews) ? response.data.reviews : [];
};

/**
 * Create a new review
 * @param {{name: string, rating: number, message: string}} data
 * @returns {Promise}
 */
export const createReview = async (data) => {
  const response = await api.post("/reviews", data);
  return response.data;
};

export default api;



