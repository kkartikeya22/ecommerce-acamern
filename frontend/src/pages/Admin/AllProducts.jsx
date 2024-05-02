import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading products
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row">
          {/* Product Section */}
          <div className="w-full md:w-3/4 p-4">
            <div className="text-xl font-bold mb-6">All Products ({products.length})</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/product/update/${product._id}`}
                  className="flex flex-col bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-lg font-semibold">{product?.name}</h5>
                      <p className="text-gray-400 text-xs">{moment(product.createdAt).format("MMMM Do YYYY")}</p>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      {product?.description?.substring(0, 160)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="bg-pink-700 text-white px-3 py-2 rounded-lg hover:bg-pink-800 transition-colors duration-300"
                      >
                        Update
                      </Link>
                      <p className="text-lg font-bold">$ {product?.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Admin Menu Section */}
          <div className="md:w-1/4 p-4">
            <AdminMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
