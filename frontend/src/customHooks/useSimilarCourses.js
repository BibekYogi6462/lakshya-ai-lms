import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import {
  getSimilarCoursesStart,
  getSimilarCoursesSuccess,
  getSimilarCoursesFailure,
} from "../redux/recommendationSlice";

const useSimilarCourses = () => {
  const dispatch = useDispatch();
  const { similarCourses } = useSelector((state) => state.recommendation);
  const [loading, setLoading] = useState(false);

  const fetchSimilarCourses = async (courseId, limit = 6) => {
    if (!courseId) return;

    // Check if we already have similar courses for this course
    if (similarCourses[courseId]) {
      return similarCourses[courseId];
    }

    try {
      setLoading(true);
      dispatch(getSimilarCoursesStart());

      const { data } = await axios.get(
        `${serverUrl}/api/course/similar/${courseId}?limit=${limit}`,
        { withCredentials: true },
      );

      if (data.success) {
        dispatch(
          getSimilarCoursesSuccess({
            courseId,
            courses: data.similarCourses,
          }),
        );
        return data.similarCourses;
      }
    } catch (error) {
      console.error("Error fetching similar courses:", error);
      dispatch(
        getSimilarCoursesFailure(
          error.response?.data?.message || "Failed to fetch similar courses",
        ),
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getSimilarCoursesForCourse = (courseId) => {
    return similarCourses[courseId] || [];
  };

  return {
    similarCourses: getSimilarCoursesForCourse,
    fetchSimilarCourses,
    loading,
  };
};

export default useSimilarCourses;
