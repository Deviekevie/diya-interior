import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import reiewRoutes from "./routes/reviewRoutes.js";

// Use review routes
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
