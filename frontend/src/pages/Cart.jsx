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
            Go To Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row justify-between">
          {/* Cart items list */}
          <div className="flex-1 mb-8 lg:mb-0 lg:pr-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center mb-6">
                {/* Product image */}
                <div className="w-20 h-20">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Product info */}
                <div className="flex-1 ml-6">
                  <Link to={`/product/${item._id}`} className="text-pink-500 hover:underline">
                    {item.name}
                  </Link>
                  <div className="text-white mt-2">{item.brand}</div>
                  <div className="text-white font-bold mt-2">${item.price}</div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center ml-4">
                  <select
                    className="bg-gray-700 text-white p-2 rounded-md"
                    value={item.qty}
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
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
                  className="ml-4 text-red-500 hover:text-red-600"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Cart summary */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full lg:w-1/3">
            <h2 className="text-xl font-bold text-white mb-4">Summary</h2>
            <div className="text-lg text-white mb-4">
              Items: {cartItems.reduce((acc, item) => acc + item.qty, 0)}
            </div>
            <div className="text-2xl font-bold text-white">
              Total: $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </div>

            <button
              className="bg-pink-500 text-white w-full py-2 mt-6 rounded-lg hover:bg-pink-600"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
