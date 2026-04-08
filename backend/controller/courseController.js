// import { response } from "express";
// import Course from "../model/courseModel.js";
// import uploadOnCloudinary from "../config/cloudinary.js";
// import Lecture from "../model/lectureModel.js";
// import User from "../model/userModel.js";
// export const createCourse = async (req, res) => {
//   try {
//     const { title, category } = req.body;
//     if (!title || !category) {
//       return res.status(400).json({ message: "Title or Category is required" });
//     }
//     const course = await Course.create({
//       title,
//       category,
//       creator: req.userId,
//     });

//     return res.status(201).json(course);
//   } catch (error) {
//     return res.status(500).json({ message: `Create Course Error ${error}` });
//   }
// };

// // export const getPublishedCourses = async (req, res) => {
// //   try {
// //     const courses = await Course.find({ isPublished: true }).populate(
// //       "lectures"
// //     );
// //     if (!courses) {
// //       return res.status(400).json({ message: "Courses Not Found" });
// //     }
// //     return res.status(200).json(courses);
// //   } catch (error) {
// //     return res
// //       .status(500)
// //       .json({ message: `Failed to find publised courses ${error}` });
// //   }
// // };

// // export const getPublishedCourses = async (req, res) => {
// //   try {
// //     const courses = await Course.find({ isPublished: true })
// //       .populate({
// //         path: "lectures",
// //         model: "Lecture",
// //       })
// //       .exec();

// //     console.log(
// //       "AFTER POPULATE - First course lectures:",
// //       courses[0]?.lectures
// //     );

// //     if (!courses) {
// //       return res.status(400).json({ message: "Courses Not Found" });
// //     }
// //     return res.status(200).json(courses);
// //   } catch (error) {
// //     return res
// //       .status(500)
// //       .json({ message: `Failed to find published courses ${error}` });
// //   }
// // };

// export const getPublishedCourses = async (req, res) => {
//   try {
//     const courses = await Course.find({ isPublished: true })
//       .populate({
//         path: "lectures",
//         model: "Lecture",
//       })
//       .populate({
//         path: "reviews",
//         model: "Review",
//         populate: {
//           path: "user",
//           model: "User",
//           select: "name photoUrl role", // fields to include
//         },
//       })
//       .exec();

//     console.log("AFTER POPULATE - First course reviews:", courses[0]?.reviews);

//     if (!courses) {
//       return res.status(400).json({ message: "Courses Not Found" });
//     }

//     return res.status(200).json(courses);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: `Failed to find published courses ${error}` });
//   }
// };

// // export const getCreatorCourses = async (req, res) => {
// //   try {
// //     const userId = req.userId;
// //     const courses = await Course.find({
// //       creator: userId,
// //     });
// //     if (!courses) {
// //       return res.status(400).json({ message: "Courses Not Found" });
// //     }
// //     return res.status(200).json(courses);
// //   } catch (error) {
// //     return res
// //       .status(500)
// //       .json({ message: `Failed to Get Creator Courses ${error}` });
// //   }
// // };

// export const getCreatorCourses = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const courses = await Course.find({
//       creator: userId,
//     })
//       .populate("lectures") // ✅ Add this
//       .populate("enrolledStudents"); // ✅ Add this

//     if (!courses) {
//       return res.status(400).json({ message: "Courses Not Found" });
//     }
//     return res.status(200).json(courses);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: `Failed to Get Creator Courses ${error}` });
//   }
// };

// export const editCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const {
//       title,
//       subTitle,
//       description,
//       category,
//       level,
//       isPublished,
//       price,
//     } = req.body;

//     console.log("=== EDIT COURSE DEBUG ===");
//     console.log("Course ID:", courseId);
//     console.log("Request body:", req.body);
//     console.log("isPublished value:", isPublished);
//     console.log("isPublished type:", typeof isPublished);
//     console.log("File received:", req.file ? "Yes" : "No");

//     let thumbnail;
//     if (req.file) {
//       console.log("Uploading to Cloudinary...");
//       try {
//         thumbnail = await uploadOnCloudinary(req.file.path);
//         console.log("Cloudinary upload successful:", thumbnail);
//       } catch (cloudinaryError) {
//         console.error("Cloudinary upload error:", cloudinaryError);
//       }
//     }

//     let course = await Course.findById(courseId);
//     if (!course) {
//       console.log("Course not found:", courseId);
//       return res.status(400).json({ message: "Course is not Found" });
//     }

//     console.log("Existing course:", course);

