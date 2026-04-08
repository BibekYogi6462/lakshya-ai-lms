import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Eye, DollarSign, Users, BookOpen } from "lucide-react";
import { serverUrl } from "../../App";

const ManageInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/admin/instructors`, {
        withCredentials: true,
      });
      console.log("Instructors data:", response.data);
      setInstructors(response.data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstructor = async (instructorId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this instructor? All their courses will also be deleted.",
      )
    ) {
      try {
        await axios.delete(`${serverUrl}/api/admin/users/${instructorId}`, {
          withCredentials: true,
        });
        fetchInstructors();
        alert("Instructor deleted successfully");
      } catch (error) {
        console.error("Error deleting instructor:", error);
        alert("Failed to delete instructor");
      }
    }
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
            Manage Instructors
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Instructors
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage all instructors on the platform
          </p>
        </div>

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
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {instructors.map((instructor) => (
                  <tr key={instructor._id} className="hover:bg-gray-50">
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
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        <span>{instructor.totalCourses || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{instructor.totalStudents || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-green-600">
                          ${(instructor.totalEarnings || 0).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(instructor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedInstructor(instructor)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteInstructor(instructor._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructor Details Modal */}
        {selectedInstructor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Instructor Details</h2>
                <button
                  onClick={() => setSelectedInstructor(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      selectedInstructor.photoUrl ||
                      "https://via.placeholder.com/80"
                    }
                    alt={selectedInstructor.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedInstructor.name}
                    </h3>
                    <p className="text-gray-600">{selectedInstructor.email}</p>
                    <p className="text-sm text-gray-500">
                      Joined:{" "}
                      {new Date(
                        selectedInstructor.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {selectedInstructor.totalCourses || 0}
                    </p>
                    <p className="text-sm text-gray-600">Total Courses</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {selectedInstructor.totalStudents || 0}
                    </p>
                    <p className="text-sm text-gray-600">Total Students</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <DollarSign className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      $
                      {(selectedInstructor.totalEarnings || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                  </div>
                </div>
                {selectedInstructor.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Bio</h4>
                    <p className="text-gray-700">
                      {selectedInstructor.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInstructors;
