import React from "react";
import logo from "../../assets/graduation-cap.png";
import insta from "../../assets/insta.png";
import linkedin from "../../assets/linkedin.png";
import tel from "../../assets/tel.png";

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-4 border-t bg-indigo-400/90">
      <div className="flex items-center gap-4">
        <img src={logo} alt="Unikid-logo" className="hidden md:block w-10" />
        <span className="text-white text-2xl italic">Unikid</span>
        <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>
        <p className="py-4 text-center text-xs md:text-sm text-white-500">
          CopyRight 2024 © Unikid. All rights reserved.
        </p>
      </div>
      <div className="flex items-center gap-3 max-md:mt-4">
        <a href="#">
          <img src={insta} alt="instagram" className="w-7" />
        </a>
        <a href="#">
          <img src={linkedin} alt="linkedin" className="w-7" />
        </a>
        <a href="#">
          <img src={tel} alt="Telegram" className="w-7" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
