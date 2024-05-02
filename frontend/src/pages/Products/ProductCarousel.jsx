import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
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
      if (i <= rating) {
        // Filled star if rating is equal to or greater than i
        stars.push(<FaStar key={i} className="text-yellow-500 mr-1" />);
      } else {
        // Empty star if rating is less than i
        stars.push(<FaStar key={i} className="text-gray-300 mr-1" />);
      }
    }
    return stars;
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
              <div key={_id} className="p-4 bg-gray-800 text-white rounded-lg shadow-lg">
                <img
                  src={image}
                  alt={name}
                  className="w-full rounded-lg object-cover h-[30rem]"
                />

                <div className="mt-4 flex flex-col lg:flex-row justify-between">
                  <div className="lg:w-2/3">
                    <h2 className="text-xl font-bold mb-2">{name}</h2>
                    <p className="text-lg mb-2">Price: ${price}</p>
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
