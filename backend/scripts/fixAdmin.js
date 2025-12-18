// backend/scripts/fixAdmin.js
// Script to create or update admin user
// Run: node scripts/fixAdmin.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const fixAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get admin credentials from environment
    const email = process.env.ADMIN_EMAIL || "diyaModular@gmail.com";
    const password = process.env.ADMIN_PASSWORD || "Diya@4568";
    const role = process.env.ADMIN_ROLE || "admin";

    console.log("Attempting to create/update admin with:");
    console.log(`Email: ${email}`);
    console.log(`Role: ${role}\n`);

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });
    
    if (existingAdmin) {
      console.log("⚠️  Admin already exists. Updating password...");
      
      // Force password update by marking as modified
      existingAdmin.password = password;
      existingAdmin.markModified('password'); // Ensure pre-save hook runs
      await existingAdmin.save();
      
      console.log("✅ Admin password updated successfully!");
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Role: ${existingAdmin.role}`);
      
      // Verify password was updated
      const verifyPassword = await existingAdmin.comparePassword(password);
      if (verifyPassword) {
        console.log("✅ Password verification: SUCCESS");
      } else {
        console.log("❌ Password verification: FAILED - Something went wrong");
      }
    } else {
      console.log("Creating new admin...");
      
      // Create new admin (password will be hashed automatically by the model)
      const admin = await Admin.create({
        email: email.toLowerCase().trim(),
        password, // Will be hashed by pre-save hook
        role,
      });

      console.log("✅ Admin created successfully!");
      console.log(`Email: ${admin.email}`);
      console.log(`Role: ${admin.role}`);
    }

    // Verify the admin exists
    const verifyAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (verifyAdmin) {
      console.log("\n✅ Verification: Admin exists in database");
      console.log(`   Email: ${verifyAdmin.email}`);
      console.log(`   Role: ${verifyAdmin.role}`);
      console.log(`   Created: ${verifyAdmin.createdAt}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.code === 11000) {
      console.error("   Duplicate email detected. Try updating instead.");
    }
    process.exit(1);
  }
};

fixAdmin();

