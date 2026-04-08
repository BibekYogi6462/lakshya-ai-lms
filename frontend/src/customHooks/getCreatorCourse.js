// // import React from "react";
// // import { useEffect } from "react";
// // import { serverUrl } from "../App";
// // import axios from "axios";
// // import { useDispatch, useSelector } from "react-redux";
// // import { setCreatorCourseData } from "../redux/courseSlice";

// // const getCreatorCourse = () => {
// //   const dispatch = useDispatch();
// //   const { userData } = useSelector((state) => state.user);
// //   return useEffect(() => {
// //     const creatorCourses = async () => {
// //       try {
// //         const result = await axios.get(serverUrl + "/api/course/getcreator", {
// //           withCredentials: true,
// //         });
// //         console.log(result.data);
// //         dispatch(setCreatorCourseData(result.data));
// //       } catch (error) {
// //         console.log(error);
// //       }
// //     };
// //     creatorCourses();
// //   }, [userData]);
// // };

// // export default getCreatorCourse;

// // import React from "react";
// // import { useEffect } from "react";
// // import { serverUrl } from "../App";
// // import axios from "axios";
// // import { useDispatch, useSelector } from "react-redux";
// // import { setCreatorCourseData, setCourseData } from "../redux/courseSlice"; // ADD setCourseData

// // const getCreatorCourse = () => {
// //   const dispatch = useDispatch();
// //   const { userData } = useSelector((state) => state.user);
// //   return useEffect(() => {
// //     const creatorCourses = async () => {
// //       try {
// //         const result = await axios.get(serverUrl + "/api/course/getcreator", {
// //           withCredentials: true,
// //         });
// //         console.log(result.data);
// //         dispatch(setCreatorCourseData(result.data));
// //         dispatch(setCourseData(result.data)); // ADD THIS LINE
// //       } catch (error) {
// //         console.log(error);
// //       }
// //     };
// //     creatorCourses();
// //   }, [userData]);
// // };

// // export default getCreatorCourse;

// import React from "react";
// import { useEffect } from "react";
// import { serverUrl } from "../App";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { setCreatorCourseData, setCourseData } from "../redux/courseSlice";

// const getCreatorCourse = () => {
//   const dispatch = useDispatch();
//   const { userData } = useSelector((state) => state.user);

//   return useEffect(() => {
//     // Only fetch courses if user is logged in and is an instructor
//     if (userData && userData.role === "instructor") {
//       const creatorCourses = async () => {
//         try {
//           const result = await axios.get(serverUrl + "/api/course/getcreator", {
//             withCredentials: true,
//           });
//           console.log("Creator courses data:", result.data);
//           dispatch(setCreatorCourseData(result.data));
//           dispatch(setCourseData(result.data));
//         } catch (error) {
//           console.log("Error fetching creator courses:", error);
//           // Set empty array on error to prevent null data
//           dispatch(setCreatorCourseData([]));
//         }
//       };
//       creatorCourses();
//     } else {
//       // If not instructor, clear the data
//       dispatch(setCreatorCourseData([]));
//     }
//   }, [userData, dispatch]); // Add dispatch to dependencies
// };

// export default getCreatorCourse;

import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCreatorCourseData, setCourseData } from "../redux/courseSlice";

const getCreatorCourse = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  return useEffect(() => {
    // Only fetch courses if user is logged in and is an instructor
    if (userData && userData.role === "instructor") {
      const creatorCourses = async () => {
        try {
          // FIXED: Changed from "/getcreator" to "/creator-courses"
          const result = await axios.get(
            serverUrl + "/api/course/creator-courses",
            {
              withCredentials: true,
            },
          );
          console.log("Creator courses data:", result.data);
          dispatch(setCreatorCourseData(result.data));
          dispatch(setCourseData(result.data));
        } catch (error) {
          console.log("Error fetching creator courses:", error);
          // Set empty array on error to prevent null data
          dispatch(setCreatorCourseData([]));
        }
      };
      creatorCourses();
    } else {
      // If not instructor, clear the data
      dispatch(setCreatorCourseData([]));
    }
  }, [userData, dispatch]); // Add dispatch to dependencies
};

export default getCreatorCourse;
