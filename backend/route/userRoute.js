import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getCurrentUser, updateProfile } from "../controller/userController.js";
import { getPersonalizedRecommendations } from "../controller/recommendationController.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/getcurrentUser", isAuth, getCurrentUser);
userRouter.post("/profile", isAuth, upload.single("photoUrl"), updateProfile);

// 🔥 NEW: Recommendation endpoints
userRouter.get("/recommendations", isAuth, getPersonalizedRecommendations);

export default userRouter;
