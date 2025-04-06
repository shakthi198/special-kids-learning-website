import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  lectureId: { type: String, required: true },
  lectureTitle: { type: String, required: true },
  lectureDuration: { type: Number, required: true },
  lectureUrl: { type: String, required: true },
  isPreviewFree: { type: Boolean, required: true },
  lectureOrder: { type: Number, required: true, default: 1 },
});

const chapterSchema = new mongoose.Schema({
  chapterId: { type: String, required: true },
  chapterOrder: { type: Number, required: true },
  chapterTitle: { type: String, required: true },
  chapterContent: [lectureSchema],
});

const courseSchema = new mongoose.Schema(
  {
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String },
    isPublished: { type: Boolean, default: true },
    courseContent: [chapterSchema],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
