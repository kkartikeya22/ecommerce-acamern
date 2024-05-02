const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={onClose}
          ></div>
          <div className="bg-white rounded-lg shadow-lg p-6 mx-4 md:mx-auto md:max-w-lg z-10">
            <div className="flex justify-end">
              <button
                className="text-gray-500 hover:text-red-600 transition-colors duration-200 ease-in-out font-semibold text-xl"
                onClick={onClose}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
