import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Please try again.");
      } else {
        toast.success(`${data.name} has been created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Please try again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container mx-auto py-8 -ml-12"> {/* Shifted left by 3rem or around 50px */}
      <div className="flex flex-col md:flex-row justify-center items-center">
        {/* Admin Menu */}
        <div className="md:w-1/4 mb-6 md:mr-8">
          <AdminMenu />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-3/4 bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-6">Create Product</h2>

          {/* Image Preview */}
          {imageUrl && (
            <div className="mb-6 text-center">
              <img
                src={imageUrl}
                alt="product"
                className="mx-auto w-48 h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-300">
              {image ? image.name : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit}>
            {/* Name and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Price</label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Quantity and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block mb-2">Quantity</label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Brand</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <textarea
                className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
              />
            </div>

            {/* Stock and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block mb-2">Count In Stock</label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Category</label>
                <select
                  className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-pink-600 rounded-lg font-semibold text-white hover:bg-pink-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              Create Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
