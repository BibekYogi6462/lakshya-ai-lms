// frontend/src/pages/Admin/ManageStudents.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, BookOpen, Mail, Calendar } from "lucide-react";
import { serverUrl } from "../../App";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/admin/students`, {
        withCredentials: true,
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`${serverUrl}/api/admin/users/${studentId}`, {
          withCredentials: true,
        });
        fetchStudents();
        alert("Student deleted successfully");
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student");
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

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-[70px]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
          <p className="text-gray-600 mt-2">
            View and manage all students enrolled on the platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.photoUrl || "https://via.placeholder.com/50"}
                      alt={student.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{student.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Mail className="w-3 h-3" />
                        <span>{student.email}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteStudent(student._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>Enrolled Courses:</span>
                    </div>
                    <span className="font-semibold">
                      {student.totalEnrolledCourses || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Joined:</span>
                    </div>
                    <span className="text-sm">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {student.enrolledCourses?.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-semibold mb-2">
                      Enrolled Courses:
                    </p>
                    <div className="space-y-1">
                      {student.enrolledCourses.slice(0, 3).map((course) => (
                        <div key={course._id} className="text-sm text-gray-600">
                          • {course.title}
                        </div>
                      ))}
                      {student.enrolledCourses.length > 3 && (
                        <p className="text-sm text-blue-600">
                          +{student.enrolledCourses.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
