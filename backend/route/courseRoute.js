import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import {
  getPublishedCourses,
  getCreatorCourses,
  getAllCourse, // ✅ Now this exists
  getCoursesById,
  createCourse,
  editCourse,
  removeCourse,
  getCreatorById,
  createLecture,
  getCourseLecture,
  editLecture,
  removeLecture,
  searchCourses,
} from "../controller/courseController.js";
import {
  getSimilarCourses,
  trackCourseView,
  getCourseStats,
} from "../controller/recommendationController.js";

const courseRouter = express.Router();

// ============ PUBLIC ROUTES ============
courseRouter.get("/published", getPublishedCourses);
courseRouter.get("/allcourses", getAllCourse); // ✅ Fixed: now uses getAllCourse
courseRouter.get("/single/:courseId", getCoursesById);
courseRouter.post("/creator", getCreatorById); // Get creator by ID
courseRouter.get("/similar/:courseId", getSimilarCourses); // 🔥 NEW
courseRouter.get("/stats/:courseId", getCourseStats); // 🔥 NEW

// ============ PROTECTED ROUTES ============
courseRouter.use(isAuth);

// 🔥 NEW: Track course view
courseRouter.post("/track-view", trackCourseView);

// ============ INSTRUCTOR COURSE MANAGEMENT ============
// ============ INSTRUCTOR COURSE MANAGEMENT ============
courseRouter.post("/create", createCourse);
courseRouter.put("/update/:courseId", upload.single("thumbnail"), editCourse); // ✅ FIXED: Added multer
courseRouter.delete("/delete/:courseId", removeCourse);
courseRouter.put("/publish/:courseId", editCourse); // Toggle publish status

// ============ INSTRUCTOR DASHBOARD ============
courseRouter.get("/creator-courses", getCreatorCourses); // Get instructor's courses

// ============ LECTURE MANAGEMENT ============
// courseRouter.post("/:courseId/lecture", createLecture);
// courseRouter.get("/:courseId/lectures", getCourseLecture);
// courseRouter.put("/lecture/:lectureId", editLecture);
// courseRouter.delete("/lecture/:lectureId", removeLecture);
// ============ LECTURE MANAGEMENT ============
courseRouter.post("/:courseId/lecture", createLecture);
courseRouter.get("/:courseId/lectures", getCourseLecture);
courseRouter.put("/lecture/:lectureId", upload.single("video"), editLecture); // ✅ ADD MULTER HERE
courseRouter.delete("/lecture/:lectureId", removeLecture);

// Add this after your existing public routes
courseRouter.get("/search", searchCourses); // Add this line

export default courseRouter;
