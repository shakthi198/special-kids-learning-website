import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "./Loading";
import star from "../../assets/star.png";
import star_filled from "../../assets/star-filled.png";
import down_arrow_icon from "../../assets/down-arrow.png";
import play_icon from "../../assets/play.png";
import humanizeDuration from "humanize-duration";
import clock_icon from "../../assets/time-left.png";
import course_icon from "../../assets/course.png";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Ensure it's not null
  const Path = import.meta.env.VITE_API_URL;

  console.log("🔹 Retrieved token:", token);
  console.log(
    "🔹 Retrieved userId:",
    userId || "No user ID found in localStorage"
  );

  // Get user ID

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      if (!token || !userId) {
        console.error("❌ No token or userId found.");
        return;
      }

      const response = await fetch(`${Path}/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setCourseData(data);

      // Check if the user is already enrolled
      const enrolledStudentIds = data.enrolledStudents.map((student) =>
        typeof student === "object"
          ? student._id?.toString().toLowerCase().trim()
          : student?.toString().toLowerCase().trim()
      );

      const formattedUserId = userId.toLowerCase().trim();
      const isEnrolled = enrolledStudentIds.includes(formattedUserId);
      setIsAlreadyEnrolled(isEnrolled);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  // Add dependencies to avoid stale values
  const handleEnroll = async () => {
    try {
      if (!token || !userId) return;

      const response = await fetch(`${Path}/courses/${id}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        setShowPopup(false);
        await fetchCourseData(); // Refresh UI
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-30 px-8 md:pt-30 pt-20 text-left">
        <div className="absolute top-0 left-0 w-full h-section-height z-1 "></div>
        {/*left*/}
        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:text-course-detials-heading-large text-course-details-heading-small font-semibold text-gray-800">
            {courseData.courseTitle}
          </h1>
          <p
            className="pt-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          ></p>
          {/*review and rating
          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p>{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  className="w-3.3 h-3.5"
                  key={i}
                  src={
                    i < Math.floor(calculateRating(courseData))
                      ? star_filled
                      : star
                  }
                  alt=""
                />
              ))}
            </div>
            <p className="text-blue-600">
              ({courseData.courseRatings.length}
              {courseData.courseRatings.length > 1 ? "ratings" : "ratings"})
            </p>
            <p>
              {courseData.enrolledStudents.length}
              {courseData.enrolledStudents.length > 1 ? "student" : "students"}
            </p>
          </div>*/}

          <p className="text-sm">
            Course by
            <span className="text-blue-600">{courseData.educator}</span>
          </p>

          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg white mb-2 rounded"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex item-center gap-2">
                      <img
                        src={down_arrow_icon}
                        alt="arrow icon"
                        className={`w-3.7 h-3.7 transform transtion-transform ${
                          openSections[index] ? "rotate-180" : ""
                        } `}
                      />
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} lectures -
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSections[index] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="list-disc md:pl-10 pl-5 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1 ">
                          <img
                            src={play_icon}
                            alt="play icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: lecture.lectureUrl
                                        .split("/")
                                        .pop(),
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Preview
                                </p>
                              )}
                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Description
            </h3>
            <p
              className="pt-3 rich-text"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}
            ></p>
          </div>
        </div>
        {/*right*/}
        <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-{300px} sm:min-w-{480px}">
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              otps={{ playerVars: { autoplay: 1 } }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img src={courseData.courseThumbnail} alt="" />
          )}

          <div className="p-5">
            <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500">
              <div className="flex item-center gap-1">
                <img src={clock_icon} alt="clock icon" />
                <p className="text-xl">{calculateCourseDuration(courseData)}</p>
              </div>

              <div className="h-4 w-px bg-gray-500/40"></div>

              <div className="flex item-center gap-1">
                <p className="text-xl">
                  {calculateNoOfLectures(courseData)} lessons{" "}
                </p>
              </div>
            </div>

            {/* Enroll Now Button */}
            <button
              className={`mt-4 w-full py-3 rounded ${
                isAlreadyEnrolled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600"
              } text-white font-medium`}
              onClick={() => !isAlreadyEnrolled && setShowPopup(true)}
              disabled={isAlreadyEnrolled} // ✅ Disable button when already enrolled
            >
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>

            {/* Enrollment Confirmation Pop-up */}
            {showPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <h2 className="text-lg font-semibold">Confirm Enrollment</h2>
                  <p>Are you sure you want to enroll in this course?</p>
                  <div className="mt-4 flex justify-center gap-4">
                    <button
                      onClick={handleEnroll}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Yes, Enroll
                    </button>
                    <button
                      onClick={() => setShowPopup(false)}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};
export default CourseDetails;
