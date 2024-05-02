import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="container mx-auto p-6">
          <div className="flex flex-col md:flex-row justify-center">
            {/* Admin Menu */}
            <div className="mb-6 md:mr-4">
              <AdminMenu />
            </div>

            {/* Order List Table */}
            <div className="w-full md:w-3/4 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Order List</h2>
              <table className="w-full bg-gray-700 rounded-lg">
                <thead className="bg-gray-600 rounded-t-lg">
                  <tr>
                    <th className="py-2 pl-2 text-left">ITEMS</th>
                    <th className="py-2 pl-2 text-left">ID</th>
                    <th className="py-2 pl-2 text-left">USER</th>
                    <th className="py-2 pl-2 text-left">DATE</th>
                    <th className="py-2 pl-2 text-left">TOTAL</th>
                    <th className="py-2 pl-2 text-left">PAID</th>
                    <th className="py-2 pl-2 text-left">DELIVERED</th>
                    <th className="py-2 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-600 hover:bg-gray-600 transition-colors duration-300 cursor-pointer"
                      onClick={() => window.location.href = `/order/${order._id}`}
                    >
                      <td className="py-3 pl-2">
                        <img
                          src={order.orderItems[0].image}
                          alt={order.orderItems[0].name}
                          className="w-14 h-14 object-cover rounded-full"
                        />
                      </td>
                      <td className="py-3 pl-2">{order._id}</td>
                      <td className="py-3 pl-2">{order.user ? order.user.username : "N/A"}</td>
                      <td className="py-3 pl-2">{order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}</td>
                      <td className="py-3 pl-2">$ {order.totalPrice}</td>
                      <td className="py-3 pl-2">
                        <p
                          className={`p-1 text-center w-24 rounded-lg font-semibold ${
                            order.isPaid ? "bg-green-400 text-black" : "bg-red-500 text-white"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Pending"}
                        </p>
                      </td>
                      <td className="py-3 pl-2">
                        <p
                          className={`p-1 text-center w-24 rounded-lg font-semibold ${
                            order.isDelivered ? "bg-green-400 text-black" : "bg-red-500 text-white"
                          }`}
                        >
                          {order.isDelivered ? "Delivered" : "Pending"}
                        </p>
                      </td>
                      <td className="py-3 text-center">
                        <Link to={`/order/${order._id}`}>
                          <button
                            className="bg-pink-600 text-white py-1 px-2 rounded-lg hover:bg-pink-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                          >
                            More
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderList;
