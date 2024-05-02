import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col md:flex-row mt-6">
      {/* Navigation Tabs */}
      <nav className="mb-4 md:mb-0 md:mr-8">
        <div
          className={`p-4 cursor-pointer text-lg text-white ${
            activeTab === 1 ? "font-bold bg-pink-600 rounded-lg" : ""
          }`}
          onClick={() => handleTabClick(1)}
        >
          Write Your Review
        </div>
        <div
          className={`p-4 cursor-pointer text-lg text-white ${
            activeTab === 2 ? "font-bold bg-pink-600 rounded-lg" : ""
          }`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews
        </div>
        <div
          className={`p-4 cursor-pointer text-lg text-white ${
            activeTab === 3 ? "font-bold bg-pink-600 rounded-lg" : ""
          }`}
          onClick={() => handleTabClick(3)}
        >
          Related Products
        </div>
      </nav>

      {/* Tab Content */}
      <div className="flex-1">
        {/* Write Your Review Tab */}
        {activeTab === 1 && (
          <div className="mt-4">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="mb-4">
                  <label
                    htmlFor="rating"
                    className="block text-xl mb-2 text-white"
                  >
                    Rating
                  </label>

                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="p-2 border rounded-lg w-full bg-white text-black"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="comment"
                    className="block text-xl mb-2 text-white"
                  >
                    Comment
                  </label>

                  <textarea
                    id="comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border rounded-lg w-full bg-white text-black"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition duration-200 ease-in-out"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p className="text-white">
                Please <Link to="/login" className="text-pink-500">sign in</Link> to write a review.
              </p>
            )}
          </div>
        )}

        {/* All Reviews Tab */}
        {activeTab === 2 && (
          <div className="bg-gray-800 p-4 rounded-lg">
            {product.reviews.length === 0 && (
              <p className="text-white">No Reviews</p>
            )}

            <div>
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="mb-4 bg-gray-700 p-4 rounded-lg"
                >
                  <div className="flex justify-between text-white">
                    <strong>{review.name}</strong>
                    <p>{review.createdAt.substring(0, 10)}</p>
                  </div>
                  <Ratings value={review.rating} />
                  <p className="my-2 text-white">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products Tab */}
        {activeTab === 3 && (
          <section className="ml-4 flex flex-wrap">
            {!data ? (
              <Loader />
            ) : (
              data.map((product) => (
                <div key={product._id} className="m-2">
                  <SmallProduct product={product} />
                </div>
              ))
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
