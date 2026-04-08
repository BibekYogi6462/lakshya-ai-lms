import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DollarSign,
  TrendingUp,
  Users,
  BookOpen,
  Download,
} from "lucide-react";
import { serverUrl } from "../../App";

const EarningsReport = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/admin/earnings/instructors`,
        {
          withCredentials: true,
        },
      );
      console.log("Earnings data:", response.data);

      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        setInstructors(response.data);
        const total = response.data.reduce(
          (sum, instructor) => sum + (instructor.totalEarnings || 0),
          0,
        );
        setTotalEarnings(total);
      } else {
        console.error("Expected array but got:", response.data);
        setInstructors([]);
      }
    } catch (error) {
      console.error("Error fetching earnings data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!Array.isArray(instructors) || instructors.length === 0) return;

    const headers = [
      "Instructor Name",
      "Email",
      "Total Courses",
      "Total Students",
      "Total Earnings",
    ];
    const csvData = instructors.map((instructor) => [
      instructor.name || "",
      instructor.email || "",
      instructor.totalCourses || 0,
      instructor.totalStudents || 0,
      instructor.totalEarnings || 0,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "instructor-earnings-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 mt-[70px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!instructors || instructors.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 mt-[70px]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Earnings Report
          </h1>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No instructors found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-[70px]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Earnings Report
            </h1>
            <p className="text-gray-600 mt-2">
              Track instructor earnings and platform revenue
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Platform Revenue</p>
                <p className="text-2xl font-bold mt-2">
                  ${totalEarnings.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Instructors</p>
                <p className="text-2xl font-bold mt-2">{instructors.length}</p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Average Earnings/Instructor
                </p>
                <p className="text-2xl font-bold mt-2">
                  ${(totalEarnings / instructors.length || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Courses</p>
                <p className="text-2xl font-bold mt-2">
                  {instructors.reduce(
                    (sum, inst) => sum + (inst.totalCourses || 0),
                    0,
                  )}
                </p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Instructors Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Earnings
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {instructors.map((instructor) => (
                  <tr
                    key={instructor.instructorId || instructor._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={
                            instructor.photoUrl ||
                            "https://via.placeholder.com/40"
                          }
                          alt={instructor.name}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <div>
                          <div className="font-medium">{instructor.name}</div>
                          <div className="text-sm text-gray-500">
                            {instructor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {instructor.totalCourses || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {instructor.totalStudents || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-green-600">
                        ${(instructor.totalEarnings || 0).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsReport;
