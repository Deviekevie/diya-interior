import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import reiewRoutes from "./routes/reviewRoutes.js";
import cors from "cors";
import express from "express"
const app=express();
app.use(
  cors({
    origin: [
      "https://diyamodularwebpage.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.options("*", cors());

app.use("/api/reviews", reiewRoutes);
dotenv.config();

const PORT = process.env.PORT || 5000;

// Local/server hosting entry point
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
