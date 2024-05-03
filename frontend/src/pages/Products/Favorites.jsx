import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
    const favorites = useSelector(selectFavoriteProduct);

    return (
        <div className="container mx-auto mt-12 p-6 bg-gray-800 rounded-lg shadow-lg"> {/* Dark background and shadow */}
            <h1 className="text-3xl font-bold text-white text-center mb-6"> {/* Centralized and styled heading */}
                Favorite Products
            </h1>

            {favorites.length === 0 ? (
                <p className="text-white text-center"> {/* Message styling */}
                    You have no favorite products. Add some to see them here.
                </p>
            ) : (
                <div className="flex flex-wrap gap-6 justify-center"> {/* Center and space products */}
                    {favorites.map((product) => (
                        <div key={product._id} className="bg-gray-700 p-4 rounded-lg shadow-md"> {/* Styled product card */}
                            <Product product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
