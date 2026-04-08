import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import {
  getRecommendationsStart,
  getRecommendationsSuccess,
  getRecommendationsFailure,
  getTrendingStart,
  getTrendingSuccess,
  getTrendingFailure,
} from "../redux/recommendationSlice";

const useRecommendations = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { personalizedRecommendations, trendingCourses, loading } = useSelector(
    (state) => state.recommendation,
  );

  // Fetch personalized recommendations
  const fetchPersonalizedRecommendations = useCallback(
    async (limit = 10) => {
      if (!userData?._id) return;

      try {
        dispatch(getRecommendationsStart());

        // FIXED: Correct endpoint - using recommendation router
        const { data } = await axios.get(
          `${serverUrl}/api/recommendation/personalized?limit=${limit}`,
          { withCredentials: true },
        );

        console.log("Personalized recommendations:", data);

        if (data.success) {
          dispatch(getRecommendationsSuccess(data.recommendations || []));
        } else {
          dispatch(
            getRecommendationsFailure("Failed to fetch recommendations"),
          );
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        dispatch(
          getRecommendationsFailure(
            error.response?.data?.message || "Failed to fetch recommendations",
          ),
        );
        // Return empty array on error
        dispatch(getRecommendationsSuccess([]));
      }
    },
    [userData?._id, dispatch],
  );

  // Fetch similar courses for a specific course
  const fetchSimilarCourses = useCallback(async (courseId, limit = 4) => {
    try {
      const { data } = await axios.get(
        `${serverUrl}/api/recommendation/similar/${courseId}?limit=${limit}`,
        { withCredentials: true },
      );

      console.log("Similar courses:", data);
      return data.similarCourses || [];
    } catch (error) {
      console.error("Error fetching similar courses:", error);
      return [];
    }
  }, []);

  // Fetch trending/popular courses
  const fetchTrendingCourses = useCallback(
    async (limit = 10) => {
      try {
        dispatch(getTrendingStart());

        // Get trending from course stats or use published courses with sorting
        const { data } = await axios.get(`${serverUrl}/api/course/published`, {
          withCredentials: true,
        });

        // You might want to sort by popularity/trending score
        // For now, just return the courses
        const courses = Array.isArray(data) ? data : [];

        dispatch(getTrendingSuccess(courses));
        return courses;
      } catch (error) {
        console.error("Error fetching trending courses:", error);
        dispatch(
          getTrendingFailure(
            error.response?.data?.message || "Failed to fetch trending courses",
          ),
        );
        return [];
      }
    },
    [dispatch],
  );

  // Track course view for better recommendations
  const trackCourseView = useCallback(
    async (courseId, timeSpent = 0) => {
      if (!userData?._id) return;

      try {
        await axios.post(
          `${serverUrl}/api/recommendation/track-view`,
          { courseId, timeSpent },
          { withCredentials: true },
        );
      } catch (error) {
        console.error("Error tracking course view:", error);
      }
    },
    [userData?._id],
  );

  // Auto-fetch recommendations when user logs in
  useEffect(() => {
    if (userData?._id) {
      fetchPersonalizedRecommendations();
      fetchTrendingCourses();
    }
  }, [userData?._id, fetchPersonalizedRecommendations, fetchTrendingCourses]);

  return {
    personalizedRecommendations,
    trendingCourses,
    loading,
    fetchPersonalizedRecommendations,
    fetchSimilarCourses,
    fetchTrendingCourses,
    trackCourseView,
  };
};

export default useRecommendations;
