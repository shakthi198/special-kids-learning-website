import express from "express";
import {
  getProgress,
  markLectureComplete,
} from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js"; // Ensure user is authenticated

const router = express.Router();

router.get("/:courseId", protect, getProgress); // Get user progress
router.post("/:courseId", protect, markLectureComplete); // Mark lecture complete

export default router;
