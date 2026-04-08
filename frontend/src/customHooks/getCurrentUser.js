// import axios from "axios";
// import { useEffect } from "react";
// import { serverUrl } from "../App.jsx";
// import { useDispatch } from "react-redux";
// import { setUserData } from "../redux/userSlice";

// const useGetCurrentUser = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const result = await axios.get(serverUrl + "/api/user/getcurrentUser", {
//           withCredentials: true,
//         });
//         // If we get here, user is authenticated
//         dispatch(setUserData(result.data));
//       } catch (error) {
//         console.log("Error fetching user:", error);
//         // Only set userData to null if it's a 400 error (no token)
//         // For other errors, we might want to handle differently
//         if (error.response?.status === 400) {
//           // This is expected when no token exists (user not logged in)
//           console.log("No user token found - user not logged in");
//           dispatch(setUserData(null));
//         }
//         // For other errors (500, network errors, etc.), we might want to retry or show a message
//       }
//     };

//     fetchUser();
//   }, [dispatch]);
// };

// export default useGetCurrentUser;

import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../App.jsx";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/getcurrentUser", {
          withCredentials: true,
        });
        // If we get here, user is authenticated
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log("Error fetching user:", error);
        // Only set userData to null if it's a 400 error (no token)
        // For other errors, we might want to handle differently
        if (error.response?.status === 400) {
          // This is expected when no token exists (user not logged in)
          console.log("No user token found - user not logged in");
          dispatch(setUserData(null));
        }
        // For other errors (500, network errors, etc.), we might want to retry or show a message
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchUser();
  }, [dispatch]);

  return loading; // Return loading state
};

export default useGetCurrentUser;
