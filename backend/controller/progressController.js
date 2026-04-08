import Progress from "../model/Progress.js";
import Lecture from "../model/lectureModel.js";
import Course from "../model/courseModel.js";
import UserInteraction from "../model/userInteractionModel.js";
import {
  updateUserPreferences,
  updateCourseStats,
} from "./recommendationController.js";

// @desc    Get user progress for a course
// @route   GET /api/progress/:courseId
// @access  Private
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    let progress = await Progress.findOne({ userId, courseId }).populate(
      "completedLectures",
    );

    if (!progress) {
      // Create initial progress record
      progress = await Progress.create({
        userId,
        courseId,
        completedLectures: [],
        progressPercentage: 0,
      });
    }

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch progress",
      error: error.message,
    });
  }
};

// @desc    Mark a lecture as completed
// @route   POST /api/progress/complete-lecture
// @access  Private
export const completeLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const userId = req.userId;

    // Find or create progress record
    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedLectures: [],
        progressPercentage: 0,
      });
    }

    // Check if lecture already completed
    if (!progress.completedLectures.includes(lectureId)) {
      progress.completedLectures.push(lectureId);

      // Get total lectures count for the course
      const course = await Course.findById(courseId).populate("lectures");
      const totalLectures = course.lectures.length;

      // Calculate progress percentage
      progress.progressPercentage =
        (progress.completedLectures.length / totalLectures) * 100;

      await progress.save();

      // 🔥 NEW: Check if course is completed
      if (progress.progressPercentage === 100) {
        // Track course completion for recommendations
        await UserInteraction.create({
          userId,
          courseId,
          interactionType: "complete",
          timestamp: new Date(),
        });

        // Update user preferences based on completed course
        await updateUserPreferences(userId, courseId, "complete");

        // Update course statistics
        await updateCourseStats(courseId, "completion");
      }

      // Track lecture completion
      await UserInteraction.create({
        userId,
        courseId,
        interactionType: "view",
        metadata: { lectureId, timeSpent: req.body.timeSpent || 0 },
        timestamp: new Date(),
      });
    }

    res.status(200).json({
      message: "Lecture marked as completed",
      progress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to complete lecture",
      error: error.message,
    });
  }
};

// @desc    Get user's overall progress across all enrolled courses
// @route   GET /api/progress/all
// @access  Private
export const getAllUserProgress = async (req, res) => {
  try {
    const userId = req.userId;

    const progress = await Progress.find({ userId })
      .populate("courseId", "title thumbnail category level")
      .sort({ updatedAt: -1 });

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all progress",
      error: error.message,
    });
  }
};

// @desc    Reset progress for a course
// @route   DELETE /api/progress/reset/:courseId
// @access  Private
export const resetProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    await Progress.findOneAndDelete({ userId, courseId });

    res.status(200).json({
      message: "Progress reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reset progress",
      error: error.message,
    });
  }
};
