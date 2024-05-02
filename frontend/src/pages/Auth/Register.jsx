import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
    const [username, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
        } else {
            try {
                const res = await register({ username, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate(redirect);
                toast.success("User successfully registered");
            } catch (err) {
                console.log(err);
                toast.error(err.data.message);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-1000 text-white">
            <section className="bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col md:flex-row w-full md:w-4/5 lg:w-3/5 xl:w-1/2">
                {/* Left Side */}
                <div className="flex-1 pr-8">
                    <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

                    <form onSubmit={submitHandler}>
                        {/* Name Input */}
                        <div className="mb-6">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium mb-1"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Enter name"
                                value={username}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* Email Input */}
                        <div className="mb-6">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-1"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-1"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div className="mb-6">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium mb-1"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-pink-500 text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? "Registering..." : "Register"}
                        </button>

                        {isLoading && <Loader className="mt-4" />}
                    </form>

                    {/* Already have an account? */}
                    <div className="mt-4 text-center">
                        <p>
                            Already have an account?{" "}
                            <Link
                                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                                className="text-pink-500 hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="hidden md:flex flex-1 items-center justify-center relative">
                    {/* Add an overlay to the image */}
                    <div className="absolute inset-0 bg-gray-900 opacity-50 rounded-lg" />

                    {/* Image */}
                    <img
                        src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
                        alt="Register Illustration"
                        className="rounded-lg object-cover h-full w-full transition-transform duration-300 transform hover:scale-105 z-10"
                    />
                </div>
            </section>
        </div>
    );
};

export default Register;
