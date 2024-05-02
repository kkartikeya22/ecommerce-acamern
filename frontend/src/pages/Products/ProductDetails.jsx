import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaArrowLeft,
} from "react-icons/fa";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <Link
        to="/"
        className="inline-flex items-center text-white font-semibold py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-200 ease-in-out mb-4"
      >
        <FaArrowLeft className="mr-2" /> Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-6 lg:mb-0">
              {/* Add background color class bg-gray-800 to the container under the image */}
              <div className="relative bg-gray-800 rounded-lg p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full rounded-lg object-cover h-[25rem] shadow-lg"
                />
                <div className="absolute top-4 right-4">
                  <HeartIcon
                    product={product}
                    className="text-pink-600 hover:text-pink-400"
                  />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 px-4">
              <div className="flex flex-col justify-between h-full">
                <h2 className="text-3xl font-semibold text-white mb-4">
                  {product.name}
                </h2>
                <p className="text-lg text-gray-300 mb-4">
                  {product.description}
                </p>
                <p className="text-4xl font-bold text-pink-600 mb-4">
                  ${product.price}
                </p>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <FaStore className="mr-2 text-white" /> Brand: {product.brand}
                  </div>

                  <div className="flex items-center mb-2">
                    <FaBox className="mr-2 text-white" /> In Stock: {product.countInStock}
                  </div>

                  <div className="flex items-center mb-2">
                    <FaShoppingCart className="mr-2 text-white" /> Quantity: {product.quantity}
                  </div>
                </div>

                <div className="mb-4">
                  <Ratings value={product.rating} />
                </div>

                {product.countInStock > 0 && (
                  <div className="flex items-center mb-4">
                    <span className="mr-4 text-white">Quantity:</span>
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="p-2 w-20 rounded-lg bg-white border border-gray-300 text-black"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className={`py-2 px-4 rounded-lg text-white font-semibold transition duration-200 ease-in-out ${product.countInStock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 shadow-md'}`}
                >
                  Add To Cart
                </button>

              </div>
            </div>
          </div>

          <div className="mt-10">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
