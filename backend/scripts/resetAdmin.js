// backend/scripts/resetAdmin.js
// Script to completely delete and recreate admin user
// Run: node scripts/resetAdmin.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const resetAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const email = process.env.ADMIN_EMAIL || "diyaModular@gmail.com";
    const password = process.env.ADMIN_PASSWORD || "Diya@4568";
    const role = process.env.ADMIN_ROLE || "admin";

    const normalizedEmail = email.toLowerCase().trim();

    console.log("🔄 Resetting admin user...");
    console.log(`Email: ${normalizedEmail}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${role}\n`);

    // Delete existing admin if exists
    const deleted = await Admin.deleteOne({ email: normalizedEmail });
    if (deleted.deletedCount > 0) {
      console.log("✅ Deleted existing admin");
    } else {
      console.log("ℹ️  No existing admin to delete");
    }

    // Create new admin
    console.log("\n📝 Creating new admin...");
    const admin = await Admin.create({
      email: normalizedEmail,
      password: password, // Will be hashed by pre-save hook
      role: role,
    });

    console.log("✅ Admin created successfully!");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin._id}`);

    // Verify password works
    console.log("\n🔐 Verifying password...");
    const isValid = await admin.comparePassword(password);
    if (isValid) {
      console.log("✅ Password verification: SUCCESS");
    } else {
      console.log("❌ Password verification: FAILED");
      throw new Error("Password verification failed");
    }

    // Final check
    const verifyAdmin = await Admin.findOne({ email: normalizedEmail });
    if (verifyAdmin) {
      console.log("\n✅ Final verification: Admin exists and is ready to use!");
      console.log(`   You can now login with:`);
      console.log(`   Email: ${normalizedEmail}`);
      console.log(`   Password: ${password}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.code === 11000) {
      console.error("   Duplicate email - try running again");
    }
    console.error(error);
    process.exit(1);
  }
};

resetAdmin();


