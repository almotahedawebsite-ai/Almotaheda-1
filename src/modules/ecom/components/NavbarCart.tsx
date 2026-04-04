'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import { FiShoppingCart } from 'react-icons/fi';

export default function NavbarCart() {
  const [showCart, setShowCart] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <button 
        onClick={() => setShowCart(true)}
        className="relative p-2.5 bg-gray-50 dark:bg-slate-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all group"
      >
        <FiShoppingCart className="text-xl group-hover:scale-110 transition-transform block text-gray-700 dark:text-gray-300" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800 shadow-sm animate-bounce">
            {totalItems}
          </span>
        )}
      </button>

      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
