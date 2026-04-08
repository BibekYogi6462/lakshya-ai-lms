import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
// import sendMail from "../config/sendMail.js";
import sendMail from "../config/sendMail.js";

//SignUp Controller
export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exist" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter valid Email" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password character count should be greater than 8" });
    }
    let hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days(ms)
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({
      message: `Signup Error ${error}`,
    });
  }
};

//Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).populate("enrolledCourses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days(ms)
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: `Login Error ${error}`,
    });
  }
};

export const logOut = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.status(200).json({ message: "Logged out Successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `Unable to Log out ${error}`,
    });
  }
};

// export const sendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({
//       email,
//     });
//     if (!user) {
//       return res.status(404).json({ message: "USer not found" });
//     }
//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     (user.resetOtp = otp),
//       (user.otpExpires = Date.now() + 5 * 60 * 1000),
//       (user.isOtpVerified = false);

//     await user.save();
//     await sendMail(email, otp);
//     return res.status(200).json({ message: "OTP Sent Successfully" });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Unable to send OTP ${error}`,
//     });
//   }
// };
// export const sendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;
//     console.log("Send OTP request received for email:", email);

//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log("User not found for email:", email);
//       return res.status(404).json({ message: "User not found" });
//     }

//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     console.log("Generated OTP:", otp);

//     user.resetOtp = otp;
//     user.otpExpires = Date.now() + 5 * 60 * 1000;
//     user.isOtpVerified = false;

//     await user.save();
//     console.log("User updated with OTP");

//     // Send email
//     console.log("Attempting to send email...");
//     await sendMail(email, otp);
//     console.log("Email sent successfully");

//     return res.status(200).json({ message: "OTP Sent Successfully" });
//   } catch (error) {
//     console.error("Send OTP Error:", error); // This will show the full error
//     return res.status(500).json({
//       message: `Unable to send OTP: ${error.message}`,
//     });
//   }
// };

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("1. Received email:", email);

    if (!email) {
      console.log("2. Email is missing");
      return res.status(400).json({ message: "Email is required" });
    }

    console.log("3. Looking for user with email:", email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log("4. User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("5. User found:", user._id);

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("6. Generated OTP:", otp);

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    console.log("7. Saving user with OTP...");
    await user.save();
    console.log("8. User saved successfully");

    console.log("9. Attempting to send email...");
    await sendMail(email, otp);
    console.log("10. Email sent successfully");

    return res.status(200).json({ message: "OTP Sent Successfully" });
  } catch (error) {
    console.error("❌ Send OTP Error:", error); // This will show the full error
    return res.status(500).json({
      message: `Unable to send OTP: ${error.message}`,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
      return res.status(404).json({ message: "Invalid OTP" });
    }
    ((user.isOtpVerified = true),
      (user.resetOtp = undefined),
      (user.otpExpires = undefined));

    await user.save();
    return res.status(200).json({ message: "OTP Verified Successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Unable to verify OTP" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(404).json({ message: "OTP verification is required" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    ((user.password = hashPassword), (user.isOtpVerified = false));

    await user.save();
    return res.status(200).json({ message: "Reset Password Successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Unable to reset password" });
  }
};

// google signup
// google signup
export const googleAuth = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    // If user doesn't exist, create new user
    if (!user) {
      user = await User.create({
        name,
        email,
        role,
      });
    }

    // Generate token and set cookie
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days(ms)
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log("Google Auth Error:", error);
    return res
      .status(500)
      .json({ message: `Google Auth Error: ${error.message}` });
  }
};
