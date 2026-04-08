// // import React, { useEffect, useState } from "react";
// // import Nav from "../component/Nav";
// // import { FaArrowLeftLong } from "react-icons/fa6";
// // import { useNavigate } from "react-router-dom";
// // import img from "../assets/SearchAi.png";
// // import { useSelector } from "react-redux";
// // import Card from "../component/Card";

// // const AllCourses = () => {
// //   const navigate = useNavigate();
// //   const { courseData } = useSelector((state) => state.course);
// //   const [category, setCategory] = useState([]);
// //   const [filterCourses, setFilterCourses] = useState([]);
// //   const [isSidebarVisible, setIsSidebarVisible] = useState(false);

// //   const toggleCategory = (e) => {
// //     if (category.includes(e.target.value)) {
// //       setCategory((prev) => prev.filter((c) => c !== e.target.value));
// //     } else {
// //       setCategory((prev) => [...prev, e.target.value]);
// //     }
// //   };

// //   const appFilter = () => {
// //     let courseCopy = courseData?.slice(); // ADD 'let' here
// //     if (category.length > 0 && courseCopy) {
// //       courseCopy = courseCopy.filter((c) => category.includes(c.category));
// //     }
// //     setFilterCourses(courseCopy || []);
// //   };

// //   useEffect(() => {
// //     setFilterCourses(courseData || []);
// //   }, [courseData]);

// //   useEffect(() => {
// //     appFilter();
// //   }, [category]);

// //   return (
// //     <div className="flex min-h-screen bg-gray-50">
// //       <Nav />

// //       <button
// //         className="fixed top-20 left-4 z-50 bg-white text-black px-3 py-1 rounded md:hidden border-2 border-black"
// //         onClick={() => setIsSidebarVisible((prev) => !prev)}
// //       >
// //         {isSidebarVisible ? "Hide" : "Show"} Filters
// //       </button>

// //       {/* sidebar */}
// //       <aside
// //         className={`
// //           w-[260px] h-screen overflow-y-auto bg-black fixed top-0 left-0 p-6 py-[130px] border-r border-gray-200 shadow-md transition-transform duration-300 z-5 ${
// //             isSidebarVisible ? "translate-x-0" : "-translate-x-full"
// //           } md:block md:translate-x-0`}
// //       >
// //         <h2 className="text-xl font-bold flex items-center justify-center gap-2 text-gray-50 mb-6">
// //           <FaArrowLeftLong
// //             className="text-white cursor-pointer"
// //             onClick={() => navigate("/")}
// //           />
// //           Filter By Category
// //         </h2>

// //         <form
// //           onSubmit={(e) => e.preventDefault()}
// //           className="space-y-4 text-sm bg-gray-600 border-white text-[white] border p-[20px] rounded-2xl"
// //         >
// //           <button className="px-[10px] py-[10px] bg-black text-white rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2">
// //             Search With AI
// //             <img src={img} alt="" className="w-[30px] h-[30px] rounded-full" />
// //           </button>

