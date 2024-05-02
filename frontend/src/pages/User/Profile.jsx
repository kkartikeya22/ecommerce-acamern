import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo]);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full md:w-1/2 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          Update Profile
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-pink-500 text-white py-2 px-6 rounded-md hover:bg-pink-600 transition duration-200 ease-in-out"
            >
              Update
            </button>

            <Link
              to="/user-orders"
              className="bg-pink-600 text-white py-2 px-6 rounded-md hover:bg-pink-700 transition duration-200 ease-in-out"
            >
              My Orders
            </Link>
          </div>

          {loadingUpdateProfile && (
            <div className="mt-4">
              <Loader />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
