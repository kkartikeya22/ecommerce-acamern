import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
    const favorites = useSelector(selectFavoriteProduct);

    return (
        <div className="container mx-auto px-6 py-8"> {/* Container styling */}
            <h1 className="text-2xl font-bold text-center mb-6"> {/* Centralize the heading */}
                Favorite Products
            </h1>

            <div className="flex flex-wrap gap-6 justify-center"> {/* Center and space products */}
                {favorites.map((product) => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Favorites;
