import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/graduation-cap.png";
import { Link } from "react-router-dom";
import profile from "../../assets/profile.webp";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { auth } from "../../../Firebase/firebaseConfig";

const Navbar = () => {
  const { navigate } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  {
    /* useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("🚨 No token found in localStorage");
          return;
        }

        console.log("🔍 Sending token:", token); // ✅ Debugging

        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Ensure correct format
        });

        setUser(response.data);
      } catch (error) {
        console.error(
          "❌ Failed to fetch user:",
          error.response?.data || error
        );
      }
    };

    fetchUser();
  }, []);
*/
  }
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      setUserDetails(user);

      {
        /*const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }*/
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <div>
      {userDetails ? (
        <div className="flex justify-between items-center px-4 md:px-8 border-b border-gray-400 py-3 bg-indigo-400/90">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("student")}
          >
            <img
              src={logo}
              alt="Unikid-logo"
              className="w-10 lg:w-10 cursor-pointer"
            />
            <span className="text-white text-2xl italic">Unikid</span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-white-500 relative">
            <div className="flex items-center gap-5 text-black-500 relative">
              <p className="text-2xl text-white italic">
                Hi! {userDetails.displayName}
              </p>
              <div className="relative">
                <img
                  className="max-w-10 rounded-full cursor-pointer"
                  src={userDetails.photoURL}
                  alt="Profile"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <Link
                      to="/student/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Navbar;
