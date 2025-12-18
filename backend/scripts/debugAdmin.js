// backend/scripts/debugAdmin.js
// Debug script to check admin in database
// Run: node scripts/debugAdmin.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";

dotenv.config();

const debugAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const email = process.env.ADMIN_EMAIL || "diyaModular@gmail.com";
    const password = process.env.ADMIN_PASSWORD || "Diya@4568";
    
    const normalizedEmail = email.toLowerCase().trim();
    
    console.log("Looking for admin with:");
    console.log(`  Original email: ${email}`);
    console.log(`  Normalized email: ${normalizedEmail}`);
    console.log(`  Password: ${password}\n`);

    // Find all admins
    const allAdmins = await Admin.find({});
    console.log(`\n📊 Total admins in database: ${allAdmins.length}`);
    
    if (allAdmins.length > 0) {
      console.log("\nAll admins in database:");
      allAdmins.forEach((admin, index) => {
        console.log(`\n${index + 1}. Admin:`);
        console.log(`   Email: "${admin.email}"`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log(`   Password hash: ${admin.password.substring(0, 20)}...`);
      });
    }

    // Try to find the specific admin
    console.log(`\n🔍 Searching for admin with email: "${normalizedEmail}"`);
    const admin = await Admin.findOne({ email: normalizedEmail });
    
    if (!admin) {
      console.log("❌ Admin NOT FOUND in database!");
      console.log("\n💡 Solution: Run 'npm run fix-admin' to create the admin user.");
      process.exit(1);
    }

    console.log("✅ Admin FOUND!");
    console.log(`   Email: "${admin.email}"`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Created: ${admin.createdAt}`);

    // Test password comparison
    console.log("\n🔐 Testing password comparison...");
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (isPasswordValid) {
      console.log("✅ Password is CORRECT!");
    } else {
      console.log("❌ Password is INCORRECT!");
      console.log("\n💡 Solution: Run 'npm run fix-admin' to update the password.");
    }

    // Test using the model method
    console.log("\n🔐 Testing with model.comparePassword method...");
    const isValidViaMethod = await admin.comparePassword(password);
    console.log(`   Result: ${isValidViaMethod ? "✅ Valid" : "❌ Invalid"}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  }
};

debugAdmin();


