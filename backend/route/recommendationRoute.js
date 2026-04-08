import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  getPersonalizedRecommendations,
  getSimilarCourses,
  trackCourseView,
  getCourseStats,
  triggerSimilarityCalculation,
} from "../controller/recommendationController.js";

const recommendationRouter = express.Router();

// ============ PUBLIC ROUTES (minimal auth) ============
// Get similar courses for a specific course
recommendationRouter.get("/similar/:courseId", getSimilarCourses);

// Get course statistics
recommendationRouter.get("/stats/:courseId", getCourseStats);

// ============ PROTECTED ROUTES ============
recommendationRouter.use(isAuth);

// Get personalized recommendations for logged-in user
recommendationRouter.get("/personalized", getPersonalizedRecommendations);

// Track course view (for better recommendations)
recommendationRouter.post("/track-view", trackCourseView);

// Admin/Instructor only route
recommendationRouter.post(
  "/calculate-similarities",
  triggerSimilarityCalculation,
);

export default recommendationRouter;
