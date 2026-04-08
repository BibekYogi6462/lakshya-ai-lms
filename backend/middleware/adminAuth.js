// backend/middleware/adminAuth.js
import User from "../model/userModel.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }
    req.user = user; // Add user to request for convenience
    next();
  } catch (error) {
    return res.status(500).json({
      message: `Admin authorization error: ${error.message}`,
    });
  }
};
