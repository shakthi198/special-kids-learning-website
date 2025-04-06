import Course from "../models/Course";

export const addcourse = async (res, req) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail not attached" });
    }

    const parsedCourseData = await JSON.parse(courseData);
    const newCourse = await Course.create(parsedCourseData);
    res.json({ success: true, message: "course added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
