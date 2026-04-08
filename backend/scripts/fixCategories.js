import mongoose from "mongoose";
import Course from "../model/courseModel.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const fixCategories = async () => {
  try {
    // Use MONGODB_URL (not MONGODB_URI)
    const mongoUrl = process.env.MONGODB_URL;
    console.log("MongoDB URL:", mongoUrl ? "Found ✅" : "Not found ❌");

    if (!mongoUrl) {
      console.error("MONGODB_URL not found in .env file");
      process.exit(1);
    }

    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB ✅");

    const misspellings = [
      "App Deveopment",
      "App Devleopment",
      "App Devlopment",
      "Appdevelopment",
      "app deveopment",
      "app devleopment",
    ];

    const result = await Course.updateMany(
      { category: { $in: misspellings } },
      { $set: { category: "App Development" } },
    );

    console.log(`✅ Fixed ${result.modifiedCount} courses`);

    const categories = await Course.distinct("category");
    console.log("📚 Current categories:", categories);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

fixCategories();
