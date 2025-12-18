import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    console.error(
      "Missing MONGO_URI. Please set it in your Vercel environment variables."
    );
    throw new Error("MONGO_URI not configured");
  }

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB connected (Vercel serverless)");
}

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("Vercel handler error:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end("Internal server error");
    }
  }
}


