// import React, { useState } from "react";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import ai from "../assets/ai.png";
// import { RiMicAiFill } from "react-icons/ri";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";
// import start from "../assets/start.mp3";
// import { serverUrl } from "../App";

// const SearchWithAi = () => {
//   const startSound = new Audio(start);
//   const navigate = useNavigate();

//   const [input, setInput] = useState("");
//   const [recommendations, setRecommendations] = useState([]);
//   const [listening, setListening] = useState(false);
//   const [searched, setSearched] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Text-to-speech function
//   function speak(message) {
//     let utterance = new SpeechSynthesisUtterance(message);
//     window.speechSynthesis.speak(utterance);
//   }

//   // Function to extract keywords from speech
//   const extractKeywords = (speechText) => {
//     console.log("Original speech:", speechText);

//     const text = speechText.toLowerCase();

//     // Common technical keywords
//     const techKeywords = [
//       "html",
//       "css",
//       "javascript",
//       "react",
//       "node",
//       "python",
//       "java",
//       "web development",
//       "app development",
//       "mobile development",
//       "ai",
//       "machine learning",
//       "data science",
//       "data analytics",
//       "ui ux",
//       "ui/ux",
//       "design",
//       "ethical hacking",
//       "cybersecurity",
//       "sql",
//       "database",
//       "mongodb",
//       "express",
//       "angular",
//       "vue",
//       "typescript",
//       "next.js",
//       "flutter",
//       "react native",
//       "kotlin",
//       "swift",
//       "c++",
//       "c#",
//       "php",
//       "laravel",
//       "django",
//       "spring",
//       "devops",
//       "cloud",
//       "aws",
//       "docker",
//       "kubernetes",
//     ];

//     // Check if any tech keyword is in the speech
//     for (const keyword of techKeywords) {
//       if (text.includes(keyword.toLowerCase())) {
//         console.log("Found keyword in speech:", keyword);
//         return keyword;
//       }
//     }

//     // Try to extract after common phrases
//     const patterns = [
//       /(?:want to|need to|learn|study|teach me)\s+(.+)/i,
//       /i (?:want|need)\s+(.+)/i,
//       /how to (?:learn|master|understand)\s+(.+)/i,
//       /(?:show me|courses? for|about)\s+(.+)/i,
//     ];

//     for (const pattern of patterns) {
//       const match = text.match(pattern);
//       if (match && match[1]) {
//         const extracted = match[1].trim();
//         console.log("Pattern matched, extracted:", extracted);
//         return extracted;
//       }
//     }

//     // If nothing else works, return the last meaningful word
//     const stopWords = [
//       "i",
//       "want",
//       "to",
//       "learn",
//       "need",
//       "study",
//       "teach",
//       "me",
//       "how",
//       "show",
//       "courses",
//       "course",
//       "about",
//       "for",
//     ];
//     const words = text
//       .split(" ")
//       .filter(
//         (word) => word.length > 2 && !stopWords.includes(word.toLowerCase()),
//       );

//     if (words.length > 0) {
//       return words[words.length - 1]; // Return last meaningful word
//     }

//     // Default: return original text
//     return speechText;
//   };

//   // Voice search handler
//   const handleVoiceSearch = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       toast.error("Speech Recognition is not supported in your browser");
//       return;
//     }

//     setListening(true);
//     setSearched(false);
//     setRecommendations([]);
//     setInput("");

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognition.continuous = false;
//     recognition.maxAlternatives = 1;

//     recognition.start();
//     startSound.play();

//     recognition.onresult = async (e) => {
//       const transcript = e.results[0][0].transcript.trim();
//       console.log("Speech recognized:", transcript);

//       // Extract keywords from speech
//       const extractedQuery = extractKeywords(transcript);
//       console.log("Extracted query for search:", extractedQuery);

//       setInput(extractedQuery);
//       await handleRecommendation(extractedQuery);
//     };

//     recognition.onerror = (event) => {
//       console.error("Speech recognition error:", event.error);
//       toast.error("Voice recognition failed. Please try again.");
//       setListening(false);
//     };

//     recognition.onend = () => {
//       setListening(false);
//     };
//   };

//   // Handle search/recommendation
//   const handleRecommendation = async (query) => {
//     if (!query || query.trim() === "") {
//       toast.error("Please enter a search query");
//       return;
//     }

//     setLoading(true);
//     setSearched(false);

//     try {
//       console.log("Sending search query:", query);

//       const result = await axios.post(
//         `${serverUrl}/api/course/search`,
//         { input: query },
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       console.log("Search response:", result.data);

//       setRecommendations(result.data || []);
//       setSearched(true);
//       setLoading(false);

