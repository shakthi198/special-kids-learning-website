import Course from "../models/Course.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { courseProgress } from "../models/courseProgress.js";

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    {
      /* console.log("Courses retrieved:", courses);*/
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCourse)
      return res.status(404).json({ message: "Course not found" });
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse)
      return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enrollCourse = async (req, res) => {
  {
    /*
    try {
      console.log("🔹 Enroll API called");

      if (!req.user || !req.user.id) {
        return res
          .status(400)
          .json({ message: "User ID missing. Please log in again." });
      }

      const userId = req.user.id;
      const courseId = req.params.id;

      // ✅ Validate `courseId`
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: "Invalid Course ID" });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });

      // ✅ Prevent duplicate enrollment
      const alreadyEnrolled = await courseProgress.findOne({
        userId,
        courseId,
      });

      if (alreadyEnrolled) {
        return res
          .status(400)
          .json({ message: "User already enrolled in this course." });
      }

      // ✅ Store enrollment in `CourseProgress`
      await courseProgress.create({
        userId,
        courseId,
        lectureCompleted: [],
      });
      console.log("Request body:", req.body);
      // If progress is undefined, this is the issue
      console.log("User object:", req.user);
      console.log("Course object:", course);
      // ✅ Also update the user model
      user.enrolledCourses.push({ courseId });
      await user.save();

      res.status(200).json({
        message: "Enrollment successful!",
        enrolledCourses: user.enrolledCourses,
      });
    } catch (error) {
      console.error("❌ Enrollment Error:", error);
      res.status(500).json({ message: "Error enrolling in course", error });
    }
 */
  }
  const courseId = req.params.id;
  const { userId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(courseId)
  ) {
    return res.status(400).json({ message: "Invalid user or course ID" });
  }

  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Start a transaction

  try {
    const user = await User.findById(userId).session(session);
    const course = await Course.findById(courseId).session(session);

    if (!user || !course) {
      throw new Error("User or Course not found");
    }

    // Prevent duplicate enrollment
    if (
      user.enrolledCourses.some((enrolled) =>
        enrolled.courseId.equals(courseId)
      )
    ) {
      throw new Error("User already enrolled");
    }

    // 1️⃣ Add course to `User` model
    user.enrolledCourses.push({ courseId });
    await user.save({ session });

    // 2️⃣ Add user to `Course` model
    course.enrolledStudents.push(userId);
    await course.save({ session });

    // 3️⃣ Create `CourseProgress` entry
    const newProgress = new courseProgress({
      userId,
      courseId,
      completed: false,
      lectureCompleted: [],
    });
    await newProgress.save({ session });

    // ✅ Commit transaction (all updates are successful)
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Enrollment successful",
      user,
      course,
      progress: newProgress,
    });
  } catch (error) {
    await session.abortTransaction(); // ❌ Rollback if error occurs
    session.endSession();
    console.error("Enrollment failed:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// update user course progress

export const updateCourseProgress = async (req, res) => {
  try {
    const { id: courseId } = req.params; // Get courseId from URL
    const { userId, lectureId } = req.body; // Get userId & lectureId from request body

    if (!userId || !lectureId) {
      return res
        .status(400)
        .json({ error: "User ID and lecture ID are required" });
    }

    // Find and update progress in CourseProgress DB
    const progress = await courseProgress.findOneAndUpdate(
      { userId, courseId },
      { $addToSet: { lectureCompleted: lectureId } }, // Prevent duplicate entries
      { new: true, upsert: true } // Create if not exists
    );

    // ✅ Check if the user has completed the entire course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const totalLectures = course.lectures.length; // Assuming `lectures` is an array in Course model
    const completedLectures = progress.lectureCompleted.length;

    if (completedLectures === totalLectures) {
      // ✅ Mark course as completed in `User` model
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { completedCourses: courseId } }, // Ensure no duplicates
        { new: true }
      );
    }

    res.status(200).json({ success: true, progress });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get user course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    console.log("🔍 Fetching course progress...");

    const userId = req.user?.id; // Ensure `req.user` exists
    const { id: courseId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user or course ID" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized request" });
    }

    console.log("User ID:", userId, "Course ID:", courseId);

    const progressData = await courseProgress.findOne({ userId, courseId });

    if (!progressData) {
      return res.json({ success: true, lectureCompleted: [] }); // ✅ Ensure empty array is returned
    }

    console.log("✅ Progress found:", progressData.lectureCompleted);
    res.json({
      success: true,
      lectureCompleted: progressData.lectureCompleted,
    });
  } catch (error) {
    console.error("❌ Error fetching progress:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