//     // Build update object
//     const updateData = {
//       title: title || course.title,
//       subTitle: subTitle || course.subTitle,
//       description: description || course.description,
//       category: category || course.category,
//       level: level || course.level,
//       price: price || course.price,
//       isPublished: isPublished === "true" || isPublished === true,
//     };

//     // Only update thumbnail if a new one was uploaded
//     if (thumbnail) {
//       updateData.thumbnail = thumbnail;
//     }

//     console.log("Updating with data:", updateData);

//     course = await Course.findByIdAndUpdate(courseId, updateData, {
//       new: true,
//     });

//     console.log("Updated course:", course);
//     return res.status(200).json(course);
//   } catch (error) {
//     console.log("=== EDIT COURSE ERROR ===");
//     console.log("Error name:", error.name);
//     console.log("Error message:", error.message);
//     console.log("Error stack:", error.stack);
//     return res
//       .status(500)
//       .json({ message: `Failed to edit Course: ${error.message}` });
//   }
// };

// export const getCoursesById = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     let course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(400).json({ message: "Course is not Found" });
//     }
//     return res.status(200).json(course);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: `Failed to get course by ID ${error}` });
//   }
// };

// export const removeCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     let course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(400).json({ message: "Course is not Found" });
//     }
//     course = await Course.findByIdAndDelete(courseId, { new: true });
//     return res.status(200).json({ message: "Course Removed" });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: `Failed to remove course ${error}` });
//   }
// };

// // For Lctures

// export const createLecture = async (req, res) => {
//   try {
//     const { lectureTitle } = req.body;
//     const { courseId } = req.params;
//     if (!lectureTitle || !courseId) {
//       return res.status(400).json({
//         message: "Lecture Title is required",
//       });
//     }
//     const lecture = await Lecture.create({ lectureTitle });
//     const course = await Course.findById(courseId);
//     if (course) {
//       course.lectures.push(lecture._id);
//     }
//     await course.populate("lectures");
//     await course.save();
//     return res.status(201).json({ lecture, course });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: `Failed to create lecture ${error}` });
//   }
// };

// export const getCourseLecture = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({
//         message: "Course is not found",
//       });
//     }
//     await course.populate("lectures");
//     await course.save();
//     return res.status(200).json(course);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: `Failed to get course lecture ${error}` });
//   }
// };
// // Add this function to your courseController.js+-------                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 +*+-2222000

// export const getAllCourse = async (req, res) => {
//   try {
//     const courses = await Course.find({})
//       .populate({
//         path: "lectures",
//         model: "Lecture",
//       })
//       .populate({
//         path: "reviews",
//         model: "Review",
//         populate: {
//           path: "user",
//           model: "User",
//           select: "name photoUrl role",
//         },
//       })
//       .populate({
//         path: "creator",
//         model: "User",
//         select: "name email photoUrl",
//       })
//       .exec();

//     return res.status(200).json(courses);
//   } catch (error) {
//     return res.status(500).json({
//       message: `Failed to get all courses ${error}`,
//     });
//   }
// };

// // export const editLecture = async (req, res) => {
// //   try {
// //     const { lectureId } = req.params;
// //     const { isPreviewFree, lectureTitle } = req.body;
// //     const lecture = await Lecture.findById(lectureId);
// //     if (!lecture) {
// //       return res.status(404).json({
// //         message: "Lecture is not found",
// //       });
// //     }
// //     let videoUrl;
// //     if (req.file) {
// //       videoUrl = await uploadOnCloudinary(req.file.path);
// //       lecture.videoUrl = videoUrl;
// //     }
// //     if (lectureTitle) {
// //       lecture.lectureTitle = lectureTitle;
// //     }
// //     lecture.isPreviewFree = isPreviewFree;

// //     await lecture.save();
// //     return res.status(200).json(lecture);
// //   } catch (error) {
// //     return res.status(500).json({
// //       message: "Failed to add lecture",
// //     });
// //   }
// // };

// export const editLecture = async (req, res) => {
//   try {
//     const { lectureId } = req.params;
//     const { isPreviewFree, lectureTitle } = req.body;

//     console.log("=== EDIT LECTURE DEBUG ===");
//     console.log("Lecture ID:", lectureId);
//     console.log("isPreviewFree received:", isPreviewFree);
//     console.log("isPreviewFree type:", typeof isPreviewFree);
//     console.log("lectureTitle:", lectureTitle);
//     console.log("File received:", req.file ? "Yes" : "No");

