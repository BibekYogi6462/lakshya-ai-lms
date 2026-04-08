import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("📧 Email Configuration Check:");
console.log("USER_EMAIL:", process.env.USER_EMAIL ? "✅ Set" : "❌ Missing");
console.log(
  "USER_PASSWORD:",
  process.env.USER_PASSWORD ? "✅ Set" : "❌ Missing",
);

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

// Test connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Transporter verification failed:", error);
  } else {
    console.log("✅ Server is ready to send emails");
  }
});

const sendMail = async (to, otp) => {
  try {
    console.log("📤 Preparing to send email to:", to);

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: to,
      subject: "Reset Your Password",
      text: `Your OTP for password reset is ${otp}`,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Your OTP is:</p>
        <h1 style="color: #4CAF50;">${otp}</h1>
        <p>Valid for 5 minutes</p>
      </div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully. Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw error;
  }
};

export default sendMail;
