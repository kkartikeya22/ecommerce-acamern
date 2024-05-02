import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto mt-12 p-6">
      <h2 className="text-3xl font-semibold text-white mb-6">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.error || error.error}
        </Message>
      ) : (
        <table className="w-full bg-gray-800 rounded-lg shadow-lg">
          <thead className="text-white bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Total Price</th>
              <th className="py-3 px-4 text-left">Payment Status</th>
              <th className="py-3 px-4 text-left">Delivery Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-gray-700">
                <td className="py-4 px-4">
                  <img
                    src={order.orderItems[0].image}
                    alt={order.user}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="py-4 px-4 text-white">{order._id}</td>
                <td className="py-4 px-4 text-white">
                  {order.createdAt.substring(0, 10)}
                </td>
                <td className="py-4 px-4 text-white">${order.totalPrice}</td>
                <td className="py-4 px-4">
                  {order.isPaid ? (
                    <span className="text-green-500 font-semibold">
                      Paid
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Pending
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {order.isDelivered ? (
                    <span className="text-green-500 font-semibold">
                      Delivered
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Pending
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <Link to={`/order/${order._id}`}>
                    <button className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrder;
