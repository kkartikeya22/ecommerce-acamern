const Loader = ({ size = 'medium' }) => {
  const sizeMap = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };
  
  return (
    <div className="flex justify-center items-center h-screen" aria-label="Loading">
      <div
        className={`animate-spin rounded-full ${sizeMap[size]} border-t-4 border-b-4 border-pink-500 border-opacity-70`}
      ></div>
      <div
        className={`absolute ${sizeMap[size]} rounded-full border-4 border-transparent border-b-pink-500 animate-spin-slow`}
        style={{ zIndex: 0 }}
      ></div>
    </div>
  );
};

export default Loader;
