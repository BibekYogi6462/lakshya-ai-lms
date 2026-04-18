// import { useState } from "react";
// import logo from "../assets/formlogo.jpg";
// import google from "../assets/google.jpg";
// import { IoEyeOutline } from "react-icons/io5";
// import { IoEye } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// import { ClipLoader } from "react-spinners";
// import { serverUrl } from "../App";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { setUserData } from "../redux/userSlice";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "../../utils/firebase";
// import { FaArrowLeftLong } from "react-icons/fa6";

// const Login = () => {
//   const [show, setShow] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();

//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     setLoading(true);
//     try {
//       const result = await axios.post(
//         serverUrl + "/api/auth/login",
//         {
//           email,
//           password,
//         },
//         { withCredentials: true }
//       );
//       dispatch(setUserData(result.data));
//       setLoading(false);

//       toast.success("Login Successfully");
//       navigate("/");
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//       toast.error(error.response.data.message);
//     }
//   };

//   const googleLogin = async () => {
//     try {
//       const response = await signInWithPopup(auth, provider);
//       let user = response.user;
//       let name = user.displayName;
//       let email = user.email;
//       let role = "";

//       const result = await axios.post(
//         serverUrl + "/api/auth/googleauth",
//         { name, email, role },
//         { withCredentials: true }
//       );
//       dispatch(setUserData(result.data));
//       navigate("/");
//       toast.success("Account Logged In Successfully");
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center ">
//       <form
//         action=""
//         className="w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex"
//         onSubmit={(e) => e.preventDefault()}
//       >
//         <FaArrowLeftLong
//           className=" absolute top-[16%] left-[5%] w-[22px] h-[22px] cursor-pointer"
//           onClick={() => navigate("/")}
//         />
//         {/* //left div */}
//         <div className="md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3">
//           <div>
//             <h1 className="font-semibold text-black text-2xl ">Welcome Back</h1>
//             <h2 className="text-[#999797] text-[18px]">
//               Login to your Account
//             </h2>
//           </div>

//           <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
//             <label htmlFor="email" className="font-semibold">
//               Email:
//             </label>
//             <input
//               className="border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
//               type="email"
//               name=""
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
//               className="border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
//               type={show ? "text" : "password"}
//               name=""
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

//           <button
//             className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px] "
//             onClick={handleLogin}
//             disabled={loading}
//           >
//             {loading ? <ClipLoader size={30} color="white" /> : "Log In"}
//           </button>

//           <span
//             className="text-[13px] cursor-pointer text-[#585757]"
//             onClick={() => navigate("/forget")}
//           >
//             Forgot Password?
//           </span>
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
//               onClick={googleLogin}
//             >
//               <img src={google} className="w-[25px]" alt="google" />
//               <span className="text-[18px] ml-1">oogle</span>
//             </div>
//             <div className="text-[#6f6f6f]">
//               Create new account ?
//               <span
//                 className="underline underline-offset-1 text-[black] "
//                 onClick={() => navigate("/signup")}
//               >
//                 Sign Up
//               </span>
//             </div>
//           </div>

//           <div className="w-[25%] h-[0.5px]"></div>
//         </div>

//         {/* Right div  */}
//         <div className="w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden">
//           <img src={logo} alt="logo" className="w-60 shadow-2xl" />
//           <span className="text-2xl text-white mt-2">
//             Dream it, learn it, achieve it
//           </span>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import logo from "../assets/formlogo.jpg";
// import google from "../assets/google.jpg";
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "../../utils/firebase";
import { FaArrowLeftLong } from "react-icons/fa6";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      setLoading(false);

      toast.success("Login Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // const googleLogin = async () => {
  //   try {
  //     const response = await signInWithPopup(auth, provider);
  //     let user = response.user;
  //     let name = user.displayName;
  //     let email = user.email;
  //     let role = "";

  //     const result = await axios.post(
  //       serverUrl + "/api/auth/googleauth",
  //       { name, email, role },
  //       { withCredentials: true }
  //     );
  //     dispatch(setUserData(result.data));
  //     navigate("/");
  //     toast.success("Account Logged In Successfully");
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.response?.data?.message || "Signup failed");
  //   }
  // };

  return (
    <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center ">
      <form
        action=""
        className="w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex"
        onSubmit={(e) => e.preventDefault()}
      >
        <FaArrowLeftLong
          className=" absolute top-[16%] left-[5%] w-[22px] h-[22px] cursor-pointer"
          onClick={() => navigate("/")}
        />
        {/* //left div */}
        <div className="md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3">
          <div>
            <h1 className="font-semibold text-black text-2xl ">Welcome Back</h1>
            <h2 className="text-[#999797] text-[18px]">
              Login to your Account
            </h2>
          </div>

          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              className="border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
              type="email"
              name=""
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
              className="border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
              type={show ? "text" : "password"}
              name=""
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

          <button
            className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px] "
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Log In"}
          </button>

          <span
            className="text-[13px] cursor-pointer text-[#585757]"
            onClick={() => navigate("/forget")}
          >
            Forgot Password?
          </span>
          <div className="w-[80%] flex flex-col items-center gap-2">
            <div className="flex w-full items-center justify-center gap-2">
              <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
              <div className="text-[15px] text-[#6f6f6f] flex items-center justify-center">
                Or Continue
              </div>
              <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
            </div>

            {/* Google Login Button - Commented Out
            <div
              className="w-[80%] h-[40px] border border-black rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-[#f7f7f7] transition"
              onClick={googleLogin}
            >
              <img src={google} className="w-[25px]" alt="google" />
              <span className="text-[18px] ml-1">oogle</span>
            </div>
            */}

            <div className="text-[#6f6f6f]">
              Create new account ?
              <span
                className="underline underline-offset-1 text-[black] "
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </div>
          </div>

          <div className="w-[25%] h-[0.5px]"></div>
        </div>

        {/* Right div  */}
        <div className="w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden">
          <img src={logo} alt="logo" className="w-60 shadow-2xl" />
          <span className="text-2xl text-white mt-2">
            Dream it, learn it, achieve it
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
