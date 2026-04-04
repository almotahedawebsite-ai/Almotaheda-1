'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { StoreRepository } from '@/modules/ecom/repositories/StoreRepository';
import { Order } from '@/domain/types/store';
import { FiPackage, FiRefreshCw, FiPhone, FiMapPin, FiSearch } from 'react-icons/fi';

export default function StoreOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const repo = new StoreRepository(db);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await repo.getOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: Order['status']) => {
    await repo.updateOrderStatus(id, status);
    fetchOrders();
    if (selectedOrder?.id === id) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'processing': return 'bg-blue-100 text-blue-600';
      case 'shipped': return 'bg-purple-100 text-purple-600';
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
             <span className="p-3 bg-purple-50 text-purple-600 rounded-2xl text-2xl"><FiPackage /></span> الطلبات الواردة
          </h1>
          <p className="text-gray-500 mt-2 text-lg">تتبع حالة طلبات العملاء وإدارتها من هنا</p>
        </div>
        <button onClick={fetchOrders} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all font-bold flex items-center gap-2"><FiRefreshCw /> تحديث القائمة</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ORDERS LIST */}
        <div className="lg:col-span-2 space-y-4">
           {loading ? (
             <div className="text-center py-20 text-gray-400">جاري تحميل الطلبات...</div>
           ) : orders.length === 0 ? (
             <div className="bg-white p-20 rounded-3xl border-2 border-dashed text-center text-gray-400">لا توجد طلبات حالياً.</div>
           ) : (
             orders.map(order => (
               <div 
                 key={order.id} 
                 onClick={() => setSelectedOrder(order)}
                 className={`bg-white p-6 rounded-3xl shadow-sm border-2 cursor-pointer transition-all hover:border-purple-200 ${selectedOrder?.id === order.id ? 'border-purple-600 ring-4 ring-purple-50' : 'border-gray-50'}`}
               >
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                          #{order.id.substring(0, 8).toUpperCase()}
                        </p>
                        <h3 className="font-bold text-gray-900 text-lg">{order.customerName}</h3>
                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                     </div>
                     <div className={`px-4 py-1.5 rounded-full text-xs font-black ${getStatusColor(order.status)}`}>
                        {order.status === 'pending' ? 'قيد الانتظار' : order.status === 'processing' ? 'جاري التنفيذ' : order.status === 'shipped' ? 'تم الشحن' : order.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                     </div>
                  </div>
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
                     <span className="text-xs text-gray-400">{(order.createdAt as any)?.toDate?.().toLocaleDateString('ar-EG') || 'اليوم'}</span>
                     <span className="font-black text-xl text-purple-600">{order.total.toLocaleString()} EGP</span>
                  </div>
               </div>
             ))
           )}
        </div>

        {/* ORDER DETAILS PANEL */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden sticky top-8">
               <div className="p-8 bg-gray-50 border-b">
                  <h2 className="text-xl font-bold mb-1">تفاصيل الطلب</h2>
                  <p className="text-xs text-gray-400 font-mono">ID: {selectedOrder.id}</p>
               </div>
               
               <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                  {/* Status Control */}
                  <div className="space-y-3">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest">تحديث الحالة</label>
                     <select 
                       className={`w-full p-4 rounded-2xl font-bold border-2 transition-all outline-none ${getStatusColor(selectedOrder.status)}`}
                       value={selectedOrder.status}
                       onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as any)}
                     >
                        <option value="pending">قيد الانتظار</option>
                        <option value="processing">جاري التنفيذ</option>
                        <option value="shipped">تم الشحن</option>
                        <option value="delivered">تم التوصيل</option>
                        <option value="cancelled">إلغاء الطلب</option>
                     </select>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-4">
                     <h3 className="font-bold border-b pb-2 text-gray-400 text-sm">بيانات العميل</h3>
                     <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                     <a href={`tel:${selectedOrder.customerPhone}`} className="block p-4 bg-purple-50 text-purple-600 rounded-2xl text-center font-bold flex items-center justify-center gap-2" dir="ltr"><FiPhone /> {selectedOrder.customerPhone}</a>
                     <div className="bg-gray-50 p-4 rounded-2xl text-sm text-gray-500 leading-relaxed flex items-start gap-2">
                        <FiMapPin className="text-purple-600 shrink-0 mt-0.5" /> {selectedOrder.customerAddress}
                     </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                     <h3 className="font-bold border-b pb-2 text-gray-400 text-sm">الأصناف المطلوبة</h3>
                     {selectedOrder.items.map((item, i) => (
                       <div key={i} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <span className="font-medium text-gray-700">{item.quantity}x {item.name}</span>
                          <span className="font-black text-gray-900">{(item.price * item.quantity).toLocaleString()}</span>
                       </div>
                     ))}
                  </div>

                  {/* Finance */}
                  <div className="pt-4 border-t space-y-2">
                     <div className="flex justify-between text-gray-400 text-sm"><span>الإجمالي الفرعي</span><span>{selectedOrder.subtotal.toLocaleString()}</span></div>
                     <div className="flex justify-between text-gray-400 text-sm"><span>الشحن</span><span>{selectedOrder.shippingFee.toLocaleString()}</span></div>
                     <div className="flex justify-between text-2xl font-black text-purple-600 pt-2"><span>الإجمالي</span><span>{selectedOrder.total.toLocaleString()}</span></div>
                  </div>
               </div>

               <div className="p-6 bg-gray-50 border-t flex gap-3">
                  <button onClick={() => setSelectedOrder(null)} className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors">إغلاق</button>
               </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed text-center text-gray-400 h-64 flex flex-col items-center justify-center">
               <span className="text-4xl text-gray-300 mb-3"><FiSearch /></span>
               <p>اختر طلباً من القائمة لعرض التفاصيل</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
