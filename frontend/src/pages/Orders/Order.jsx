import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      await payOrder({ orderId, details });
      refetch();
      toast.success("Order is paid");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: order.totalPrice } }],
    }).then((orderID) => orderID);
  };

  const onError = (err) => {
    toast.error(err.message);
  };

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error.data.message}</Message>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Items */}
        <div className="lg:w-2/3 space-y-8">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <table className="w-full table-auto text-left text-gray-200">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2 text-center">Unit Price</th>
                    <th className="p-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-600">
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product}`} className="text-pink-500 hover:underline">
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">${item.price.toFixed(2)}</td>
                      <td className="p-2 text-center">${(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Shipping Details and Order Summary */}
        <div className="lg:w-1/3 space-y-8">
          {/* Shipping Details */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Shipping Details</h2>
            <div className="text-gray-200 space-y-2">
              <p>
                <strong className="text-pink-500">Order ID:</strong> {order._id}
              </p>
              <p>
                <strong className="text-pink-500">Name:</strong> {order.user.username}
              </p>
              <p>
                <strong className="text-pink-500">Email:</strong> {order.user.email}
              </p>
              <p>
                <strong className="text-pink-500">Address:</strong> 
                <span> {order.shippingAddress.address}</span>
                <span>, {order.shippingAddress.city}</span>
                <span>, {order.shippingAddress.postalCode}</span>
                <span>, {order.shippingAddress.country}</span>
              </p>
              <p>
                <strong className="text-pink-500">Payment Method:</strong> {order.paymentMethod}
              </p>
            </div>
            <div className="mt-4">
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-200 mb-2">
              <span>Items:</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-200 mb-2">
              <span>Shipping:</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-200 mb-2">
              <span>Tax:</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-200 font-bold">
              <span>Total:</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>

            {!order.isPaid && (
              <div className="mt-4">
                {loadingPay && <Loader />}
                {isPending ? (
                  <Loader />
                ) : (
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                )}
              </div>
            )}

            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                type="button"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 mt-4 rounded-lg"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