//     const lecture = await Lecture.findById(lectureId);
//     if (!lecture) {
//       return res.status(404).json({
//         message: "Lecture is not found",
//       });
//     }

//     let videoUrl;
//     if (req.file) {
//       console.log("Uploading video to Cloudinary...");
//       try {
//         videoUrl = await uploadOnCloudinary(req.file.path);
//         console.log("Video uploaded successfully:", videoUrl);
//         lecture.videoUrl = videoUrl;
//       } catch (uploadError) {
//         console.error("Cloudinary upload error:", uploadError);
//       }
//     }

//     if (lectureTitle) {
//       lecture.lectureTitle = lectureTitle;
//     }

//     // FIXED: Handle isPreviewFree properly (could be string "true"/"false" or boolean)
//     lecture.isPreviewFree = isPreviewFree === "true" || isPreviewFree === true;

//     await lecture.save();
//     console.log("Lecture updated successfully:", lecture);

//     return res.status(200).json(lecture);
//   } catch (error) {
//     console.error("=== EDIT LECTURE ERROR ===");
//     console.error("Error name:", error.name);
//     console.error("Error message:", error.message);
//     console.error("Error stack:", error.stack);
//     return res.status(500).json({
//       message: "Failed to edit lecture: " + error.message,
//     });
//   }
// };

// export const removeLecture = async (req, res) => {
//   try {
//     const { lectureId } = req.params;
//     const lecture = await Lecture.findByIdAndDelete(lectureId);
//     if (!lecture) {
//       return res.status(404).json({ message: "Lecture is not found" });
//     }
//     await Course.updateOne(
//       { lectures: lectureId },
//       { $pull: { lectures: lectureId } },
//     );
//     return res.status(200).json({ message: "Lecture Removed" });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to remove lecture",
//     });
//   }
// };

// //get creator

// export const getCreatorById = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const user = await User.findById(userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "USer is not found" });
//     }
//     return res.status(200).json(user);
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to get instructor",
//     });
//   }
// };

// // Add this function at the end of the file
// export const searchCourses = async (req, res) => {
//   try {
//     const { query } = req.query; // Get search query from URL parameter

//     if (!query || query.trim() === "") {
//       return res.status(400).json({ message: "Search query is required" });
//     }

//     // Create a case-insensitive regex search pattern
//     const searchRegex = new RegExp(query.trim(), "i");

//     // Search in title, subtitle, description, and category
//     const courses = await Course.find({
//       isPublished: true, // Only show published courses
//       $or: [
//         { title: searchRegex },
//         { subTitle: searchRegex },
//         { description: searchRegex },
//         { category: searchRegex },
//         { level: searchRegex },
//       ],
//     })
//       .populate({
//         path: "lectures",
//         model: "Lecture",
//       })
//       .populate({
//         path: "reviews",
//         model: "Review",
//         populate: {
//           path: "user",
//           model: "User",
//           select: "name photoUrl role",
//         },
//       })
//       .populate({
//         path: "creator",
//         model: "User",
//         select: "name email photoUrl",
//       })
//       .exec();

//     return res.status(200).json(courses);
//   } catch (error) {
//     console.error("Search error:", error);
//     return res.status(500).json({
//       message: `Failed to search courses: ${error.message}`,
//     });
//   }
// };

import { response } from "express";
import Course from "../model/courseModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Lecture from "../model/lectureModel.js";
import User from "../model/userModel.js";

// Helper function for category normalization
const normalizeCategory = (category) => {
  const categoryMapping = {
    "app devleopment": "app development",
    "app devlopment": "app development",
    "app develpment": "app development",
    appdevelopment: "app development",
    "app dev": "app development",
  };

  const lowerCategory = category?.toLowerCase() || "";
  return categoryMapping[lowerCategory] || lowerCategory;
};

// Search Courses with fuzzy matching
export const searchCourses = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchTerm = query.trim().toLowerCase();
    const searchRegex = new RegExp(searchTerm, "i");

    let courses = await Course.find({ isPublished: true })
      .populate({ path: "lectures", model: "Lecture" })
      .populate({
        path: "reviews",
        model: "Review",
        populate: { path: "user", model: "User", select: "name photoUrl role" },
      })
      .populate({
        path: "creator",
        model: "User",
        select: "name email photoUrl",
      })
      .exec();

    const filteredCourses = courses.filter((course) => {
      const matchesRegex =
        searchRegex.test(course.title) ||
        searchRegex.test(course.subTitle || "") ||
        searchRegex.test(course.description || "") ||
        searchRegex.test(course.level || "");

      const normalizedCourseCategory = normalizeCategory(course.category);
      const normalizedSearchTerm = normalizeCategory(searchTerm);
      const matchesCategory =
        normalizedCourseCategory.includes(normalizedSearchTerm) ||
        normalizedSearchTerm.includes(normalizedCourseCategory);

      return matchesRegex || matchesCategory;
    });

    return res.status(200).json(filteredCourses);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      message: `Failed to search courses: ${error.message}`,
    });
  }
};

