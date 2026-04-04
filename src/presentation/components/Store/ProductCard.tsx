'use client';

import React from 'react';
import { Product, StoreConfig } from '@/domain/types/store';
import { useCart } from '@/modules/ecom/context/CartContext';
import { tField } from '@/domain/types/settings';
import { FiPackage, FiShoppingCart } from 'react-icons/fi';

interface Props {
  product: Product;
  locale: string;
  categoryName?: string;
  currency?: string;
}

export default function ProductCard({ product, locale, categoryName, currency = 'EGP' }: Props) {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all">
      <div className="h-64 relative bg-gray-50">
        {product.images && product.images[0] ? (
          <img src={product.images[0]} alt="product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-10 text-gray-500"><FiPackage /></div>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-gray-900 px-6 py-2 rounded-full font-black">نفذ المخزون</span>
          </div>
        )}
      </div>
      
      <div className="p-8 text-right" dir="rtl">
        <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2">
           {categoryName}
        </p>
        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
          {tField(product.name, locale)}
        </h3>
        
        <div className="flex items-center justify-between mt-6">
          <div className="text-right">
            <span className="text-2xl font-black text-gray-900">{product.price.toLocaleString()}</span>
            <span className="text-xs text-gray-400 mr-1 font-bold">{currency}</span>
          </div>
          <button 
            onClick={() => addItem(product)}
            disabled={product.stock <= 0}
            className="group bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-purple-100 transition-all active:scale-95 disabled:opacity-30 flex items-center gap-2 font-bold"
          >
             <FiShoppingCart className="group-hover:scale-110 transition-transform" /> أضف للسلة
          </button>
        </div>
      </div>
    </div>
  );
}
