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
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row">
                {/* Product Section */}
                <div className="w-full md:w-3/4 p-4">
                    <div className="text-xl font-bold mb-6">All Products ({products.length})</div>

                    {/* Product Listing */}
                    <div className="space-y-6"> {/* Use space-y-6 for vertical spacing */}
                        {products.map((product) => (
                            <Link
                                key={product._id}
                                to={`/admin/product/update/${product._id}`}
                                className="flex items-center bg-gray-800 text-white rounded-lg shadow-lg p-4 hover:bg-gray-700 transition-colors duration-300"
                            >
                                {/* Product Image */}
                                <div className="w-1/3 rounded-lg overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 ml-4">
                                    <div className="text-lg font-semibold mb-2">{product.name}</div>
                                    <div className="text-gray-400 mb-2">
                                        Created: {moment(product.createdAt).format("MMM D, YYYY")}
                                    </div>
                                    <div className="text-gray-400 mb-2">
                                        {product.description?.substring(0, 100)}...
                                    </div>

                                    {/* Product Actions */}
                                    <div className="flex justify-between items-center">
                                        <Link
                                            to={`/admin/product/update/${product._id}`}
                                            className="bg-pink-500 text-white px-3 py-2 rounded-lg hover:bg-pink-600"
                                        >
                                            Update
                                        </Link>
                                        <div className="text-xl font-bold">${product.price}</div>
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
    );
};

export default AllProducts;
