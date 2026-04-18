// import { useState } from "react";
// import { FaArrowLeft } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { serverUrl } from "../App";
// import axios from "axios";
// import { setUserData } from "../redux/userSlice";
// import { toast } from "react-toastify";
// import { ClipLoader } from "react-spinners";

// const EditProfile = () => {
//   const navigate = useNavigate();
//   const { userData } = useSelector((state) => state.user);
//   const [name, setName] = useState(userData.name || "");
//   const [description, setDescription] = useState(userData.description || "");
//   const [photoUrl, setPhotoUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();

//   const formData = new FormData();
//   formData.append("name", name);
//   formData.append("description", description);
//   formData.append("photoUrl", photoUrl);

//   const handleEditProfile = async () => {
//     setLoading(true);
//     try {
//       const result = await axios.post(
//         serverUrl + "/api/user/profile",
//         formData,
//         { withCredentials: true }
//       );
//       dispatch(setUserData(result.data));
//       setLoading(false);
//       navigate("/");
//       toast.success("Profile Updated");
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//       toast.error(error.response.data.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
//       <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full relative">
//         <FaArrowLeft
//           className="absolute top-[5%] left-[5%] w-[22px] h-[22px] cursor-pointer"
//           onClick={() => navigate("/profile")}
//         />
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           Edit Profile
//         </h2>

//         <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
//           <div className="flex flex-col items-center text-center">
//             {userData?.photoUrl ? (
//               <img
//                 src={userData?.photoUrl}
//                 alt=""
//                 className="w-24 h-24 rounded-full object-cover border-4 border-black"
//               />
//             ) : (
//               <div className="w-24 h-24 rounded-full flex items-center justify-center text-[30px] border-2 bg-black border-white text-white">
//                 {userData?.name?.slice(0, 1)?.toUpperCase()}
//               </div>
//             )}
//           </div>

//           <div className="">
//             <label
//               htmlFor="image"
//               className="text-sm font-medium text-gray-700"
//             >
//               Select Avatar
//             </label>
//             <input
//               type="file"
//               name="photoUrl"
//               placeholder="PhotoUrl"
//               id="image"
//               accept="image/*"
//               className="w-full px-4 py-2 border rounded-md text-sm"
//               onChange={(e) => setPhotoUrl(e.target.files[0])}
//             />
//           </div>
//           <div className="">
//             <label htmlFor="name" className="text-sm font-medium text-gray-700">
//               Username
//             </label>
//             <input
//               type="text"
//               placeholder={userData.name}
//               id="name"
//               className="w-full px-4 py-2 border rounded-md text-sm"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>
//           <div className="">
//             <label className="text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               placeholder={userData.email}
//               id="email"
//               readOnly
//               className="w-full px-4 py-2 border rounded-md text-sm"
//             />
//           </div>
//           <div className="">
//             <label className="text-sm font-medium text-gray-700">
//               Bio(Description)
//             </label>
//             <textarea
//               placeholder="Tell Us About Yourself"
//               id="email"
//               name="description"
//               rows={3}
//               className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-[black]"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>
//           <button
//             className="w-full bg-[black] active:bg-[#454545] text-white py-2 rounded-md font-medium transition cursor-pointer"
//             onClick={handleEditProfile}
//             disabled={loading}
//           >
//             {loading ? <ClipLoader size={30} color="white" /> : "Save Changes"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const EditProfile = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [name, setName] = useState(userData.name || "");
  const [description, setDescription] = useState(userData.description || "");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleEditProfile = async () => {
    // Validation
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setLoading(true);

    // Create FormData INSIDE the function, not outside
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    // Only append photo if a new one is selected
    if (photoUrl) {
      formData.append("photoUrl", photoUrl);
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/user/profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Important!
          },
        },
      );
      dispatch(setUserData(result.data));
      toast.success("Profile Updated Successfully");
      navigate("/profile");
    } catch (error) {
      console.log("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full relative">
        <FaArrowLeft
          className="absolute top-[5%] left-[5%] w-[22px] h-[22px] cursor-pointer"
          onClick={() => navigate("/profile")}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Profile
        </h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col items-center text-center">
            {photoUrl ? (
              <img
                src={URL.createObjectURL(photoUrl)}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-black"
              />
            ) : userData?.photoUrl ? (
              <img
                src={userData?.photoUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-black"
              />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-[30px] border-2 bg-black border-white text-white">
                {userData?.name?.slice(0, 1)?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="">
            <label
              htmlFor="image"
              className="text-sm font-medium text-gray-700"
            >
              Select Avatar
            </label>
            <input
              type="file"
              name="photoUrl"
              placeholder="PhotoUrl"
              id="image"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-md text-sm"
              onChange={(e) => setPhotoUrl(e.target.files[0])}
            />
            {photoUrl && (
              <p className="text-xs text-green-600 mt-1">
                New image selected: {photoUrl.name}
              </p>
            )}
          </div>

          <div className="">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder={userData.name}
              id="name"
              className="w-full px-4 py-2 border rounded-md text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder={userData.email}
              id="email"
              readOnly
              className="w-full px-4 py-2 border rounded-md text-sm bg-gray-50"
            />
          </div>

          <div className="">
            <label className="text-sm font-medium text-gray-700">
              Bio (Description)
            </label>
            <textarea
              placeholder="Tell Us About Yourself"
              name="description"
              rows={3}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-[black]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-[black] active:bg-[#454545] text-white py-2 rounded-md font-medium transition cursor-pointer disabled:opacity-50"
            onClick={handleEditProfile}
            disabled={loading}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
