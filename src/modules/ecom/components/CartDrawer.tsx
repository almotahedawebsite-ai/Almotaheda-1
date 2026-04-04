'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { FiShoppingCart, FiPackage, FiTrash2, FiCreditCard } from 'react-icons/fi';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-left rtl:animate-slide-in-right">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold flex items-center gap-2 text-brand-navy">
            <FiShoppingCart /> سلة المشتريات <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">{totalItems}</span>
          </h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <FiShoppingCart className="text-7xl mb-4 text-gray-500" />
              <p className="text-xl font-bold">السلة فارغة حالياً</p>
              <button onClick={onClose} className="mt-4 text-purple-600 font-bold underline">ابدأ التسوق</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.productId} className="flex gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 group">
                <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                   {item.image ? (
                     <img src={item.image} alt="item" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300"><FiPackage /></div>
                   )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{item.name}</h3>
                    <button onClick={() => removeItem(item.productId)} className="text-gray-300 hover:text-red-500 transition-colors"><FiTrash2 /></button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-2 py-1">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="text-purple-600 font-bold text-lg leading-none">-</button>
                      <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="text-purple-600 font-bold text-lg leading-none">+</button>
                    </div>
                    <p className="font-black text-purple-600">{(item.price * item.quantity).toLocaleString()} <span className="text-[10px]">EGP</span></p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 border-t bg-gray-50 space-y-4">
          <div className="flex justify-between items-center text-lg">
             <span className="font-bold text-gray-500">الإجمالي الفرعي:</span>
             <span className="text-2xl font-black text-gray-900">{subtotal.toLocaleString()} EGP</span>
          </div>
          <p className="text-xs text-gray-400 text-center">سيتم إضافة رسوم الشحن والضرائب في الخطوة القادمة</p>
          
          <Link 
            href="/checkout"
            onClick={onClose}
            className={`group w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-100 flex items-center justify-center gap-3 transition-all ${items.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <FiCreditCard className="group-hover:scale-110 transition-transform" /> إتمام عملية الشراء
          </Link>
        </div>
      </div>
    </div>
  );
}