// //           {/* Your category checkboxes */}
// //           {/* Your category checkboxes */}
// //           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
// //             <input
// //               type="checkbox"
// //               className="accent-black w-4 h-4 rounded-md"
// //               value={"App Development"}
// //               onChange={toggleCategory}
// //             />
// //             App Development
// //           </label>
// //           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
// //             <input
// //               type="checkbox"
// //               className="accent-black w-4 h-4 rounded-md"
// //               value={"AI/ML"}
// //               onChange={toggleCategory}
// //             />
// //             AI/ML
// //           </label>
// //           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
// //             <input
// //               type="checkbox"
// //               className="accent-black w-4 h-4 rounded-md"
// //               value={"AI Tools"}
// //               onChange={toggleCategory}
// //             />
// //             AI Tools
// //           </label>
// //           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
// //             <input
// //               type="checkbox"
// //               className="accent-black w-4 h-4 rounded-md"
// //               value={"Data Science"}
// //               onChange={toggleCategory}
// //             />
// //             Data Science
// //           </label>
// //           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
// //             <input
// //               type="checkbox"
// //               className="accent-black w-4 h-4 rounded-md"
// //               value={"AI/Data Analytics"}
// //               onChange={toggleCategory}
// //             />
// //             Data Analytics
// //           </label>
// //           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
// //             <input
// //               type="checkbox"
// //               className="accent-black w-4 h-4 rounded-md"
// //               value={"Ethical Hacking"}
// //               onChange={toggleCategory}
// //             />
// //             Ethical Hacking
// //           </label>
// //           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
// //             <input
// //               type="checkbox"
// //               className="accent-black w-4 h-4 rounded-md"
// //               value={"UI/UX Designing"}
// //               onChange={toggleCategory}
// //             />
// //             UI/UX Designing
// //           </label>
// //           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
// //             <input
// //               type="checkbox"
// //               className="accent-black w-4 h-4 rounded-md"
// //               value={"Web Development"}
// //               onChange={toggleCategory}
// //             />
// //             Web Development
// //           </label>
// //           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
// //             <input
// //               type="checkbox"
// //               className="accent-black w-4 h-4 rounded-md"
// //               value={"Others"}
// //               onChange={toggleCategory}
// //             />
// //             Others
// //           </label>
// //         </form>
// //       </aside>

// //       {/* MAIN CONTENT - MOVED OUTSIDE THE ASIDE */}
// //       <main className="ml-[260px] w-[calc(100%-260px)] transition-all duration-300 py-[130px] flex items-start justify-center md:justify-start flex-wrap gap-6 px-[10px]">
// //         {filterCourses && filterCourses.length > 0 ? (
// //           filterCourses.map((course, index) => (
// //             <Card
// //               key={course._id || index}
// //               thumbnail={course.thumbnail}
// //               title={course.title}
// //               category={course.category}
// //               price={course.price}
// //               id={course._id}
// //             />
// //           ))
// //         ) : (
// //           <div className="text-center py-8">
// //             <p>No courses found</p>
// //           </div>
// //         )}
// //       </main>
// //     </div>
// //   );
// // };

// // export default AllCourses;

// import React, { useEffect, useState } from "react";
// import Nav from "../component/Nav";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { useNavigate } from "react-router-dom";
// import img from "../assets/SearchAi.png";
// import { useSelector } from "react-redux";
// import Card from "../component/Card";

// const AllCourses = () => {
//   const navigate = useNavigate();
//   const { courseData } = useSelector((state) => state.course);
//   const [category, setCategory] = useState([]);
//   const [filterCourses, setFilterCourses] = useState([]);
//   const [isSidebarVisible, setIsSidebarVisible] = useState(false);

//   const toggleCategory = (e) => {
//     if (category.includes(e.target.value)) {
//       setCategory((prev) => prev.filter((c) => c !== e.target.value));
//     } else {
//       setCategory((prev) => [...prev, e.target.value]);
//     }
//   };

//   const appFilter = () => {
//     let courseCopy = courseData?.slice();
//     if (category.length > 0 && courseCopy) {
//       courseCopy = courseCopy.filter((c) => category.includes(c.category));
//     }
//     setFilterCourses(courseCopy || []);
//   };

//   useEffect(() => {
//     setFilterCourses(courseData || []);
//   }, [courseData]);

//   useEffect(() => {
//     appFilter();
//   }, [category]);

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Nav />

//       <button
//         className="fixed top-20 left-4 z-50 bg-white text-black px-3 py-1 rounded md:hidden border-2 border-black"
//         onClick={() => setIsSidebarVisible((prev) => !prev)}
//       >
//         {isSidebarVisible ? "Hide" : "Show"} Filters
//       </button>

//       {/* sidebar */}
//       <aside
//         className={`
//           w-[260px] h-screen overflow-y-auto bg-black fixed top-0 left-0 p-6 py-[130px] border-r border-gray-200 shadow-md transition-transform duration-300 z-40 ${
//             isSidebarVisible ? "translate-x-0" : "-translate-x-full"
//           } md:translate-x-0 md:relative md:z-0`}
//       >
//         <h2 className="text-xl font-bold flex items-center justify-center gap-2 text-gray-50 mb-6">
//           <FaArrowLeftLong
//             className="text-white cursor-pointer"
//             onClick={() => navigate("/")}
//           />
//           Filter By Category
//         </h2>

