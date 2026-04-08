import React, { useEffect } from "react";
import { FaArrowLeftLong, FaStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedCourse } from "../redux/courseSlice";
import { setUserData } from "../redux/userSlice"; // IMPORT ADDED
import img from "../assets/empty.jpg";
import { FaPlayCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { useState } from "react";
import Card from "../component/Card";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import useSimilarCourses from "../customHooks/useSimilarCourses";
import { FaUsers } from "react-icons/fa";

// PayPal SDK Script
const loadPayPalScript = () => {
  return new Promise((resolve) => {
    if (window.paypal) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${
      import.meta.env.VITE_PAYPAL_CLIENT_ID
    }&currency=USD&intent=capture`;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ViewCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { selectedCourse } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [creatorCourses, setCreatorCourses] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [courseLoading, setCourseLoading] = useState(true);
  const { fetchSimilarCourses, loading: similarLoading } = useSimilarCourses();
  const [similarCoursesList, setSimilarCoursesList] = useState([]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Check if user is enrolled in the course
  const checkEnrollment = async () => {
    if (!userData?._id || !courseId) {
      console.log("Cannot check enrollment: missing user or courseId", {
        userData,
        courseId,
      });
      return;
    }

    try {
      console.log("Checking enrollment for course:", courseId);
      const response = await axios.get(
        `${serverUrl}/api/order/check-purchase/${courseId}`,
        { withCredentials: true },
      );
      console.log("Enrollment check response:", response.data);
      setIsEnrolled(response.data.purchased);
    } catch (error) {
      console.log("Error checking enrollment:", error);
      setIsEnrolled(false);
    }
  };

  // Load PayPal SDK
  useEffect(() => {
    loadPayPalScript().then((success) => {
      setPaypalLoaded(success);
    });
  }, []);

  // Check enrollment when user data or course changes
  useEffect(() => {
    if (userData && courseId) {
      checkEnrollment();
    }
  }, [userData, courseId]);

  // Safe course data fetching
  const fetchCourseData = async () => {
    if (!courseData || courseData.length === 0) {
      console.log("Course data not loaded yet");
      setCourseLoading(true);
      return;
    }

    const foundCourse = courseData.find((course) => course._id === courseId);
    if (foundCourse) {
      dispatch(setSelectedCourse(foundCourse));
      setCourseLoading(false);
    } else {
      console.log("Course not found in courseData");
      setCourseLoading(false);
    }
  };

  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(
            serverUrl + "/api/course/creator",
            {
              userId: selectedCourse?.creator,
            },
            { withCredentials: true },
          );
          setCreatorData(result.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    handleCreator();
  }, [selectedCourse]);

  useEffect(() => {
    fetchCourseData();
  }, [courseData, courseId]);

  useEffect(() => {
    if (courseId) {
      const getSimilar = async () => {
        const courses = await fetchSimilarCourses(courseId, 4);
        setSimilarCoursesList(courses || []);
      };
      getSimilar();
    }
  }, [courseId]);

  useEffect(() => {
    if (creatorData?._id && courseData?.length > 0) {
      const creatorCourse = courseData.filter(
        (course) =>
          course.creator === creatorData?._id && course._id !== courseId,
      );
      setCreatorCourses(creatorCourse);
    }
  }, [creatorData, courseData, courseId]);

  // PayPal Payment Handler
  const handlePayment = async () => {
    if (!userData) {
      alert("Please login to purchase this course");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/order/create-paypal-order`,
        { courseId },
        { withCredentials: true },
      );

      console.log("PayPal order response:", data);

      if (data.orderID && window.paypal) {
        const container = document.getElementById("paypal-button-container");
        if (container) {
          container.innerHTML = "";
        }

        const paypalOrderID = data.orderID;

        window.paypal
          .Buttons({
            createOrder: function (data, actions) {
              console.log("Using PayPal order ID:", paypalOrderID);
              return paypalOrderID;
            },
            onApprove: async function (data, actions) {
              console.log("Payment approved:", data);
              try {
                const response = await axios.post(
                  `${serverUrl}/api/order/capture-paypal-order`,
                  { orderID: data.orderID },
                  { withCredentials: true },
                );

                console.log("Capture response:", response);

                if (
                  response.data.message === "Payment completed successfully"
                ) {
                  // Fetch updated user data
                  const userResponse = await axios.get(
                    `${serverUrl}/api/user/getcurrentUser`,
                    { withCredentials: true },
                  );

                  // Update Redux store with new user data
                  dispatch(setUserData(userResponse.data));

                  // Re-check enrollment (should now be true)
                  await checkEnrollment();

                  toast.success(
                    "Payment successful! You are now enrolled in this course.",
                  );

                  // Clear the PayPal button container
                  const container = document.getElementById(
                    "paypal-button-container",
                  );
                  if (container) {
                    container.innerHTML = "";
                  }
                }
              } catch (error) {
                console.error("Payment capture error:", error);
                toast.error("Payment failed. Please try again.");
                setLoading(false);
              }
            },
            onError: (err) => {
              console.error("PayPal error:", err);
              alert("Payment failed. Please try again.");
              setLoading(false);
            },
            onCancel: () => {
              console.log("Payment cancelled by user");
              setLoading(false);
            },
          })
          .render("#paypal-button-container")
          .then(() => {
            console.log("PayPal buttons rendered successfully");
            setLoading(false);
          })
          .catch((error) => {
            console.error("PayPal button render error:", error);
            setLoading(false);
          });
      } else {
        console.error("No orderID in response or PayPal not loaded");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initialize payment. Please try again.");
      setLoading(false);
    }
  };

  // Handle Watch Now - redirect to course content
  const handleWatchNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("===== WATCH NOW DEBUG =====");
    console.log("1. Button clicked");
    console.log("2. isEnrolled state:", isEnrolled);
    console.log("3. courseId from params:", courseId);
    console.log("4. userData:", userData);
    console.log("5. Navigation target:", `/view-lectures/${courseId}`);

    if (isEnrolled) {
      console.log("6. User is enrolled, attempting navigation...");
      try {
        navigate(`/view-lectures/${courseId}`);
        console.log("7. Navigation called successfully");
      } catch (error) {
        console.error("8. Navigation error:", error);
      }
    } else {
      console.log("6. User not enrolled, showing toast");
      toast.error("You need to enroll in this course first");
    }
    console.log("===== END DEBUG =====");
  };

  // Add this useEffect to monitor enrollment changes
  useEffect(() => {
    console.log("isEnrolled changed to:", isEnrolled);
  }, [isEnrolled]);

  const handleReview = async () => {
    setLoading1(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/review/createreview",
        {
          rating,
          comment,
          courseId,
        },
        { withCredentials: true },
      );
      setLoading1(false);
      toast.success("Review Added");
      console.log(result.data);
      setRating(0);
      setComment("");
    } catch (error) {
      console.log(error);
      setLoading1(false);
      toast.error(error.response?.data?.message || "Error adding review");
      setRating(0);
      setComment("");
    }
  };

  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAvgReview(selectedCourse?.reviews);

  // Loading check
  if (courseLoading || !selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader size={50} color="#3B82F6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">
        {/* Back button and thumbnail section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* thumbnail */}
          <div className="w-full md:w-1/2">
            <FaArrowLeftLong
              className="text-[black] w-[22px] h-[22px] cursor-pointer mb-4"
              onClick={() => navigate("/")}
            />
            {selectedCourse?.thumbnail ? (
              <img
                src={selectedCourse?.thumbnail}
                alt={selectedCourse?.title}
                className="rounded-xl w-full object-cover h-[300px]"
              />
            ) : (
              <img
                src={img}
                alt="placeholder"
                className="rounded-xl w-full object-cover h-[300px]"
              />
            )}
          </div>

          {/* course info */}
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-bold">{selectedCourse?.title}</h2>
            <p className="text-gray-600">{selectedCourse?.subTitle}</p>
            <div className="flex items-start flex-col justify-between">
              <div className="text-yellow-500 font-medium flex gap-2">
                <span className="flex items-center justify-center gap-1">
                  <FaStar />
                  {avgRating}
                </span>
                <span className="text-gray-400">
                  ({selectedCourse?.reviews?.length || 0} Reviews)
                </span>
              </div>
              <div className="text-lg font-semibold text-black">
                <span>${selectedCourse?.price}</span>{" "}
                <span className="line-through text-sm text-gray-400">$599</span>
              </div>

              <ul className="text-sm text-gray-700 space-y-1 pt-2">
                <li>
                  ✅ {selectedCourse?.lectures?.length || 0}+ hours of video
                  content
                </li>
                <li>✅ Lifetime access to course materials</li>
                <li>✅ Certificate of completion</li>
              </ul>

              {/* Enrollment/Payment Section */}
              <div className="mt-4 w-full">
                {console.log("Rendering button - isEnrolled:", isEnrolled)}
                {!isEnrolled ? (
                  <div className="space-y-3">
                    <button
                      className="bg-[black] text-white px-6 py-3 rounded hover:bg-gray-700 w-full font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handlePayment}
                      disabled={loading || !paypalLoaded}
                    >
                      {loading
                        ? "Processing..."
                        : `Enroll Now - $${selectedCourse?.price}`}
                    </button>

                    {/* PayPal Button Container */}
                    {paypalLoaded && (
                      <div
                        id="paypal-button-container"
                        className="w-full"
                      ></div>
                    )}

                    {!paypalLoaded && (
                      <p className="text-sm text-gray-500">
                        Loading payment options...
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-green-700 font-medium mb-2">
                        ✅ You are enrolled in this course!
                      </p>
                      <button
                        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full font-semibold cursor-pointer"
                        onClick={handleWatchNow}
                      >
                        Watch Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Learn */}
        <div>
          <h2 className="text-xl font-semibold mb-2">What You'll Learn</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Learn {selectedCourse?.category} from Beginning</li>
            <li>Build real-world projects</li>
            <li>Master industry best practices</li>
          </ul>
        </div>

        {/* This Course is for */}
        <div className="text-xl font-semibold mb-2">
          <h2>This Course is for</h2>
          <p className="text-gray-700 list-disc pl-6 space-y-1 text-base">
            Beginners, aspiring developers, and professionals looking to upgrade
            skills.
          </p>
        </div>

        {/* Course Curriculum and Video Preview */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Curriculum Section */}
          <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-1 text-gray-800">
              Course Curriculum
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedCourse?.lectures?.length} Lectures
            </p>

            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
              {selectedCourse?.lectures?.map((lecture, index) => (
                <button
                  key={lecture._id || index}
                  disabled={!lecture.isPreviewFree && !isEnrolled}
                  onClick={() => {
                    if (lecture.isPreviewFree || isEnrolled) {
                      setSelectedLecture(lecture);
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                    lecture.isPreviewFree || isEnrolled
                      ? "hover:bg-gray-100 cursor-pointer border-gray-300"
                      : "cursor-not-allowed opacity-60 border-gray-200"
                  } ${
                    selectedLecture?._id === lecture?._id
                      ? "bg-gray-100 border-gray-400"
                      : ""
                  }`}
                >
                  <span className="text-lg text-gray-700">
                    {lecture.isPreviewFree || isEnrolled ? (
                      <FaPlayCircle />
                    ) : (
                      <FaLock />
                    )}
                  </span>
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {lecture?.lectureTitle}
                    {!lecture.isPreviewFree && !isEnrolled && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Premium)
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Video Preview Section */}
          <div className="bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center">
              {selectedLecture?.videoUrl ? (
                <video
                  className="w-full h-full object-cover"
                  src={selectedLecture?.videoUrl}
                  controls
                />
              ) : (
                <span className="text-white text-sm">
                  {isEnrolled
                    ? "Select a lecture to watch"
                    : "Select a preview lecture to watch"}
                </span>
              )}
            </div>

            {/* Show message for locked content */}
            {selectedLecture &&
              !selectedLecture.isPreviewFree &&
              !isEnrolled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <FaLock className="mx-auto text-yellow-500 mb-2" />
                  <p className="text-yellow-700 font-medium">Premium Content</p>
                  <p className="text-yellow-600 text-sm">
                    Enroll in the course to access all lectures
                  </p>
                  <button
                    onClick={handlePayment}
                    className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
                  >
                    Enroll Now
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">Write a Review</h2>
          <div className="mb-4">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer ${
                    star <= rating ? "fill-amber-300" : "fill-gray-300"
                  }`}
                />
              ))}
            </div>

            <textarea
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Please write your review here"
              rows={3}
            />
            <button
              className="bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
              disabled={loading1 || !rating || !comment}
              onClick={handleReview}
            >
              {loading1 ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </div>

        {/* Instructor Info */}
        <div className="flex items-center gap-4 pt-4 border-t">
          {creatorData?.photoUrl ? (
            <img
              src={creatorData?.photoUrl}
              alt={creatorData?.name}
              className="w-16 h-16 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <img
              src={img}
              alt="instructor"
              className="w-16 h-16 rounded-full object-cover border border-gray-200"
            />
          )}

          <div>
            <h2 className="text-lg font-semibold">{creatorData?.name}</h2>
            <p className="text-sm text-gray-600">
              {creatorData?.description || "Course Instructor"}
            </p>
            <p className="text-sm text-gray-500">{creatorData?.email}</p>
          </div>
        </div>

        {/* Similar Courses */}
        {similarCoursesList.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaUsers className="text-blue-500" />
                  Similar Courses You Might Like
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Based on the content and category of this course
                </p>
              </div>
            </div>

            {similarLoading ? (
              <div className="flex justify-center py-8">
                <ClipLoader size={30} color="#3B82F6" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarCoursesList.map((item) => (
                  <div key={item.courseId._id} className="relative">
                    <div className="absolute top-2 left-2 z-10 bg-blue-500/90 backdrop-blur-sm text-white rounded-full px-2 py-1 text-xs font-medium">
                      {Math.round(item.score * 100)}% Match
                    </div>

                    <Card
                      thumbnail={item.courseId.thumbnail}
                      id={item.courseId._id}
                      price={item.courseId.price}
                      title={item.courseId.title}
                      category={item.courseId.category}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Creator's Other Courses */}
        {creatorCourses?.length > 0 && (
          <div className="w-full transition-all duration-300 py-[20px] flex items-start justify-center lg:justify-start flex-wrap gap-6">
            <h2 className="text-xl font-semibold w-full mb-4">
              More from {creatorData?.name}
            </h2>
            {creatorCourses.map((course, index) => (
              <Card
                key={index}
                thumbnail={course.thumbnail}
                id={course._id}
                price={course.price}
                title={course.title}
                category={course.category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCourse;
