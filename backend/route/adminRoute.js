// backend/route/adminRoute.js
import express from "express";
import isAuth from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/adminAuth.js";
import {
  getAllInstructors,
  getAllStudents,
  getInstructorDetails,
  getAllCourses,
  editCourse,
  deleteCourse,
  deleteUser,
  getPlatformStats,
  updateUserRole,
  getInstructorEarningsSummary,
  createAdmin,
} from "../controller/adminController.js";

const router = express.Router();

// Public route to create first admin (remove in production or protect)
router.post("/create-admin", createAdmin);

// All other admin routes require authentication and admin role
router.use(isAuth, isAdmin);

// Dashboard stats
router.get("/stats", getPlatformStats);

// User management
router.get("/instructors", getAllInstructors);
router.get("/students", getAllStudents);
router.get("/instructors/:instructorId", getInstructorDetails);
router.delete("/users/:userId", deleteUser);
router.put("/users/:userId/role", updateUserRole);

// Course management
router.get("/courses", getAllCourses);
router.put("/courses/:courseId", editCourse);
// router.put("/courses/:courseId/status", updateCourseStatus);
router.delete("/courses/:courseId", deleteCourse);

// Earnings reports
router.get("/earnings/instructors", getInstructorEarningsSummary);

export default router;
