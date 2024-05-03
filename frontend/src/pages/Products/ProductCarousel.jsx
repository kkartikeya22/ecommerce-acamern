import React from 'react';
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaBox, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ProductCarousel = () => {
  const dispatch = useDispatch();
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? "text-yellow-500" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  // Function to handle adding products to the cart
  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="mb-4 lg:block xl:block md:block">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="xl:w-[40rem] lg:w-[40rem] md:w-[46rem] sm:w-[35rem] sm:block"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              rating,
              quantity,
              countInStock,
            }) => (
              <div
                key={_id}
                className="p-4 bg-gray-800 text-white rounded-lg shadow-lg"
              >
                {/* Add a link to the product page */}
                <Link to={`/product/${_id}`} className="block relative">
                  <img
                    src={image}
                    alt={name}
                    className="w-full rounded-lg object-cover h-[30rem]"
                  />
                </Link>

                <div className="mt-4 flex flex-col lg:flex-row justify-between">
                  <div className="lg:w-2/3">
                    {/* Centralized and bold product name */}
                    <h2 className="text-xl font-bold mb-2 text-center">
                      {name}
                    </h2>
                    <p className="text-lg font-semibold text-pink-500">
                      {price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </p>
                    <p className="text-sm mb-4">
                      {description.substring(0, 170)}...
                    </p>
                  </div>

                  <div className="lg:w-1/3 lg:pl-6">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-2">
                        <FaStore className="mr-2 text-primary" />
                        <p>Brand: {brand}</p>
                      </div>
                      <div className="flex items-center mb-2">
                        {renderStars(rating)}
                      </div>
                      <div className="flex items-center mb-2">
                        <FaShoppingCart className="mr-2 text-primary" />
                        <p>Quantity: {quantity}</p>
                      </div>
                      <div className="flex items-center">
                        <FaBox className="mr-2 text-primary" />
                        <p>In Stock: {countInStock}</p>
                      </div>

                      {/* Add to Cart button */}
                      <button
                        className="mt-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full flex justify-center items-center"
                        onClick={() => addToCartHandler({
                          _id,
                          name,
                          image,
                          price,
                          quantity: 1,
                        })}
                        aria-label="Add to Cart"
                      >
                        <FaShoppingCart size={25} className="text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
