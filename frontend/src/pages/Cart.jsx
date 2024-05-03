import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container mx-auto mt-12 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-white">
          Your cart is empty.{" "}
          <Link to="/shop" className="text-pink-500 hover:underline">
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cart items list */}
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg shadow-md"
              >
                {/* Product image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product info */}
                <div className="flex-1">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-pink-500 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-white">{item.brand}</p>
                  <p className="font-semibold text-white">
                    {item.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center">
                  <select
                    className="bg-gray-600 text-white p-2 rounded-md"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remove item button */}
                <button
                  className="ml-4 text-red-500 hover:text-red-700"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Cart summary */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Summary</h2>
            <p className="text-white mb-4">
              Items: {cartItems.reduce((acc, item) => acc + item.qty, 0)}
            </p>
            <p className="text-white font-bold text-2xl mb-4">
              Total: {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
                .toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
            </p>
            <button
              className="w-full py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-300"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