// export const createCourse = async (req, res) => {
//   try {
//     const { title, category } = req.body;
//     if (!title || !category) {
//       return res.status(400).json({ message: "Title or Category is required" });
//     }
//     const course = await Course.create({
//       title,
//       category,
//       creator: req.userId,
//     });

//     return res.status(201).json(course);
//   } catch (error) {
//     return res.status(500).json({ message: `Create Course Error ${error}` });
//   }
// };

export const createCourse = async (req, res) => {
  try {
    const { title, category, isPublished, price } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title or Category is required" });
    }

    // If publishing immediately, price is required
    const isPublishing = isPublished === "true" || isPublished === true;
    const priceValue = parseFloat(price);

    if (isPublishing && (!price || isNaN(priceValue) || priceValue <= 0)) {
      return res.status(400).json({
        message:
          "Price is required and must be greater than 0 for published courses",
      });
    }

    const course = await Course.create({
      title,
      category,
      creator: req.userId,
      price: priceValue || 0,
      isPublished: isPublishing || false,
    });

    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ message: `Create Course Error ${error}` });
  }
};

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate({ path: "lectures", model: "Lecture" })
      .populate({
        path: "reviews",
        model: "Review",
        populate: { path: "user", model: "User", select: "name photoUrl role" },
      })
      .exec();

    console.log("AFTER POPULATE - First course reviews:", courses[0]?.reviews);

    if (!courses) {
      return res.status(400).json({ message: "Courses Not Found" });
    }

    return res.status(200).json(courses);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to find published courses ${error}` });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const courses = await Course.find({ creator: userId })
      .populate("lectures")
      .populate("enrolledStudents");

    if (!courses) {
      return res.status(400).json({ message: "Courses Not Found" });
    }
    return res.status(200).json(courses);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to Get Creator Courses ${error}` });
  }
};

// export const editCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const {
//       title,
//       subTitle,
//       description,
//       category,
//       level,
//       isPublished,
//       price,
//     } = req.body;

//     console.log("=== EDIT COURSE DEBUG ===");
//     console.log("Course ID:", courseId);
//     console.log("Request body:", req.body);
//     console.log("File received:", req.file ? "Yes" : "No");

//     let thumbnail;
//     if (req.file) {
//       console.log("Uploading to Cloudinary...");
//       try {
//         thumbnail = await uploadOnCloudinary(req.file.path);
//         console.log("Cloudinary upload successful:", thumbnail);
//       } catch (cloudinaryError) {
//         console.error("Cloudinary upload error:", cloudinaryError);
//       }
//     }

//     let course = await Course.findById(courseId);
//     if (!course) {
//       console.log("Course not found:", courseId);
//       return res.status(400).json({ message: "Course is not Found" });
//     }

//     const updateData = {
//       title: title || course.title,
//       subTitle: subTitle || course.subTitle,
//       description: description || course.description,
//       category: category || course.category,
//       level: level || course.level,
//       price: price || course.price,
//       isPublished: isPublished === "true" || isPublished === true,
//     };

//     if (thumbnail) {
//       updateData.thumbnail = thumbnail;
//     }

//     course = await Course.findByIdAndUpdate(courseId, updateData, {
//       new: true,
//     });

//     console.log("Updated course:", course);
//     return res.status(200).json(course);
//   } catch (error) {
//     console.log("=== EDIT COURSE ERROR ===");
//     console.log("Error message:", error.message);
//     return res
//       .status(500)
//       .json({ message: `Failed to edit Course: ${error.message}` });
//   }
// };

