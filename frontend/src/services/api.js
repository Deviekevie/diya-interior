// frontend/src/services/api.js
import axios from "axios";

// Centralized API base URL
// Production: MUST be set via VITE_API_URL (e.g. https://your-backend.vercel.app/api)
// Local dev: Falls back to http://localhost:5000/api if VITE_API_URL not set
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : null);

if (!API_BASE_URL) {
  // Throw clear error in production if VITE_API_URL is missing
  const errorMsg =
    "VITE_API_URL is not defined. Please set it in Vercel environment variables to your backend base URL, e.g. https://diya-interior-8rbh.vercel.app/api";
  // eslint-disable-next-line no-console
  console.error(errorMsg);
  throw new Error(errorMsg);
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      // Redirect to login if not already there
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
 * @returns {Promise}
 */
export const getReviews = async () => {
  const response = await api.get("/api/reviews");
  return response.data;
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



