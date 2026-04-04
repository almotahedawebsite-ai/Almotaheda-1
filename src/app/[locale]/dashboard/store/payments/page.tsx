'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { StoreRepository } from '@/modules/ecom/repositories/StoreRepository';
import { PaymentMethod } from '@/domain/types/store';
import { TranslatableString } from '@/domain/types/settings';
import { TranslatableField } from '@/presentation/components/Dashboard/TranslatableField';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { FiCreditCard, FiTrash2, FiSettings, FiX, FiSave, FiDollarSign, FiSmartphone, FiBriefcase } from 'react-icons/fi';

export default function StorePaymentsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [saving, setSaving] = useState(false);
  
  const repo = new StoreRepository(db);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    const existingData = await repo.getPaymentMethods();
    
    // Improved Seeding: Ensure all core methods exist without duplicating
    // We use the 'provider' as the 'id' for core system methods
    const coreMethods: Partial<PaymentMethod>[] = [
      { id: 'cod', name: 'الدفع عند الاستلام (COD)', provider: 'cod', enabled: true, config: {} },
      { id: 'stripe', name: 'بطاقة ائتمان (Stripe)', provider: 'stripe', enabled: false, config: { publishableKey: '', secretKey: '' } },
      { id: 'paypal', name: 'PayPal', provider: 'paypal', enabled: false, config: { clientId: '' } },
      { id: 'fawry', name: 'Fawry (فوري)', provider: 'fawry', enabled: false, config: { merchantCode: '', securityKey: '' } },
      { id: 'paymob', name: 'Paymob', provider: 'paymob', enabled: false, config: { integrationId: '', apiKey: '' } },
      { id: 'wallet', name: 'محافظ إلكترونية (Wallet)', provider: 'wallet', enabled: false, config: { phoneNumber: '', instructions: { ar: 'قم بالتحويل للرقم الموضح وادرج رقم العملية', en: 'Transfer to the number and include transaction ID' }, qrCode: '' } },
      { id: 'bank', name: 'تحويل بنكي (Bank)', provider: 'bank', enabled: false, config: { iban: '', bankName: '', instructions: { ar: 'حول المبلغ لحسابنا البنكي', en: 'Transfer to our bank account' } } },
    ];

    // Check if we need to sync/add new methods to Firestore
    const existingProviders = existingData.map(m => m.provider);
    for (const core of coreMethods) {
      if (!existingProviders.includes(core.provider as any)) {
        await repo.savePaymentMethod(core);
      }
    }

    const finalData = await repo.getPaymentMethods();
    setMethods(finalData);
    setLoading(false);
  };

  const toggleMethod = async (method: PaymentMethod) => {
    const updated = { ...method, enabled: !method.enabled };
    await repo.savePaymentMethod(updated);
    setMethods(methods.map(m => m.id === method.id ? updated : m));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الوسيلة؟')) return;
    await repo.deletePaymentMethod(id);
    setMethods(methods.filter(m => m.id !== id));
  };

  const handleSaveConfig = async () => {
    if (!editingMethod) return;
    setSaving(true);
    try {
      await repo.savePaymentMethod(editingMethod);
      setMethods(methods.map(m => m.id === editingMethod.id ? editingMethod : m));
      setEditingMethod(null);
    } catch (e) {
      alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadQR = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingMethod) return;
    setSaving(true);
    try {
      const url = await CloudinaryService.uploadImage(file);
      setEditingMethod({ ...editingMethod, config: { ...editingMethod.config, qrCode: url } });
    } catch (e) {
      alert('فشل رفع الصورة');
    } finally {
      setSaving(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'cod': return <FiDollarSign />;
      case 'stripe': return <FiCreditCard />;
      case 'paypal': return <FiCreditCard />;
      case 'fawry': return <FiSmartphone />;
      case 'paymob': return <FiSmartphone />;
      case 'wallet': return <FiSmartphone />;
      case 'bank': return <FiBriefcase />;
      default: return <FiDollarSign />;
    }
  };

  if (loading) return <div className="p-10 text-gray-400 font-bold">جاري تحميل طرق الدفع المتوفرة...</div>;

  return (
    <>
      <div className="p-8 space-y-8 animate-fade-in-up">
        {/* Header */}
          <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
               <span className="p-3 bg-purple-50 text-purple-600 rounded-2xl text-2xl"><FiCreditCard /></span> طرق الدفع المتاحة
            </h1>
            <p className="text-gray-500 mt-2 text-lg">تحكم في بوابات الدفع الإلكترونية والتحويلات اليدوية</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methods.map(method => (
            <div 
              key={method.id} 
              className={`bg-white p-8 rounded-3xl border-2 transition-all shadow-sm flex flex-col justify-between h-80 ${method.enabled ? 'border-purple-200 ring-4 ring-purple-50' : 'border-gray-100 opacity-60'}`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-5xl">{getProviderIcon(method.provider)}</span>
                  <div className="flex flex-col items-end gap-2">
                     <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${method.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {method.enabled ? 'نشط' : 'غير نشط'}
                     </div>
                     <button 
                       onClick={() => handleDelete(method.id)}
                       className="text-gray-300 hover:text-red-500 transition-colors text-xs flex items-center gap-1"
                       title="حذف"
                     >
                        <FiTrash2 /> حذف
                     </button>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{method.name}</h2>
                <button 
                  onClick={() => setEditingMethod(method)}
                  className="text-xs font-black text-purple-600 hover:underline flex items-center gap-1"
                >
                   <FiSettings /> ضبط الإعدادات
                </button>
              </div>

              <button 
                onClick={() => toggleMethod(method)}
                className={`w-full py-4 rounded-2xl font-black transition-all mt-6 ${method.enabled ? 'bg-slate-900 text-white hover:bg-red-600' : 'bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white'}`}
              >
                {method.enabled ? 'تعطيل الوسيلة' : 'تفعيل الآن'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CONFIGURATION DRAWER */}
      {editingMethod && (
        <div className="fixed inset-y-0 left-0 right-0 z-[100] flex justify-end">
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setEditingMethod(null)} />
          
          <div className="relative w-full max-w-md md:max-w-lg bg-white h-full shadow-2xl flex flex-col border-r border-gray-100 animate-slide-in-left">
              <div className="p-6 border-b bg-gray-50 flex justify-between items-center shrink-0">
                 <h2 className="text-xl font-black flex items-center gap-3">
                    <span>{getProviderIcon(editingMethod.provider)}</span> إعدادات {editingMethod.name}
                 </h2>
                 <button onClick={() => setEditingMethod(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors font-bold"><FiX /></button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6 text-right custom-scrollbar" dir="rtl">
                 
                 {/* Dynamic Fields based on provider */}
                 {editingMethod.provider === 'stripe' && (
                   <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">Publishable Key</label>
                        <input className="w-full p-4 bg-white shadow-inner border-none rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-purple-200" value={editingMethod.config?.publishableKey} onChange={e => setEditingMethod({...editingMethod, config: {...editingMethod.config, publishableKey: e.target.value}})} />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">Secret Key</label>
                        <input className="w-full p-4 bg-white shadow-inner border-none rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-purple-200" type="password" value={editingMethod.config?.secretKey} onChange={e => setEditingMethod({...editingMethod, config: {...editingMethod.config, secretKey: e.target.value}})} />
                      </div>
                   </div>
                 )}

                 {editingMethod.provider === 'fawry' && (
                   <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">Merchant Code (كود التاجر)</label>
                        <input className="w-full p-4 bg-white shadow-inner border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200" value={editingMethod.config?.merchantCode} onChange={e => setEditingMethod({...editingMethod, config: {...editingMethod.config, merchantCode: e.target.value}})} />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">Security Key</label>
                        <input className="w-full p-4 bg-white shadow-inner border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200" value={editingMethod.config?.securityKey} onChange={e => setEditingMethod({...editingMethod, config: {...editingMethod.config, securityKey: e.target.value}})} />
                      </div>
                   </div>
                 )}

                 {(editingMethod.provider === 'wallet' || editingMethod.provider === 'bank') && (
                   <div className="space-y-6">
                      {editingMethod.provider === 'wallet' && (
                        <div>
                          <label className="block text-sm font-black text-gray-700 mb-2">رقم المحفظة (مثلاً فودافون كاش)</label>
                          <input className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm outline-none focus:ring-2 focus:ring-purple-200 font-black tracking-wider text-purple-600" value={editingMethod.config?.phoneNumber} onChange={e => setEditingMethod({...editingMethod, config: {...editingMethod.config, phoneNumber: e.target.value}})} dir="ltr" />
                        </div>
                      )}
                      {editingMethod.provider === 'bank' && (
                        <div>
                          <label className="block text-sm font-black text-gray-700 mb-2">رقم الحساب / IBAN</label>
                          <input className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm outline-none focus:ring-2 focus:ring-purple-200 font-mono tracking-widest text-purple-600" value={editingMethod.config?.iban} onChange={e => setEditingMethod({...editingMethod, config: {...editingMethod.config, iban: e.target.value}})} dir="ltr" />
                        </div>
                      )}
                      
                      <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                        <TranslatableField 
                          label="تعليمات الدفع للعميل" 
                          value={editingMethod.config?.instructions as TranslatableString} 
                          onChange={val => setEditingMethod({...editingMethod, config: {...editingMethod.config, instructions: val}})}
                          enableMultiLanguage={true}
                          isTextArea={true}
                        />
                      </div>

                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                         <label className="block text-sm font-black text-gray-700 mb-2">صورة QR Code للتحويل (اختياري)</label>
                         <input type="file" onChange={handleUploadQR} className="text-xs text-gray-500 w-full cursor-pointer" />
                         {editingMethod.config?.qrCode && (
                           <div className="mt-4 p-2 bg-white border border-gray-200 rounded-xl inline-block shadow-sm">
                             <img src={editingMethod.config.qrCode} className="w-32 h-32 object-contain" />
                           </div>
                         )}
                      </div>
                   </div>
                 )}

                 {editingMethod.provider === 'cod' && (
                   <div className="bg-gray-50 p-10 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                     <span className="text-4xl mb-4 text-gray-300 opacity-50"><FiSettings /></span>
                     <p className="text-gray-400 font-bold mb-1">إعدادات غير ضرورية</p>
                     <p className="text-gray-400 text-xs text-balance">لا توجد إعدادات إضافية مطلوبة لبوابة الدفع عند الاستلام.</p>
                   </div>
                 )}
              </div>

              <div className="p-6 bg-white border-t border-gray-100 shrink-0">
                 <button 
                   onClick={handleSaveConfig} 
                   disabled={saving}
                   className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-black shadow-lg shadow-purple-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                 >
                   {saving ? '... جاري الحفظ' : <><FiSave /> حفظ الإعدادات المطلوبة</>}
                 </button>
              </div>
          </div>
        </div>
      )}
    </>
  );
}

