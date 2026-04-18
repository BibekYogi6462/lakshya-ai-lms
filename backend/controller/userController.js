// import uploadOnCloudinary from "../config/cloudinary.js";
// import User from "../model/userModel.js";

// export const getCurrentUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId)
//       .select("-password")
//       .populate("enrolledCourses");
//     if (!user) {
//       return res.status(404).json({ message: "User not Found" });
//     }
//     return res.status(200).json(user);
//   } catch (error) {
//     return res.status(500).json({ message: `Get Current User Error ${error}` });
//   }
// };

// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { description, name } = req.body;
//     let photoUrl = "";

//     // Check if file was uploaded
//     if (req.file) {
//       // Convert buffer to base64 or upload to Cloudinary
//       const result = await uploadOnCloudinary(req.file.buffer);
//       photoUrl = result.secure_url;
//     }

//     const user = await User.findByIdAndUpdate(
//       userId,
//       {
//         name,
//         description,
//         ...(photoUrl && { photoUrl }), // Only update photoUrl if a new one was uploaded
//       },
//       { new: true }, // Return updated user
//     ).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not Found" });
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     return res
//       .status(500)
//       .json({ message: `Update User Profile Error ${error.message}` });
//   }
// };

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

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { description, name } = req.body;
    let photoUrl = "";

    // Check if file was uploaded (buffer from memory storage)
    if (req.file) {
      console.log("File received:", req.file.originalname);
      console.log("File size:", req.file.size);
      console.log("File mimetype:", req.file.mimetype);

      // Upload buffer to Cloudinary
      const cloudinaryUrl = await uploadOnCloudinary(req.file.buffer, true);

      if (cloudinaryUrl) {
        photoUrl = cloudinaryUrl;
      } else {
        return res
          .status(400)
          .json({ message: "Failed to upload image to Cloudinary" });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (photoUrl) updateData.photoUrl = photoUrl;

    // Update user in database
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }, // Return updated document
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res
      .status(500)
      .json({ message: `Update User Profile Error: ${error.message}` });
  }
};
