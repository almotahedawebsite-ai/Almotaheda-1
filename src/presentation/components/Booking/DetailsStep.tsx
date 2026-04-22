import React from 'react';
import Link from 'next/link';
import { User } from 'firebase/auth';
import { Service } from '@/domain/types/service';
import { tField } from '@/domain/types/settings';
import { FiEdit, FiInfo, FiArrowLeft } from 'react-icons/fi';
import { BookingFormState } from '@/domain/types/booking';

export default function DetailsStep({
  form,
  setForm,
  user,
  services,
  locale,
  onSubmit
}: {
  form: BookingFormState;
  setForm: React.Dispatch<React.SetStateAction<BookingFormState>>;
  user: User | null;
  services: Service[];
  locale: string;
  onSubmit: () => void;
}) {
  return (
    <div className="bg-gray-50 dark:bg-slate-800 p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-slate-700 space-y-6">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2"><FiEdit /> بيانات الحجز</h2>

      {!user && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-4 rounded-2xl">
          <div className="flex items-start gap-2"><FiInfo className="text-blue-700 dark:text-blue-300 mt-1 shrink-0" /><p className="text-sm text-blue-700 dark:text-blue-300 font-bold">
            يمكنك <Link href={`/${locale}/login`} className="underline">تسجيل الدخول بحساب جوجل</Link> لملء بياناتك تلقائياً
          </p></div>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">الاسم الكامل *</label>
        <input
          type="text"
          value={form.customerName}
          onChange={(e) => setForm((prev: any) => ({ ...prev, customerName: e.target.value }))}
          className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all text-gray-900 dark:text-white"
          placeholder="أدخل اسمك الكامل"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">رقم الهاتف *</label>
        <input
          type="tel"
          value={form.customerPhone}
          onChange={(e) => setForm((prev: any) => ({ ...prev, customerPhone: e.target.value }))}
          className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all text-gray-900 dark:text-white"
          dir="ltr"
          placeholder="01xxxxxxxxx"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">العنوان</label>
        <input
          type="text"
          value={form.customerAddress}
          onChange={(e) => setForm((prev: any) => ({ ...prev, customerAddress: e.target.value }))}
          className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all text-gray-900 dark:text-white"
          placeholder="أدخل العنوان بالتفصيل"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">الخدمة المطلوبة *</label>
        <select
          value={form.serviceId}
          onChange={(e) => setForm((prev: any) => ({ ...prev, serviceId: e.target.value }))}
          className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all text-gray-900 dark:text-white"
        >
          <option value="">— اختر الخدمة —</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>{tField(s.name, locale)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">ملاحظات إضافية</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((prev: any) => ({ ...prev, notes: e.target.value }))}
          className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all text-gray-900 dark:text-white"
          rows={3}
          placeholder="أي تفاصيل إضافية تريد إخبارنا بها..."
        />
      </div>

      <button
        onClick={onSubmit}
        className="w-full bg-gradient-to-r from-brand-navy to-brand-teal text-white py-4 rounded-2xl font-black text-lg transition-all hover:shadow-xl hover:shadow-brand-navy/20 flex items-center justify-center gap-2"
      >
        التالي: اختيار طريقة الدفع <FiArrowLeft />
      </button>
    </div>
  );
}
