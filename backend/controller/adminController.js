// backend/controller/adminController.js
import User from "../model/userModel.js";
import Course from "../model/courseModel.js";
import Order from "../model/orderModel.js";

// Get all instructors with their details and earnings
// Get all instructors with their details and earnings
// export const getAllInstructors = async (req, res) => {
//   try {
//     const instructors = await User.find({ role: "instructor" })
//       .select("-password")
//       .sort({ createdAt: -1 });

//     const instructorsWithEarnings = await Promise.all(
//       instructors.map(async (instructor) => {
//         // CHANGE: Use 'creator' instead of 'instructorId'
//         const courses = await Course.find({ creator: instructor._id });
//         const courseIds = courses.map((course) => course._id);

//         const orders = await Order.find({
//           course: { $in: courseIds },
//           status: "completed",
//         });

//         const totalEarnings = orders.reduce(
//           (sum, order) => sum + order.amount,
//           0,
//         );
//         const totalStudents = orders.length;
//         const totalCourses = courses.length;

//         return {
//           ...instructor.toObject(),
//           totalEarnings,
//           totalStudents,
//           totalCourses,
//         };
//       }),
//     );

//     res.status(200).json(instructorsWithEarnings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get all instructors with their details and earnings
export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" })
      .select("-password")
      .sort({ createdAt: -1 });

    const instructorsWithEarnings = await Promise.all(
      instructors.map(async (instructor) => {
        // Get all courses by this instructor
        const courses = await Course.find({ creator: instructor._id });
        const courseIds = courses.map((course) => course._id);

        const orders = await Order.find({
          course: { $in: courseIds },
          status: "completed",
        });

        // Calculate total earnings
        const totalEarnings = orders.reduce(
          (sum, order) => sum + order.amount,
          0,
        );

        // COUNT UNIQUE STUDENTS (not total orders)
        const uniqueStudentIds = new Set();
        orders.forEach((order) => {
          if (order.user) {
            uniqueStudentIds.add(order.user.toString());
          }
        });
        const totalUniqueStudents = uniqueStudentIds.size;

        const totalCourses = courses.length;

        return {
          ...instructor.toObject(),
          totalEarnings,
          totalStudents: totalUniqueStudents, // Changed: unique students count
          totalCourses,
        };
      }),
    );

    res.status(200).json(instructorsWithEarnings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all students with their enrolled courses
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .populate("enrolledCourses", "title price thumbnail")
      .sort({ createdAt: -1 });

    const studentsWithStats = students.map((student) => ({
      ...student.toObject(),
      totalEnrolledCourses: student.enrolledCourses.length,
    }));

    res.status(200).json(studentsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single instructor details with earnings breakdown
// export const getInstructorDetails = async (req, res) => {
//   try {
//     const { instructorId } = req.params;

//     const instructor = await User.findOne({
//       _id: instructorId,
//       role: "instructor",
//     }).select("-password");

//     if (!instructor) {
//       return res.status(404).json({ message: "Instructor not found" });
//     }

//     // Get all courses by this instructor
//     const courses = await Course.find({ instructorId: instructor._id });

//     // Get all orders for these courses
//     const courseIds = courses.map((course) => course._id);
//     const orders = await Order.find({
//       course: { $in: courseIds },
//       status: "completed",
//     }).populate("user", "name email");

//     // Calculate earnings per course
//     const coursesWithEarnings = courses.map((course) => {
//       const courseOrders = orders.filter(
//         (order) => order.course.toString() === course._id.toString(),
//       );
//       return {
//         ...course.toObject(),
//         totalStudents: courseOrders.length,
//         totalEarnings: courseOrders.reduce(
//           (sum, order) => sum + order.amount,
//           0,
//         ),
//         students: courseOrders.map((order) => order.user),
//       };
//     });

//     const totalEarnings = coursesWithEarnings.reduce(
//       (sum, course) => sum + course.totalEarnings,
//       0,
//     );
//     const totalStudents = orders.length;

//     res.status(200).json({
//       instructor,
//       stats: {
//         totalCourses: courses.length,
//         totalStudents,
//         totalEarnings,
//       },
//       courses: coursesWithEarnings,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Get all instructors with their details and earnings
// export const getAllInstructors = async (req, res) => {
//   try {
//     const instructors = await User.find({ role: "instructor" })
//       .select("-password")
//       .sort({ createdAt: -1 });

//     const instructorsWithEarnings = await Promise.all(
//       instructors.map(async (instructor) => {
//         // CHANGE: Use 'creator' instead of 'instructorId'
//         const courses = await Course.find({ creator: instructor._id });
//         const courseIds = courses.map((course) => course._id);

//         const orders = await Order.find({
//           course: { $in: courseIds },
//           status: "completed",
//         });

//         const totalEarnings = orders.reduce(
//           (sum, order) => sum + order.amount,
//           0,
//         );
//         const totalStudents = orders.length;
//         const totalCourses = courses.length;

//         return {
//           ...instructor.toObject(),
//           totalEarnings,
//           totalStudents,
//           totalCourses,
//         };
//       }),
//     );

//     res.status(200).json(instructorsWithEarnings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get single instructor details with earnings breakdown
// export const getInstructorDetails = async (req, res) => {
//   try {
//     const { instructorId } = req.params;

//     const instructor = await User.findOne({
//       _id: instructorId,
//       role: "instructor",
//     }).select("-password");

//     if (!instructor) {
//       return res.status(404).json({ message: "Instructor not found" });
//     }

//     // CHANGE: Use 'creator' instead of 'instructorId'
//     const courses = await Course.find({ creator: instructor._id });

//     const courseIds = courses.map((course) => course._id);
//     const orders = await Order.find({
//       course: { $in: courseIds },
//       status: "completed",
//     }).populate("user", "name email");

//     const coursesWithEarnings = courses.map((course) => {
//       const courseOrders = orders.filter(
//         (order) => order.course.toString() === course._id.toString(),
//       );
//       return {
//         ...course.toObject(),
//         totalStudents: courseOrders.length,
//         totalEarnings: courseOrders.reduce(
//           (sum, order) => sum + order.amount,
//           0,
//         ),
//         students: courseOrders.map((order) => order.user),
//       };
//     });

//     const totalEarnings = coursesWithEarnings.reduce(
//       (sum, course) => sum + course.totalEarnings,
//       0,
//     );
//     const totalStudents = orders.length;

//     res.status(200).json({
//       instructor,
//       stats: {
//         totalCourses: courses.length,
//         totalStudents,
//         totalEarnings,
//       },
//       courses: coursesWithEarnings,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get single instructor details with earnings breakdown
export const getInstructorDetails = async (req, res) => {
  try {
    const { instructorId } = req.params;

    const instructor = await User.findOne({
      _id: instructorId,
      role: "instructor",
    }).select("-password");

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    const courses = await Course.find({ creator: instructor._id });
    const courseIds = courses.map((course) => course._id);
    const orders = await Order.find({
      course: { $in: courseIds },
      status: "completed",
    }).populate("user", "name email");

    // Count unique students
    const uniqueStudentIds = new Set();
    orders.forEach((order) => {
      if (order.user) {
        uniqueStudentIds.add(order.user._id.toString());
      }
    });

    const coursesWithEarnings = courses.map((course) => {
      const courseOrders = orders.filter(
        (order) => order.course.toString() === course._id.toString(),
      );
      return {
        ...course.toObject(),
        totalStudents: courseOrders.length,
        totalEarnings: courseOrders.reduce(
          (sum, order) => sum + order.amount,
          0,
        ),
        students: courseOrders.map((order) => order.user),
      };
    });

    const totalEarnings = coursesWithEarnings.reduce(
      (sum, course) => sum + course.totalEarnings,
      0,
    );

    res.status(200).json({
      instructor,
      stats: {
        totalCourses: courses.length,
        totalStudents: uniqueStudentIds.size, // Changed: unique students count
        totalEarnings,
      },
      courses: coursesWithEarnings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all courses (for admin overview)
// export const getAllCourses = async (req, res) => {
//   try {
//     const courses = await Course.find()
//       .populate("instructorId", "name email photoUrl")
//       .sort({ createdAt: -1 });

//     // Get enrollment counts for each course
//     const coursesWithStats = await Promise.all(
//       courses.map(async (course) => {
//         const enrollmentCount = await Order.countDocuments({
//           course: course._id,
//           status: "completed",
//         });

//         return {
//           ...course.toObject(),
//           enrollmentCount,
//           totalRevenue: course.price * enrollmentCount,
//         };
//       }),
//     );

//     res.status(200).json(coursesWithStats);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Get all courses (for admin overview)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("creator", "name email photoUrl") // Changed from instructorId to creator
      .sort({ createdAt: -1 });

    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Order.countDocuments({
          course: course._id,
          status: "completed",
        });

        return {
          ...course.toObject(),
          instructorId: course.creator, // Map creator to instructorId for frontend compatibility
          enrollmentCount,
          totalRevenue: course.price * enrollmentCount,
        };
      }),
    );

    res.status(200).json(coursesWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit course (admin only)
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, subTitle, description, category, price, thumbnail } =
      req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (title) course.title = title;
    if (subTitle) course.subTitle = subTitle;
    if (description) course.description = description;
    if (category) course.category = category;
    if (price) course.price = price;
    if (thumbnail) course.thumbnail = thumbnail;

    await course.save();

    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error("Error in editCourse:", error);
    res.status(500).json({ message: error.message });
  }
};

// Approve or reject a course
export const updateCourseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { status } = req.body; // 'approved', 'rejected', 'pending'

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.status = status;
    await course.save();

    res.status(200).json({ message: `Course ${status} successfully`, course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a course (admin only)
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete all related orders
    await Order.deleteMany({ course: course._id });

    // Remove course from students' enrolledCourses
    await User.updateMany(
      { enrolledCourses: course._id },
      { $pull: { enrolledCourses: course._id } },
    );

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user (instructor or student)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "instructor") {
      // Delete all courses by this instructor
      const courses = await Course.find({ instructorId: user._id });
      for (const course of courses) {
        await Order.deleteMany({ course: course._id });
        await User.updateMany(
          { enrolledCourses: course._id },
          { $pull: { enrolledCourses: course._id } },
        );
        await Course.findByIdAndDelete(course._id);
      }
    } else if (user.role === "student") {
      // Delete student's orders
      await Order.deleteMany({ user: user._id });
      // Remove student from courses' enrolled lists
      await User.updateMany(
        { enrolledCourses: { $in: user.enrolledCourses } },
        { $pull: { enrolledCourses: { $in: user.enrolledCourses } } },
      );
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get platform statistics
// export const getPlatformStats = async (req, res) => {
//   try {
//     const totalStudents = await User.countDocuments({ role: "student" });
//     const totalInstructors = await User.countDocuments({ role: "instructor" });
//     const totalCourses = await Course.countDocuments();
//     const totalOrders = await Order.countDocuments({ status: "completed" });

//     const totalRevenue = await Order.aggregate([
//       { $match: { status: "completed" } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);

//     // Get recent activities
//     const recentOrders = await Order.find({ status: "completed" })
//       .populate("user", "name email")
//       .populate("course", "title")
//       .sort({ createdAt: -1 })
//       .limit(10);

//     const recentCourses = await Course.find()
//       .populate("instructorId", "name")
//       .sort({ createdAt: -1 })
//       .limit(10);

//     // Top instructors by revenue
//     const topInstructors = await Order.aggregate([
//       { $match: { status: "completed" } },
//       {
//         $lookup: {
//           from: "courses",
//           localField: "course",
//           foreignField: "_id",
//           as: "courseData",
//         },
//       },
//       { $unwind: "$courseData" },
//       {
//         $group: {
//           _id: "$courseData.instructorId",
//           totalRevenue: { $sum: "$amount" },
//           totalSales: { $sum: 1 },
//         },
//       },
//       { $sort: { totalRevenue: -1 } },
//       { $limit: 5 },
//       {
//         $lookup: {
//           from: "users",
//           localField: "_id",
//           foreignField: "_id",
//           as: "instructor",
//         },
//       },
//       { $unwind: "$instructor" },
//       {
//         $project: {
//           _id: 1,
//           totalRevenue: 1,
//           totalSales: 1,
//           "instructor.name": 1,
//           "instructor.email": 1,
//           "instructor.photoUrl": 1,
//         },
//       },
//     ]);

//     res.status(200).json({
//       overview: {
//         totalStudents,
//         totalInstructors,
//         totalCourses,
//         totalRevenue: totalRevenue[0]?.total || 0,
//       },
//       recentActivities: {
//         orders: recentOrders,
//         courses: recentCourses,
//       },
//       topInstructors,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Get platform statistics
// export const getPlatformStats = async (req, res) => {
//   try {
//     const totalStudents = await User.countDocuments({ role: "student" });
//     const totalInstructors = await User.countDocuments({ role: "instructor" });
//     const totalCourses = await Course.countDocuments();
//     const totalOrders = await Order.countDocuments({ status: "completed" });

//     const totalRevenueResult = await Order.aggregate([
//       { $match: { status: "completed" } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const totalRevenue = totalRevenueResult[0]?.total || 0;

//     // Get recent activities
//     const recentOrders = await Order.find({ status: "completed" })
//       .populate("user", "name email")
//       .populate("course", "title")
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .catch((err) => []);

//     const recentCourses = await Course.find()
//       .populate("instructorId", "name")
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .catch((err) => []);

//     // Top instructors by revenue - SIMPLIFIED VERSION
//     const topInstructors = [];
//     const instructors = await User.find({ role: "instructor" }).select(
//       "name email photoUrl",
//     );

//     for (const instructor of instructors) {
//       const courses = await Course.find({ instructorId: instructor._id });
//       const courseIds = courses.map((c) => c._id);
//       const orders = await Order.find({
//         course: { $in: courseIds },
//         status: "completed",
//       });
//       const totalRevenueForInstructor = orders.reduce(
//         (sum, o) => sum + o.amount,
//         0,
//       );
//       topInstructors.push({
//         instructor: {
//           name: instructor.name,
//           email: instructor.email,
//           photoUrl: instructor.photoUrl,
//         },
//         totalRevenue: totalRevenueForInstructor,
//         totalSales: orders.length,
//       });
//     }

//     topInstructors.sort((a, b) => b.totalRevenue - a.totalRevenue);
//     const top5Instructors = topInstructors.slice(0, 5);

//     res.status(200).json({
//       overview: {
//         totalStudents,
//         totalInstructors,
//         totalCourses,
//         totalRevenue,
//       },
//       recentActivities: {
//         orders: recentOrders,
//         courses: recentCourses,
//       },
//       topInstructors: top5Instructors,
//     });
//   } catch (error) {
//     console.error("Error in getPlatformStats:", error);
//     res.status(500).json({ message: error.message, stack: error.stack });
//   }
// };

// Get platform statistics
export const getPlatformStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalInstructors = await User.countDocuments({ role: "instructor" });
    const totalCourses = await Course.countDocuments();
    const totalOrders = await Order.countDocuments({ status: "completed" });

    const totalRevenueResult = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Get recent activities
    const recentOrders = await Order.find({ status: "completed" })
      .populate("user", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    // const recentCourses = await Course.find()
    //   .populate("creator", "name") // Changed from instructorId to creator
    //   .sort({ createdAt: -1 })
    //   .limit(10);

    const recentCourses = await Course.find()
      .populate("creator", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    console.log("Recent courses with creator:", recentCourses);

    // Top instructors by revenue - FIXED VERSION
    const instructors = await User.find({ role: "instructor" });
    const topInstructorsTemp = [];

    for (const instructor of instructors) {
      // Get courses using 'creator' field
      const courses = await Course.find({ creator: instructor._id });
      const courseIds = courses.map((c) => c._id);

      // Get completed orders for these courses
      const orders = await Order.find({
        course: { $in: courseIds },
        status: "completed",
      });

      const totalRevenueForInstructor = orders.reduce(
        (sum, o) => sum + (o.amount || 0),
        0,
      );
      const totalSales = orders.length;

      topInstructorsTemp.push({
        instructor: {
          name: instructor.name,
          email: instructor.email,
          photoUrl: instructor.photoUrl,
        },
        totalRevenue: totalRevenueForInstructor,
        totalSales: totalSales,
      });
    }

    // Sort by revenue and get top 5
    topInstructorsTemp.sort((a, b) => b.totalRevenue - a.totalRevenue);
    const top5Instructors = topInstructorsTemp.slice(0, 5);

    res.status(200).json({
      overview: {
        totalStudents,
        totalInstructors,
        totalCourses,
        totalRevenue,
      },
      recentActivities: {
        orders: recentOrders,
        courses: recentCourses,
      },
      topInstructors: top5Instructors,
    });
  } catch (error) {
    console.error("Error in getPlatformStats:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update user role (make instructor or student)
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body; // 'student', 'instructor'

    if (!["student", "instructor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get instructor earnings summary for dashboard
// export const getInstructorEarningsSummary = async (req, res) => {
//   try {
//     const instructors = await User.find({ role: "instructor" }).select(
//       "name email photoUrl createdAt",
//     );

//     const earningsData = await Promise.all(
//       instructors.map(async (instructor) => {
//         const courses = await Course.find({ instructorId: instructor._id });
//         const courseIds = courses.map((course) => course._id);

//         const orders = await Order.find({
//           course: { $in: courseIds },
//           status: "completed",
//         });

//         const monthlyEarnings = {};
//         orders.forEach((order) => {
//           const month = order.createdAt.toISOString().slice(0, 7);
//           monthlyEarnings[month] = (monthlyEarnings[month] || 0) + order.amount;
//         });

//         return {
//           instructorId: instructor._id,
//           name: instructor.name,
//           email: instructor.email,
//           photoUrl: instructor.photoUrl,
//           totalEarnings: orders.reduce((sum, order) => sum + order.amount, 0),
//           totalStudents: orders.length,
//           totalCourses: courses.length,
//           monthlyEarnings,
//         };
//       }),
//     );

//     res.status(200).json(earningsData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Get instructor earnings summary for dashboard
// export const getInstructorEarningsSummary = async (req, res) => {
//   try {
//     const instructors = await User.find({ role: "instructor" }).select(
//       "name email photoUrl createdAt",
//     );

//     const earningsData = await Promise.all(
//       instructors.map(async (instructor) => {
//         // CHANGE: Use 'creator' instead of 'instructorId'
//         const courses = await Course.find({ creator: instructor._id });
//         const courseIds = courses.map((course) => course._id);

//         const orders = await Order.find({
//           course: { $in: courseIds },
//           status: "completed",
//         });

//         const monthlyEarnings = {};
//         orders.forEach((order) => {
//           const month = order.createdAt.toISOString().slice(0, 7);
//           monthlyEarnings[month] = (monthlyEarnings[month] || 0) + order.amount;
//         });

//         return {
//           instructorId: instructor._id,
//           name: instructor.name,
//           email: instructor.email,
//           photoUrl: instructor.photoUrl,
//           totalEarnings: orders.reduce((sum, order) => sum + order.amount, 0),
//           totalStudents: orders.length,
//           totalCourses: courses.length,
//           monthlyEarnings,
//         };
//       }),
//     );

//     res.status(200).json(earningsData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get instructor earnings summary for dashboard
export const getInstructorEarningsSummary = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }).select(
      "name email photoUrl createdAt",
    );

    const earningsData = await Promise.all(
      instructors.map(async (instructor) => {
        const courses = await Course.find({ creator: instructor._id });
        const courseIds = courses.map((course) => course._id);

        const orders = await Order.find({
          course: { $in: courseIds },
          status: "completed",
        });

        // Count unique students
        const uniqueStudentIds = new Set();
        orders.forEach((order) => {
          if (order.user) {
            uniqueStudentIds.add(order.user.toString());
          }
        });

        const monthlyEarnings = {};
        orders.forEach((order) => {
          const month = order.createdAt.toISOString().slice(0, 7);
          monthlyEarnings[month] = (monthlyEarnings[month] || 0) + order.amount;
        });

        return {
          instructorId: instructor._id,
          name: instructor.name,
          email: instructor.email,
          photoUrl: instructor.photoUrl,
          totalEarnings: orders.reduce((sum, order) => sum + order.amount, 0),
          totalStudents: uniqueStudentIds.size, // Changed: unique students count
          totalCourses: courses.length,
          monthlyEarnings,
        };
      }),
    );

    res.status(200).json(earningsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create admin user (one-time setup)
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "User already exists" });
    }

    const bcrypt = await import("bcryptjs");
    const hashPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashPassword,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: { ...admin.toObject(), password: undefined },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
