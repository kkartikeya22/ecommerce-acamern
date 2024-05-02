import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeartIcon from './HeartIcon';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Product = ({ product }) => {
    const dispatch = useDispatch();

    // Function to handle adding product to cart
    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, qty: 1 }));
        toast.success('Item added successfully', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
        });
    };

    // Function to render star rating
    const renderStarRating = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const stars = [];
        const starSize = 14;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} size={starSize} className="text-yellow-400" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key={fullStars} size={starSize} className="text-yellow-400" />);
        }

        for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
            stars.push(<FaRegStar key={i} size={starSize} className="text-yellow-400" />);
        }

        return stars;
    };

    return (
        <div className="w-[30rem] mx-4 my-2 p-3 bg-[#0D1F2D] rounded-lg shadow-lg transition-shadow hover:shadow-xl">
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full rounded-lg object-cover h-[15rem]"
                />
                <HeartIcon product={product} />
            </div>

            <div className="p-6">
                <Link to={`/product/${product._id}`}>
                    <h2 className="text-lg font-bold text-white text-center mb-2">
                        {product.name}
                    </h2>
                </Link>
                <div className="flex justify-between items-center mb-2">
                    <p className="text-md text-gray-400">{product.brand}</p>
                    <span className="bg-pink-100 text-pink-800 text-sm font-medium px-2 py-1 rounded-full dark:bg-pink-900 dark:text-pink-300">
                        {product.price.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </span>
                </div>
                <div className="flex mt-2">
                    {renderStarRating(product.rating)}
                </div>
                {/* Add to Cart Button */}
                <button
                    className="mt-4 px-4 py-2 bg-pink-700 text-white rounded-lg hover:bg-pink-800"
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default Product;
