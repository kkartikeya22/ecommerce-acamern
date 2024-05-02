const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="py-3 px-4 border border-gray-700 rounded-lg w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-pink-500 text-white py-2 px-4 rounded-lg font-semibold transition-all hover:bg-pink-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
          >
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-lg font-semibold transition-all hover:bg-red-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
