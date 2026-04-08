import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  personalizedRecommendations: [],
  similarCourses: {},
  trendingCourses: [],
  courseStats: {},
  loading: false,
  error: null,
};

const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  reducers: {
    // Personalized recommendations
    getRecommendationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getRecommendationsSuccess: (state, action) => {
      state.loading = false;
      state.personalizedRecommendations = action.payload;
      state.error = null;
    },
    getRecommendationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Similar courses
    getSimilarCoursesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSimilarCoursesSuccess: (state, action) => {
      state.loading = false;
      const { courseId, courses } = action.payload;
      state.similarCourses[courseId] = courses;
      state.error = null;
    },
    getSimilarCoursesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Trending courses
    getTrendingStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTrendingSuccess: (state, action) => {
      state.loading = false;
      state.trendingCourses = action.payload;
      state.error = null;
    },
    getTrendingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Course stats
    getCourseStatsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCourseStatsSuccess: (state, action) => {
      state.loading = false;
      const { courseId, stats } = action.payload;
      state.courseStats[courseId] = stats;
      state.error = null;
    },
    getCourseStatsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear
    clearRecommendations: (state) => {
      state.personalizedRecommendations = [];
      state.error = null;
    },
    clearSimilarCourses: (state, action) => {
      const { courseId } = action.payload;
      if (courseId) {
        delete state.similarCourses[courseId];
      } else {
        state.similarCourses = {};
      }
    },
  },
});

export const {
  getRecommendationsStart,
  getRecommendationsSuccess,
  getRecommendationsFailure,
  getSimilarCoursesStart,
  getSimilarCoursesSuccess,
  getSimilarCoursesFailure,
  getTrendingStart,
  getTrendingSuccess,
  getTrendingFailure,
  getCourseStatsStart,
  getCourseStatsSuccess,
  getCourseStatsFailure,
  clearRecommendations,
  clearSimilarCourses,
} = recommendationSlice.actions;

export default recommendationSlice.reducer;
