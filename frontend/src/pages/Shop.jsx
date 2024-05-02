import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        {/* Filter Section */}
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md md:w-1/4">
          <h2 className="text-lg font-bold text-center mb-6">Filter by Categories</h2>
          <div className="space-y-3">
            {categories?.map((c) => (
              <div key={c._id} className="transition-transform transform hover:scale-105">
                <label className="flex items-center cursor-pointer bg-gray-800 p-2 rounded-md hover:bg-gray-700">
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="mr-2 h-5 w-5 text-pink-500 focus:ring-pink-500 border-gray-300"
                  />
                  <span className="text-gray-300">{c.name}</span>
                </label>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold text-center mt-8 mb-6">Filter by Brands</h2>
          <div className="space-y-3">
            {uniqueBrands?.map((brand) => (
              <div key={brand} className="transition-transform transform hover:scale-105">
                <label className="flex items-center cursor-pointer bg-gray-800 p-2 rounded-md hover:bg-gray-700">
                  <input
                    type="radio"
                    id={`brand-${brand}`}
                    name="brand"
                    onChange={() => handleBrandClick(brand)}
                    className="mr-2 h-5 w-5 text-pink-500 focus:ring-pink-500 border-gray-300"
                  />
                  <span className="text-gray-300">{brand}</span>
                </label>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold text-center mt-8 mb-6">Filter by Price</h2>
          <div>
            <input
              type="text"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChange}
              className="w-full rounded-md border-gray-300 px-3 py-2 focus:ring-pink-500"
            />
          </div>

          <button
            className="mt-6 w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Reset Filters
          </button>
        </div>

        {/* Product Listing */}
        <div className="md:w-3/4 p-4">
          <h2 className="text-lg font-semibold text-center mb-4">{products?.length} Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.length === 0 ? (
              <Loader />
            ) : (
              products?.map((p) => (
                <div key={p._id} className="mb-4">
                  <ProductCard p={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
