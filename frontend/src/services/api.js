import axios from "axios";

// API base URL configuration
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
if (!API_BASE_URL.endsWith("/api")) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, "") + "/api";
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
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
export const adminLogin = async (email, password) => {
  const response = await api.post("/admin/login", { email, password });
  return response.data;
};

export const getAdminInfo = async () => {
  const response = await api.get("/admin/me");
  return response.data;
};

// ==================== GALLERY API ====================
export const getAllImages = async (params = {}) => {
  const response = await api.get("/gallery", { params });
  return response.data;
};

export const getImagesByCategory = async (category) => {
  const response = await api.get(`/gallery/${category}`);
  return response.data;
};

export const uploadImage = async (formData, onUploadProgress) => {
  const response = await api.post("/gallery/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
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

export const deleteImage = async (imageId) => {
  const response = await api.delete(`/gallery/${imageId}`);
  return response.data;
};

// ==================== CONTACT API ====================
export const submitContact = async (data) => {
  const response = await api.post("/contact", data);
  return response.data;
};

// ==================== REVIEWS API ====================
export const getReviews = async () => {
  const response = await api.get("/reviews");
  return Array.isArray(response.data?.reviews) ? response.data.reviews : [];
};

export const createReview = async (data) => {
  const response = await api.post("/reviews", data);
  return response.data;
};

// ✅ Fixed deleteReview (only one function)
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

export default api;
