import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../App";

const SearchWithAi = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle search
  const handleSearch = async () => {
    if (!input || input.trim() === "") {
      toast.error("Please enter a search query");
      return;
    }

    setLoading(true);
    setSearched(false);

    try {
      console.log("Searching for:", input);

      // Using GET request with query parameter
      const result = await axios.get(
        `${serverUrl}/api/course/search?query=${encodeURIComponent(input)}`,
        {
          withCredentials: true,
        },
      );

      console.log("Search results:", result.data);
      setSearchResults(result.data || []);
      setSearched(true);
      setLoading(false);

      if (result.data && result.data.length === 0) {
        toast.info("No courses found. Try different keywords.");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error(error.response?.data?.message || "Failed to search courses");
      setLoading(false);
      setSearched(true);
      setSearchResults([]);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-16">
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative">
        {/* Back button */}
        <FaArrowLeftLong
          className="text-[black] w-[22px] h-[22px] cursor-pointer absolute left-4 top-6"
          onClick={() => navigate(-1)}
        />

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-6">
          Search <span className="text-[#da6ed1]">Courses</span>
        </h1>

        {/* Search input */}
        <div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full mb-4">
          <input
            type="text"
            className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
            placeholder="Search for courses (e.g., HTML, JavaScript, React...)"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyPress={handleKeyPress}
          />

          {/* Search Button */}
          <button
            className="absolute right-2 bg-[#da6ed1] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#c05db8] transition-colors"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <IoSearch className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Search tips */}
        <p className="text-gray-500 text-sm mt-2">
          Try searching by: title, category, level, or description
        </p>
      </div>

      {/* Results section */}
      {loading ? (
        <div className="w-full max-w-6xl mt-12 px-2 sm:px-4">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#da6ed1]"></div>
          </div>
        </div>
      ) : searched ? (
        searchResults.length > 0 ? (
          <div className="w-full max-w-6xl mt-12 px-2 sm:px-4">
            <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
              📚 Found {searchResults.length} Course
              {searchResults.length !== 1 ? "s" : ""}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {searchResults.map((course) => (
                <div
                  key={course._id}
                  className="bg-white text-black p-5 rounded-2xl shadow-md hover:shadow-indigo-500/30 transition-all duration-200 border border-gray-200 cursor-pointer hover:scale-[1.02] hover:bg-gray-50"
                  onClick={() => navigate(`/viewcourse/${course._id}`)}
                >
                  {/* Course thumbnail if available */}
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}

                  <h2 className="text-lg font-bold line-clamp-2">
                    {course.title}
                  </h2>

                  {course.subTitle && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {course.subTitle}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {course.category}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {course.level || "All Levels"}
                    </span>
                  </div>

                  {course.description && (
                    <p className="text-xs text-gray-500 mt-3 line-clamp-2">
                      {course.description}
                    </p>
                  )}

                  {/* Creator info */}
                  {course.creator && (
                    <p className="text-xs text-gray-400 mt-3">
                      By {course.creator.name || "Instructor"}
                    </p>
                  )}

                  {/* Price if available */}
                  {course.price > 0 ? (
                    <p className="text-sm font-semibold mt-2 text-green-600">
                      ${course.price}
                    </p>
                  ) : (
                    <p className="text-sm font-semibold mt-2 text-blue-600">
                      Free
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl mt-12 px-2 sm:px-4 text-center">
            <div className="bg-white/10 rounded-2xl p-8 max-w-md mx-auto">
              <h1 className="text-xl sm:text-2xl font-bold mb-4">
                No Courses Found
              </h1>
              <p className="text-gray-300 mb-4">
                No results found for "{input}"
              </p>
              <p className="text-gray-400 mb-6">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "HTML",
                  "CSS",
                  "JavaScript",
                  "React",
                  "Python",
                  "Web Development",
                  "Data Science",
                ].map((term) => (
                  <button
                    key={term}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm transition-colors"
                    onClick={() => {
                      setInput(term);
                      setTimeout(() => handleSearch(), 100);
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      ) : null}
    </div>
  );
};

export default SearchWithAi;
