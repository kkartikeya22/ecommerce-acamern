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

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

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
      <ProgressSteps step1 step2 step3 step4 />

      <div className="container mx-auto mt-8 px-4">
        {/* Display message if the cart is empty */}
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Image</th>
                  <th className="p-2">Product</th>
                  <th className="p-2 text-center">Quantity</th>
                  <th className="p-2 text-center">Price</th>
                  <th className="p-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-2">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-pink-500 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-2 text-center">{item.qty}</td>
                    <td className="p-2 text-center">${item.price.toFixed(2)}</td>
                    <td className="p-2 text-center">
                      ${(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Summary Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <ul className="mb-4 text-lg space-y-2">
              <li>
                <span className="font-semibold">Items:</span> ${cart.itemsPrice.toFixed(2)}
              </li>
              <li>
                <span className="font-semibold">Shipping:</span> ${cart.shippingPrice.toFixed(2)}
              </li>
              <li>
                <span className="font-semibold">Tax:</span> ${cart.taxPrice.toFixed(2)}
              </li>
              <li>
                <span className="font-semibold">Total:</span> ${cart.totalPrice.toFixed(2)}
              </li>
            </ul>
            {/* Display shipping address */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
              <p>
                <strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </div>
            {/* Display payment method */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
              <p><strong>Method:</strong> {cart.paymentMethod}</p>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="mt-6">
            <button
              type="button"
              className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg text-lg font-semibold transition-colors hover:bg-pink-600 disabled:opacity-50"
              disabled={cart.cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              Place Order
            </button>

            {isLoading && <Loader />}
          </div>

          {/* Display error message if any */}
          {error && <Message variant="danger">{error.data.message}</Message>}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
