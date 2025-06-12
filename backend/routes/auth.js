import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import admin from "firebase-admin";
import { protect } from "../middlewares/auth.js";
import { courseProgress } from "../models/CourseProgress.js"; // ✅ Fix

const router = express.Router();

import { initializeApp, cert } from "firebase-admin/app";

const serviceAccountBase64 = process.env.FIREBASE_CONFIG_BASE64;

const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
);

initializeApp({
  credential: cert(serviceAccount),
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// User Login (Email/Password)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Google OAuth Login
router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: "google-auth", // Placeholder
        imageUrl: picture,
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token: jwtToken,
      userId: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

router.get("/enrollments", protect, async (req, res) => {
  try {
    console.log("🔍 Fetching enrollments...");

    // Check if user ID exists
    if (!req.user || !req.user.id) {
      console.error("❌ User not authenticated!");
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const userId = req.user.id;
    console.log("✅ User ID:", userId);

    const user = await User.findById(userId).populate(
      "enrolledCourses.courseId"
    );
    if (!user) {
      console.error("❌ User not found in DB!");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Enrolled Courses:", user.enrolledCourses.length);

    const progressData = await courseProgress.find({ userId });

    // Format courses
    const formattedCourses = user.enrolledCourses
      .map((enrolled) => {
        const course = enrolled.courseId;
        if (!course) return null; // Ensure course exists

        const progress = progressData.find(
          (p) => p.courseId.toString() === course._id.toString()
        );

        return {
          ...course.toObject(),
          lectureCompleted: progress ? progress.lectureCompleted.length : 0,
          totalLectures: course.courseContent.reduce(
            (total, chapter) => total + chapter.chapterContent.length,
            0
          ),
        };
      })
      .filter(Boolean); // Remove null values

    console.log("✅ Final Enrolled Courses:", formattedCourses);
    res.json(formattedCourses);
  } catch (error) {
    console.error("❌ Error fetching enrollments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export { router as authRoutes };
