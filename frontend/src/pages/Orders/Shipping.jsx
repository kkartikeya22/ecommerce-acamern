import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto mt-10 px-4 bg-gray-800 min-h-screen rounded-lg shadow-lg">
      <ProgressSteps step1 step2 />
      <div className="flex flex-col items-center justify-center mt-10">
        <form onSubmit={submitHandler} className="w-full md:w-1/2 p-6 bg-gray-700 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4 text-center text-white">Shipping</h1>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="postalCode">Postal Code</label>
            <input
              id="postalCode"
              type="text"
              className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Payment Method</label>
            <div className="flex items-center">
              <input
                id="paypal"
                type="radio"
                className="mr-2 text-pink-500"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === "PayPal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="paypal" className="text-gray-300">
                PayPal or Credit Card
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="bg-pink-500 text-white w-full py-3 rounded-lg text-lg font-medium transition-all hover:bg-pink-600 hover:shadow-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
