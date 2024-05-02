import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart, FaUser } from "react-icons/fa";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const location = useLocation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // Function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`fixed h-full bg-black pt-10 pb-10 z-50 transition-all duration-500 ease-in-out ${dropdownOpen ? "w-1/6" : "w-18"
        }`} id="navigation-container"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
      style={{ opacity: 1 }}
    >
      <div className="flex bg-dark-1000 flex-col justify-between h-full p-4">
        {/* Navigation Links */}
        <div className="flex flex-col items-center bg-black-1000 space-y-6">
          {/* Home Link */}
          <Link
            to="/"
            className={`flex items-center justify-center hover:text-pink-500 transition-colors duration-200 ${isActive("/") ? "text-pink-500" : ""}`}
          >
            <AiOutlineHome size={24} className="mr-2" />
            {dropdownOpen && <span className="text-sm">HOME</span>}
          </Link>

          {/* Shop Link */}
          <Link
            to="/shop"
            className={`flex items-center justify-center hover:text-pink-500 transition-colors duration-200 ${isActive("/shop") ? "text-pink-500" : ""}`}
          >
            <AiOutlineShopping size={24} className="mr-2" />
            {dropdownOpen && <span className="text-sm">SHOP</span>}
          </Link>

          {/* Cart Link */}
          <Link
            to="/cart"
            className={`flex items-center justify-center relative hover:text-pink-500 transition-colors duration-200 ${isActive("/cart") ? "text-pink-500" : ""}`}
          >
            <AiOutlineShoppingCart size={24} className="mr-2" />
            {dropdownOpen && <span className="text-sm">CART</span>}
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full text-xs px-2">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          {/* Favorites Link */}
          <Link
            to="/favorite"
            className={`flex items-center justify-center relative hover:text-pink-500 transition-colors duration-200 ${isActive("/favorite") ? "text-pink-500" : ""}`}
          >
            <FaHeart size={24} className="mr-2" />
            {dropdownOpen && <span className="text-sm">FAVORITES</span>}
            {/* Absolute positioned div for FavoritesCount */}
            <div
              className="absolute top-[-42px] left-1 bg-pink-500 text-white rounded-full text-xs px-2"
              style={{ transform: 'translate(50%, 0%)' }}
            >
              <FavoritesCount />
            </div>
          </Link>

        </div>

        {/* User Menu */}
        <div className="flex flex-col items-center">
          {/* User Icon and Dropdown Button */}
          {userInfo && (
            <div className="relative flex items-center justify-center">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center justify-center ${isActive("/profile") ? "text-pink-500" : ""}`}
              >
                <FaUser size={24} className="mr-2" />
                {dropdownOpen && (
                  <span className="text-sm">{userInfo.username}</span>
                )}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <ul
                  className="absolute bottom-14 w-40 bg-gray-800 rounded shadow-lg z-10"
                  style={{ marginBottom: "2px" }}
                >
                  {userInfo.isAdmin && (
                    <>
                      <li>
                        <Link
                          to="/admin/dashboard"
                          className={`block px-4 py-2 hover:bg-gray-500 text-center ${isActive("/admin/dashboard") ? "bg-pink-500" : ""}`}
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/productlist"
                          className={`block px-4 py-2 hover:bg-gray-500 text-center ${isActive("/admin/productlist") ? "bg-pink-500" : ""}`}
                        >
                          Products
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/categorylist"
                          className={`block px-4 py-2 hover:bg-gray-500 text-center ${isActive("/admin/categorylist") ? "bg-pink-500" : ""}`}
                        >
                          Category
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/orderlist"
                          className={`block px-4 py-2 hover:bg-gray-500 text-center ${isActive("/admin/orderlist") ? "bg-pink-500" : ""}`}
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/userlist"
                          className={`block px-4 py-2 hover:bg-gray-500 text-center ${isActive("/admin/userlist") ? "bg-pink-500" : ""}`}
                        >
                          Users
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 hover:bg-gray-500 text-center ${isActive("/profile") ? "bg-pink-500" : ""}`}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logoutHandler}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-500 text-center"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* Guest Menu */}
          {!userInfo && (
            <ul className="space-y-4">
              <li>
                <Link
                  to="/login"
                  className={`flex items-center justify-center hover:text-pink-500 transition-colors duration-200 ${isActive("/login") ? "text-pink-500" : ""}`}
                >
                  <AiOutlineLogin size={24} className="mr-2" />
                  {dropdownOpen && <span className="text-sm">LOGIN</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={`flex items-center justify-center hover:text-pink-500 transition-colors duration-200 ${isActive("/register") ? "text-pink-500" : ""}`}
                >
                  <AiOutlineUserAdd size={24} className="mr-2" />
                  {dropdownOpen && <span className="text-sm">REGISTER</span>}
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
