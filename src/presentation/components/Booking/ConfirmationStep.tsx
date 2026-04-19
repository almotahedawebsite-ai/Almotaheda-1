import React from 'react';
import Link from 'next/link';
import { Service } from '@/domain/types/service';
import { tField } from '@/domain/types/settings';
import { FiCheckCircle, FiClipboard, FiClock, FiHome, FiMessageSquare } from 'react-icons/fi';
import { BookingFormState } from '@/domain/types/booking';

export default function ConfirmationStep({
  form,
  bookingId,
  settings,
  selectedService,
  locale
}: {
  form: BookingFormState;
  bookingId: string;
  settings: any;
  selectedService: Service | undefined;
  locale: string;
}) {
  return (
    <div className="text-center space-y-8">
      <div className="bg-green-50 dark:bg-green-900/20 p-12 rounded-3xl border border-green-100 dark:border-green-800/30">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 animate-scale-in text-green-600">
          <FiCheckCircle />
        </div>
        <h2 className="text-3xl font-black text-green-800 dark:text-green-300 mb-4">
          تم إرسال حجزك بنجاح!
        </h2>
        <p className="text-green-700 dark:text-green-400 text-lg mb-2">
          رقم الحجز: <span className="font-mono font-black">{bookingId}</span>
        </p>
        <p className="text-green-600 dark:text-green-500 max-w-md mx-auto">
          سيتم مراجعة طلبك وإثبات الدفع من قبل فريقنا. سنتواصل معك قريباً لتأكيد الحجز.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 text-right">
        <h3 className="font-black text-gray-900 dark:text-white mb-4 text-lg flex items-center gap-2"><FiClipboard /> ملخص حجزك</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">الاسم:</span> <span className="font-bold">{form.customerName}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">الهاتف:</span> <span className="font-bold" dir="ltr">{form.customerPhone}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">الخدمة:</span> <span className="font-bold text-brand-teal">{selectedService ? tField(selectedService.name, locale) : ''}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">طريقة الدفع:</span> <span className="font-bold">{form.paymentMethod === 'instapay_qr' ? 'InstaPay QR' : 'محفظة إلكترونية'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">حالة الدفع:</span> <span className="font-bold text-amber-500 flex items-center gap-1"><FiClock /> قيد المراجعة</span></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={`/${locale}`}
          className="bg-brand-navy text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-brand-teal"
        >
          <div className="flex items-center gap-2"><FiHome /> العودة للرئيسية</div>
        </Link>
        {(settings.whatsappCta || settings.contactWhatsapp) && (
          <a
            href={`https://wa.me/${(settings.whatsappCta || settings.contactWhatsapp || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً، قمت بحجز خدمة - رقم الحجز: ${bookingId}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold transition-all inline-flex items-center gap-2"
          >
            <FiMessageSquare /> تواصل معنا عبر واتساب
          </a>
        )}
      </div>
    </div>
  );
}