//         <form
//           onSubmit={(e) => e.preventDefault()}
//           className="space-y-4 text-sm bg-gray-600 border-white text-[white] border p-[20px] rounded-2xl"
//         >
//           <button
//             className="px-[10px] py-[10px] bg-black text-white rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2"
//             onClick={() => navigate("/search")}
//           >
//             Search
//             <img src={img} alt="" className="w-[30px] h-[30px] rounded-full" />
//           </button>

//           {/* Your category checkboxes */}
//           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
//             <input
//               type="checkbox"
//               className="accent-black w-4 h-4 rounded-md"
//               value={"App Development"}
//               onChange={toggleCategory}
//             />
//             App Development
//           </label>
//           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
//             <input
//               type="checkbox"
//               className="accent-black w-4 h-4 rounded-md"
//               value={"AI/ML"}
//               onChange={toggleCategory}
//             />
//             AI/ML
//           </label>
//           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
//             <input
//               type="checkbox"
//               className="accent-black w-4 h-4 rounded-md"
//               value={"AI Tools"}
//               onChange={toggleCategory}
//             />
//             AI Tools
//           </label>
//           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
//             <input
//               type="checkbox"
//               className="accent-black w-4 h-4 rounded-md"
//               value={"Data Science"}
//               onChange={toggleCategory}
//             />
//             Data Science
//           </label>
//           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
//             <input
//               type="checkbox"
//               className="accent-black w-4 h-4 rounded-md"
//               value={"AI/Data Analytics"}
//               onChange={toggleCategory}
//             />
//             Data Analytics
//           </label>
//           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
//             <input
//               type="checkbox"
//               className="accent-black w-4 h-4 rounded-md"
//               value={"Ethical Hacking"}
//               onChange={toggleCategory}
//             />
//             Ethical Hacking
//           </label>
//           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
//             <input
//               type="checkbox"
//               className="accent-black w-4 h-4 rounded-md"
//               value={"UI/UX Designing"}
//               onChange={toggleCategory}
//             />
//             UI/UX Designing
//           </label>
//           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
//             <input
//               type="checkbox"
//               className="accent-black w-4 h-4 rounded-md"
//               value={"Web Development"}
//               onChange={toggleCategory}
//             />
//             Web Development
//           </label>
//           <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
//             <input
//               type="checkbox"
//               className="accent-black w-4 h-4 rounded-md"
//               value={"Others"}
//               onChange={toggleCategory}
//             />
//             Others
//           </label>
//         </form>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main
//         className={`
//         flex-1 transition-all duration-300 py-[130px] flex items-start justify-center md:justify-start flex-wrap gap-6 px-[10px]
//         ${isSidebarVisible ? "md:ml-0" : "md:ml-0"}
//       `}
//       >
//         {filterCourses && filterCourses.length > 0 ? (
//           filterCourses.map((course, index) => (
//             <Card
//               key={course._id || index}
//               thumbnail={course.thumbnail}
//               title={course.title}
//               category={course.category}
//               price={course.price}
//               id={course._id}
//               reviews={course.reviews}
//             />
//           ))
//         ) : (
//           <div className="text-center py-8">
//             <p>No courses found</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default AllCourses;

import React, { useEffect, useState } from "react";
import Nav from "../component/Nav";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import img from "../assets/SearchAi.png";
import { useSelector } from "react-redux";
import Card from "../component/Card";

