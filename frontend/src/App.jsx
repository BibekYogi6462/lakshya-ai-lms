// import React from "react";
// import { Navigate, Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import SignUp from "./pages/SignUp";
// import Login from "./pages/Login";
// import { ToastContainer } from "react-toastify";
// import useGetCurrentUser from "./customHooks/getCurrentUser";
// import { useSelector } from "react-redux";
// import Profile from "./pages/Profile";
// import ForgetPassword from "./pages/ForgetPassword";
// import EditProfile from "./pages/EditProfile";
// import Dashboard from "./pages/Educator/Dashboard";
// import Courses from "./pages/Educator/Courses";
// import CreateCourses from "./pages/Educator/CreateCourses";
// import getCreatorCourse from "./customHooks/getCreatorCourse";
// import EditCourse from "./pages/Educator/EditCourse";
// import AllCourses from "./pages/AllCourses";
// import CreateLecture from "./pages/Educator/CreateLecture";
// import EditLecture from "./pages/Educator/EditLecture";
// import ViewCourse from "./pages/ViewCourse";
// import getPublishedCourse from "./customHooks/getPublishedCourse";
// import ScrollToTop from "./component/ScrollToTop";
// import ViewLectures from "./pages/ViewLectures";
// import MyEnrolledCourses from "./pages/MyEnrolledCourses";
// import getAllReviews from "./customHooks/getAllReviews";
// import SearchWithAi from "./pages/SearchWithAi";
// import RecommendedCourses from "./pages/RecommendedCourses";
// import { ClipLoader } from "react-spinners"; // Add this import

// export const serverUrl = "http://localhost:8000";

// const App = () => {
//   const authLoading = useGetCurrentUser(); // Get loading state
//   getCreatorCourse();
//   getPublishedCourse();
//   getAllReviews();

//   const { userData } = useSelector((state) => state.user);

//   // Show loader while checking authentication
//   if (authLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
//         <ClipLoader size={60} color="#da6ed1" />
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer />
//       <ScrollToTop />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route
//           path="/signup"
//           element={!userData ? <SignUp /> : <Navigate to={"/"} />}
//         />
//         <Route path="/login" element={<Login />} />
//         <Route
//           path="/profile"
//           element={userData ? <Profile /> : <Navigate to={"/signup"} />}
//         />
//         <Route
//           path="/forget"
//           element={!userData ? <ForgetPassword /> : <Navigate to={"/"} />}
//         />
//         <Route
//           path="/editprofile"
//           element={userData ? <EditProfile /> : <Navigate to={"/signup"} />}
//         />
//         <Route
//           path="/allcourses"
//           element={userData ? <AllCourses /> : <Navigate to={"/signup"} />}
//         />

//         {/* Instructor only routes */}
//         <Route
//           path="/dashboard"
//           element={
//             userData?.role === "instructor" ? (
//               <Dashboard />
//             ) : (
//               <Navigate to={"/signup"} />
//             )
//           }
//         />
//         <Route
//           path="/courses"
//           element={
//             userData?.role === "instructor" ? (
//               <Courses />
//             ) : (
//               <Navigate to={"/signup"} />
//             )
//           }
//         />
//         <Route
//           path="/createcourse"
//           element={
//             userData?.role === "instructor" ? (
//               <CreateCourses />
//             ) : (
//               <Navigate to={"/signup"} />
//             )
//           }
//         />
//         <Route
//           path="/editcourse/:courseId"
//           element={
//             userData?.role === "instructor" ? (
//               <EditCourse />
//             ) : (
//               <Navigate to={"/signup"} />
//             )
//           }
//         />
//         <Route
//           path="/createlecture/:courseId"
//           element={
//             userData?.role === "instructor" ? (
//               <CreateLecture />
//             ) : (
//               <Navigate to={"/signup"} />
//             )
//           }
//         />
//         <Route
//           path="/editlecture/:courseId/:lectureId"
//           element={
//             userData?.role === "instructor" ? (
//               <EditLecture />
//             ) : (
//               <Navigate to={"/signup"} />
//             )
//           }
//         />
//         <Route
//           path="/viewcourse/:courseId"
//           element={userData ? <ViewCourse /> : <Navigate to={"/signup"} />}
//         />

