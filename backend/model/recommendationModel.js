import mongoose from "mongoose";

// Store course similarity scores
const courseSimilaritySchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  similarCourses: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      score: { type: Number, min: 0, max: 1 }, // Similarity score (0-1)
      basedOn: [String], // e.g., ["category", "level", "purchased_together"]
    },
  ],
  lastCalculated: { type: Date, default: Date.now },
});

// Store user-based recommendations
const userRecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recommendations: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      score: Number, // Recommendation score
      reason: String, // e.g., "Because you enrolled in React course"
      type: {
        type: String,
        enum: ["collaborative", "content-based", "popular", "trending"],
      },
      expiresAt: {
        type: Date,
        default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
      }, // 7 days
    },
  ],
  lastUpdated: { type: Date, default: Date.now },
});

// Store global course statistics for trending/popular
const courseStatsSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    unique: true,
  },
  viewCount: { type: Number, default: 0 },
  enrollmentCount: { type: Number, default: 0 },
  completionCount: { type: Number, default: 0 },
  recentEnrollments: { type: Number, default: 0 }, // Last 7 days
  trendingScore: { type: Number, default: 0 },
  popularityScore: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

// Pre-save middleware to update timestamps
courseSimilaritySchema.pre("save", function (next) {
  this.lastCalculated = Date.now();
  next();
});

userRecommendationSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

courseStatsSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

// Create indexes for better query performance
courseSimilaritySchema.index({ courseId: 1 });
userRecommendationSchema.index({ userId: 1 });
courseStatsSchema.index({ courseId: 1 });
courseStatsSchema.index({ trendingScore: -1 });
courseStatsSchema.index({ popularityScore: -1 });

export const CourseSimilarity =
  mongoose.models.CourseSimilarity ||
  mongoose.model("CourseSimilarity", courseSimilaritySchema);

export const UserRecommendation =
  mongoose.models.UserRecommendation ||
  mongoose.model("UserRecommendation", userRecommendationSchema);

export const CourseStats =
  mongoose.models.CourseStats ||
  mongoose.model("CourseStats", courseStatsSchema);