const AllCourses = () => {
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);
  const [category, setCategory] = useState([]);
  const [filterCourses, setFilterCourses] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Helper function to normalize category names (fix misspellings)
  const normalizeCategory = (cat) => {
    const mapping = {
      "app devleopment": "app development",
      "app devlopment": "app development",
      "app develpment": "app development",
      appdevelopment: "app development",
      "app dev": "app development",
    };
    const lower = cat?.toLowerCase() || "";
    return mapping[lower] || lower;
  };

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((c) => c !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const appFilter = () => {
    let courseCopy = courseData?.slice();
    if (category.length > 0 && courseCopy) {
      courseCopy = courseCopy.filter((c) => {
        const normalizedCourseCat = normalizeCategory(c.category);
        return category.some(
          (selectedCat) =>
            normalizedCourseCat === normalizeCategory(selectedCat),
        );
      });
    }
    setFilterCourses(courseCopy || []);
  };

  useEffect(() => {
    setFilterCourses(courseData || []);
  }, [courseData]);

  useEffect(() => {
    appFilter();
  }, [category]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Nav />

      <button
        className="fixed top-20 left-4 z-50 bg-white text-black px-3 py-1 rounded md:hidden border-2 border-black"
        onClick={() => setIsSidebarVisible((prev) => !prev)}
      >
        {isSidebarVisible ? "Hide" : "Show"} Filters
      </button>

      {/* sidebar */}
      <aside
        className={`
          w-[260px] h-screen overflow-y-auto bg-black fixed top-0 left-0 p-6 py-[130px] border-r border-gray-200 shadow-md transition-transform duration-300 z-40 ${
            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative md:z-0`}
      >
        <h2 className="text-xl font-bold flex items-center justify-center gap-2 text-gray-50 mb-6">
          <FaArrowLeftLong
            className="text-white cursor-pointer"
            onClick={() => navigate("/")}
          />
          Filter By Category
        </h2>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-4 text-sm bg-gray-600 border-white text-[white] border p-[20px] rounded-2xl"
        >
          <button
            className="px-[10px] py-[10px] bg-black text-white rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 w-full"
            onClick={() => navigate("/search")}
          >
            Search
            <img src={img} alt="" className="w-[30px] h-[30px] rounded-full" />
          </button>

          {/* Category checkboxes */}
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input
              type="checkbox"
              className="accent-black w-4 h-4 rounded-md"
              value={"App Development"}
              onChange={toggleCategory}
            />
            App Development
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input
              type="checkbox"
              className="accent-black w-4 h-4 rounded-md"
              value={"AI/ML"}
              onChange={toggleCategory}
            />
            AI/ML
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input
              type="checkbox"
              className="accent-black w-4 h-4 rounded-md"
              value={"AI Tools"}
              onChange={toggleCategory}
            />
            AI Tools
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input
              type="checkbox"
              className="accent-black w-4 h-4 rounded-md"
              value={"Data Science"}
              onChange={toggleCategory}
            />
            Data Science
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input
              type="checkbox"
              className="accent-black w-4 h-4 rounded-md"
              value={"Data Analytics"}
              onChange={toggleCategory}
            />
            Data Analytics
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input
              type="checkbox"
              className="accent-black w-4 h-4 rounded-md"
              value={"Ethical Hacking"}
              onChange={toggleCategory}
            />
            Ethical Hacking
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input
              type="checkbox"
              className="accent-black w-4 h-4 rounded-md"
              value={"UI/UX Designing"}
              onChange={toggleCategory}
            />
            UI/UX Designing
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input
              type="checkbox"
              className="accent-black w-4 h-4 rounded-md"
              value={"Web Development"}
              onChange={toggleCategory}
            />
            Web Development
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input
              type="checkbox"
              className="accent-black w-4 h-4 rounded-md"
              value={"Others"}
              onChange={toggleCategory}
            />
            Others
          </label>
        </form>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`
        flex-1 transition-all duration-300 py-[130px] flex items-start justify-center md:justify-start flex-wrap gap-6 px-[10px]
        ${isSidebarVisible ? "md:ml-0" : "md:ml-0"}
      `}
      >
        {filterCourses && filterCourses.length > 0 ? (
          filterCourses.map((course, index) => (
            <Card
              key={course._id || index}
              thumbnail={course.thumbnail}
              title={course.title}
              category={course.category}
              price={course.price}
              id={course._id}
              reviews={course.reviews}
            />
          ))
        ) : (
          <div className="text-center py-8 w-full">
            <p className="text-gray-500">No courses found in this category</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllCourses;
