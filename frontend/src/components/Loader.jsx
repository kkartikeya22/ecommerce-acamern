const Loader = ({ size = 'large' }) => {
    const sizeMap = {
        small: 'h-8 w-8',
        medium: 'h-12 w-12',
        large: 'h-16 w-16',
    };

    return (
        <div
            className="flex justify-center items-center h-screen"
            aria-label="Loading"
        >
            <div className={`relative ${sizeMap[size]}`}>
                {/* Background circle with shadow */}
                <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-20 shadow-lg`}
                    style={{ zIndex: -1 }}
                ></div>

                {/* Rotating loader with gradient border */}
                <div
                    className={`animate-spin rounded-full border-4 border-t-transparent border-b-pink-500 border-l-purple-500 border-r-purple-500 ${sizeMap[size]}`}
                ></div>

                {/* Slow rotating circle with a matching border */}
                <div
                    className={`absolute inset-0 animate-spin-slow rounded-full border-4 border-transparent border-b-pink-500 ${sizeMap[size]}`}
                ></div>
            </div>
        </div>
    );
};

export default Loader;