//       if (result.data && result.data.length > 0) {
//         speak(`Found ${result.data.length} courses for you`);
//       } else {
//         speak("No courses found. Please try a different search.");
//       }
//     } catch (error) {
//       console.error("Search error:", error);
//       toast.error(error.response?.data?.message || "Failed to search courses");
//       setLoading(false);
//       setSearched(true);
//       setRecommendations([]);
//     }
//   };

//   // Handle manual search button click
//   const handleSearch = () => {
//     if (input.trim()) {
//       handleRecommendation(input);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-16">
//       <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative">
//         {/* Back button */}
//         <FaArrowLeftLong
//           className="text-[black] w-[22px] h-[22px] cursor-pointer absolute left-4 top-6"
//           onClick={() => navigate(-1)}
//         />

//         {/* Title */}
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2">
//           <img src={ai} alt="AI" className="w-8 h-8 sm:w-[30px] sm:h-[30px]" />
//           Search With <span className="text-[#da6ed1]">AI</span>
//         </h1>

//         {/* Search input */}
//         <div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full mb-4">
//           <input
//             type="text"
//             className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
//             placeholder="What do you want to learn?"
//             onChange={(e) => setInput(e.target.value)}
//             value={input}
//             onKeyPress={(e) => {
//               if (e.key === "Enter") {
//                 handleSearch();
//               }
//             }}
//           />

//           {/* AI Search Button */}
//           {input && (
//             <button
//               className="absolute right-14 sm:right-16 bg-white rounded-full hover:bg-gray-100 transition-colors"
//               onClick={handleSearch}
//               disabled={loading || listening}
//             >
//               <img
//                 src={ai}
//                 className="w-10 h-10 p-2 rounded-full"
//                 alt="AI Search"
//               />
//             </button>
//           )}

//           {/* Voice Search Button */}
//           <button
//             className="absolute right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
//             onClick={handleVoiceSearch}
//             disabled={listening || loading}
//           >
//             {listening ? (
//               <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
//             ) : (
//               <RiMicAiFill className="w-5 h-5 text-[#cb87c5]" />
//             )}
//           </button>
//         </div>

//         {/* Loading indicator */}
//         {loading && (
//           <div className="mt-4">
//             <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#da6ed1]"></div>
//             <p className="text-gray-600 mt-2">Searching courses...</p>
//           </div>
//         )}

//         {/* Voice listening indicator */}
//         {listening && (
//           <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
//             <p className="text-gray-600 font-medium">
//               🎤 Listening... Speak now
//             </p>
//             <p className="text-gray-500 text-sm mt-1">
//               Say something like "I want to learn HTML" or "Web development
//               courses"
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Results section */}
//       {loading ? (
//         <div className="w-full max-w-6xl mt-12 px-2 sm:px-4">
//           <div className="flex justify-center items-center h-40">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#da6ed1]"></div>
//           </div>
//         </div>
//       ) : searched ? (
//         recommendations.length > 0 ? (
//           <div className="w-full max-w-6xl mt-12 px-2 sm:px-4">
//             <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
//               📚 {recommendations.length} Course
//               {recommendations.length !== 1 ? "s" : ""} Found
//             </h1>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
//               {recommendations.map((course) => (
//                 <div
//                   key={course._id}
//                   className="bg-white text-black p-5 rounded-2xl shadow-md hover:shadow-indigo-500/30 transition-all duration-200 border border-gray-200 cursor-pointer hover:scale-[1.02] hover:bg-gray-50"
//                   onClick={() => navigate(`/viewcourse/${course._id}`)}
//                 >
//                   <h2 className="text-lg font-bold line-clamp-2">
//                     {course.title}
//                   </h2>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Category: {course.category}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-2">
//                     Level: {course.level}
//                   </p>
//                   {course.tags && course.tags.length > 0 && (
//                     <div className="flex flex-wrap gap-1 mt-3">
//                       {course.tags.slice(0, 3).map((tag, index) => (
//                         <span
//                           key={index}
//                           className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="w-full max-w-6xl mt-12 px-2 sm:px-4 text-center">
//             <div className="bg-white/10 rounded-2xl p-8 max-w-md mx-auto">
//               <h1 className="text-xl sm:text-2xl font-bold mb-4">
//                 No Courses Found
//               </h1>
//               <p className="text-gray-300 mb-6">Try searching for:</p>
//               <div className="flex flex-wrap gap-2 justify-center">
//                 {[
//                   "HTML",
//                   "Web Development",
//                   "JavaScript",
//                   "Python",
//                   "React",
//                   "AI/ML",
//                   "Data Science",
//                   "UI/UX",
//                 ].map((term) => (
//                   <button
//                     key={term}
//                     className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm transition-colors"
//                     onClick={() => {
//                       setInput(term);
//                       handleRecommendation(term);
//                     }}
//                   >
//                     {term}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )
//       ) : null}
//     </div>
//   );
// };

// export default SearchWithAi;

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
