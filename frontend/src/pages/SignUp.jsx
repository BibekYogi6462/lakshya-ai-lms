// import React, { useState } from "react";
// import logo from "../assets/formlogo.jpg";
// import google from "../assets/google.jpg";
// import { IoEyeOutline } from "react-icons/io5";
// import { IoEye } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { serverUrl } from "../App";
// import { toast } from "react-toastify";
// import { ClipLoader } from "react-spinners";
// import { useDispatch } from "react-redux";
// import { setUserData } from "../redux/userSlice";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "../../utils/firebase";

// const SignUp = () => {
//   const [show, setShow] = useState(false);
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("student");
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();

//   const handleSignup = async () => {
//     setLoading(true);
//     try {
//       const result = await axios.post(
//         serverUrl + "/api/auth/signup",
//         {
//           name,
//           password,
//           email,
//           role,
//         },
//         { withCredentials: true }
//       );
//       dispatch(setUserData(result.data));
//       setLoading(false);
//       navigate("/");
//       toast.success("Account Signed Up Successfully");
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response?.data?.message || "Signup failed");
//     }
//   };

//   const googleSignUp = async () => {
//     try {
//       const response = await signInWithPopup(auth, provider);
//       let user = response.user;
//       let name = user.displayName;
//       let email = user.email;

//       const result = await axios.post(
//         serverUrl + "/api/auth/googleauth",
//         { name, email, role },
//         { withCredentials: true }
//       );
//       dispatch(setUserData(result.data));
//       navigate("/");
//       toast.success("Account Signed Up Successfully");
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center">
//       <form
//         action=""
//         className="w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex"
//         onSubmit={(e) => e.preventDefault()}
//       >
//         {/* //left div */}
//         <div className="md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3">
//           <div>
//             <h1 className="font-semibold text-black text-2xl ">
//               Let's Get Started
//             </h1>
//             <h2 className="text-[#999797] text-[18px]">Create Your Account</h2>
//           </div>

//           <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
//             <label htmlFor="name" className="font-semibold">
//               Name:
//             </label>
//             <input
//               className="border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
//               type="text"
//               id="name"
//               placeholder="Enter your name"
//               onChange={(e) => setName(e.target.value)}
//               value={name}
//             />
//           </div>

//           <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
//             <label htmlFor="email" className="font-semibold">
//               Email:
//             </label>
//             <input
//               className="border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
//               type="email"
//               id="email"
//               placeholder="Enter your email"
//               onChange={(e) => setEmail(e.target.value)}
//               value={email}
//             />
//           </div>

//           <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative">
//             <label htmlFor="password" className="font-semibold">
//               Password:
//             </label>
//             <input
//               className="border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
//               type={show ? "text" : "password"}
//               id="password"
//               placeholder="Enter your password"
//               onChange={(e) => setPassword(e.target.value)}
//               value={password}
//             />
//             {show ? (
//               <IoEyeOutline
//                 className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]"
//                 onClick={() => setShow((prev) => !prev)}
//               />
//             ) : (
//               <IoEye
//                 className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]"
//                 onClick={() => setShow((prev) => !prev)}
//               />
//             )}
//           </div>

//           <div className="flex md:w-[50%] w-[70%] items-center justify-between">
//             <span
//               className={`px-[10px] py-[5px] border-[2px] rounded-xl cursor-pointer hover:border-black ${
//                 role === "student" ? "border-black" : "border-[#646464]"
//               }`}
//               onClick={() => setRole("student")}
//             >
//               Student
//             </span>
//             <span
//               className={`px-[10px] py-[5px] border-[2px] rounded-xl cursor-pointer hover:border-black ${
//                 role === "instructor" ? "border-black" : "border-[#646464]"
//               }`}
//               onClick={() => setRole("instructor")}
//             >
//               Instructor
//             </span>
//           </div>

//           <button
//             type="button"
//             onClick={handleSignup}
//             className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]"
//             disabled={loading}
//           >
//             {loading ? <ClipLoader size={30} color="white" /> : "Sign Up"}
//           </button>

//           <div className="w-[80%] flex flex-col items-center gap-2">
//             <div className="flex w-full items-center justify-center gap-2">
//               <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
//               <div className="text-[15px] text-[#6f6f6f] flex items-center justify-center">
//                 Or Continue
//               </div>
//               <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
//             </div>

