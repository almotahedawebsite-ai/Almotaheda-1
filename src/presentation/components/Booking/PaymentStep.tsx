import React from 'react';
import { Service } from '@/domain/types/service';
import { tField } from '@/domain/types/settings';
import { FiClipboard, FiCreditCard, FiSmartphone, FiDollarSign, FiCamera, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { BookingFormState } from '@/domain/types/booking';

export default function PaymentStep({
  form,
  setForm,
  settings,
  submitting,
  uploadingProof,
  selectedService,
  locale,
  onProofUpload,
  onSubmit,
  onBack
}: {
  form: BookingFormState;
  setForm: React.Dispatch<React.SetStateAction<BookingFormState>>;
  settings: any;
  submitting: boolean;
  uploadingProof: boolean;
  selectedService: Service | undefined;
  locale: string;
  onProofUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700">
        <h3 className="font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2"><FiClipboard /> ملخص الحجز</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-500">الاسم:</span> <span className="font-bold text-gray-900 dark:text-white">{form.customerName}</span></div>
          <div><span className="text-gray-500">الهاتف:</span> <span className="font-bold text-gray-900 dark:text-white" dir="ltr">{form.customerPhone}</span></div>
          <div className="col-span-2"><span className="text-gray-500">الخدمة:</span> <span className="font-bold text-brand-teal">{selectedService ? tField(selectedService.name, locale) : ''}</span></div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-50 dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 space-y-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2"><FiCreditCard /> اختر طريقة الدفع</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* InstaPay QR */}
          <button
            onClick={() => setForm((prev: any) => ({ ...prev, paymentMethod: 'instapay_qr' }))}
            className={`p-6 rounded-2xl border-2 transition-all text-center ${
              form.paymentMethod === 'instapay_qr'
                ? 'border-brand-teal bg-brand-teal/5 shadow-lg'
                : 'border-gray-200 dark:border-slate-600 hover:border-brand-teal/50'
            }`}
          >
            <FiSmartphone className="text-4xl mb-3 mx-auto" />
            <p className="font-black text-gray-900 dark:text-white">InstaPay QR</p>
            <p className="text-xs text-gray-500 mt-1">ادفع بمسح كود الـ QR</p>
          </button>

          {/* E-Wallet */}
          <button
            onClick={() => setForm((prev: any) => ({ ...prev, paymentMethod: 'e_wallet' }))}
            className={`p-6 rounded-2xl border-2 transition-all text-center ${
              form.paymentMethod === 'e_wallet'
                ? 'border-brand-teal bg-brand-teal/5 shadow-lg'
                : 'border-gray-200 dark:border-slate-600 hover:border-brand-teal/50'
            }`}
          >
            <FiDollarSign className="text-4xl mb-3 mx-auto" />
            <p className="font-black text-gray-900 dark:text-white">محفظة إلكترونية</p>
            <p className="text-xs text-gray-500 mt-1">حوّل على رقم المحفظة</p>
          </button>
        </div>

        {/* Show payment info based on method */}
        {form.paymentMethod === 'instapay_qr' && (
          <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl border border-gray-100 dark:border-slate-600 text-center space-y-4">
            <h3 className="font-black text-gray-900 dark:text-white flex items-center justify-center gap-2"><FiSmartphone /> امسح كود الـ QR للدفع</h3>
            {settings.instapayQrImage ? (
              <img src={settings.instapayQrImage} alt="InstaPay QR Code" className="w-64 h-64 mx-auto rounded-2xl object-contain border border-gray-200" />
            ) : (
              <div className="w-64 h-64 mx-auto bg-gray-100 dark:bg-slate-600 rounded-2xl flex items-center justify-center text-gray-400">
                <p className="text-sm font-bold">لم يتم إضافة كود QR بعد</p>
              </div>
            )}
            <p className="text-sm text-gray-500">قم بمسح الكود من تطبيق InstaPay ثم ارفع صورة إثبات الدفع</p>
          </div>
        )}

        {form.paymentMethod === 'e_wallet' && (
          <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl border border-gray-100 dark:border-slate-600 text-center space-y-4">
            <h3 className="font-black text-gray-900 dark:text-white flex items-center justify-center gap-2"><FiDollarSign /> حوّل على رقم المحفظة</h3>
            {settings.eWalletNumber ? (
              <p className="text-3xl font-black text-brand-teal" dir="ltr">{settings.eWalletNumber}</p>
            ) : (
              <p className="text-gray-400 font-bold">لم يتم إضافة رقم المحفظة بعد</p>
            )}
            <p className="text-sm text-gray-500">قم بالتحويل على الرقم أعلاه ثم ارفع صورة إثبات الدفع</p>
          </div>
        )}

        {/* Upload Payment Proof */}
        {form.paymentMethod && (
          <div className="space-y-4">
            <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2"><FiCamera /> ارفع صورة إثبات الدفع *</h3>
            
            {form.paymentProofUrl && (
              <div className="relative">
                <img src={form.paymentProofUrl} alt="Payment Proof" className="w-full max-h-80 object-contain rounded-2xl border border-gray-200" />
                <button
                  onClick={() => setForm((prev: any) => ({ ...prev, paymentProofUrl: '' }))}
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            {!form.paymentProofUrl && (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-10 text-center hover:border-brand-teal transition-colors">
                  {uploadingProof ? (
                    <div className="text-brand-teal font-bold">جاري رفع الصورة...</div>
                  ) : (
                    <>
                      <FiCamera className="text-4xl mb-3 mx-auto" />
                      <p className="font-bold text-gray-600 dark:text-gray-300">اضغط لاختيار صورة إثبات الدفع</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG حتى 5MB</p>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={onProofUpload} className="hidden" />
              </label>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="px-6 bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 text-gray-700 dark:text-white py-4 rounded-2xl font-bold transition-all"
          >
            <div className="flex items-center justify-center gap-2"><FiArrowRight /> رجوع</div>
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting || !form.paymentMethod || !form.paymentProofUrl}
            className="flex-1 bg-gradient-to-r from-brand-navy to-brand-teal text-white py-4 rounded-2xl font-black text-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? 'جاري الإرسال...' : <><FiCheckCircle /> تأكيد الحجز والدفع</>}
          </button>
        </div>
      </div>
    </div>
  );
}
