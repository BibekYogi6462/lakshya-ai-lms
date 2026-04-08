// frontend/src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  UserCheck,
  ShoppingCart,
  Award,
  Clock,
} from "lucide-react";
import { serverUrl } from "../../App";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/admin/stats`, {
        withCredentials: true,
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats?.overview.totalStudents || 0,
      icon: Users,
      color: "bg-blue-500",
      link: "/admin/students",
    },
    {
      title: "Total Instructors",
      value: stats?.overview.totalInstructors || 0,
      icon: UserCheck,
      color: "bg-green-500",
      link: "/admin/instructors",
    },
    {
      title: "Total Courses",
      value: stats?.overview.totalCourses || 0,
      icon: BookOpen,
      color: "bg-purple-500",
      link: "/admin/courses",
    },
    {
      title: "Total Revenue",
      value: `$${stats?.overview.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "bg-yellow-500",
      link: "/admin/earnings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-[70px]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {userData?.name}! Here's what's happening with your
            platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.link} className="block">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Top Instructors */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Top Performing Instructors
            </h2>
            <Link
              to="/admin/instructors"
              className="text-blue-600 hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats?.topInstructors?.map((instructor, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={
                            instructor.instructor?.photoUrl ||
                            "https://via.placeholder.com/40"
                          }
                          alt={instructor.instructor?.name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <div className="font-medium">
                            {instructor.instructor?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {instructor.instructor?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {instructor.totalSales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      ${instructor.totalRevenue?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-500" />
                Recent Orders
              </h2>
            </div>
            <div className="space-y-3">
              {/* {stats?.recentActivities?.orders
                ?.slice(0, 5)
                .map((order, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{order.user?.name}</p>
                      <p className="text-sm text-gray-500">
                        {order.course?.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        ${order.amount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))} */}

              {stats?.recentActivities?.courses
                ?.slice(0, 5)
                .map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-gray-500">
                        By {course.creator?.name || "Unknown"}
                      </p>{" "}
                      {/* ← FIXED */}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        ${course.price}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Recent Courses */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Recently Added Courses
              </h2>
            </div>
            <div className="space-y-3">
              {stats?.recentActivities?.courses
                ?.slice(0, 5)
                .map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-gray-500">
                        {/* By {course.instructorId?.name} */}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        ${course.price}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
