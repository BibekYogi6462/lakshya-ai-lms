// // import { v2 as cloudinary } from "cloudinary";
// // import fs from "fs";

// // const uploadOnCloudinary = async (file, isBuffer = false) => {
// //   // Configure cloudinary
// //   cloudinary.config({
// //     cloud_name: process.env.CLOUDINARY_NAME,
// //     api_key: process.env.CLOUDINARY_API_KEY,
// //     api_secret: process.env.CLOUDINARY_API_SECRET,
// //   });

// //   try {
// //     if (!file) {
// //       console.log("No file provided");
// //       return null;
// //     }

// //     let uploadResult;

// //     // Handle buffer (from memory storage)
// //     if (isBuffer || Buffer.isBuffer(file)) {
// //       console.log("Uploading from buffer");

// //       // Convert buffer to base64
// //       const base64String = file.toString("base64");
// //       const dataUri = `data:image/jpeg;base64,${base64String}`;

// //       uploadResult = await cloudinary.uploader.upload(dataUri, {
// //         resource_type: "auto",
// //         folder: "user_avatars",
// //       });
// //     }
// //     // Handle file path (from disk storage)
// //     else if (typeof file === "string") {
// //       console.log("Uploading from file path:", file);

// //       // Check if file exists
// //       if (!fs.existsSync(file)) {
// //         console.log("File does not exist at path:", file);
// //         return null;
// //       }

// //       uploadResult = await cloudinary.uploader.upload(file, {
// //         resource_type: "auto",
// //         folder: "user_avatars",
// //       });

// //       // Delete local file after upload
// //       if (fs.existsSync(file)) {
// //         fs.unlinkSync(file);
// //       }
// //     } else {
// //       console.log("Invalid file format");
// //       return null;
// //     }

// //     console.log("Upload successful:", uploadResult.secure_url);
// //     return uploadResult.secure_url;
// //   } catch (error) {
// //     console.error("Cloudinary upload error:", error);
// //     return null;
// //   }
// // };

// // export default uploadOnCloudinary;

// import multer from "multer";

// // Use memory storage instead of disk storage for Cloudinary
// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
//   fileFilter: (req, file, cb) => {
//     // Allow both images AND videos
//     if (
//       file.mimetype.startsWith("image/") ||
//       file.mimetype.startsWith("video/")
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only images and videos are allowed"), false);
//     }
//   },
// });

// export default upload;

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (
  file,
  isBuffer = false,
  fileMimetype = null,
) => {
  // Configure cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!file) {
      console.log("No file provided");
      return null;
    }

    let uploadResult;
    const mimetype =
      fileMimetype || (file.mimetype ? file.mimetype : "image/jpeg");
    const isVideo = mimetype.startsWith("video/");

    // Handle buffer (from memory storage)
    if (isBuffer || Buffer.isBuffer(file)) {
      console.log("Uploading from buffer. Type:", isVideo ? "Video" : "Image");

      // Convert buffer to base64 with correct MIME type
      const base64String = file.toString("base64");
      const dataUri = `data:${mimetype};base64,${base64String}`;

      uploadResult = await cloudinary.uploader.upload(dataUri, {
        resource_type: isVideo ? "video" : "auto",
        folder: isVideo ? "course_videos" : "user_avatars",
      });
    }
    // Handle file path (from disk storage)
    else if (typeof file === "string") {
      console.log("Uploading from file path:", file);

      // Check if file exists
      if (!fs.existsSync(file)) {
        console.log("File does not exist at path:", file);
        return null;
      }

      uploadResult = await cloudinary.uploader.upload(file, {
        resource_type: isVideo ? "video" : "auto",
        folder: isVideo ? "course_videos" : "user_avatars",
      });

      // Delete local file after upload
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } else {
      console.log("Invalid file format");
      return null;
    }

    console.log("Upload successful:", uploadResult.secure_url);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export default uploadOnCloudinary;
