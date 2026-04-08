import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import Card from "../component/Card";
import useRecommendations from "../customHooks/useRecommendations";
import { FaStar, FaFire, FaUserFriends, FaRobot } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const RecommendedCourses = () => {
  const navigate = useNavigate();
  const { personalizedRecommendations, trendingCourses, loading } =
    useRecommendations();
  const { userData } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("personalized");

  // Reason icons mapping
  const getReasonIcon = (type) => {
    switch (type) {
      case "collaborative":
        return <FaUserFriends className="text-blue-500" />;
      case "trending":
        return <FaFire className="text-orange-500" />;
      default:
        return <FaRobot className="text-purple-500" />;
    }
  };

  // Get reason text
  const getReasonText = (reason, type) => {
    if (reason) return reason;
    switch (type) {
      case "collaborative":
        return "Users with similar interests enrolled in this course";
      case "trending":
        return "Trending now";
      default:
        return "Recommended based on your interests";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Recommended For You
          </h1>
          <p className="text-gray-600 mt-2">
            Personalized courses based on your learning interests and activity
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab("personalized")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "personalized"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Personalized For You
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "trending"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Trending Now
            </button>
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={50} color="#3B82F6" />
          </div>
        ) : (
          <>
            {/* Personalized Recommendations */}
            {activeTab === "personalized" && (
              <div>
                {personalizedRecommendations?.length > 0 ? (
                  <div>
                    {/* Recommendation reasons summary */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <FaRobot />
                        Why these recommendations?
                      </h3>
                      <p className="text-sm text-blue-700">
                        Based on your{" "}
                        {userData?.preferences?.categories?.length || 0}{" "}
                        preferred categories and{" "}
                        {userData?.enrolledCourses?.length || 0} enrolled
                        courses
                      </p>
                    </div>

                    {/* Courses grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {personalizedRecommendations.map((rec) => (
                        <div key={rec.courseId._id} className="relative">
                          {/* Recommendation badge */}
                          <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium shadow-lg flex items-center gap-1">
                            {getReasonIcon(rec.type)}
                            <span className="truncate max-w-[150px]">
                              {getReasonText(rec.reason, rec.type)}
                            </span>
                          </div>

                          <Card
                            thumbnail={rec.courseId.thumbnail}
                            id={rec.courseId._id}
                            price={rec.courseId.price}
                            title={rec.courseId.title}
                            category={rec.courseId.category}
                          />

                          {/* Match score */}
                          {rec.score && (
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                Match score
                              </span>
                              <span className="text-xs font-semibold text-green-600">
                                {Math.round(rec.score * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <FaRobot className="mx-auto text-4xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No recommendations yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Enroll in some courses to get personalized recommendations
                    </p>
                    <button
                      onClick={() => navigate("/allcourses")}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Explore Courses
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Trending Courses */}
            {activeTab === "trending" && (
              <div>
                {trendingCourses?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {trendingCourses.map((course) => (
                      <div key={course._id} className="relative">
                        <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white rounded-full px-3 py-1 text-xs font-medium shadow-lg flex items-center gap-1">
                          <FaFire />
                          Trending
                        </div>
                        <Card
                          thumbnail={course.thumbnail}
                          id={course._id}
                          price={course.price}
                          title={course.title}
                          category={course.category}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <FaFire className="mx-auto text-4xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No trending courses yet
                    </h3>
                    <p className="text-gray-500">
                      Check back later for trending courses
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RecommendedCourses;
