import { createContext, useContext, useEffect, useState } from "react";
import React from 'react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();
export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setsearchQuery] = useState({})


    // Fetch seller auth
    const fetchSellerAuth = async () => {
        try {
            const { data } = await axios.get("/api/seller/is-auth");
            if (data.success) {
                setIsSeller(true);
            } else {
                setIsSeller(false);
            }
        } catch (error) {
            console.log(error.message);
            setIsSeller(false);
        }
    }

    // fetch user auth and cart data
    const fetchUserAuth = async () => {
        try {
            const { data } = await axios.get("/api/user/is-auth");
            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems)
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        }
    }

    // fetch products data
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/api/product/list");
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        fetchSellerAuth();
        fetchProducts();
        fetchUserAuth();
    }, [])

    //update database cartItems
    useEffect(() => {
        const updateCartItems = async () => {
            try {
                const { data } = await axios.post("/api/cart/update", { cartItems });
                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        if (user) {
            updateCartItems();
        }
    }, [cartItems])

    // add to card
    const addTocart = (itemId) => {
        let cartData = structuredClone(cartItems)
        if (cartData[itemId]) {
            cartData[itemId] += 1
        } else {
            cartData[itemId] = 1
        }
        setCartItems(cartData)
        toast.success("Added to Cart")
    }
    // cart Updated
    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart  Updated")

    }
    //remove cart item
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData) {
            cartData[itemId] -= 1
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }

        }
        toast.success("Remove From Cart")
        setCartItems(cartData);

    }

    // get cart items count
    const getCartCount = () => {
        let totalcount = 0;
        for (const item in cartItems) {
            totalcount += cartItems[item]
        }
        return totalcount
    }

    // get total cart amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            let itemInfo = products.find((product) => product._id === item);
            if (cartItems[item] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[item]
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    const value = { navigate, user, setUser, setIsSeller, isSeller, showUserLogin, setShowUserLogin, products, currency, addTocart, updateCartItem, removeFromCart, cartItems, searchQuery, setsearchQuery, getCartCount, getCartAmount, axios, fetchProducts, setCartItems }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}
export const useAppContext = () => {
    return useContext(AppContext)
}