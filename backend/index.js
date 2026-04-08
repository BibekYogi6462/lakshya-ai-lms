// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import connectDB from "./config/connectDB.js";

// // Import routes
// import authRouter from "./route/authRoute.js";
// import userRouter from "./route/userRoute.js";
// import courseRouter from "./route/courseRoute.js";
// import orderRouter from "./route/orderRoute.js";
// import reviewRouter from "./route/reviewRoute.js";
// import progressRouter from "./route/progressRoute.js";
// import recommendationRouter from "./route/recommendationRoute.js";

// dotenv.config();
// connectDB();

// const app = express();
// const PORT = process.env.PORT || 8000;

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   }),
// );

// // Routes
// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);
// app.use("/api/course", courseRouter);
// app.use("/api/order", orderRouter);
// app.use("/api/review", reviewRouter);
// app.use("/api/progress", progressRouter);
// app.use("/api/recommendation", recommendationRouter);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";

// Import routes
import authRouter from "./route/authRoute.js";
import userRouter from "./route/userRoute.js";
import courseRouter from "./route/courseRoute.js";
import orderRouter from "./route/orderRoute.js";
import reviewRouter from "./route/reviewRoute.js";
import progressRouter from "./route/progressRoute.js";
import recommendationRouter from "./route/recommendationRoute.js";
import adminRoutes from "./route/adminRoute.js"; // ← ADD THIS LINE

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);
app.use("/api/progress", progressRouter);
app.use("/api/recommendation", recommendationRouter);
app.use("/api/admin", adminRoutes); // ← ADD THIS LINE

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
