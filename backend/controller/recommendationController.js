import mongoose from "mongoose";
import User from "../model/userModel.js";
import Course from "../model/courseModel.js";
import UserInteraction from "../model/userInteractionModel.js";
import {
  CourseSimilarity,
  UserRecommendation,
  CourseStats,
} from "../model/recommendationModel.js";
import Order from "../model/orderModel.js";

// ============================================
// USER PREFERENCES UPDATE
// ============================================

// @desc    Update user preferences based on interactions
export const updateUserPreferences = async (
  userId,
  courseId,
  interactionType,
) => {
  try {
    const course = await Course.findById(courseId);
    if (!course) return;

    const user = await User.findById(userId);
    if (!user) return;

    // Initialize preferences if not exists
    if (!user.preferences) {
      user.preferences = {
        categories: [],
        levels: [],
        viewedCourses: [],
        priceRange: { min: 0, max: 1000 },
        preferredInstructors: [],
      };
    }

    // Update category preferences
    const categoryIndex = user.preferences.categories.findIndex(
      (c) => c.category === course.category,
    );

    if (categoryIndex > -1) {
      user.preferences.categories[categoryIndex].count += 1;
      user.preferences.categories[categoryIndex].lastAccessed = new Date();
    } else {
      user.preferences.categories.push({
        category: course.category,
        count: 1,
        lastAccessed: new Date(),
      });
    }

    // Update level preferences
    if (course.level) {
      const levelIndex = user.preferences.levels.findIndex(
        (l) => l.level === course.level,
      );

      if (levelIndex > -1) {
        user.preferences.levels[levelIndex].count += 1;
        user.preferences.levels[levelIndex].lastAccessed = new Date();
      } else {
        user.preferences.levels.push({
          level: course.level,
          count: 1,
          lastAccessed: new Date(),
        });
      }
    }

    // Update instructor preferences
    const instructorIndex =
      user.preferences.preferredInstructors?.findIndex(
        (i) => i.instructorId.toString() === course.creator.toString(),
      ) || -1;

    if (instructorIndex > -1) {
      user.preferences.preferredInstructors[instructorIndex].count += 1;
    } else {
      if (!user.preferences.preferredInstructors) {
        user.preferences.preferredInstructors = [];
      }
      user.preferences.preferredInstructors.push({
        instructorId: course.creator,
        count: 1,
      });
    }

    // Update price range preference
    if (course.price) {
      const currentMin = user.preferences.priceRange?.min || 0;
      const currentMax = user.preferences.priceRange?.max || 1000;

      user.preferences.priceRange = {
        min: Math.min(currentMin, course.price),
        max: Math.max(currentMax, course.price),
      };
    }

    await user.save();
  } catch (error) {
    console.error("Error updating user preferences:", error);
  }
};

// ============================================
// COURSE STATISTICS UPDATE
// ============================================

// @desc    Update course statistics
export const updateCourseStats = async (courseId, action) => {
  try {
    let stats = await CourseStats.findOne({ courseId });

    if (!stats) {
      stats = new CourseStats({ courseId });
    }

    switch (action) {
      case "view":
        stats.viewCount += 1;
        break;
      case "enrollment":
        stats.enrollmentCount += 1;
        stats.recentEnrollments += 1;
        break;
      case "completion":
        stats.completionCount += 1;
        break;
    }

    stats.popularityScore =
      stats.enrollmentCount * 3 +
      stats.completionCount * 5 +
      stats.viewCount * 0.5;

    stats.trendingScore =
      stats.recentEnrollments * 10 +
      stats.completionCount * 8 +
      stats.viewCount * 0.1;

    await stats.save();

    setTimeout(
      async () => {
        const currentStats = await CourseStats.findOne({ courseId });
        if (currentStats) {
          currentStats.recentEnrollments = Math.max(
            0,
            currentStats.recentEnrollments - 1,
          );
          await currentStats.save();
        }
      },
      7 * 24 * 60 * 60 * 1000,
    );
  } catch (error) {
    console.error("Error updating course stats:", error);
  }
};

// ============================================
// COURSE SIMILARITY CALCULATION
// ============================================

