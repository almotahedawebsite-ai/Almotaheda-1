'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { BookingRepository } from '@/infrastructure/repositories/BookingRepository';
import { Booking } from '@/domain/types/booking';
import { FiList, FiClock, FiCheckCircle, FiCheck, FiXCircle, FiX, FiZoomIn, FiSmartphone, FiCreditCard } from 'react-icons/fi';

const statusLabels: Record<string, { label: React.ReactNode; color: string }> = {
  pending: { label: <span className="flex items-center gap-1"><FiClock className="w-4 h-4" /> قيد الانتظار</span>, color: 'bg-amber-50 text-amber-700' },
  confirmed: { label: <span className="flex items-center gap-1"><FiCheckCircle className="w-4 h-4" /> مؤكد</span>, color: 'bg-green-50 text-green-700' },
  completed: { label: <span className="flex items-center gap-1"><FiCheck className="w-4 h-4" /> مكتمل</span>, color: 'bg-blue-50 text-blue-700' },
  cancelled: { label: <span className="flex items-center gap-1"><FiXCircle className="w-4 h-4" /> ملغي</span>, color: 'bg-red-50 text-red-700' },
};

const paymentLabels: Record<string, { label: React.ReactNode; color: string }> = {
  pending: { label: <span className="flex items-center gap-1"><FiClock className="w-4 h-4" /> قيد المراجعة</span>, color: 'bg-amber-50 text-amber-700' },
  confirmed: { label: <span className="flex items-center gap-1"><FiCheckCircle className="w-4 h-4" /> تم التأكيد</span>, color: 'bg-green-50 text-green-700' },
  rejected: { label: <span className="flex items-center gap-1"><FiXCircle className="w-4 h-4" /> مرفوض</span>, color: 'bg-red-50 text-red-700' },
};

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const repo = new BookingRepository(db);

  const fetchBookings = async () => {
    setLoading(true);
    const data = await repo.getAll();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await repo.update(id, { status: status as any, updatedAt: new Date().toISOString() });
      await fetchBookings();
      if (selectedBooking?.id === id) {
        setSelectedBooking(prev => prev ? { ...prev, status: status as any } : null);
      }
    } catch (err) {
      alert('حدث خطأ');
    }
  };

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return <div className="p-10 font-bold text-gray-400 text-center">جاري تحميل الحجوزات...</div>;

  return (
    <>
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><FiList className="text-brand-teal" /> إدارة الحجوزات</h1>
            <p className="text-gray-500 mt-1">مراجعة وإدارة حجوزات العملاء</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === f ? 'bg-brand-teal text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'الكل' : (statusLabels[f]?.label || f)} ({f === 'all' ? bookings.length : bookings.filter(b => b.status === f).length})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">العميل</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">الخدمة</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">الحالة</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">الدفع</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">التاريخ</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                    <td className="px-4 py-4">
                      <p className="font-bold text-gray-900 text-sm">{booking.customerName}</p>
                      <p className="text-gray-400 text-xs" dir="ltr">{booking.customerPhone}</p>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-brand-teal">{booking.serviceName}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${statusLabels[booking.status]?.color}`}>
                        {statusLabels[booking.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${paymentLabels[booking.paymentStatus]?.color}`}>
                        {paymentLabels[booking.paymentStatus]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-4">
                      <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4 text-gray-300"><FiList className="w-16 h-16" /></div>
              <p className="text-gray-400 font-bold">لا توجد حجوزات {filter !== 'all' ? 'بهذه الحالة ' : ''}حالياً</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedBooking && (
        <div className="fixed inset-y-0 left-0 right-0 z-[100] flex justify-end">
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setSelectedBooking(null)} />
          
          <div className="relative w-full max-w-md md:max-w-xl bg-white h-full shadow-2xl flex flex-col border-r border-gray-100 animate-slide-in-left">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shrink-0">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><FiList className="text-brand-teal" /> تفاصيل الحجز</h2>
              <button onClick={() => setSelectedBooking(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors font-bold"><FiX /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div><span className="text-gray-500 text-xs font-bold mb-1 block">رقم الحجز</span><p className="font-mono font-black text-sm text-brand-teal">{selectedBooking.id}</p></div>
                <div><span className="text-gray-500 text-xs font-bold mb-1 block">التاريخ</span><p className="font-bold text-sm text-gray-900">{new Date(selectedBooking.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100"><span className="text-gray-500 text-xs font-bold mb-1 block">الاسم</span><p className="font-black text-gray-900">{selectedBooking.customerName}</p></div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100"><span className="text-gray-500 text-xs font-bold mb-1 block">الهاتف</span><p className="font-black text-gray-900" dir="ltr">{selectedBooking.customerPhone}</p></div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100"><span className="text-gray-500 text-xs font-bold mb-1 block">العنوان</span><p className="font-black text-gray-900 text-sm overflow-hidden text-ellipsis">{selectedBooking.customerAddress || '—'}</p></div>
                <div className="bg-brand-teal/5 border border-brand-teal/20 p-4 rounded-2xl"><span className="text-brand-teal/70 text-xs font-bold mb-1 block">الخدمة المطلوبة</span><p className="font-black text-brand-teal text-lg">{selectedBooking.serviceName}</p></div>
              </div>

              {selectedBooking.notes && (
                <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl">
                  <span className="text-amber-700 text-xs font-black mb-2 block">ملاحظات العميل</span>
                  <p className="font-medium text-amber-900 leading-relaxed text-sm">{selectedBooking.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 text-xs font-bold mb-2 block">حالة الحجز</span>
                  <p className={`inline-block px-4 py-2 rounded-xl text-sm font-black ${statusLabels[selectedBooking.status]?.color}`}>
                    {statusLabels[selectedBooking.status]?.label}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-bold mb-2 block">حالة الدفع</span>
                  <p className={`inline-block px-4 py-2 rounded-xl text-sm font-black ${paymentLabels[selectedBooking.paymentStatus]?.color}`}>
                    {paymentLabels[selectedBooking.paymentStatus]?.label}
                  </p>
                </div>
              </div>

              {selectedBooking.paymentMethod && (
                <div>
                  <span className="text-gray-500 text-sm font-bold block mb-2">طريقة الدفع</span>
                  <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 inline-flex items-center">
                    <p className="font-black text-gray-900 flex items-center gap-2">
                       {selectedBooking.paymentMethod === 'instapay_qr' ? <><FiSmartphone className="text-brand-teal" /> كود خصم / InstaPay QR</> : <><FiCreditCard className="text-brand-teal" /> محفظة إلكترونية</>}
                    </p>
                  </div>
                </div>
              )}

              {selectedBooking.paymentProofUrl && (
                <div>
                  <span className="text-gray-500 text-sm font-bold block mb-3">صورة إثبات الدفع المرفقة</span>
                  <a href={selectedBooking.paymentProofUrl} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-2xl border border-gray-200">
                    <img src={selectedBooking.paymentProofUrl} alt="Payment Proof" className="w-full max-h-80 object-contain hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm flex items-center gap-2"><FiZoomIn /> تكبير الصورة</span>
                    </div>
                  </a>
                </div>
              )}

            </div>
            
            {/* Status Update Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
               <span className="text-gray-500 text-xs font-bold block mb-3 text-center">تحديث حالة الحجز:</span>
               <div className="grid grid-cols-2 gap-2">
                 {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                   <button
                     key={s}
                     onClick={() => handleStatusChange(selectedBooking.id, s)}
                     disabled={selectedBooking.status === s}
                     className={`py-3 rounded-xl text-sm font-black transition-all disabled:opacity-40 disabled:scale-100 active:scale-95 ${statusLabels[s]?.color} ${selectedBooking.status === s ? 'ring-2 ring-offset-2 ring-gray-300' : 'hover:shadow-md'}`}
                   >
                     {statusLabels[s]?.label}
                   </button>
                 ))}
               </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
