// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//     },
//     role: {
//       type: String,
//       enum: ["student", "instructor"],
//       required: true,
//     },
//     photoUrl: {
//       type: String,
//       default: "",
//     },
//     enrolledCourses: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Course",
//       },
//     ],
//     resetOtp: {
//       type: String,
//     },
//     otpExpires: {
//       type: Date,
//     },
//     isOtpVerified: {
//       type: Boolean,
//       default: false,
//     },
//     // 🔥 NEW: User preferences for recommendation system
//     preferences: {
//       categories: [
//         {
//           category: String,
//           count: { type: Number, default: 1 },
//           lastAccessed: { type: Date, default: Date.now },
//         },
//       ],
//       levels: [
//         {
//           level: {
//             type: String,
//             enum: ["Beginner", "Intermediate", "Advanced"],
//           },
//           count: { type: Number, default: 1 },
//           lastAccessed: { type: Date, default: Date.now },
//         },
//       ],
//       viewedCourses: [
//         {
//           courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
//           viewedAt: { type: Date, default: Date.now },
//           timeSpent: { type: Number, default: 0 }, // in seconds
//         },
//       ],
//       priceRange: {
//         min: { type: Number, default: 0 },
//         max: { type: Number, default: 1000 },
//       },
//       preferredInstructors: [
//         {
//           instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//           count: { type: Number, default: 1 },
//         },
//       ],
//     },
//     // 🔥 NEW: Track recommendation performance
//     recommendationFeedback: [
//       {
//         courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
//         recommendedAt: Date,
//         clicked: { type: Boolean, default: false },
//         enrolled: { type: Boolean, default: false },
//         watched: { type: Boolean, default: false },
//       },
//     ],
//   },
//   { timestamps: true },
// );

// // Fix: Check if model already exists before creating
// const User = mongoose.models.User || mongoose.model("User", userSchema);

// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"], // ✅ Added "admin" role
      required: true,
    },
    photoUrl: {
      type: String,
      default: "",
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    resetOtp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    // 🔥 NEW: User preferences for recommendation system
    preferences: {
      categories: [
        {
          category: String,
          count: { type: Number, default: 1 },
          lastAccessed: { type: Date, default: Date.now },
        },
      ],
      levels: [
        {
          level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
          },
          count: { type: Number, default: 1 },
          lastAccessed: { type: Date, default: Date.now },
        },
      ],
      viewedCourses: [
        {
          courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
          viewedAt: { type: Date, default: Date.now },
          timeSpent: { type: Number, default: 0 }, // in seconds
        },
      ],
      priceRange: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 1000 },
      },
      preferredInstructors: [
        {
          instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          count: { type: Number, default: 1 },
        },
      ],
    },
    // 🔥 NEW: Track recommendation performance
    recommendationFeedback: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        recommendedAt: Date,
        clicked: { type: Boolean, default: false },
        enrolled: { type: Boolean, default: false },
        watched: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
);

// Fix: Check if model already exists before creating
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
