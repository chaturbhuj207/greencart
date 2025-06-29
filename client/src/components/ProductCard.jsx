import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
    const {
        currency,
        addTocart,
        cartItems,
        updateCartItem,
        removeFromCart,
        navigate,
    } = useAppContext();

    return (
        product && (
            <div
                onClick={() => {
                    navigate(`/products/${product.category}/${product._id}`);
                    scrollTo(0, 0);
                }}
                className="border border-gray-200 rounded-md px-3 py-2 bg-white w-full h-full shadow-sm hover:shadow-md transition-shadow"
            >
                <div className="group cursor-pointer flex items-center justify-center px-2">
                    <img
                        className="group-hover:scale-105 transition-transform duration-200 max-h-28 object-contain"
                        src={product.image[0]}
                        alt={product.name}
                    />
                </div>

                <div className="text-gray-500/60 text-sm mt-2">
                    <p>{product.category}</p>
                    <p className="text-gray-700 font-medium text-lg truncate">
                        {product.name}
                    </p>

                    <div className="flex items-center gap-0.5">
                        {Array(5)
                            .fill("")
                            .map((_, i) => (
                                <img
                                    key={i}
                                    className="w-3 md:w-4"
                                    src={
                                        i < 4
                                            ? assets.star_icon
                                            : assets.star_dull_icon
                                    }
                                    alt=""
                                />
                            ))}
                        <p>(4)</p>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                        <p className="md:text-xl text-base font-medium text-primary">
                            {currency}{product.offerPrice}
                            <span className="text-gray-500/60 md:text-sm text-xs line-through ml-1">
                                {currency}{product.price}
                            </span>
                        </p>

                        <div
                            className="text-primary"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {!cartItems[product._id] ? (
                                <button
                                    className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded"
                                    onClick={() => addTocart(product._id)}
                                >
                                    <img
                                        src={assets.cart_icon}
                                        alt="cart-icon"
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">Add</span>
                                </button>
                            ) : (
                                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                    <button
                                        onClick={() =>
                                            removeFromCart(product._id)
                                        }
                                        className="px-2"
                                    >
                                        -
                                    </button>
                                    <span className="w-5 text-center">
                                        {cartItems[product._id]}
                                    </span>
                                    <button
                                        onClick={() =>
                                            addTocart(product._id)
                                        }
                                        className="px-2"
                                    >
                                        +
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default ProductCard;
