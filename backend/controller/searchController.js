import Course from "../model/courseModel.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

// Helper function to extract keywords from text
const extractKeywordsLocal = (input) => {
  console.log("Local extraction input:", input);

  const lowerInput = input.toLowerCase();

  // Map of keywords to categories
  const keywordMap = {
    // Web Development
    html: "html",
    css: "css",
    javascript: "javascript",
    react: "react",
    angular: "angular",
    vue: "vue",
    node: "node",
    express: "express",
    "web development": "web development",
    frontend: "frontend",
    backend: "backend",
    "full stack": "full stack",

    // App Development
    "app development": "app development",
    "mobile development": "mobile development",
    android: "android",
    ios: "ios",
    flutter: "flutter",
    "react native": "react native",

    // AI/ML
    ai: "ai",
    "artificial intelligence": "artificial intelligence",
    "machine learning": "machine learning",
    "deep learning": "deep learning",

    // Data Science
    "data science": "data science",
    "data analytics": "data analytics",
    python: "python",
    "r programming": "r programming",

    // UI/UX
    "ui ux": "ui ux",
    "ui/ux": "ui/ux",
    design: "design",
    figma: "figma",

    // Cybersecurity
    "ethical hacking": "ethical hacking",
    cybersecurity: "cybersecurity",
    security: "security",

    // Levels
    beginner: "beginner",
    intermediate: "intermediate",
    advanced: "advanced",
  };

  // Check for exact matches first
  for (const [keyword, value] of Object.entries(keywordMap)) {
    if (lowerInput.includes(keyword)) {
      console.log("Exact keyword match found:", keyword);
      return value;
    }
  }

  // Check for partial matches
  const words = lowerInput.split(/\s+/);
  for (const word of words) {
    if (word.length < 3) continue;

    for (const [keyword, value] of Object.entries(keywordMap)) {
      if (keyword.includes(word) || word.includes(keyword.split(" ")[0])) {
        console.log("Partial match found:", word, "->", keyword);
        return value;
      }
    }
  }

  console.log("No local keyword found");
  return null;
};

// Main search function
export const searchWithAi = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || input.trim() === "") {
      return res.status(400).json({
        message: "Search Query is Required",
        courses: [],
      });
    }

    console.log("🔍 Search request for:", input);

    let courses = [];
    const searchLog = [];

    // Step 1: Try local keyword extraction
    const localKeyword = extractKeywordsLocal(input);
    if (localKeyword) {
      searchLog.push(`Local keyword: ${localKeyword}`);

      courses = await Course.find({
        isPublished: true,
        $or: [
          { title: { $regex: localKeyword, $options: "i" } },
          { subTitle: { $regex: localKeyword, $options: "i" } },
          { description: { $regex: localKeyword, $options: "i" } },
          { category: { $regex: localKeyword, $options: "i" } },
          { level: { $regex: localKeyword, $options: "i" } },
          { tags: { $in: [new RegExp(localKeyword, "i")] } },
        ],
      }).limit(25);

      if (courses.length > 0) {
        searchLog.push(`✅ Found ${courses.length} courses with local keyword`);
        console.log(searchLog.join(" | "));
        return res.status(200).json(courses);
      }
    }

    // Step 2: Try direct search with original input
    searchLog.push(`Trying direct search: "${input}"`);

    courses = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: input, $options: "i" } },
        { subTitle: { $regex: input, $options: "i" } },
        { description: { $regex: input, $options: "i" } },
        { category: { $regex: input, $options: "i" } },
        { level: { $regex: input, $options: "i" } },
        { tags: { $in: [new RegExp(input, "i")] } },
      ],
    }).limit(25);

    if (courses.length > 0) {
      searchLog.push(`✅ Found ${courses.length} courses with direct search`);
      console.log(searchLog.join(" | "));
      return res.status(200).json(courses);
    }

    // Step 3: Try individual words from input
    const words = input
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .filter(
        (word) =>
          ![
            "want",
            "need",
            "learn",
            "study",
            "teach",
            "courses",
            "course",
          ].includes(word),
      );

    if (words.length > 0) {
      searchLog.push(`Trying individual words: ${words.join(", ")}`);

      // Try each word separately
      for (const word of words) {
        courses = await Course.find({
          isPublished: true,
          $or: [
            { title: { $regex: word, $options: "i" } },
            { category: { $regex: word, $options: "i" } },
            { tags: { $in: [new RegExp(word, "i")] } },
          ],
        }).limit(25);

        if (courses.length > 0) {
          searchLog.push(
            `✅ Found ${courses.length} courses with word: "${word}"`,
          );
          console.log(searchLog.join(" | "));
          return res.status(200).json(courses);
        }
      }
    }

    // Step 4: Try AI extraction (only if API key exists)
    if (process.env.GEMINI_API_KEY) {
      try {
        searchLog.push("Trying AI extraction...");

        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
        });

        const prompt = `Extract the main subject or skill from this user query for course search.
User query: "${input}"

Examples:
- "I want to learn HTML" -> "HTML"
- "Show me web development courses" -> "web development"
- "I need to study python" -> "python"
- "How to learn react" -> "react"

Return ONLY the main subject/skill as a single word or short phrase.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const aiKeyword = response.text().trim();
        searchLog.push(`AI extracted: "${aiKeyword}"`);

        if (aiKeyword && aiKeyword.toLowerCase() !== input.toLowerCase()) {
          courses = await Course.find({
            isPublished: true,
            $or: [
              { title: { $regex: aiKeyword, $options: "i" } },
              { subTitle: { $regex: aiKeyword, $options: "i" } },
              { description: { $regex: aiKeyword, $options: "i" } },
              { category: { $regex: aiKeyword, $options: "i" } },
              { level: { $regex: aiKeyword, $options: "i" } },
              { tags: { $in: [new RegExp(aiKeyword, "i")] } },
            ],
          }).limit(25);

          if (courses.length > 0) {
            searchLog.push(
              `✅ Found ${courses.length} courses with AI keyword`,
            );
            console.log(searchLog.join(" | "));
            return res.status(200).json(courses);
          }
        }
      } catch (aiError) {
        console.error("AI extraction failed:", aiError);
        searchLog.push("AI extraction failed");
      }
    }

    // Step 5: Final fallback - broad search
    searchLog.push("Trying broad search...");

    courses = await Course.find({
      isPublished: true,
      $or: [{ description: { $regex: input.split(" ")[0], $options: "i" } }],
    }).limit(15);

    if (courses.length > 0) {
      searchLog.push(`✅ Found ${courses.length} courses with broad search`);
      console.log(searchLog.join(" | "));
      return res.status(200).json(courses);
    }

    // No courses found
    searchLog.push("❌ No courses found");
    console.log(searchLog.join(" | "));
    return res.status(200).json([]);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      message: "Failed to search courses",
      error: error.message,
      courses: [],
    });
  }
};
