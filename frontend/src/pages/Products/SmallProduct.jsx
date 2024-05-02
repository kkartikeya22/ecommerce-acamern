import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaShoppingCart } from "react-icons/fa"; // Import the shopping cart icon
import { toast } from "react-toastify"; // Import the toast function
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import { addToCart } from "../../redux/features/cart/cartSlice"; // Import the addToCart action

const SmallProduct = ({ product }) => {
    const dispatch = useDispatch();

    // Handler function for adding the product to the cart
    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, qty: 1 })); // Add product to cart with a quantity of 1

        // Show a toast notification for a successful addition to the cart
        toast.success("Item added to cart successfully!");
    };

    return (
        <div className="w-[18rem] h-[17.5rem] mx-[2rem] p-3 bg-gray-800 rounded-lg shadow-lg mb-4 flex flex-col justify-between items-center">
            {/* Product image and Heart icon */}
            <div className="relative h-[50%] w-full">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                />
                {/* Heart icon */}
                <div className="absolute top-2 right-2">
                    <HeartIcon product={product} />
                </div>
            </div>

            {/* Product information */}
            <div className="p-2 h-[50%] flex flex-col justify-center items-center w-full">
                {/* Product name */}
                <Link to={`/product/${product._id}`} className="block mb-1">
                    <h2 className="text-center text-sm font-bold text-white hover:underline">
                        {product.name}
                    </h2>
                </Link>

                {/* Ratings display */}
                <div className="mb-1">
                    <Ratings value={product.rating} />
                </div>

                {/* Brand and price */}
                <div className="flex justify-between items-center w-full">
                    <span className="text-xs text-gray-400">{product.brand}</span>
                    <span className="bg-pink-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        ${product.price}
                    </span>
                </div>

                {/* Add to cart button with circular icon */}
                <button
                    onClick={handleAddToCart}
                    className="mt-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                    <FaShoppingCart size={18} />
                </button>
            </div>
        </div>
    );
};

export default SmallProduct;
