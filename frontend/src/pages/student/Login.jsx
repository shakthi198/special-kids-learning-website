// src/Pages/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../assets/Custom.css"; // Import the custom CSS file
import google from "../../assets/google.png";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { auth } from "../../../Firebase/firebaseConfig";
import { toast } from "react-toastify";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false); // Define the state variables
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const Path = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Add the login-page class to the body element
    document.body.classList.add("login-page");

    // Remove the login-page class when the component is unmounted
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${Path}/api/users/login`, {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        console.log("Login successful, navigating to Dashboard page");
        navigate("/student");
      }
    } catch (error) {
      console.error("Failed to log in", error);
    }
  };

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      setUserDetails(user);
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) {
        throw new Error("No credential found in Google sign-in result");
      }

      const idToken = await result.user.getIdToken(); // Get Firebase ID token

      // Send token to backend
      const res = await axios.post(`${Path}/api/users/google-login`, {
        token: idToken,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user details

        toast.success("User logged in successfully!", {
          position: "top-center",
        });
        window.location.href = "/student";
      }
    } catch (error) {
      console.error("Failed to log in with Google:", error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Log in with</h2>
      <div className="social-login">
        <button className="social-button" onClick={handleGoogleSignIn}>
          <img src={google} alt="Google" className="social-icon" />
          Google
        </button>
      </div>
      <p className="separator">
        <span>or</span>
      </p>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-wrapper">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <i className="material-symbols-rounded"></i>
        </div>
        <div className="input-wrapper">
          <input
            type={passwordShown ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
          <i className="material-symbols-rounded"></i>
          <i
            onClick={() => setPasswordShown((prevState) => !prevState)}
            className="material-symbols-rounded eye-icon"
          >
            {passwordShown ? "visibility" : "visibility_off"}
          </i>
        </div>
        {/*<a href="/forgot-password" className="forgot-password-link">
          Forgot password?
        </a>*/}
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
      {/*} <p className="signup-prompt">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="signup-link">
          Sign up
        </a>
      </p>*/}
    </div>
  );
};

export default Login;
