// import React, { useEffect } from "react";
// import Nav from "../component/Nav";
// import home from "../assets/home4.png";
// import { SiViaplay } from "react-icons/si";
// import ai from "../assets/ai.png";
// import ai1 from "../assets/SearchAi.png";
// import Logos from "../component/Logos";
// import ExploreCourses from "../component/ExploreCourses";
// import CardPage from "../component/CardPage";
// import { useNavigate } from "react-router-dom";
// import About from "../component/About";
// import Footer from "../component/Footer";
// import ReviewPage from "../component/ReviewPage";
// import useRecommendations from "../customHooks/useRecommendations";
// import { useSelector } from "react-redux";
// import { FaRobot, FaFire } from "react-icons/fa";
// import Card from "../component/Card";

// const Home = () => {
//   const navigate = useNavigate();
//   const { personalizedRecommendations, trendingCourses } = useRecommendations();
//   const { userData } = useSelector((state) => state.user);

//   return (
//     <div className="w-[100%] overflow-hidden">
//       <div className="w-[100%] lg:h-[140vh] h-[70vh] relative">
//         <Nav />
//         <img
//           src={home}
//           alt="Hero background"
//           className="object-cover md:object-fill w-[100%] lg:h-[100%] h-[50vh] mt-20"
//         />

//         {/* Sky blue overlay for better text readability */}
//         <div className="absolute inset-0 bg-sky-500/10 lg:bg-sky-500/5 mt-20"></div>

//         <span className="lg:text-[50px] absolute md:text-[20px] lg:top-[5%] md:top-[5%] top-[15%] w-[100%] flex items-center justify-center text-white font-bold text-[20px] drop-shadow-lg">
//           Grow Your Skills to Advance
//         </span>

//         <div className="absolute lg:top-[15%] md:top-[35%] top-[25%] w-[100%] flex items-center justify-center gap-3 flex-wrap">
//           <button
//             className="px-[20px] py-[10px] border-2 border-white bg-white/20 backdrop-blur-sm text-black rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer hover:bg-white/30 transition-all duration-300 shadow-lg"
//             onClick={() => navigate("/allcourses")}
//           >
//             View All Courses
//             <SiViaplay className="w-[30px] h-[30px] " />
//           </button>
//           <button
//             className="px-[20px] py-[10px] border-2 border-sky-300 bg-sky-500/80 backdrop-blur-sm text-white rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer hover:bg-sky-600 transition-all duration-300 shadow-lg"
//             onClick={() => navigate("/search")}
//           >
//             Search Courses
//             <img
//               src={ai}
//               alt=""
//               className="w-[30px] h-[30px] rounded-full hidden lg:block "
//             />
//             <img
//               src={ai1}
//               alt=""
//               className="w-[35px] h-[35px] rounded-full lg:hidden"
//             />
//           </button>
//         </div>
//       </div>

//       <Logos />
//       <ExploreCourses />

//       {/* 🔥 NEW: Personalized Recommendations Section - Only for logged in users */}
//       {userData && personalizedRecommendations?.length > 0 && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                 <FaRobot className="text-blue-500" />
//                 Recommended For You
//               </h2>
//               <p className="text-gray-600 mt-1">
//                 Based on your learning preferences
//               </p>
//             </div>
//             <button
//               onClick={() => navigate("/recommendations")}
//               className="text-blue-600 hover:text-blue-800 font-medium text-sm"
//             >
//               View All →
//             </button>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {personalizedRecommendations.slice(0, 4).map((rec) => (
//               <div key={rec.courseId._id} className="relative">
//                 <div className="absolute top-2 left-2 z-10 bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-medium">
//                   {Math.round(rec.score * 100)}% Match
//                 </div>
//                 <Card
//                   thumbnail={rec.courseId.thumbnail}
//                   id={rec.courseId._id}
//                   price={rec.courseId.price}
//                   title={rec.courseId.title}
//                   category={rec.courseId.category}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* 🔥 NEW: Trending Courses Section */}
//       {trendingCourses?.length > 0 && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-r from-orange-50 to-red-50">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                 <FaFire className="text-orange-500" />
//                 Trending Now
//               </h2>
//               <p className="text-gray-600 mt-1">
//                 Most popular courses this week
//               </p>
//             </div>
//             <button
//               onClick={() => navigate("/allcourses?sort=trending")}
//               className="text-orange-600 hover:text-orange-800 font-medium text-sm"
//             >
//               View All →
//             </button>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {trendingCourses.slice(0, 4).map((course) => (
//               <div key={course._id} className="relative">
//                 <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
//                   <FaFire />
//                   Hot
//                 </div>
//                 <Card
//                   thumbnail={course.thumbnail}
//                   id={course._id}
//                   price={course.price}
//                   title={course.title}
//                   category={course.category}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <CardPage />
//       <About />
//       <ReviewPage />
//       <Footer />
//     </div>
//   );
// };

