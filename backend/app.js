
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import galleryRoutes from "./routes/galleryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminGalleryRoutes from "./routes/adminGalleryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

// Strict CORS configuration for production + local dev
const allowedOrigins = [
  "diyamodulardesign.vercel.app", // production frontend
  "http://localhost:5173", // local Vite dev
  process.env.CLIENT_ORIGIN || null, // optional override from env
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server or tools (no Origin header)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Generic preflight handler (no route pattern to avoid path-to-regexp issues)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static uploads (mainly for local dev / legacy assets)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API routes
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/gallery", adminGalleryRoutes);
app.use("/api/reviews", reviewRoutes);

export default app;



