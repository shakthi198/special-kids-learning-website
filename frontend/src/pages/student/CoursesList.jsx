import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../Components/student/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../Components/student/CourseCard";
import cross_icon from "../../assets/cross-icon.png";

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        const data = await response.json();
        console.log("Courses received in CoursesList:", data);
        setAllCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = input
        ? allCourses.filter((item) =>
            item.courseTitle.toLowerCase().includes(input.toLowerCase())
          )
        : allCourses;
      setFilteredCourse(tempCourses);
    }
  }, [allCourses, input]);

  return (
    <>
      <div className="relative md:px-30 px-8 pt-20 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Course List
            </h1>
            <p className="text-gray-500">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("student")}
              >
                Home
              </span>{" "}
              / <span>Course List</span>
            </p>
          </div>
          <SearchBar data={input} />
        </div>
        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 mb-8 text-gray-600">
            <p>{input}</p>
            <img
              src={cross_icon}
              alt="Clear search"
              className="cursor-pointer"
              onClick={() => navigate("student/course-list")}
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-8 px-2 md:p-0">
          {filteredCourse.length === 0 ? (
            <p className="text-gray-500 col-span-full">
              No courses found for "{input}"
            </p>
          ) : (
            filteredCourse.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CoursesList;
