// backend/routes/adminRoutes.js
import express from "express";
import { login, getMe } from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public route
router.post("/login", login);

// Protected routes
router.get("/me", verifyAdmin, getMe);

export default router;
