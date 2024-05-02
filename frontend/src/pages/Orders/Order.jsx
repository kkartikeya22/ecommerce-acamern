import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
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
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
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
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

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
    return <Messsage variant="danger">{error.data.message}</Messsage>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row">
        {/* Order Items */}
        <div className="md:w-2/3 pr-4">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <Messsage>Order is empty</Messsage>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product}`} className="text-pink-500 hover:underline">
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
            )}
          </div>
        </div>

        {/* Shipping Details and Order Summary */}
        <div className="md:w-1/3 md:pl-4">
          {/* Shipping Details */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
            <div className="mb-2">
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Name:</strong> {order.user.username}
              </p>
              <p>
                <strong>Email:</strong> {order.user.email}
              </p>
            </div>
            <div>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            </div>
            <div className="mt-4">
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Messsage variant="success">Paid on {order.paidAt}</Messsage>
              ) : (
                <Messsage variant="danger">Not Paid</Messsage>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Items</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
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
                className="bg-pink-500 text-white w-full py-2 mt-4 rounded"
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
