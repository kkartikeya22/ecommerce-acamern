const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50 transition-opacity"
            onClick={onClose}
          ></div>
          
          {/* Modal content */}
          <div className="bg-gray-400 rounded-lg shadow-4xl p-4 mx-4 md:mx-auto md:max-w-lg z-10 transition-transform transform">
            {/* Close button */}
            <div className="flex justify-end">
              <button
                className="text-gray-800  hover:text-red-500 transition-colors duration-200 ease-in-out font-semibold text-2xl"
                onClick={onClose}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 text-gray-300">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
