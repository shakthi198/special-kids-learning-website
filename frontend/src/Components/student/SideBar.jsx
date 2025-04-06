import React from "react";
import { NavLink } from "react-router-dom";
import home from "../../assets/home.png";
import course from "../../assets/course.png";
import chat from "../../assets/ai.png";
import profile from "../../assets/user.png";
import mic from "../../assets/mic.png";
import doc from "../../assets/read.png";

const SideBar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/student", icon: home },
    { name: "Courses", path: "/student/course-list", icon: course },
    { name: "Chat-AI", path: "/student/chat-ai", icon: chat },
    { name: "Speak-AI", path: "/student/speak-ai", icon: mic },
    { name: "Read Doc", path: "/student/read-doc", icon: doc },
    { name: "Profile", path: "/student/profile", icon: profile },
  ];
  return (
    <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-200 py-2 flex flex-col">
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          end={item.path === "/student"}
          className={({ isActive }) =>
            `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-5 gap-3 ${
              isActive
                ? "bg-blue-200/60 border-r-[6px] border-indigo-500/90"
                : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"
            }`
          }
        >
          <img src={item.icon} alt="" className="w-6 h-6" />
          <p className="md:block hidden text-center">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default SideBar;
