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

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json());

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



