import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/student/Home";
import CoursesList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollment from "./pages/student/MyEnrollment";
import Player from "./pages/student/Player";
import Admin from "./pages/Admin/Admin";
import Dashboard from "./pages/student/Dashboard";
import AddCourse from "./pages/Admin/AddCourse";
import MyCourses from "./pages/Admin/MyCourses";
import StudentEnroll from "./pages/Admin/StudentEnroll";
import Loading from "./pages/student/Loading";
import Student from "./pages/student/student";
import ChatAi from "./pages/student/ChatAi";
import Profile from "./pages/student/Profile";
import Login from "./pages/student/Login";
import SpeakAi from "./pages/student/SpeakAi";
import ReadDoc from "./pages/student/ReadDoc";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/student" element={<Student />}>
          <Route index element={<Dashboard />} />
          <Route path="course-list" element={<CoursesList />} />
          <Route path="course-list/:input" element={<CoursesList />} />
          <Route path="course/:id" element={<CourseDetails />} />
          <Route path="my-enrollments" element={<MyEnrollment />} />
          <Route path="player/:courseId" element={<Player />} />
          <Route path="loading/:path" element={<Loading />} />
          <Route path="chat-ai" element={<ChatAi />} />
          <Route path="speak-ai" element={<SpeakAi />} />
          <Route path="read-doc" element={<ReadDoc />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-course" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentEnroll />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
