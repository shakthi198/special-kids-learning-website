import React, { useContext } from "react";
import star from "../../assets/star.png";
import star_filled from "../../assets/star-filled.png";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link
      to={"/student/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg"
    >
      <img className="w-full" src={course.courseThumbnail} alt="" />
      <div className="p-3 text-left">
        <h3 className="text-base font-semibold">{course.courseTitle}</h3>
        <p className="text-gray-500">{course.educator}</p>
        <div className="flex items-center space-x-2">
          {/*<p>{calculateRating(course)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(course)) ? star_filled : star
                }
                alt=""
                className="w-3.3 h-3.5"
              />
            ))}
          </div>
          <p className="text-gray-500">{course.courseRatings.length}</p>*/}
        </div>
        <p className="text-base font-semibold text-blue-800">
          {/* {currency}
          {(
            course.coursePrice -
            (course.discount * course.coursePrice) / 100
          ).toFixed(2)} */}
          Free
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