const calculateCourseSimilarity = (course1, course2) => {
  let score = 0;
  let factors = [];

  if (course1.category === course2.category) {
    score += 0.5;
    factors.push("category");
  }

  if (course1.level === course2.level) {
    score += 0.2;
    factors.push("level");
  }

  if (course1.creator?.toString() === course2.creator?.toString()) {
    score += 0.15;
    factors.push("same_creator");
  }

  if (course1.price && course2.price) {
    const priceDiff = Math.abs(course1.price - course2.price);
    if (priceDiff < 20) {
      score += 0.1;
      factors.push("price_range");
    }
  }

  return { score: Math.min(score, 1), factors };
};

export const calculateCourseSimilarities = async () => {
  try {
    const courses = await Course.find({ isPublished: true });

    for (let i = 0; i < courses.length; i++) {
      const course1 = courses[i];
      const similarCourses = [];

      for (let j = 0; j < courses.length; j++) {
        if (i === j) continue;

        const course2 = courses[j];
        const { score, factors } = calculateCourseSimilarity(course1, course2);

        if (score > 0.3) {
          similarCourses.push({
            courseId: course2._id,
            score,
            basedOn: factors,
          });
        }
      }

      similarCourses.sort((a, b) => b.score - a.score);

      await CourseSimilarity.findOneAndUpdate(
        { courseId: course1._id },
        {
          courseId: course1._id,
          similarCourses: similarCourses.slice(0, 10),
          lastCalculated: new Date(),
        },
        { upsert: true, new: true },
      );
    }

    console.log("Course similarities calculated successfully");
  } catch (error) {
    console.error("Error calculating course similarities:", error);
  }
};

// ============================================
// RECOMMENDATION GENERATION
// ============================================

export const getContentBasedRecommendations = async (userId, limit = 10) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.preferences) return [];

    const enrolledCourses = user.enrolledCourses || [];
    const enrolledIds = enrolledCourses.map((id) => id.toString());

    const preferredCategories =
      user.preferences.categories
        ?.sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map((c) => c.category) || [];

    const preferredLevels =
      user.preferences.levels
        ?.sort((a, b) => b.count - a.count)
        .slice(0, 2)
        .map((l) => l.level) || [];

    const query = {
      isPublished: true,
      _id: { $nin: enrolledIds },
    };

    if (preferredCategories.length > 0) {
      query.category = { $in: preferredCategories };
    }

    if (preferredLevels.length > 0) {
      query.level = { $in: preferredLevels };
    }

    const recommendations = await Course.find(query)
      .limit(limit * 2)
      .lean();

    const scoredRecommendations = recommendations.map((course) => {
      let score = 0;

      if (preferredCategories.includes(course.category)) {
        const categoryPref = user.preferences.categories.find(
          (c) => c.category === course.category,
        );
        score += (categoryPref?.count || 1) * 0.4;
      }

      if (preferredLevels.includes(course.level)) {
        const levelPref = user.preferences.levels.find(
          (l) => l.level === course.level,
        );
        score += (levelPref?.count || 1) * 0.3;
      }

      if (
        user.preferences.preferredInstructors?.some(
          (i) => i.instructorId.toString() === course.creator?.toString(),
        )
      ) {
        score += 0.2;
      }

      if (user.preferences.priceRange) {
        if (
          course.price >= user.preferences.priceRange.min &&
          course.price <= user.preferences.priceRange.max
        ) {
          score += 0.1;
        }
      }

      return { ...course, recommendationScore: score };
    });

    return scoredRecommendations
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting content-based recommendations:", error);
    return [];
  }
};

