import express from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getUserCourseProgress,
  updateCourseProgress,
} from "../controllers/courseController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", protect, getCourseById);
router.get("/:id/progress", protect, getUserCourseProgress);
router.post("/:id/progress", protect, updateCourseProgress);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.post("/:id/enroll", protect, enrollCourse);

export default router;