// export default Home;
import React, { useEffect } from "react";
import Nav from "../component/Nav";
import home from "../assets/home4.png";
import { SiViaplay } from "react-icons/si";
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";
import Logos from "../component/Logos";
import ExploreCourses from "../component/ExploreCourses";
import CardPage from "../component/CardPage";
import { useNavigate } from "react-router-dom";
import About from "../component/About";
import Footer from "../component/Footer";
import ReviewPage from "../component/ReviewPage";
import useRecommendations from "../customHooks/useRecommendations";
import { useSelector } from "react-redux";
import { FaRobot, FaFire } from "react-icons/fa";
import Card from "../component/Card";
import { ClipLoader } from "react-spinners";

const Home = () => {
  const navigate = useNavigate();
  const { personalizedRecommendations, trendingCourses, loading } =
    useRecommendations();
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="w-[100%] overflow-hidden">
      {/* Hero Section */}
      <div className="w-[100%] lg:h-[140vh] h-[70vh] relative">
        <Nav />
        <img
          src={home}
          alt="Hero background"
          className="object-cover md:object-fill w-[100%] lg:h-[100%] h-[50vh] mt-20"
        />

        {/* Sky blue overlay for better text readability */}
        <div className="absolute inset-0 bg-sky-500/10 lg:bg-sky-500/5 mt-20"></div>

        <span className="lg:text-[50px] absolute md:text-[20px] lg:top-[5%] md:top-[5%] top-[15%] w-[100%] flex items-center justify-center text-white font-bold text-[20px] drop-shadow-lg">
          Grow Your Skills to Advance
        </span>

        <div className="absolute lg:top-[15%] md:top-[35%] top-[25%] w-[100%] flex items-center justify-center gap-3 flex-wrap">
          <button
            className="px-[20px] py-[10px] border-2 border-white bg-white/20 backdrop-blur-sm text-black rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer hover:bg-white/30 transition-all duration-300 shadow-lg"
            onClick={() => navigate("/allcourses")}
          >
            View All Courses
            <SiViaplay className="w-[30px] h-[30px] " />
          </button>
          <button
            className="px-[20px] py-[10px] border-2 border-sky-300 bg-sky-500/80 backdrop-blur-sm text-white rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer hover:bg-sky-600 transition-all duration-300 shadow-lg"
            onClick={() => navigate("/search")}
          >
            Search Courses
            <img
              src={ai}
              alt=""
              className="w-[30px] h-[30px] rounded-full hidden lg:block "
            />
            <img
              src={ai1}
              alt=""
              className="w-[35px] h-[35px] rounded-full lg:hidden"
            />
          </button>
        </div>
      </div>

      <Logos />
      <ExploreCourses />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <ClipLoader size={40} color="#3B82F6" />
        </div>
      )}

      {/* Personalized Recommendations Section - Only for logged in users */}
      {!loading && userData && personalizedRecommendations?.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaRobot className="text-blue-500" />
                Recommended For You
              </h2>
              <p className="text-gray-600 mt-1">
                Based on your learning preferences
              </p>
            </div>
            <button
              onClick={() => navigate("/recommendations")}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {personalizedRecommendations.slice(0, 4).map((rec) => {
              // Handle both possible data structures
              const course = rec.courseId || rec;
              const matchScore = rec.score ? Math.round(rec.score * 100) : 70;
              const reason = rec.reason || "Based on your interests";

              return (
                <div key={course._id} className="relative group">
                  {/* Match Score Badge */}
                  <div className="absolute top-2 left-2 z-10 bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-medium">
                    {matchScore}% Match
                  </div>

                  {/* Tooltip with Reason */}
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-black text-white text-xs p-2 rounded-lg shadow-lg max-w-[200px]">
                      {reason}
                    </div>
                  </div>

                  <Card
                    thumbnail={course.thumbnail}
                    id={course._id}
                    price={course.price}
                    title={course.title}
                    category={course.category}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State for Recommendations */}
      {!loading && userData && personalizedRecommendations?.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="bg-gray-50 rounded-lg p-8">
            <FaRobot className="text-4xl text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Recommendations Yet
            </h3>
            <p className="text-gray-600">
              Start exploring courses and we'll personalize recommendations for
              you!
            </p>
            <button
              onClick={() => navigate("/allcourses")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Courses
            </button>
          </div>
        </div>
      )}

      {/* Trending Courses Section */}
      {!loading && trendingCourses?.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaFire className="text-orange-500" />
                Trending Now
              </h2>
              <p className="text-gray-600 mt-1">
                Most popular courses this week
              </p>
            </div>
            <button
              onClick={() => navigate("/allcourses?sort=trending")}
              className="text-orange-600 hover:text-orange-800 font-medium text-sm"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingCourses.slice(0, 4).map((course) => (
              <div key={course._id} className="relative group">
                <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                  <FaFire />
                  Hot
                </div>

                {/* Trending tooltip */}
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-black text-white text-xs p-2 rounded-lg shadow-lg">
                    Trending this week
                  </div>
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
        </div>
      )}

      <CardPage />
      <About />
      <ReviewPage />
      <Footer />
    </div>
  );
};

export default Home;