export const getCollaborativeRecommendations = async (userId, limit = 10) => {
  try {
    const userOrders = await Order.find({
      user: userId,
      status: "completed",
    }).select("course");

    const userCourseIds = userOrders.map((order) => order.course.toString());

    if (userCourseIds.length === 0) return [];

    const similarUsers = await Order.aggregate([
      {
        $match: {
          course: {
            $in: userCourseIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
          user: { $ne: new mongoose.Types.ObjectId(userId) },
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$user",
          commonCourses: { $addToSet: "$course" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    if (similarUsers.length === 0) return [];

    const similarUserIds = similarUsers.map((u) => u._id);

    const recommendations = await Order.aggregate([
      {
        $match: {
          user: { $in: similarUserIds },
          course: {
            $nin: userCourseIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$course",
          purchaseCount: { $sum: 1 },
          avgScore: { $avg: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      { $unwind: "$courseDetails" },
      {
        $match: {
          "courseDetails.isPublished": true,
        },
      },
      { $sort: { purchaseCount: -1 } },
      { $limit: limit },
    ]);

    return recommendations.map((rec) => ({
      ...rec.courseDetails,
      recommendationScore: rec.purchaseCount * 0.2,
      reason:
        "Users who enrolled in similar courses also enrolled in this course",
    }));
  } catch (error) {
    console.error("Error getting collaborative recommendations:", error);
    return [];
  }
};

export const getTrendingRecommendations = async (limit = 10) => {
  try {
    const trending = await CourseStats.find()
      .sort({ trendingScore: -1 })
      .limit(limit)
      .populate("courseId");

    return trending.map((stat) => ({
      ...stat.courseId.toObject(),
      recommendationScore: stat.trendingScore / 100,
      reason: "Trending now",
    }));
  } catch (error) {
    console.error("Error getting trending recommendations:", error);
    return [];
  }
};

// ============================================
// SEQUENTIAL RECOMMENDATIONS (Learning Path)
// ============================================

export const getSequentialRecommendations = async (userId, limit = 10) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const enrolledCourses = await Course.find({
      _id: { $in: user.enrolledCourses || [] },
    });

    if (enrolledCourses.length === 0) return [];

    const learningPaths = {
      HTML: ["CSS", "CSS Basics", "CSS Fundamentals", "Complete CSS Tutorial"],
      CSS: [
        "JavaScript",
        "JavaScript Basics",
        "JS Fundamentals",
        "JavaScript for Beginners",
      ],
      JavaScript: ["React", "React.js", "React Basics", "React Native"],
      React: ["Node.js", "Express", "Backend Development", "MongoDB"],
      Python: ["Python Advanced", "Django", "Flask", "Data Science"],
      Java: ["Spring Boot", "Advanced Java", "Hibernate"],
      Photoshop: ["Illustrator", "After Effects", "UI Design"],
      "UI Design": ["UX Design", "Figma", "Prototyping"],
      Flutter: ["React Native", "Mobile App Development"],
      Swift: ["iOS Development", "SwiftUI"],
    };

    const nextCourses = [];
    const userCourseTitles = enrolledCourses.map((c) => c.title);

    for (const [prerequisite, nextList] of Object.entries(learningPaths)) {
      const hasPrerequisite = userCourseTitles.some((title) =>
        title.toLowerCase().includes(prerequisite.toLowerCase()),
      );

      if (hasPrerequisite) {
        const nextAvailable = await Course.find({
          title: { $in: nextList },
          isPublished: true,
          _id: { $nin: user.enrolledCourses },
        });

        nextAvailable.forEach((course) => {
          nextCourses.push({
            ...course.toObject(),
            recommendationScore: 0.95,
            reason: `Next step after ${prerequisite}`,
          });
        });
      }
    }

    const userCategories = [...new Set(enrolledCourses.map((c) => c.category))];

    for (const category of userCategories) {
      const userLevels = enrolledCourses.map((c) => c.level);

      let nextLevel = null;
      if (userLevels.includes("Beginner")) nextLevel = "Intermediate";
      if (userLevels.includes("Intermediate")) nextLevel = "Advanced";

      if (nextLevel) {
        const advancedCourses = await Course.find({
          category: category,
          level: nextLevel,
          isPublished: true,
          _id: { $nin: user.enrolledCourses },
        }).limit(limit);

        advancedCourses.forEach((course) => {
          nextCourses.push({
            ...course.toObject(),
            recommendationScore: 0.8,
            reason: `Advance from ${category} to ${nextLevel} level`,
          });
        });
      }
    }

    const unique = [];
    const seen = new Set();
    for (const course of nextCourses) {
      if (!seen.has(course._id.toString())) {
        seen.add(course._id.toString());
        unique.push(course);
      }
    }

    return unique.slice(0, limit);
  } catch (error) {
    console.error("Error getting sequential recommendations:", error);
    return [];
  }
};

// ============================================
// MAIN RECOMMENDATION FUNCTION - COMPLETE FIXED
// ============================================

export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 10 } = req.query;

    // Get user to check if they are new
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is new (less than 1 hour old OR no preferences)
    const userCreatedAt = user.createdAt || new Date();
    const isNewUser =
      !user.preferences?.categories?.length ||
      Date.now() - new Date(userCreatedAt).getTime() < 60 * 60 * 1000;

    // ============================================
    // NEW USER WITH 1 PURCHASED COURSE - FALLBACK
    // ============================================

    if (isNewUser && user.enrolledCourses?.length === 1) {
      console.log("🆕 New user detected - using sequential fallback");

      const purchasedCourse = await Course.findById(user.enrolledCourses[0]);

      if (purchasedCourse) {
        const learningPath = {
          HTML: [
            "CSS",
            "CSS Basics",
            "CSS Fundamentals",
            "Complete CSS Tutorial",
          ],
          CSS: [
            "JavaScript",
            "JavaScript Basics",
            "JS Fundamentals",
            "JavaScript for Beginners",
          ],
          JavaScript: ["React", "React.js", "React Basics", "React Native"],
          React: ["Node.js", "Express", "Backend Development", "MongoDB"],
          Python: ["Python Advanced", "Django", "Flask", "Data Science"],
          Java: ["Spring Boot", "Advanced Java", "JSP", "Hibernate"],
          Photoshop: ["Illustrator", "After Effects", "UI Design"],
          "UI Design": ["UX Design", "Figma", "Prototyping", "Adobe XD"],
          Flutter: [
            "React Native",
            "Mobile App Development",
            "iOS Development",
          ],
          Swift: ["iOS Development", "Apple App Design", "SwiftUI"],
        };

        let nextCourseNames = [];
        for (const [currentTopic, nextTopics] of Object.entries(learningPath)) {
          if (
            purchasedCourse.title
              .toLowerCase()
              .includes(currentTopic.toLowerCase())
          ) {
            nextCourseNames = nextTopics;
            break;
          }
        }

        let nextCourses = [];

        if (nextCourseNames.length > 0) {
          nextCourses = await Course.find({
            title: { $in: nextCourseNames },
            isPublished: true,
            _id: { $ne: purchasedCourse._id, $nin: user.enrolledCourses },
          });
        }

        if (nextCourses.length === 0) {
          nextCourses = await Course.find({
            category: purchasedCourse.category,
            isPublished: true,
            _id: { $ne: purchasedCourse._id, $nin: user.enrolledCourses },
            level: { $ne: purchasedCourse.level },
          }).limit(parseInt(limit));
        }

        if (nextCourses.length === 0) {
          nextCourses = await Course.find({
            category: purchasedCourse.category,
            isPublished: true,
            _id: { $ne: purchasedCourse._id, $nin: user.enrolledCourses },
          }).limit(parseInt(limit));
        }

        const recommendations = nextCourses.map((course) => ({
          courseId: course._id,
          score: 0.85,
          reason: `Since you bought "${purchasedCourse.title}", try this next`,
          type: "sequential",
        }));

        if (recommendations.length > 0) {
          await UserRecommendation.findOneAndUpdate(
            { userId },
            {
              userId,
              recommendations: recommendations,
              lastUpdated: new Date(),
            },
            { upsert: true, new: true },
          );
        }

        const populated = await UserRecommendation.findOne({ userId }).populate(
          "recommendations.courseId",
        );

        return res.status(200).json({
          success: true,
          recommendations: populated?.recommendations || recommendations,
        });
      }
    }

    // ============================================
    // CHECK CACHE FOR EXISTING USERS
    // ============================================

    let cached = await UserRecommendation.findOne({ userId });

    if (
      cached &&
      cached.lastUpdated > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ) {
      const populated = await UserRecommendation.findOne({ userId }).populate(
        "recommendations.courseId",
      );

      const validRecommendations = (populated?.recommendations || []).filter(
        (rec) => rec.courseId !== null,
      );

      return res.status(200).json({
        success: true,
        recommendations: validRecommendations.slice(0, parseInt(limit)),
      });
    }

    // ============================================
    // GENERATE NEW RECOMMENDATIONS
    // ============================================

    console.log("🔄 Generating new recommendations for user");

    const [contentBased, collaborative, trending, sequential] =
      await Promise.all([
        getContentBasedRecommendations(userId, parseInt(limit) * 2),
        getCollaborativeRecommendations(userId, parseInt(limit)),
        getTrendingRecommendations(5),
        getSequentialRecommendations(userId, parseInt(limit)),
      ]);

    const allRecommendations = [
      ...sequential,
      ...contentBased,
      ...collaborative,
      ...trending,
    ];
    const seen = new Set();
    const uniqueRecommendations = [];

    for (const rec of allRecommendations) {
      if (!rec || !rec._id) continue;

      if (!seen.has(rec._id.toString())) {
        seen.add(rec._id.toString());

        let type = "content-based";
        let reason = rec.reason || "Recommended based on your interests";

        if (sequential.find((s) => s._id?.toString() === rec._id?.toString())) {
          type = "sequential";
          reason = rec.reason || "Next step in your learning path";
        } else if (
          collaborative.find((c) => c._id?.toString() === rec._id?.toString())
        ) {
          type = "collaborative";
          reason = "Users with similar interests enrolled in this course";
        } else if (
          trending.find((t) => t._id?.toString() === rec._id?.toString())
        ) {
          type = "trending";
          reason = "Trending now";
        }

        uniqueRecommendations.push({
          courseId: rec._id,
          score: rec.recommendationScore || 0.5,
          reason,
          type,
        });
      }
    }

    uniqueRecommendations.sort((a, b) => b.score - a.score);
    const finalRecommendations = uniqueRecommendations.slice(
      0,
      parseInt(limit),
    );

    await UserRecommendation.findOneAndUpdate(
      { userId },
      {
        userId,
        recommendations: finalRecommendations,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true },
    );

    const populated = await UserRecommendation.findOne({ userId }).populate(
      "recommendations.courseId",
    );

    const validRecommendations = (populated?.recommendations || []).filter(
      (rec) => rec.courseId !== null,
    );

    res.status(200).json({
      success: true,
      recommendations: validRecommendations,
    });
  } catch (error) {
    console.error("Error getting personalized recommendations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get recommendations",
      error: error.message,
    });
  }
};

// ============================================
// OTHER ROUTES
// ============================================

export const getSimilarCourses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const limit = parseInt(req.query.limit) || 6;

    const similarity = await CourseSimilarity.findOne({ courseId }).populate(
      "similarCourses.courseId",
    );

    if (similarity) {
      return res.status(200).json({
        success: true,
        similarCourses: similarity.similarCourses
          .filter((s) => s.courseId)
          .slice(0, limit),
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const allCourses = await Course.find({
      isPublished: true,
      _id: { $ne: courseId },
    });

    const similarCourses = allCourses
      .map((otherCourse) => {
        const { score, factors } = calculateCourseSimilarity(
          course,
          otherCourse,
        );
        return {
          courseId: otherCourse,
          score,
          basedOn: factors,
        };
      })
      .filter((s) => s.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    res.status(200).json({
      success: true,
      similarCourses,
    });
  } catch (error) {
    console.error("Error getting similar courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get similar courses",
      error: error.message,
    });
  }
};

export const trackCourseView = async (req, res) => {
  try {
    const { courseId, timeSpent } = req.body;
    const userId = req.userId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await UserInteraction.create({
      userId,
      courseId,
      interactionType: "view",
      metadata: { timeSpent: timeSpent || 0 },
      timestamp: new Date(),
    });

    await User.findByIdAndUpdate(userId, {
      $push: {
        "preferences.viewedCourses": {
          courseId,
          viewedAt: new Date(),
          timeSpent: timeSpent || 0,
        },
      },
    });

    await updateCourseStats(courseId, "view");
    await updateUserPreferences(userId, courseId, "view");

    res.status(200).json({
      success: true,
      message: "Course view tracked successfully",
    });
  } catch (error) {
    console.error("Error tracking course view:", error);
    res.status(500).json({
      success: false,
      message: "Failed to track course view",
      error: error.message,
    });
  }
};

export const getCourseStats = async (req, res) => {
  try {
    const { courseId } = req.params;

    const stats = await CourseStats.findOne({ courseId });

    res.status(200).json({
      success: true,
      stats: stats || {
        viewCount: 0,
        enrollmentCount: 0,
        completionCount: 0,
        trendingScore: 0,
        popularityScore: 0,
      },
    });
  } catch (error) {
    console.error("Error getting course stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get course statistics",
      error: error.message,
    });
  }
};

export const triggerSimilarityCalculation = async (req, res) => {
  try {
    if (req.userRole !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await calculateCourseSimilarities();

    res.status(200).json({
      success: true,
      message: "Course similarities calculated successfully",
    });
  } catch (error) {
    console.error("Error calculating similarities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate similarities",
      error: error.message,
    });
  }
};
