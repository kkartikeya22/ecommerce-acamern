import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu"; // Import AdminMenu component
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Add AdminMenu */}
      <AdminMenu />

      <div className="bg-gray-800 rounded-lg p-6 mt-4">
        <h1 className="text-2xl font-bold text-center text-white mb-6">User List</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <table className="w-full bg-gray-900 rounded-lg overflow-hidden border-separate">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-700 text-white">
                  <td className="py-2 px-4">{user._id}</td>
                  <td className="py-2 px-4">
                    {editableUserId === user._id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editableUserName}
                          onChange={(e) => setEditableUserName(e.target.value)}
                          className="w-full py-2 px-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition duration-200"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span>{user.username}</span>
                        <button
                          onClick={() => toggleEdit(user._id, user.username, user.email)}
                          className="ml-2 text-blue-500 hover:text-blue-400 transition duration-200"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editableUserId === user._id ? (
                      <div className="flex items-center">
                        <input
                          type="email"
                          value={editableUserEmail}
                          onChange={(e) => setEditableUserEmail(e.target.value)}
                          className="w-full py-2 px-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition duration-200"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <a
                          href={`mailto:${user.email}`}
                          className="text-blue-500 hover:text-blue-400 transition duration-200"
                        >
                          {user.email}
                        </a>
                        <button
                          onClick={() => toggleEdit(user._id, user.username, user.email)}
                          className="ml-2 text-blue-500 hover:text-blue-400 transition duration-200"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {!user.isAdmin && (
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition duration-200"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserList;
