'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '@/infrastructure/firebase/config';
import { PaymentRepository } from '@/infrastructure/repositories/PaymentRepository';
import { BookingRepository } from '@/infrastructure/repositories/BookingRepository';
import { Payment } from '@/domain/types/booking';
import { FiClock, FiCheckCircle, FiXCircle, FiCreditCard, FiAlertTriangle, FiSmartphone, FiBriefcase, FiList, FiX, FiCamera, FiCheck } from 'react-icons/fi';

const statusLabels: Record<string, { label: React.ReactNode; color: string; bg: string }> = {
  pending: { label: <span className="flex items-center gap-1"><FiClock /> قيد المراجعة</span>, color: 'text-amber-700', bg: 'bg-amber-50' },
  confirmed: { label: <span className="flex items-center gap-1"><FiCheckCircle /> تم التأكيد</span>, color: 'text-green-700', bg: 'bg-green-50' },
  rejected: { label: <span className="flex items-center gap-1"><FiXCircle /> مرفوض</span>, color: 'text-red-700', bg: 'bg-red-50' },
};

export default function DashboardPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [updating, setUpdating] = useState(false);

  const paymentRepo = new PaymentRepository(db);
  const bookingRepo = new BookingRepository(db);

  const fetchPayments = async () => {
    setLoading(true);
    const data = await paymentRepo.getAll();
    setPayments(data);
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleStatusChange = async (payment: Payment, newStatus: 'confirmed' | 'rejected') => {
    setUpdating(true);
    try {
      const currentUser = auth.currentUser;

      // Update payment status
      await paymentRepo.update(payment.id, {
        status: newStatus,
        confirmedBy: currentUser?.email || 'admin',
        confirmedAt: new Date().toISOString(),
      });

      // Update booking payment status too
      if (payment.bookingId) {
        await bookingRepo.update(payment.bookingId, {
          paymentStatus: newStatus,
          ...(newStatus === 'confirmed' ? { status: 'confirmed' } : {}),
          updatedAt: new Date().toISOString(),
        });
      }

      await fetchPayments();
      setSelectedPayment(null);
    } catch (err) {
      alert('حدث خطأ أثناء التحديث');
      console.error(err);
    }
    setUpdating(false);
  };

  const filteredPayments = filter === 'all' ? payments : payments.filter(p => p.status === filter);

  if (loading) return <div className="p-10 font-bold text-gray-400 text-center">جاري تحميل المدفوعات...</div>;

  return (
    <>
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><FiCreditCard className="text-brand-teal" /> مراجعة المدفوعات</h1>
            <p className="text-gray-500 mt-1">تأكيد أو رفض إثباتات الدفع المقدمة من العملاء</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'confirmed', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === f ? 'bg-brand-teal text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'الكل' : (statusLabels[f]?.label || f)} ({f === 'all' ? payments.length : payments.filter(p => p.status === f).length})
              </button>
            ))}
          </div>
        </div>

        {/* Pending Alert */}
        {payments.filter(p => p.status === 'pending').length > 0 && (
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3">
            <span className="text-2xl text-amber-500"><FiAlertTriangle /></span>
            <p className="font-bold text-amber-800 text-sm">
              لديك {payments.filter(p => p.status === 'pending').length} مدفوعات بانتظار المراجعة
            </p>
          </div>
        )}

        {/* Payments Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">العميل</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">طريقة الدفع</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">الحالة</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">إثبات</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">التاريخ</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-bold text-gray-900 text-sm">{payment.customerName}</p>
                      <p className="text-gray-400 text-xs" dir="ltr">{payment.customerPhone}</p>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <span className="flex items-center gap-1 text-gray-600">{payment.method === 'instapay_qr' ? <><FiSmartphone /> InstaPay</> : <><FiBriefcase /> محفظة</>}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusLabels[payment.status]?.bg} ${statusLabels[payment.status]?.color}`}>
                        {statusLabels[payment.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {payment.proofImageUrl ? (
                        <img src={payment.proofImageUrl} alt="" className="w-10 h-10 rounded-lg object-cover cursor-pointer hover:scale-110 transition-transform shadow-sm" onClick={() => setSelectedPayment(payment)} />
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <FiList /> عرض
                        </button>
                        {payment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(payment, 'confirmed')}
                              className="bg-green-50 hover:bg-green-100 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() => handleStatusChange(payment, 'rejected')}
                              className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center"
                            >
                              <FiX />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 text-gray-300 flex justify-center"><FiCreditCard /></span>
              <p className="text-gray-400 font-bold">لا توجد مدفوعات {filter !== 'all' ? 'بهذه الحالة ' : ''}حالياً</p>
            </div>
          )}
        </div>
      </div>

      {/* Premium Side Drawer for Payment Details */}
      {selectedPayment && (
        <div className="fixed inset-y-0 left-0 right-0 z-[100] flex justify-end">
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-all" onClick={() => setSelectedPayment(null)} />
          
          <div className="relative w-full max-w-md md:max-w-lg bg-white h-full shadow-2xl flex flex-col border-r border-gray-100 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shrink-0">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><FiCreditCard className="text-brand-teal" /> تفاصيل الدفع</h2>
              <button onClick={() => setSelectedPayment(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors font-bold"><FiX /></button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div><span className="text-gray-400 text-xs font-bold">رقم الدفع</span><p className="font-mono font-bold text-xs mt-1 text-gray-700">{selectedPayment.id}</p></div>
                <div><span className="text-gray-400 text-xs font-bold">رقم الحجز</span><p className="font-mono font-bold text-xs mt-1 text-gray-700">{selectedPayment.bookingId}</p></div>
              </div>

              <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-50 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-blue-400 font-bold mb-1 block text-xs">اسم العميل</span><p className="font-black text-blue-900">{selectedPayment.customerName}</p></div>
                  <div><span className="text-blue-400 font-bold mb-1 block text-xs">رقم الهاتف</span><p className="font-black text-blue-900" dir="ltr">{selectedPayment.customerPhone}</p></div>
                  <div><span className="text-blue-400 font-bold mb-1 block text-xs">طريقة الدفع</span><p className="font-black text-blue-900 flex items-center gap-1">{selectedPayment.method === 'instapay_qr' ? <><FiSmartphone /> InstaPay</> : <><FiBriefcase /> محفظة</>}</p></div>
                  <div><span className="text-blue-400 font-bold mb-1 block text-xs">المبلغ</span><p className="font-black text-blue-900 text-lg">{selectedPayment.amount || '—'}</p></div>
                </div>
              </div>

              <div>
                <span className="text-gray-500 text-sm font-bold block mb-2">الحالة الحالية</span>
                <span className={`inline-flex px-4 py-2 rounded-full text-sm font-black ${statusLabels[selectedPayment.status]?.bg} ${statusLabels[selectedPayment.status]?.color}`}>
                  {statusLabels[selectedPayment.status]?.label}
                </span>
              </div>

              {selectedPayment.confirmedBy && (
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl grid grid-cols-2 gap-2">
                  <div><span className="text-gray-400 text-xs font-bold">تم بواسطة</span><p className="font-bold text-sm text-gray-700">{selectedPayment.confirmedBy}</p></div>
                  <div><span className="text-gray-400 text-xs font-bold">في</span><p className="font-bold text-sm text-gray-700">{selectedPayment.confirmedAt ? new Date(selectedPayment.confirmedAt).toLocaleString('ar-EG') : '—'}</p></div>
                </div>
              )}

              {/* Payment Proof Image */}
              <div>
                <span className="text-gray-900 text-sm font-black flex items-center gap-2 mb-3">
                  <FiCamera className="text-gray-500" /> صورة إثبات الدفع
                </span>
                {selectedPayment.proofImageUrl ? (
                  <div className="relative group overflow-hidden rounded-2xl border-2 border-gray-100 shadow-sm bg-gray-50">
                    <img
                      src={selectedPayment.proofImageUrl}
                      alt="Payment proof"
                      className="w-full object-contain hover:scale-105 transition-transform duration-500"
                    />
                    <a
                      href={selectedPayment.proofImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-5 py-2 rounded-full text-xs font-bold shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-black"
                    >
                      عرض بالحجم الكامل ↗
                    </a>
                  </div>
                ) : (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400 font-bold">
                    لا توجد صورة مرفقة
                  </div>
                )}
              </div>
            </div>

            {/* Actions for pending payments */}
            {selectedPayment.status === 'pending' && (
              <div className="p-6 border-t border-gray-100 shrink-0 bg-white">
                <p className="font-black text-gray-500 text-xs uppercase tracking-wider mb-3">اتخذ قراراً</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusChange(selectedPayment, 'confirmed')}
                    disabled={updating}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 py-3.5 rounded-xl font-black text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updating ? '...' : <><FiCheckCircle /> قبول الدفع</>}
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedPayment, 'rejected')}
                    disabled={updating}
                    className="flex-1 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 py-3.5 rounded-xl font-black text-sm transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updating ? '...' : <><FiXCircle /> رفض</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