//             <div
//               className="w-[80%] h-[40px] border border-black rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-[#f7f7f7] transition"
//               onClick={googleSignUp}
//             >
//               <img src={google} className="w-[25px]" alt="google" />
//               <span className="text-[18px] ml-1">oogle</span>
//             </div>

//             <div className="text-[#6f6f6f]">
//               Already have an account?{" "}
//               <span
//                 className="underline underline-offset-1 text-black cursor-pointer"
//                 onClick={() => navigate("/login")}
//               >
//                 Login
//               </span>
//             </div>
//           </div>

//           <div className="w-[25%] h-[0.5px]"></div>
//         </div>

//         {/* Right div */}
//         <div className="w-[50%] h-[100%] rounded-r-2xl bg-black md:flex items-center justify-center flex-col hidden">
//           <img src={logo} alt="logo" className="w-60 shadow-2xl" />
//           <span className="text-2xl text-white mt-2">
//             Dream it, learn it, achieve it
//           </span>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SignUp;

import React, { useState } from "react";
import logo from "../assets/formlogo.jpg";
// import google from "../assets/google.jpg";
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "../../utils/firebase";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        {
          name,
          password,
          email,
          role,
        },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      setLoading(false);
      navigate("/");
      toast.success("Account Signed Up Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  // const googleSignUp = async () => {
  //   try {
  //     const response = await signInWithPopup(auth, provider);
  //     let user = response.user;
  //     let name = user.displayName;
  //     let email = user.email;

  //     const result = await axios.post(
  //       serverUrl + "/api/auth/googleauth",
  //       { name, email, role },
  //       { withCredentials: true }
  //     );
  //     dispatch(setUserData(result.data));
  //     navigate("/");
  //     toast.success("Account Signed Up Successfully");
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.response?.data?.message || "Signup failed");
  //   }
  // };

  return (
    <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center">
      <form
        action=""
        className="w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* //left div */}
        <div className="md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3">
          <div>
            <h1 className="font-semibold text-black text-2xl ">
              Let's Get Started
            </h1>
            <h2 className="text-[#999797] text-[18px]">Create Your Account</h2>
          </div>

          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
            <label htmlFor="name" className="font-semibold">
              Name:
            </label>
            <input
              className="border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
              type="text"
              id="name"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              className="border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
              type="email"
              id="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative">
            <label htmlFor="password" className="font-semibold">
              Password:
            </label>
            <input
              className="border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
              type={show ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {show ? (
              <IoEyeOutline
                className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]"
                onClick={() => setShow((prev) => !prev)}
              />
            ) : (
              <IoEye
                className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
          </div>

          <div className="flex md:w-[50%] w-[70%] items-center justify-between">
            <span
              className={`px-[10px] py-[5px] border-[2px] rounded-xl cursor-pointer hover:border-black ${
                role === "student" ? "border-black" : "border-[#646464]"
              }`}
              onClick={() => setRole("student")}
            >
              Student
            </span>
            <span
              className={`px-[10px] py-[5px] border-[2px] rounded-xl cursor-pointer hover:border-black ${
                role === "instructor" ? "border-black" : "border-[#646464]"
              }`}
              onClick={() => setRole("instructor")}
            >
              Instructor
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignup}
            className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]"
            disabled={loading}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Sign Up"}
          </button>

          <div className="w-[80%] flex flex-col items-center gap-2">
            <div className="flex w-full items-center justify-center gap-2">
              <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
              <div className="text-[15px] text-[#6f6f6f] flex items-center justify-center">
                Or Continue
              </div>
              <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
            </div>

            {/* Google Sign Up Button - Commented Out
            <div
              className="w-[80%] h-[40px] border border-black rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-[#f7f7f7] transition"
              onClick={googleSignUp}
            >
              <img src={google} className="w-[25px]" alt="google" />
              <span className="text-[18px] ml-1">oogle</span>
            </div>
            */}

            <div className="text-[#6f6f6f]">
              Already have an account?{" "}
              <span
                className="underline underline-offset-1 text-black cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </div>
          </div>

          <div className="w-[25%] h-[0.5px]"></div>
        </div>

        {/* Right div */}
        <div className="w-[50%] h-[100%] rounded-r-2xl bg-black md:flex items-center justify-center flex-col hidden">
          <img src={logo} alt="logo" className="w-60 shadow-2xl" />
          <span className="text-2xl text-white mt-2">
            Dream it, learn it, achieve it
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
