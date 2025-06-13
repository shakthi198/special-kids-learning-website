import React, { useContext } from "react";
import OnlineLearning from "../../assets/online-removebg-preview.png";
import Voice from "../../assets/voice.png";
import YoutubeLearning from "../../assets/youtubelearning-removebg-preview.png";
import Cap from "../../assets/graduation-cap.png";
import Img1 from "../../assets/img1.png";
import Cloud1 from "../../assets/cloud3.png";
import Cloud2 from "../../assets/cloud4.png";
import Cloud3 from "../../assets/cloud5.png";
import Insta from "../../assets/insta.png";
import Linkedin from "../../assets/linkedin.png";
import Tel from "../../assets/tel.png";
import { AppContext } from "../../context/AppContext.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  const { navigate } = useContext(AppContext);

  return (
    <div className="overflow-x-hidden min-h-screen ">
      <div className="bg-gradient-to-b from-[#6ac7ff] to-[#9ec3dd]">
        <div className="bg-opacity-10 bg-black p-2">
          <div className="flex justify-around p-2">
            <a href="/" className="flex items-center">
              <img id="logo" src={Cap} className="h-9 w-9" alt="UniKid Logo" />
              <span className="text-white italic text-2xl ml-1">UniKid</span>
            </a>
            <Link to="/login" className="text-white italic text-2xl">
              Login
            </Link>
          </div>
        </div>
        {/* Responsive hero section */}
        <div className="flex flex-col md:flex-row p-2 md:p-6 items-center md:items-start">
          {/* Image */}
          <div className="w-full flex justify-center md:justify-start md:w-1/2 relative">
            <img
              id="hero-img"
              src={Img1}
              className="
                h-60 w-60 md:h-[500px] md:w-[500px]
                mx-auto md:mx-0
                sm:top-4 md:top-16
                z-0
              "
              alt="Hero"
            />
          </div>
          {/* Text and Button */}
          <div className="flex flex-col p-2 md:p-4 pt-4 md:pt-12 pb-2 md:pb-4 text-lg font-sans text-gray-700 italic w-full md:w-1/2 z-10">
            <h1 className="text-[#1d3557] text-2xl md:text-3xl font-medium italic text-center md:text-left">
              Welcome to UniKid...
            </h1>
            <br className="hidden md:block" />
            <q className="italic text-base md:text-lg text-center md:text-left">
              Each child is a story waiting to be told, with unique chapters of
              ability, resilience, and untapped potential - Linda Kardami
            </q>
            <br className="hidden md:block" />
            <p className="pt-2 italic text-base md:text-lg text-center md:text-left">
              We believe that every child is unique and deserves a tailored
              approach to learn. Our mission is to provide personalized
              educational experiences for kids with special needs.
            </p>
            <div className="mt-2 flex justify-center md:justify-start">
              <button
                className="rounded-full border border-[#1d3557] bg-transparent text-[#1d3557] mt-8 p-2 transition duration-1000 hover:bg-[#1d3557] hover:text-white relative z-20"
                onClick={() => navigate("login")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#9ec3dd] to-[#deedf9] relative h-[500px]">
        <section className="cloud absolute inset-0 flex justify-center items-center">
          <img
            src={Cloud1}
            id="c1"
            className="
              absolute
              transform
              -translate-x-[500px] -translate-y-[150px]
              sm:-translate-y-[100px]
              md:-translate-y-[80px]
            "
            height="350"
            width="750"
            alt="Cloud"
          />
          <img
            src={Cloud2}
            id="c2"
            className="
              absolute
              transform
              translate-x-[-800px] -translate-y-[285px]
              sm:-translate-y-[200px]
              md:-translate-y-[150px]
            "
            height="400"
            alt="Cloud"
          />
          <img
            src={Cloud1}
            id="c3"
            className="
              absolute
              transform
              translate-x-[-35px] -translate-y-[150px]
              sm:-translate-y-[120px]
              md:-translate-y-[90px]
            "
            height="400"
            width="750"
            alt="Cloud"
          />
          <img
            src={Cloud2}
            id="c4"
            className="
              absolute
              transform
              translate-x-[460px] -translate-y-[280px]
              sm:-translate-y-[180px]
              md:-translate-y-[120px]
            "
            height="350"
            alt="Cloud"
          />
          <img
            src={Cloud3}
            id="c6"
            className="
              absolute
              transform
              translate-x-[700px] -translate-y-[160px]
              sm:-translate-y-[80px]
              md:-translate-y-[40px]
            "
            height="350"
            alt="Cloud"
          />
          <img
            src={Cloud1}
            id="c5"
            className="
              absolute
              transform
              translate-x-[-240px] -translate-y-[70px]
              sm:-translate-y-[30px]
              md:-translate-y-[10px]
            "
            height="400"
            width="700"
            alt="Cloud"
          />
          <img
            src={Cloud2}
            id="c7"
            className="
              absolute
              transform
              translate-x-[300px] -translate-y-[90px]
              sm:-translate-y-[40px]
              md:-translate-y-[10px]
            "
            height="230"
            alt="Cloud"
          />
        </section>
      </div>
      <div className="bg-gradient-to-b from-[#deedf9] to-[#ebf1f5] ">
        <section className="features flex flex-col items-center">
          <div className="feature1 flex flex-col items-center mb-6">
            <img
              src={OnlineLearning}
              className="h-60"
              alt="Inclusive Learning"
            />
            <h2 className="text-[#1d3557] text-2xl mt-2">Inclusive Learning</h2>
            <p className="text-lg text-gray-700 text-center px-2">
              Accessibility Features like Voice control, screen readers, and
              adaptable text sizes to support children with diverse abilities.
            </p>
          </div>
          <div className="feature2 flex flex-col items-center mb-6">
            <img src={Voice} className="h-60" alt="Voice & Text Assistance" />
            <h2 className="text-[#1d3557] text-2xl mt-2">
              Voice & Text Assistance
            </h2>
            <p className="text-lg text-gray-700 text-center px-2">
              Communication should never be a barrier to learning. That's why we
              offer: <br />
              ChatGPT with Speech-to-Text: An interactive assistant that can
              understand voice commands and respond via text or speech.
              Text-to-Speech Reading Aid: Converts written content into spoken
              words, aiding children with reading difficulties. Conversational
              Learning: Children can ask questions and learn by having natural,
              intuitive conversations with the AI.
            </p>
          </div>
          <div className="feature3 flex flex-col items-center mb-6">
            <img src={YoutubeLearning} className="h-60" alt="Video Learning" />
            <h2 className="text-[#1d3557] text-2xl mt-2">Video Learning</h2>
            <p className="text-lg text-gray-700 text-center px-2">
              Visual learning is powerful, and we leverage it with:
              <br />
              Integrated YouTube Courses: Access to a vast library of
              educational videos carefully selected to enhance learning.
              Recommended Content: Smart suggestions tailored to each child's
              interests and learning progress. Safe Viewing Environment: Strict
              content filtering ensures a child-friendly and secure learning
              experience.
            </p>
          </div>
        </section>
      </div>
      <footer className="bg-gradient-to-b from-[#ebf1f5] to-white text-center py-5">
        <div className="flex justify-center space-x-4 mb-2">
          <img className="h-8 w-8" src={Insta} alt="Instagram" />
          <img className="h-8 w-8" src={Linkedin} alt="LinkedIn" />
          <img className="h-8 w-8" src={Tel} alt="Telegram" />
        </div>
        <p className="text-lg font-sans italic text-gray-700">
          Copyright &copy; 2025
        </p>
      </footer>
    </div>
  );
};

export default Home;
