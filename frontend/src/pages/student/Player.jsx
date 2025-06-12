import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import down_arrow_icon from "../../assets/down-arrow.png";
import play_icon from "../../assets/play.png";
import blue_tick from "../../assets/blue-tick.png";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import axios from "axios";

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    updateLectureProgress,
    currentUser,
  } = useContext(AppContext);

  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const Path = import.meta.env.VITE_API_URL;

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getYouTubeVideoId = (url) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([^#&?]*)/
    );
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
      fetchProgress();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${Path}/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourseData(response.data);
      if (response.data.lectures?.length > 0) {
        setPlayerData(response.data.lectures[0]);
      }
    } catch (error) {
      console.error("❌ Error fetching course:", error);
    }
  };

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${Path}/api/courses/${courseId}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setCompletedLectures(new Set(res.data.lectureCompleted || []));
      }
    } catch (error) {
      console.error("❌ Error fetching progress:", error);
    }
  };

  const markLectureCompleted = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("Missing user ID or token. Please log in again.");
      return;
    }

    if (!playerData?.lectureId) {
      console.error("🚨 Missing lectureId! Cannot mark as completed.");
      return;
    }

    try {
      const response = await axios.post(
        `${Path}/api/courses/${courseId}/progress`,
        { userId, courseId, lectureId: playerData.lectureId }, // ✅ Now defined
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCompletedLectures(
          (prev) => new Set([...prev, playerData.lectureId])
        );
      }
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-30">
      {/* Left Column - Course Structure */}
      <div className="text-gray-800">
        <h2 className="text-xl font-semibold">Course Structure</h2>

        <div className="pt-5">
          {courseData &&
            courseData.courseContent.map((chapter, index) => (
              <div
                key={index}
                className="border border-gray-300 bg-white mb-2 rounded"
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex item-center gap-2">
                    <img
                      src={down_arrow_icon}
                      alt="arrow icon"
                      className={`w-3.7 h-3.7 transform transition-transform ${
                        openSections[index] ? "rotate-180" : ""
                      }`}
                    />
                    <p className="font-medium md:text-base text-sm">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className="text-sm md:text-default">
                    {chapter.chapterContent.length} lectures -{" "}
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
                      <li key={i} className="flex items-start gap-2 py-1">
                        <img
                          src={
                            completedLectures.has(lecture.lectureId)
                              ? blue_tick
                              : play_icon
                          }
                          alt="status icon"
                          className="w-4 h-4 mt-1"
                        />
                        <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                          <p>{lecture.lectureTitle}</p>
                          <div className="flex gap-2">
                            {lecture.lectureUrl && (
                              <p
                                onClick={() =>
                                  setPlayerData({
                                    ...lecture,
                                    chapter: index + 1,
                                    lecture: i + 1,
                                    lectureId: lecture.lectureId,
                                  })
                                }
                                className="text-blue-500 cursor-pointer"
                              >
                                Watch
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

      {/* Right Column - Video Player */}
      <div className="md:mt-10">
        {playerData ? (
          <div>
            <YouTube
              videoId={getYouTubeVideoId(playerData.lectureUrl)}
              iframeClassName="w-full aspect-video"
              onEnd={() => {
                console.log("🎥 Video ended, marking as complete...");
                markAsComplete(); // ✅ Automatically mark lecture as complete
              }}
            />
            <div className="flex justify-between items-center mt-1">
              <p>
                {playerData.chapter}.{playerData.lecture}{" "}
                {playerData.lectureTitle}
              </p>
              <button
                onClick={markLectureCompleted}
                className={`px-4 py-2 rounded ${
                  completedLectures.has(playerData?.lectureId)
                    ? "bg-green-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
                }`}
                disabled={completedLectures.has(playerData?.lectureId)}
              >
                {completedLectures.has(playerData?.lectureId)
                  ? "✅ Completed"
                  : "📌 Mark as Complete"}
              </button>
            </div>
          </div>
        ) : (
          <img
            src={courseData ? courseData.courseThumbnail : "course Thumbnail"}
            alt=""
          />
        )}
      </div>
    </div>
  );
};

export default Player;
