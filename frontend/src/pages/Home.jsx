import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="container mx-auto mt-10 px-4">
  <div className="bg-white rounded shadow p-6 mb-2">
    <p className="text-xl font-medium text-gray-700 text-center leading-relaxed">
      <span className="text-2xl font-semibold text-pink-500">Welcome to our e-commerce platform!</span><br />
      Explore a diverse selection of high-quality products and exclusive deals tailored to your needs. Enjoy a seamless shopping experience with us.
    </p>
  </div>
</div>




          <div className=" flex justify-between items-center">
            <h1 className=" ml-[20rem] mt-[4rem] text-[3rem]">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[4rem]"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem]">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
