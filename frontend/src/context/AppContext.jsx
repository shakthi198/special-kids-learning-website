import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  //Fetch all coureses
  const fetchAllCourses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/courses");
      const data = await response.json();
      console.log("Courses received from backend:", data); // Debugging
      setAllCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  //fetch user enrolled courses
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch(
        "http://localhost:5000/api/users/enrollments",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

      const data = await response.json();
      console.log("✅ Enrolled Courses Fetched:", data);

      setEnrolledCourses(data); // ✅ Fix: Update state
    } catch (error) {
      console.error("❌ API Fetch Error:", error);
    }
  };

  const updateLectureProgress = async (courseId, lectureId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(localStorage.getItem("user"))?._id; // ✅ Fix: Get userId

      if (!userId) {
        console.error("🚨 No userId found in localStorage!");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/progress`,
        { courseId, lectureId, userId }, // ✅ Fix: Include userId
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Progress updated:", response.data);

      fetchUserEnrolledCourses(); // Refresh progress
    } catch (error) {
      console.error(
        "❌ Error updating progress:",
        error.response?.data || error.message
      );
    }
  };

  //function to calculate rating

  {
    /*const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return totalRating / course.courseRatings.length;
  };
*/
  }

  // function to calculate course chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach((lecture) => {
      time += lecture.lectureDuration;
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // course duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // no of lectures

  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent))
        totalLectures += chapter.chapterContent.length;
    });
    return totalLectures;
  };

  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);

  const value = {
    navigate,
    currency,
    allCourses,
    //calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    fetchAllCourses,
    updateLectureProgress,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
