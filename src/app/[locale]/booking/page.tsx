'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '@/infrastructure/firebase/config';
import { collection, getDocs, query, where, orderBy, doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useSearchParams, useParams } from 'next/navigation';
import { Service } from '@/domain/types/service';
import { tField } from '@/domain/types/settings';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { FiClipboard } from 'react-icons/fi';

import DetailsStep from '@/presentation/components/Booking/DetailsStep';
import PaymentStep from '@/presentation/components/Booking/PaymentStep';
import ConfirmationStep from '@/presentation/components/Booking/ConfirmationStep';

type BookingStep = 'details' | 'payment' | 'confirmation';

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || 'ar';
  const preSelectedService = searchParams.get('service') || '';

  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [step, setStep] = useState<BookingStep>('details');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    serviceId: preSelectedService,
    notes: '',
    paymentMethod: '' as '' | 'instapay_qr' | 'e_wallet',
    paymentProofUrl: '',
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

  const handleSubmitBooking = async () => {
    if (!form.customerName || !form.customerPhone || !form.serviceId) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setStep('payment');
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProof(true);
    try {
      const url = await CloudinaryService.uploadImage(file);
      setForm(prev => ({ ...prev, paymentProofUrl: url }));
    } catch (err) {
      alert('فشل رفع صورة الإثبات. تأكد من إعداد Cloudinary.');
    }
    setUploadingProof(false);
  };

  const handleFinalSubmit = async () => {
    if (!form.paymentMethod) {
      alert('يرجى اختيار طريقة الدفع');
      return;
    }
    if (!form.paymentProofUrl) {
      alert('يرجى رفع صورة إثبات الدفع');
      return;
    }

    setSubmitting(true);
    try {
      const id = `booking-${Date.now()}`;
      const serviceName = selectedService ? tField(selectedService.name, 'ar') : '';

      const bookingData = {
        id,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerAddress: form.customerAddress,
        customerUid: user?.uid || '',
        serviceId: form.serviceId,
        serviceName,
        notes: form.notes,
        status: 'pending',
        paymentStatus: 'pending',
        paymentProofUrl: form.paymentProofUrl,
        paymentMethod: form.paymentMethod,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'bookings', id), bookingData);

      // Also create a payment record
      const paymentId = `payment-${Date.now()}`;
      await setDoc(doc(db, 'payments', paymentId), {
        id: paymentId,
        bookingId: id,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        amount: '',
        method: form.paymentMethod,
        proofImageUrl: form.paymentProofUrl,
        status: 'pending',
        confirmedBy: '',
        confirmedAt: '',
        createdAt: new Date().toISOString(),
      });

      setBookingId(id);
      setStep('confirmation');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إرسال الحجز');
    }
    setSubmitting(false);
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
            {(['details', 'payment', 'confirmation'] as BookingStep[]).map((s, idx) => (
              <React.Fragment key={s}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                  step === s ? 'bg-white text-brand-navy scale-110' : 
                  (['details', 'payment', 'confirmation'].indexOf(step) > idx) ? 'bg-brand-teal text-white' : 'bg-white/20 text-white/60'
                }`}>
                  {idx + 1}
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-1 rounded-full transition-all ${
                    (['details', 'payment', 'confirmation'].indexOf(step) > idx) ? 'bg-brand-teal' : 'bg-white/20'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center justify-between max-w-md mx-auto mt-2 text-xs text-white/60 font-bold">
            <span>البيانات</span>
            <span>الدفع</span>
            <span>التأكيد</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-2xl">

          {/* ============ STEP 1: DETAILS ============ */}
          {step === 'details' && (
            <DetailsStep 
              form={form}
              setForm={setForm}
              user={user}
              services={services}
              locale={locale}
              onSubmit={handleSubmitBooking}
            />
          )}

          {/* ============ STEP 2: PAYMENT ============ */}
          {step === 'payment' && (
            <PaymentStep 
              form={form}
              setForm={setForm}
              settings={settings}
              submitting={submitting}
              uploadingProof={uploadingProof}
              selectedService={selectedService}
              locale={locale}
              onProofUpload={handleProofUpload}
              onSubmit={handleFinalSubmit}
              onBack={() => setStep('details')}
            />
          )}

          {/* ============ STEP 3: CONFIRMATION ============ */}
          {step === 'confirmation' && (
            <ConfirmationStep 
              form={form}
              bookingId={bookingId}
              settings={settings}
              selectedService={selectedService}
              locale={locale}
            />
          )}
        </div>
      </section>
    </div>
  );
}

