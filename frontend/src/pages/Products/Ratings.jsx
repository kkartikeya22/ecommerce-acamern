import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars > 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center">
      {/* Display full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className={`text-${color} text-xl`} />
      ))}

      {/* Display half star */}
      {halfStars === 1 && (
        <FaStarHalfAlt className={`text-${color} text-xl`} />
      )}

      {/* Display empty stars */}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={index} className={`text-${color} text-xl`} />
      ))}

      {/* Optional rating text */}
      {text && (
        <span className={`ml-2 text-sm text-gray-400`}>
          {text}
        </span>
      )}
    </div>
  );
};

Ratings.defaultProps = {
  color: "yellow-500",
};

export default Ratings;
