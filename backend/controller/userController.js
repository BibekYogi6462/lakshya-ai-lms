import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("enrolledCourses");
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Get Current User Error ${error}` });
  }
};

// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { description, name } = req.body;
//     let photoUrl;
//     if (req.file) {
//       photoUrl = await uploadOnCloudinary(req.file.path);
//     }
//     const user = await User.findByIdAndUpdate(userId, {
//       name,
//       description,
//       photoUrl,
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not Found" });
//     }
//     await user.save();
//     return res.status(200).json(user);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: `Update User Profile Error ${error}` });
//   }
// };

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { description, name } = req.body;
    let photoUrl = "";

    // Check if file was uploaded
    if (req.file) {
      // Convert buffer to base64 or upload to Cloudinary
      const result = await uploadOnCloudinary(req.file.buffer);
      photoUrl = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        description,
        ...(photoUrl && { photoUrl }), // Only update photoUrl if a new one was uploaded
      },
      { new: true }, // Return updated user
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res
      .status(500)
      .json({ message: `Update User Profile Error ${error.message}` });
  }
};
