import mongoose from "mongoose";
import app from "../app.js";

let isConnected = false;
let envValidated = false;

function validateEnv() {
  if (envValidated) return;

  const required = ["MONGO_URI", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `Missing required environment variables: ${missing.join(
        ", "
      )}. Please configure them in your Vercel project settings.`
    );
  }

  envValidated = true;
}

async function connectDB() {
  if (isConnected) return;

  validateEnv();

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  // eslint-disable-next-line no-console
  console.log("MongoDB connected (Vercel)");
}

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Serverless handler error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
