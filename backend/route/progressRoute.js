import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  getCourseProgress,
  completeLecture,
  getAllUserProgress,
  resetProgress,
} from "../controller/progressController.js";

const progressRouter = express.Router();

// All progress routes are protected
progressRouter.use(isAuth);

progressRouter.get("/:courseId", getCourseProgress);
progressRouter.post("/complete-lecture", completeLecture);
progressRouter.get("/all/progress", getAllUserProgress);
progressRouter.delete("/reset/:courseId", resetProgress);

export default progressRouter;
