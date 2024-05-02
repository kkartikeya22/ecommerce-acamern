import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  // Fetching product data by ID
  const { data: productData } = useGetProductByIdQuery(params._id);

  // States for the product form fields
  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(productData?.description || "");
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category?._id || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock || 0);

  // Fetching categories
  const { data: categories = [] } = useFetchCategoriesQuery();

  // RTK Query mutations
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Update state when product data is available
  useEffect(() => {
    if (productData) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setStock(productData.countInStock);
      setImage(productData.image);
    }
  }, [productData]);

  // Uploading the product image
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      toast.error("Failed to upload image. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  // Submitting the product update form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const { data } = await updateProduct({
        productId: params._id,
        formData,
      });

      if (data.error) {
        toast.error(data.error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } else {
        toast.success("Product updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Product update failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  // Deleting the product
  const handleDelete = async () => {
    const confirmation = window.confirm("Are you sure you want to delete this product?");
    if (!confirmation) return;

    try {
      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete the product. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="container mx-auto py-8 -ml-12">
      <div className="flex flex-col md:flex-row justify-center items-start">
        {/* Admin Menu */}
        <div className="md:w-1/4 mb-6 md:mb-0">
          <AdminMenu />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-3/4 p-6 bg-gray-900 text-gray-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">
            Update/Delete Product
          </h2>

          {/* Image Preview */}
          {image && (
            <div className="text-center mb-4">
              <img
                src={image}
                alt="Product"
                className="max-w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="mb-4">
              <label
                htmlFor="imageUpload"
                className="block w-full text-center py-2 px-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition duration-300 text-gray-200"
              >
                {image ? image.name : "Upload Image"}
                <input
                  id="imageUpload"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block mb-2">Name</label>
                <input
                  id="name"
                  type="text"
                  className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 hover:shadow-lg transition duration-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block mb-2">Price</label>
                <input
                  id="price"
                  type="number"
                  className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 hover:shadow-lg transition duration-300"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Quantity and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="quantity" className="block mb-2">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 hover:shadow-lg transition duration-300"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="brand" className="block mb-2">Brand</label>
                <input
                  id="brand"
                  type="text"
                  className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 hover:shadow-lg transition duration-300"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block mb-2">Description</label>
              <textarea
                id="description"
                className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 hover:shadow-lg transition duration-300"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>

            {/* Stock and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="stock" className="block mb-2">Stock</label>
                <input
                  id="stock"
                  type="number"
                  className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 hover:shadow-lg transition duration-300"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block mb-2">Category</label>
                <select
                  id="category"
                  className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 hover:shadow-lg transition duration-300"
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

            {/* Update and Delete buttons */}
            <div className="flex justify-center gap-6">
              <button
                type="submit"
                className="w-40 py-3 bg-pink-600 rounded-lg font-semibold text-white hover:bg-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-40 py-3 bg-red-600 rounded-lg font-semibold text-white hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
