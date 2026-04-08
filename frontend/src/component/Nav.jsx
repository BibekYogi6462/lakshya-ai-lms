import React, { useState, useEffect } from "react";
import logo from "../assets/logo2.jpg";
import { IoPersonCircleSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { ImCross } from "react-icons/im";
import { FaRobot } from "react-icons/fa";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { serverUrl } from "../App";

const Nav = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [showHam, setShowHam] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  // Close admin menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAdminMenu && !event.target.closest(".admin-dropdown")) {
        setShowAdminMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAdminMenu]);

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      toast.success("Logout Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-[70px] bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-between px-6 lg:px-16 z-50">
      {/* Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src={logo}
          alt="logo"
          className="w-[50px] h-[50px] rounded-lg border border-gray-300 shadow-sm object-cover"
        />
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Lakshya
        </h1>
      </div>

      {/* ================= DESKTOP RIGHT SECTION ================= */}
      <div className="hidden lg:flex items-center gap-5 relative">
        {/* Recommendation Button */}
        <button
          onClick={() => navigate("/recommendations")}
          className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1 transition"
        >
          <FaRobot className="text-blue-500" />
          For You
        </button>

        {/* If not logged in */}
        {/* If not logged in */}
        {!userData && (
          <IoPersonCircleSharp
            className="w-[38px] h-[38px] text-gray-700 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/login")}
          />
        )}

        {/* Logged in avatar */}
        {userData && (
          <>
            {userData?.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt="user"
                className="w-[40px] h-[40px] rounded-full cursor-pointer shadow-md hover:scale-105 transition-transform object-cover"
                onClick={() => setShow((prev) => !prev)}
              />
            ) : (
              <div
                className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-800 text-white font-semibold text-lg cursor-pointer shadow-md hover:scale-105 transition-transform"
                onClick={() => setShow((prev) => !prev)}
              >
                {userData?.role === "admin" ? (
                  <LayoutDashboard className="w-5 h-5" />
                ) : (
                  userData?.name?.slice(0, 1)?.toUpperCase()
                )}
              </div>
            )}
          </>
        )}

        {/* Admin Panel Dropdown - CLICK VERSION */}
        {userData?.role === "admin" && (
          <div className="relative admin-dropdown">
            <button
              onClick={() => setShowAdminMenu(!showAdminMenu)}
              className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-md"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Panel</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showAdminMenu ? "rotate-180" : ""}`}
              />
            </button>

            {showAdminMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="py-2">
                  <div className="px-4 py-2 bg-gray-50 border-b">
                    <p className="text-sm font-semibold text-gray-700">
                      Admin Controls
                    </p>
                    <p className="text-xs text-gray-500">Manage platform</p>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/admin");
                      setShowAdminMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Dashboard</p>
                      <p className="text-xs text-gray-500">
                        View platform overview
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/admin/instructors");
                      setShowAdminMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b"
                  >
                    <Users className="w-4 h-4 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Manage Instructors</p>
                      <p className="text-xs text-gray-500">
                        View and manage instructors
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/admin/students");
                      setShowAdminMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b"
                  >
                    <Users className="w-4 h-4 text-purple-600" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Manage Students</p>
                      <p className="text-xs text-gray-500">
                        View all enrolled students
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/admin/courses");
                      setShowAdminMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b"
                  >
                    <BookOpen className="w-4 h-4 text-yellow-600" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Manage Courses</p>
                      <p className="text-xs text-gray-500">
                        Approve or reject courses
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/admin/earnings");
                      setShowAdminMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Earnings Report</p>
                      <p className="text-xs text-gray-500">
                        Track instructor earnings
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructor dashboard button - only show for instructors, not for admin */}
        {userData?.role === "instructor" && (
          <button
            className="px-4 py-2 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        )}

        {/* Login / Logout */}
        {!userData ? (
          <button
            className="px-4 py-2 bg-white text-black border border-black rounded-xl font-medium hover:bg-black hover:text-white transition-colors"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-white text-black rounded-xl font-medium shadow hover:bg-gray-100 transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

        {/* User Dropdown */}
        {show && userData && userData.role !== "admin" && (
          <div className="absolute top-[150%] right-0 flex flex-col gap-2 text-[16px] rounded-md bg-white px-[15px] py-[10px] border-[2px] border-black z-50">
            <span
              className="bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600 cursor-pointer"
              onClick={() => {
                navigate("/profile");
                setShow(false);
              }}
            >
              My Profile
            </span>

            <span
              className="bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600 cursor-pointer"
              onClick={() => {
                navigate("/mycourses");
                setShow(false);
              }}
            >
              My Courses
            </span>
          </div>
        )}
      </div>

      {/* ================= MOBILE SECTION ================= */}
      <div className="flex lg:hidden items-center gap-4">
        <RxHamburgerMenu
          className="w-6 h-6 cursor-pointer"
          onClick={() => setShowHam((prev) => !prev)}
        />
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white flex flex-col items-center justify-center gap-5 z-50 lg:hidden transform transition-transform duration-500 ${
          showHam ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ImCross
          className="w-6 h-6 text-black absolute top-5 right-5 cursor-pointer"
          onClick={() => setShowHam(false)}
        />

        {/* Mobile Recommendation Button */}
        <button
          onClick={() => {
            navigate("/recommendations");
            setShowHam(false);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2"
        >
          <FaRobot />
          For You
        </button>

        {/* Mobile Admin Menu */}
        {userData?.role === "admin" && (
          <>
            <button
              onClick={() => {
                navigate("/admin");
                setShowHam(false);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium w-48 flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate("/admin/instructors");
                setShowHam(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium w-48 flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Instructors
            </button>
            <button
              onClick={() => {
                navigate("/admin/students");
                setShowHam(false);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium w-48 flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Students
            </button>
            <button
              onClick={() => {
                navigate("/admin/courses");
                setShowHam(false);
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-xl font-medium w-48 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Courses
            </button>
            <button
              onClick={() => {
                navigate("/admin/earnings");
                setShowHam(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium w-48 flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Earnings
            </button>
          </>
        )}

        {/* Mobile Instructor Dashboard */}
        {userData?.role === "instructor" && (
          <button
            onClick={() => {
              navigate("/dashboard");
              setShowHam(false);
            }}
            className="px-4 py-2 bg-black text-white rounded-xl font-medium w-48"
          >
            Dashboard
          </button>
        )}

        {/* Mobile Profile Links for non-admin users */}
        {userData && userData.role !== "admin" && (
          <>
            <button
              onClick={() => {
                navigate("/profile");
                setShowHam(false);
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded-xl font-medium w-48"
            >
              My Profile
            </button>
            <button
              onClick={() => {
                navigate("/mycourses");
                setShowHam(false);
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded-xl font-medium w-48"
            >
              My Courses
            </button>
          </>
        )}

        {/* Mobile Login/Logout */}
        {!userData ? (
          <button
            className="px-4 py-2 bg-white text-black border border-black rounded-xl font-medium hover:bg-black hover:text-white transition-colors w-48"
            onClick={() => {
              navigate("/login");
              setShowHam(false);
            }}
          >
            Login
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-white text-black rounded-xl font-medium shadow hover:bg-gray-100 transition-colors w-48"
            onClick={() => {
              handleLogout();
              setShowHam(false);
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
