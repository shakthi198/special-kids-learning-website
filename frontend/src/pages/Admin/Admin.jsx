import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Admin/Navbar";
import Footer from "../../Components/Admin/Footer";
import AddCourse from "./AddCourse";

const Student = () => {
  return (
    <div className="text-default min-h-screen bg-gradient-to-b from-indigo-300/20">
      <Navbar />
      <div className="flex">
        <AddCourse />
        <div className="flex-1">{<Outlet />}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Student;
