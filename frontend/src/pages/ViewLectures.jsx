import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlayCircle, FaCheckCircle } from "react-icons/fa";

const serverUrl = "http://localhost:8000";

const ViewLectures = () => {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);
  const selectedCourse = courseData?.find((course) => course._id === courseId);
  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(
    selectedCourse?.lectures?.[0] || null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [progress, setProgress] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const videoRef = useRef(null);
  const navigate = useNavigate();

  // // Check if user is enrolled
  // const isEnrolled = userData?.enrolledCourses?.includes(courseId) || false;

  // // Redirect if not enrolled
  // useEffect(() => {
  //   if (userData && !isEnrolled && selectedCourse) {
  //     navigate(`/viewcourse/${courseId}`);
  //   }
  // }, [userData, isEnrolled, selectedCourse, courseId, navigate]);

  // Fetch creator data
  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          setLoading(true);
          setError(null);
          const result = await axios.post(
            `${serverUrl}/api/course/creator`,
            {
              userId: selectedCourse?.creator,
            },
            { withCredentials: true },
          );
          setCreatorData(result.data);
        } catch (error) {
          console.error("Error fetching creator:", error);
          setError("Failed to load creator information");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    handleCreator();
  }, [selectedCourse]);

  // Fetch user progress for this course
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (userData && courseId) {
        try {
          const response = await axios.get(
            `${serverUrl}/api/progress/${courseId}`,
            { withCredentials: true },
          );

          console.log("Progress response:", response.data);

          // The response is the progress object directly
          if (response.data) {
            const completedList = response.data.completedLectures || [];
            console.log("Completed lectures from API:", completedList);

            // Remove duplicates
            const uniqueCompletedLectures = [...new Set(completedList)];

            console.log("Unique completed lectures:", uniqueCompletedLectures);

            setCompletedLectures(uniqueCompletedLectures);
            calculateProgress(uniqueCompletedLectures);
          }
        } catch (error) {
          console.error("Error fetching progress:", error);
          setCompletedLectures([]);
          setProgress(0);
        }
      }
    };

    fetchUserProgress();
  }, [userData, courseId, selectedCourse]);

  // Calculate progress percentage
  const calculateProgress = (completedLecturesList) => {
    const totalLectures = selectedCourse?.lectures?.length || 0;
    if (totalLectures === 0) {
      setProgress(0);
      return;
    }

    // Remove duplicates and count unique completed lectures
    const uniqueCompleted = [...new Set(completedLecturesList)];
    const completedCount = uniqueCompleted.length;

    // Ensure completed count doesn't exceed total lectures
    const validCompletedCount = Math.min(completedCount, totalLectures);

    const progressPercentage = (validCompletedCount / totalLectures) * 100;
    setProgress(Math.round(progressPercentage));
  };

  // Mark lecture as completed
  // Mark lecture as completed
  const markLectureAsCompleted = async (lectureId) => {
    if (!userData || !courseId || completedLectures.includes(lectureId)) {
      return;
    }

    console.log("Marking lecture as completed:", lectureId);

    try {
      const response = await axios.post(
        `${serverUrl}/api/progress/complete-lecture`,
        {
          courseId,
          lectureId,
        },
        { withCredentials: true },
      );

      console.log("Mark completed response:", response.data);

      // Just add this lecture to the list, don't replace with response data
      setCompletedLectures((prev) => {
        const newCompleted = [...new Set([...prev, lectureId])];
        console.log("Updated completed lectures:", newCompleted);
        calculateProgress(newCompleted);
        return newCompleted;
      });
    } catch (error) {
      console.error("Error marking lecture as completed:", error);
    }
  };

  // Handle video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoTime(videoRef.current.currentTime);
      setVideoDuration(videoRef.current.duration);

      // Mark as completed if user watched more than 80% of the video
      if (videoRef.current.duration > 0) {
        const watchedPercentage =
          (videoRef.current.currentTime / videoRef.current.duration) * 100;
        if (
          watchedPercentage >= 80 &&
          selectedLecture &&
          !completedLectures.includes(selectedLecture._id)
        ) {
          markLectureAsCompleted(selectedLecture._id);
        }
      }
    }
  };

  // Handle video ended
  const handleVideoEnded = () => {
    if (selectedLecture && !completedLectures.includes(selectedLecture._id)) {
      markLectureAsCompleted(selectedLecture._id);
    }
  };

  // Handle lecture selection
  const handleLectureSelect = (lecture) => {
    // Mark current lecture as completed if watched significantly
    if (
      selectedLecture &&
      !completedLectures.includes(selectedLecture._id) &&
      videoDuration > 0
    ) {
      const watchedPercentage = (videoTime / videoDuration) * 100;
      if (watchedPercentage >= 50) {
        markLectureAsCompleted(selectedLecture._id);
      }
    }

    setSelectedLecture(lecture);
    setVideoTime(0);
    setVideoDuration(0);
    setVideoLoading(true);
  };

  const handleVideoLoad = () => {
    setVideoLoading(false);
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleVideoError = () => {
    setVideoLoading(false);
    setError("Failed to load video");
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const formatDuration = (duration) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isLectureCompleted = (lectureId) => {
    return completedLectures.includes(lectureId);
  };

  // Manual mark as completed button handler
  const handleMarkCompleted = () => {
    if (selectedLecture && !completedLectures.includes(selectedLecture._id)) {
      markLectureAsCompleted(selectedLecture._id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lectures...</p>
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Course Not Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const totalLectures = selectedCourse?.lectures?.length || 0;

  // Remove duplicates and ensure count doesn't exceed total
  const uniqueCompletedLectures = [...new Set(completedLectures)];
  const completedCount = Math.min(
    uniqueCompletedLectures.length,
    totalLectures,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Left Section - Video Player */}
      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-4 md:p-6 border border-gray-200">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={handleBackClick}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Go back"
            >
              <FaArrowLeftLong className="text-black w-5 h-5 md:w-6 md:h-6" />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 line-clamp-2">
              {selectedCourse?.title}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4 text-sm text-gray-500 font-medium">
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              Category: {selectedCourse?.category}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              {selectedCourse?.level}
            </span>
          </div>
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300 relative">
          {selectedLecture?.videoUrl ? (
            <>
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              )}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={selectedLecture.videoUrl}
                controls
                onLoadStart={() => setVideoLoading(true)}
                onLoadedData={handleVideoLoad}
                onError={handleVideoError}
                onEnded={handleVideoEnded}
                onTimeUpdate={handleTimeUpdate}
                preload="metadata"
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-white bg-gray-800">
              <div className="text-center">
                <FaPlayCircle className="text-4xl text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">
                  Select a lecture to start watching
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Current Lecture Info */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                {selectedLecture?.lectureTitle || "No lecture selected"}
              </h2>
              {/* Tick mark for current lecture if completed */}
              {selectedLecture && isLectureCompleted(selectedLecture._id) && (
                <FaCheckCircle
                  className="text-green-500 text-lg"
                  title="Completed"
                />
              )}
            </div>

            {/* Mark as completed button */}
            {selectedLecture && !isLectureCompleted(selectedLecture._id) && (
              <button
                onClick={handleMarkCompleted}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <FaCheckCircle className="text-white" />
                Mark as Completed
              </button>
            )}
          </div>

          <p className="text-gray-600 text-sm md:text-base">
            {selectedLecture?.description ||
              "Select a lecture from the list to view its content."}
          </p>

          {selectedLecture?.duration && (
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span>Duration: {formatDuration(selectedLecture.duration)}</span>
              {videoDuration > 0 && (
                <span className="text-blue-600">
                  Watched: {Math.round((videoTime / videoDuration) * 100)}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Right Section - Lecture List & Educator Info */}
      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-4 md:p-6 border border-gray-200 h-fit">
        {/* Course Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Course Progress
            </span>
            <span className="text-sm text-gray-500">
              {completedCount}/{totalLectures} ({progress}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Lecture List with Tick Marks */}
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">
            Course Lectures ({totalLectures})
          </h2>
          <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
            {selectedCourse?.lectures?.length > 0 ? (
              selectedCourse.lectures.map((lecture, index) => {
                const isCompleted = isLectureCompleted(lecture._id);
                return (
                  <button
                    key={lecture._id || index}
                    onClick={() => handleLectureSelect(lecture)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition text-left w-full
                      ${
                        selectedLecture?._id === lecture._id
                          ? "bg-blue-50 border-blue-500 border-2"
                          : "hover:bg-gray-50 border-gray-300 hover:border-gray-400"
                      }
                      ${isCompleted ? "border-green-200 bg-green-50" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Tick mark or empty circle */}
                      {isCompleted ? (
                        <FaCheckCircle className="text-green-500 flex-shrink-0 text-lg" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex-shrink-0"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-sm font-semibold truncate ${
                            isCompleted ? "text-green-700" : "text-gray-800"
                          }`}
                        >
                          {index + 1}. {lecture.lectureTitle}
                        </h3>
                        {lecture.duration && (
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDuration(lecture.duration)}
                          </p>
                        )}
                      </div>
                    </div>
                    <FaPlayCircle
                      className={`text-lg flex-shrink-0 ml-2 ${
                        selectedLecture?._id === lecture._id
                          ? "text-blue-600"
                          : isCompleted
                            ? "text-green-500"
                            : "text-gray-400"
                      }`}
                    />
                  </button>
                );
              })
            ) : (
              <div className="text-center py-8">
                <FaPlayCircle className="text-3xl text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No lectures available</p>
              </div>
            )}
          </div>
        </div>

        {/* Educator Info */}
        {creatorData && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-md font-semibold text-gray-700 mb-3">
              Educator
            </h3>

            <div className="flex items-start gap-4">
              <img
                src={creatorData?.photoUrl || "/default-avatar.png"}
                alt={creatorData?.name}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-gray-300"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-medium text-gray-800 truncate">
                  {creatorData?.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {creatorData?.description || "Course Educator"}
                </p>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {creatorData?.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLectures;
