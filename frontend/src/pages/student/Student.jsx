import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../Components/student/Navbar";
import SideBar from "../../Components/student/SideBar";
import Footer from "../../Components/student/Footer";

const Student = () => {
  return (
    <div className="text-default min-h-screen bg-gradient-to-b from-indigo-300/20">
      <Navbar />
      <div className="flex">
        <SideBar />
        <div className="flex-1">{<Outlet />}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Student;
