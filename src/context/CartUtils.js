// src/context/CartUtils.js

export const saveCartItems = (items) => {
    localStorage.setItem('cartItems', JSON.stringify(items));
};

export const getCartItems = () => {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
};
