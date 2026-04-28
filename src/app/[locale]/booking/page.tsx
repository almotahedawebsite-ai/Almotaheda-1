'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '@/infrastructure/firebase/config';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useSearchParams, useParams } from 'next/navigation';
import { Service } from '@/domain/types/service';
import { tField } from '@/domain/types/settings';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';
import { FiClipboard, FiEdit, FiInfo, FiArrowLeft, FiCheckCircle, FiHome } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

type BookingStep = 'details' | 'confirmation';

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || 'ar';
  const preSelectedService = searchParams.get('service') || '';

  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [step, setStep] = useState<BookingStep>('details');

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    serviceId: preSelectedService,
    notes: '',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setForm(prev => ({
          ...prev,
          customerName: u.displayName || prev.customerName,
        }));
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, 'services');
        const q = query(colRef, where('isActive', '==', true), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        setServices(snapshot.docs.map(d => d.data() as Service));

        const settingsRepo = new SettingsRepository(db);
        const s = await settingsRepo.getGlobalSettings();
        setSettings(s);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const selectedService = services.find(s => s.id === form.serviceId);

  const handleSubmitToWhatsApp = () => {
    if (!form.customerName || !form.customerPhone || !form.serviceId) {
      alert(locale === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    const serviceName = selectedService ? tField(selectedService.name, 'ar') : '';
    const whatsappNumber = (settings.contactWhatsapp || settings.whatsappCta || '').replace(/[^0-9]/g, '');

    if (!whatsappNumber) {
      alert(locale === 'ar' ? 'عذراً، رقم الواتساب غير متاح حالياً' : 'Sorry, WhatsApp number is not available');
      return;
    }

    // Build Arabic WhatsApp message
    const message = [
      '🏢 *طلب حجز خدمة — المتحدة*',
      '',
      `👤 *الاسم:* ${form.customerName}`,
      `📱 *الهاتف:* ${form.customerPhone}`,
      form.customerAddress ? `📍 *العنوان:* ${form.customerAddress}` : '',
      `🧹 *الخدمة المطلوبة:* ${serviceName}`,
      form.notes ? `📝 *ملاحظات:* ${form.notes}` : '',
      '',
      '⏳ في انتظار التأكيد من فريق المتحدة',
    ].filter(Boolean).join('\n');

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Show confirmation step first
    setStep('confirmation');

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="pt-20 animate-fade-in-up">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-brand-navy to-brand-dark text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-black mb-4">
            <FiClipboard /> {locale === 'ar' ? 'احجز خدمتك' : 'Book Your Service'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            {locale === 'ar' ? 'نموذج الحجز' : 'Booking Form'}
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mt-8 max-w-md mx-auto">
            {(['details', 'confirmation'] as BookingStep[]).map((s, idx) => (
              <React.Fragment key={s}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                  step === s ? 'bg-white text-brand-navy scale-110' : 
                  (['details', 'confirmation'].indexOf(step) > idx) ? 'bg-brand-teal text-white' : 'bg-white/20 text-white/60'
                }`}>
                  {idx + 1}
                </div>
                {idx < 1 && (
                  <div className={`flex-1 h-1 rounded-full transition-all ${
                    (['details', 'confirmation'].indexOf(step) > idx) ? 'bg-brand-teal' : 'bg-white/20'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center justify-between max-w-md mx-auto mt-2 text-xs text-white/60 font-bold">
            <span>{locale === 'ar' ? 'البيانات' : 'Details'}</span>
            <span>{locale === 'ar' ? 'التأكيد' : 'Confirmation'}</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-2xl">

          {/* ============ STEP 1: DETAILS ============ */}
          {step === 'details' && (
            <div className="bg-gray-50 dark:bg-slate-800 p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-slate-700 space-y-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2"><FiEdit /> {locale === 'ar' ? 'بيانات الحجز' : 'Booking Details'}</h2>

              {!user && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-4 rounded-2xl">
                  <div className="flex items-start gap-2"><FiInfo className="text-blue-700 dark:text-blue-300 mt-1 shrink-0" /><p className="text-sm text-blue-700 dark:text-blue-300 font-bold">
                    {locale === 'ar' ? (
                      <>يمكنك <Link href={`/${locale}/login`} className="underline">تسجيل الدخول بحساب جوجل</Link> لملء بياناتك تلقائياً</>
                    ) : (
                      <>You can <Link href={`/${locale}/login`} className="underline">sign in with Google</Link> to auto-fill your details</>
                    )}
                  </p></div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{locale === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}</label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all text-gray-900 dark:text-white"
                  placeholder={locale === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{locale === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}</label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => setForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all text-gray-900 dark:text-white"
                  dir="ltr"
                  placeholder="01xxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{locale === 'ar' ? 'العنوان' : 'Address'}</label>
                <input
                  type="text"
                  value={form.customerAddress}
                  onChange={(e) => setForm(prev => ({ ...prev, customerAddress: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all text-gray-900 dark:text-white"
                  placeholder={locale === 'ar' ? 'أدخل العنوان بالتفصيل' : 'Enter your detailed address'}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{locale === 'ar' ? 'الخدمة المطلوبة *' : 'Required Service *'}</label>
                <select
                  value={form.serviceId}
                  onChange={(e) => setForm(prev => ({ ...prev, serviceId: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all text-gray-900 dark:text-white"
                >
                  <option value="">{locale === 'ar' ? '— اختر الخدمة —' : '— Select Service —'}</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{tField(s.name, locale)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{locale === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all text-gray-900 dark:text-white"
                  rows={3}
                  placeholder={locale === 'ar' ? 'أي تفاصيل إضافية تريد إخبارنا بها...' : 'Any additional details...'}
                />
              </div>

              <button
                onClick={handleSubmitToWhatsApp}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-black text-lg transition-all hover:shadow-xl hover:shadow-green-500/20 flex items-center justify-center gap-3"
              >
                <FaWhatsapp className="text-2xl" /> {locale === 'ar' ? 'إرسال عبر واتساب' : 'Send via WhatsApp'}
              </button>
            </div>
          )}

          {/* ============ STEP 2: CONFIRMATION ============ */}
          {step === 'confirmation' && (
            <div className="text-center space-y-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-12 rounded-3xl border border-green-100 dark:border-green-800/30">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 animate-scale-in text-green-600">
                  <FiCheckCircle />
                </div>
                <h2 className="text-3xl font-black text-green-800 dark:text-green-300 mb-4">
                  {locale === 'ar' ? 'تم إرسال طلبك!' : 'Request Sent!'}
                </h2>
                <p className="text-green-600 dark:text-green-500 max-w-md mx-auto">
                  {locale === 'ar'
                    ? 'تم توجيهك إلى واتساب لإرسال طلب الحجز. إذا لم يتم فتح واتساب تلقائياً، اضغط الزر أدناه.'
                    : 'You have been redirected to WhatsApp. If it did not open automatically, click the button below.'}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 text-right">
                <h3 className="font-black text-gray-900 dark:text-white mb-4 text-lg flex items-center gap-2"><FiClipboard /> {locale === 'ar' ? 'ملخص طلبك' : 'Request Summary'}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">{locale === 'ar' ? 'الاسم:' : 'Name:'}</span> <span className="font-bold">{form.customerName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">{locale === 'ar' ? 'الهاتف:' : 'Phone:'}</span> <span className="font-bold" dir="ltr">{form.customerPhone}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">{locale === 'ar' ? 'الخدمة:' : 'Service:'}</span> <span className="font-bold text-brand-teal">{selectedService ? tField(selectedService.name, locale) : ''}</span></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={`/${locale}`}
                  className="bg-brand-navy text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-brand-teal"
                >
                  <div className="flex items-center gap-2"><FiHome /> {locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</div>
                </Link>
                {(settings.whatsappCta || settings.contactWhatsapp) && (
                  <a
                    href={`https://wa.me/${(settings.contactWhatsapp || settings.whatsappCta || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `🏢 *طلب حجز خدمة — المتحدة*\n\n👤 *الاسم:* ${form.customerName}\n📱 *الهاتف:* ${form.customerPhone}\n${form.customerAddress ? `📍 *العنوان:* ${form.customerAddress}\n` : ''}🧹 *الخدمة:* ${selectedService ? tField(selectedService.name, 'ar') : ''}\n${form.notes ? `📝 *ملاحظات:* ${form.notes}\n` : ''}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold transition-all inline-flex items-center gap-2 shadow-lg shadow-green-500/20"
                  >
                    <FaWhatsapp className="text-xl" /> {locale === 'ar' ? 'فتح واتساب مرة أخرى' : 'Open WhatsApp Again'}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