//         {/* Allow all authenticated users to view lectures */}
//         <Route
//           path="/view-lectures/:courseId"
//           element={userData ? <ViewLectures /> : <Navigate to={"/signup"} />}
//         />
//         <Route
//           path="/mycourses"
//           element={
//             userData ? <MyEnrolledCourses /> : <Navigate to={"/signup"} />
//           }
//         />
//         <Route
//           path="/search"
//           element={userData ? <SearchWithAi /> : <Navigate to={"/signup"} />}
//         />
//         <Route
//           path="/recommendations"
//           element={
//             userData ? <RecommendedCourses /> : <Navigate to={"/login"} />
//           }
//         />
//       </Routes>
//     </>
//   );
// };

// export default App;

import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import useGetCurrentUser from "./customHooks/getCurrentUser";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile";
import ForgetPassword from "./pages/ForgetPassword";
import EditProfile from "./pages/EditProfile";
import Dashboard from "./pages/Educator/Dashboard";
import Courses from "./pages/Educator/Courses";
import CreateCourses from "./pages/Educator/CreateCourses";
import getCreatorCourse from "./customHooks/getCreatorCourse";
import EditCourse from "./pages/Educator/EditCourse";
import AllCourses from "./pages/AllCourses";
import CreateLecture from "./pages/Educator/CreateLecture";
import EditLecture from "./pages/Educator/EditLecture";
import ViewCourse from "./pages/ViewCourse";
import getPublishedCourse from "./customHooks/getPublishedCourse";
import ScrollToTop from "./component/ScrollToTop";
import ViewLectures from "./pages/ViewLectures";
import MyEnrolledCourses from "./pages/MyEnrolledCourses";
import getAllReviews from "./customHooks/getAllReviews";
import SearchWithAi from "./pages/SearchWithAi";
import RecommendedCourses from "./pages/RecommendedCourses";
import { ClipLoader } from "react-spinners";

// Admin imports
// import AdminRoute from "./component/AdminRoute";
import AdminRoute from "./component/adminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageInstructors from "./pages/Admin/ManageInstructors";
import ManageStudents from "./pages/Admin/ManageStudents";
import ManageCourses from "./pages/Admin/ManageCourses";
import EarningsReport from "./pages/Admin/EarningsReport";

export const serverUrl = "http://localhost:8000";

const App = () => {
  const authLoading = useGetCurrentUser(); // Get loading state
  getCreatorCourse();
  getPublishedCourse();
  getAllReviews();

  const { userData } = useSelector((state) => state.user);

  // Show loader while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
        <ClipLoader size={60} color="#da6ed1" />
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/forget"
          element={!userData ? <ForgetPassword /> : <Navigate to={"/"} />}
        />
        <Route
          path="/editprofile"
          element={userData ? <EditProfile /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/allcourses"
          element={userData ? <AllCourses /> : <Navigate to={"/signup"} />}
        />

        {/* Instructor only routes */}
        <Route
          path="/dashboard"
          element={
            userData?.role === "instructor" ? (
              <Dashboard />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/courses"
          element={
            userData?.role === "instructor" ? (
              <Courses />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/createcourse"
          element={
            userData?.role === "instructor" ? (
              <CreateCourses />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/editcourse/:courseId"
          element={
            userData?.role === "instructor" ? (
              <EditCourse />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/createlecture/:courseId"
          element={
            userData?.role === "instructor" ? (
              <CreateLecture />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/editlecture/:courseId/:lectureId"
          element={
            userData?.role === "instructor" ? (
              <EditLecture />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/viewcourse/:courseId"
          element={userData ? <ViewCourse /> : <Navigate to={"/signup"} />}
        />

        {/* Allow all authenticated users to view lectures */}
        <Route
          path="/view-lectures/:courseId"
          element={userData ? <ViewLectures /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/mycourses"
          element={
            userData ? <MyEnrolledCourses /> : <Navigate to={"/signup"} />
          }
        />
        <Route
          path="/search"
          element={userData ? <SearchWithAi /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/recommendations"
          element={
            userData ? <RecommendedCourses /> : <Navigate to={"/login"} />
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/instructors"
          element={
            <AdminRoute>
              <ManageInstructors />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <AdminRoute>
              <ManageStudents />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <AdminRoute>
              <ManageCourses />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/earnings"
          element={
            <AdminRoute>
              <EarningsReport />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
