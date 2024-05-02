import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories, isLoading } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} has been created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, please try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} has been updated.`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Updating category failed, please try again.");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} has been deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Deleting category failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center mx-auto p-6">
      {/* Centralizing the AdminMenu and category content */}
      <div className="w-full md:w-3/4 p-6 bg-gray-800 rounded-lg shadow-lg">
        {/* Admin Menu */}
        <div className="mb-4">
          <AdminMenu />
        </div>
        
        {/* Manage Categories Section */}
        <h2 className="text-2xl font-semibold mb-6 text-center">Manage Categories</h2>
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
          buttonText="Create"
        />

        <hr className="my-6 border-gray-600" />

        {/* Category List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 justify-center">
          {isLoading ? (
            <div className="text-center">Loading categories...</div>
          ) : (
            categories?.map((category) => (
              <div key={category._id}>
                <button
                  className="bg-gray-900 text-white py-2 px-3 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300"
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }}
                >
                  {category.name}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal for Update/Delete Category */}
        {modalVisible && (
          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <CategoryForm
              value={updatingName}
              setValue={setUpdatingName}
              handleSubmit={handleUpdateCategory}
              buttonText="Update"
              handleDelete={handleDeleteCategory}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
