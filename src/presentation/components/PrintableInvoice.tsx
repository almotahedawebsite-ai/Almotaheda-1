'use client';

import React from 'react';
import { Booking } from '@/domain/types/booking';
import { FiPrinter, FiCheckCircle, FiXCircle, FiFlag, FiClock } from 'react-icons/fi';

interface InvoiceProps {
  booking: Booking;
  companyName: string;
  companyPhone: string;
  companyAddress: string;
}

export default function PrintableInvoice({ booking, companyName, companyPhone, companyAddress }: InvoiceProps) {

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="no-print mb-6 bg-brand-teal hover:bg-brand-navy text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 group"
      >
        <FiPrinter className="group-hover:scale-110 transition-transform" /> طباعة الفاتورة
      </button>

      {/* Invoice Content */}
      <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm" id="printable-invoice">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-black text-brand-navy">{companyName || 'المتحدة'}</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Cleaning Service</p>
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-gray-900">فاتورة حجز</h2>
            <p className="text-gray-500 text-sm font-mono mt-1">#{booking.id}</p>
            <p className="text-gray-500 text-sm">
              {new Date(booking.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Client & Service Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase mb-2">بيانات العميل</h3>
            <p className="font-bold text-gray-900">{booking.customerName}</p>
            <p className="text-gray-600 text-sm" dir="ltr">{booking.customerPhone}</p>
            {booking.customerAddress && <p className="text-gray-600 text-sm">{booking.customerAddress}</p>}
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase mb-2">بيانات الشركة</h3>
            <p className="font-bold text-gray-900">{companyName || 'المتحدة'}</p>
            {companyPhone && <p className="text-gray-600 text-sm" dir="ltr">{companyPhone}</p>}
            {companyAddress && <p className="text-gray-600 text-sm">{companyAddress}</p>}
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-gray-50 rounded-2xl overflow-hidden mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-navy text-white">
                <th className="text-right py-3 px-4 text-sm font-bold">الخدمة</th>
                <th className="text-right py-3 px-4 text-sm font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4 px-4 font-bold text-gray-900">{booking.serviceName}</td>
                <td className="py-4 px-4 text-sm font-medium">
                  {booking.status === 'pending' ? <span className="flex items-center gap-1"><FiClock className="text-amber-500" /> قيد الانتظار</span> :
                   booking.status === 'confirmed' ? <span className="flex items-center gap-1"><FiCheckCircle className="text-green-500" /> مؤكد</span> :
                   booking.status === 'completed' ? <span className="flex items-center gap-1"><FiFlag className="text-blue-500" /> مكتمل</span> : <span className="flex items-center gap-1"><FiXCircle className="text-red-500" /> ملغي</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="mb-8">
            <h3 className="text-xs font-black text-gray-400 uppercase mb-2">ملاحظات</h3>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">{booking.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-400 text-xs mb-2">شكراً لاختياركم شركة المتحدة لخدمات النظافة</p>
          <p className="text-gray-400 text-[10px]">تم إنشاء هذه الفاتورة إلكترونياً وهي صالحة بدون توقيع</p>
        </div>
      </div>
    </div>
  );
}