export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      subTitle,
      description,
      category,
      level,
      isPublished,
      price,
    } = req.body;

    console.log("=== EDIT COURSE DEBUG ===");
    console.log("Course ID:", courseId);
    console.log("Request body:", req.body);
    console.log("File received:", req.file ? "Yes" : "No");

    let thumbnail;
    if (req.file) {
      console.log("Uploading to Cloudinary...");
      try {
        thumbnail = await uploadOnCloudinary(req.file.path);
        console.log("Cloudinary upload successful:", thumbnail);
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
      }
    }

    let course = await Course.findById(courseId);
    if (!course) {
      console.log("Course not found:", courseId);
      return res.status(400).json({ message: "Course is not Found" });
    }

    // PRICE VALIDATION
    const isPublishing = isPublished === "true" || isPublished === true;
    const priceValue = parseFloat(price);

    // If trying to publish, price is required and must be > 0
    if (isPublishing && (!price || isNaN(priceValue) || priceValue <= 0)) {
      return res.status(400).json({
        message:
          "Price is required and must be greater than 0 for published courses",
      });
    }

    // If price is provided but invalid for draft courses
    if (
      price !== undefined &&
      price !== "" &&
      (isNaN(priceValue) || priceValue < 0)
    ) {
      return res.status(400).json({
        message: "Please enter a valid price (0 or greater)",
      });
    }

    const updateData = {
      title: title || course.title,
      subTitle: subTitle || course.subTitle,
      description: description || course.description,
      category: category || course.category,
      level: level || course.level,
      isPublished: isPublishing,
    };

    // Only update price if provided
    if (price !== undefined && price !== "") {
      updateData.price = priceValue;
    }

    if (thumbnail) {
      updateData.thumbnail = thumbnail;
    }

    console.log("Updating with data:", updateData);

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    console.log("Updated course:", course);
    return res.status(200).json(course);
  } catch (error) {
    console.log("=== EDIT COURSE ERROR ===");
    console.log("Error message:", error.message);
    return res
      .status(500)
      .json({ message: `Failed to edit Course: ${error.message}` });
  }
};

export const getCoursesById = async (req, res) => {
  try {
    const { courseId } = req.params;
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ message: "Course is not Found" });
    }
    return res.status(200).json(course);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to get course by ID ${error}` });
  }
};

// export const removeCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     let course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(400).json({ message: "Course is not Found" });
//     }
//     course = await Course.findByIdAndDelete(courseId, { new: true });
//     return res.status(200).json({ message: "Course Removed" });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: `Failed to remove course ${error}` });
//   }
// };

// Lectures

export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find and delete the course
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Also delete all lectures associated with this course
    await Lecture.deleteMany({ _id: { $in: course.lectures } });

    // Remove course from enrolled students
    await User.updateMany(
      { enrolledCourses: courseId },
      { $pull: { enrolledCourses: courseId } },
    );

    return res.status(200).json({ message: "Course removed successfully" });
  } catch (error) {
    console.error("Remove course error:", error);
    return res
      .status(500)
      .json({ message: `Failed to remove course: ${error.message}` });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;
    if (!lectureTitle || !courseId) {
      return res.status(400).json({ message: "Lecture Title is required" });
    }
    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
    }
    await course.populate("lectures");
    await course.save();
    return res.status(201).json({ lecture, course });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to create lecture ${error}` });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course is not found" });
    }
    await course.populate("lectures");
    await course.save();
    return res.status(200).json(course);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to get course lecture ${error}` });
  }
};

export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate({ path: "lectures", model: "Lecture" })
      .populate({
        path: "reviews",
        model: "Review",
        populate: { path: "user", model: "User", select: "name photoUrl role" },
      })
      .populate({
        path: "creator",
        model: "User",
        select: "name email photoUrl",
      })
      .exec();

    return res.status(200).json(courses);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to get all courses ${error}` });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { isPreviewFree, lectureTitle } = req.body;

    console.log("=== EDIT LECTURE DEBUG ===");
    console.log("Lecture ID:", lectureId);
    console.log("File received:", req.file ? "Yes" : "No");

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture is not found" });
    }

    let videoUrl;
    if (req.file) {
      console.log("Uploading video to Cloudinary...");
      try {
        videoUrl = await uploadOnCloudinary(req.file.path);
        lecture.videoUrl = videoUrl;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
      }
    }

    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle;
    }

    lecture.isPreviewFree = isPreviewFree === "true" || isPreviewFree === true;

    await lecture.save();
    console.log("Lecture updated successfully:", lecture);

    return res.status(200).json(lecture);
  } catch (error) {
    console.error("=== EDIT LECTURE ERROR ===");
    console.error("Error message:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to edit lecture: " + error.message });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture is not found" });
    }
    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } },
    );
    return res.status(200).json({ message: "Lecture Removed" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove lecture" });
  }
};

export const getCreatorById = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get instructor" });
  }
};
