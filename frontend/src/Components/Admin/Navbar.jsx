import React, { useEffect, useState } from "react";
import logo from "../../assets/graduation-cap.png";
import profile from "../../assets/profile.webp";
import axios from "axios";

const Navbar = () => {
  return (
    <div className="flex items-center justify-center px-4 md:px-8 border-b border-gray-400 py-3 bg-indigo-400/90">
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="Unikid-logo"
          className="w-10 lg:w-10 cursor-pointer"
        />
        <span className="text-white text-3xl italic">Unikid</span>
      </div>
    </div>
  );
};

export default Navbar;
