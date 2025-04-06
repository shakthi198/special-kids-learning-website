import React, { useEffect, useState } from "react";
import { auth } from "../../../Firebase/firebaseConfig";

function Profile() {
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

  {
    /* async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }*/
  }
  return (
    <div>
      {userDetails ? (
        <>
          <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={userDetails.photoURL}
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
            </div>
            <h3 className="block text-lg font-medium text-gray-700 px-5  text-center">
              Name : {userDetails.displayName}
            </h3>
            <div className="py-2">
              <p className="block text-lg font-medium text-gray-700 px-5 text-center">
                Email: {userDetails.email}
              </p>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
export default Profile;
