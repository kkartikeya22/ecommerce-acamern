// Import necessary dependencies
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 mt-4">
            <h1 className="text-2xl font-bold text-center text-white mb-6">Order Summary</h1>
            <table className="w-full bg-gray-900 rounded-lg overflow-hidden border-separate">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700 text-white hover:bg-gray-700 transition duration-200">
                    <td className="py-2 px-4">
                      <Link to={`/product/${item.product}`} className="text-blue-500 hover:text-blue-400 transition duration-200">
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4">{item.qty}</td>
                    <td className="py-2 px-4">${Number(item.price).toFixed(2)}</td>
                    <td className="py-2 px-4">${Number(item.qty * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-5">Summary Details</h2>
          <div className="flex justify-between flex-wrap p-8 bg-gray-900 rounded-lg shadow-lg">
            <ul className="text-lg text-white">
              <li>
                <span className="font-semibold">Items:</span> $ {Number(cart.itemsPrice).toFixed(2)}
              </li>
              <li>
                <span className="font-semibold">Shipping:</span> $ {Number(cart.shippingPrice).toFixed(2)}
              </li>
              <li>
                <span className="font-semibold">Tax:</span> $ {Number(cart.taxPrice).toFixed(2)}
              </li>
              <li>
                <span className="font-semibold">Total:</span> $ {Number(cart.totalPrice).toFixed(2)}
              </li>
            </ul>

            {error && <Message variant="danger">{error.data.message}</Message>}

            <div className="text-white">
              <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
              <p>
                <strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </div>

            <div className="text-white">
              <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
              <strong>Method:</strong> {cart.paymentMethod}
            </div>
          </div>

          <button
            type="button"
            className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg text-lg w-full mt-4"
            disabled={cart.cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
