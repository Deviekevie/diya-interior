// backend/scripts/createAdmin.js
// Script to create initial admin user
// Run: node scripts/createAdmin.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get admin credentials from environment or use defaults
    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const role = process.env.ADMIN_ROLE || "admin";

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`Admin with email ${email} already exists.`);
      process.exit(0);
    }

    // Create new admin (password will be hashed automatically by the model)
    const admin = await Admin.create({
      email,
      password, // Will be hashed by pre-save hook
      role,
    });

    console.log("✅ Admin created successfully!");
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log("\n⚠️  Please change the default password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();



