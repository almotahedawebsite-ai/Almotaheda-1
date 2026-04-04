'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';
import { SiteSettings } from '@/domain/types/settings';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { FiSettings, FiSave, FiMessageCircle, FiCreditCard, FiSmartphone, FiX, FiCamera, FiDollarSign, FiMoon, FiGlobe, FiFlag } from 'react-icons/fi';

export default function PreferencesPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const repo = new SettingsRepository(db);

  useEffect(() => {
    repo.getGlobalSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await repo.saveGlobalSettings(settings);
      alert('تم تحديث الإعدادات بنجاح!');
      window.location.reload(); 
    } catch (e) {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingQr(true);
    try {
      const url = await CloudinaryService.uploadImage(file);
      setSettings({ ...settings, instapayQrImage: url });
    } catch (err) {
      alert('فشل رفع الصورة');
    }
    setUploadingQr(false);
  };

  if (loading) return <div className="p-10 font-bold text-gray-400">جاري تحميل الإعدادات...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-20">
      
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><FiSettings className="text-brand-teal" /> إعدادات النظام</h1>
          <p className="text-gray-500 mt-1">إعدادات الموقع والدفع والتواصل</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-brand-teal hover:bg-brand-navy text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 min-w-[140px] flex items-center justify-center gap-2"
        >
          {saving ? 'جاري الحفظ...' : <><FiSave /> حفظ التحديثات</>}
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-10">

        {/* ============================================
            SECTION 1: WhatsApp & Communication
            ============================================ */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="bg-green-50 p-2 rounded-xl text-green-500"><FiMessageCircle /></span> إعدادات التواصل والواتساب
          </h2>

          <div className="space-y-5 bg-green-50 p-6 rounded-2xl border border-green-100">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">رقم واتساب الحجز (CTA)</label>
              <p className="text-xs text-gray-500 mb-2">هذا الرقم سيظهر في زر الواتساب العائم وأزرار التواصل في صفحات الخدمات</p>
              <input
                type="text"
                value={settings.whatsappCta || ''}
                onChange={(e) => setSettings({ ...settings, whatsappCta: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none bg-white"
                dir="ltr"
                placeholder="مثال: +201234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">رقم واتساب التواصل العام</label>
              <p className="text-xs text-gray-500 mb-2">يظهر في قسم التواصل والفوتر</p>
              <input
                type="text"
                value={settings.contactWhatsapp || ''}
                onChange={(e) => setSettings({ ...settings, contactWhatsapp: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none bg-white"
                dir="ltr"
                placeholder="مثال: +201234567890"
              />
            </div>
          </div>
        </div>

        {/* ============================================
            SECTION 2: Payment Settings
            ============================================ */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="bg-purple-50 p-2 rounded-xl text-purple-500"><FiCreditCard /></span> إعدادات الدفع
          </h2>

            <div className="space-y-6 bg-purple-50 p-6 rounded-2xl border border-purple-100">
            {/* InstaPay QR */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2"><FiSmartphone className="text-purple-600" /> صورة InstaPay QR Code</label>
              <p className="text-xs text-gray-500 mb-3">هذه الصورة ستظهر للعميل في صفحة الحجز ليقوم بمسحها ودفع المبلغ</p>
              
              {settings.instapayQrImage && (
                <div className="mb-3 relative inline-block">
                  <img src={settings.instapayQrImage} alt="InstaPay QR" className="w-48 h-48 object-contain rounded-2xl border border-gray-200 bg-white p-2" />
                  <button
                    onClick={() => setSettings({ ...settings, instapayQrImage: '' })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold hover:bg-red-600"
                  >
                    <FiX />
                  </button>
                </div>
              )}
              
              <div className="flex gap-3 items-center flex-wrap">
                <label className="cursor-pointer">
                  <div className="bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 transition-colors inline-flex items-center gap-2">
                    {uploadingQr ? 'جاري الرفع...' : <><FiCamera /> رفع صورة QR</>}
                  </div>
                  <input type="file" accept="image/*" onChange={handleQrUpload} className="hidden" />
                </label>
                <span className="text-gray-400 text-xs">أو</span>
                <input
                  type="text"
                  value={settings.instapayQrImage || ''}
                  onChange={(e) => setSettings({ ...settings, instapayQrImage: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white"
                  dir="ltr"
                  placeholder="ألصق رابط صورة QR هنا"
                />
              </div>
            </div>

            {/* E-Wallet */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2"><FiDollarSign className="text-emerald-500" /> رقم المحفظة الإلكترونية</label>
              <p className="text-xs text-gray-500 mb-2">رقم المحفظة (فودافون كاش / إتصالات كاش / ...) الذي سيظهر للعميل لتحويل المبلغ</p>
              <input
                type="text"
                value={settings.eWalletNumber || ''}
                onChange={(e) => setSettings({ ...settings, eWalletNumber: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none bg-white"
                dir="ltr"
                placeholder="مثال: 01012345678"
              />
            </div>
          </div>
        </div>

        {/* ============================================
            SECTION 3: Dark Mode Toggle
            ============================================ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-colors">
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-slate-800 flex items-center gap-3">
              <span className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-slate-500"><FiMoon /></span> تفعيل الوضع الليلي (Dark Mode)
            </h3>
            <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
              إذا تم تفعيله، سيظهر زر في أعلى الموقع للزوار يسمح لهم بتبديل ألوان الموقع بين الفاتح والداكن.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-bold transition-colors ${settings.enableDarkMode ? 'text-brand-teal' : 'text-slate-400'}`}>
              {settings.enableDarkMode ? 'مُفعّل' : 'مُعطّل'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={!!settings.enableDarkMode} 
                onChange={e => setSettings({...settings, enableDarkMode: e.target.checked})}
              />
              <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-teal shadow-inner"></div>
            </label>
          </div>
        </div>

        {/* ============================================
            SECTION 4: Multi-Language Toggle
            ============================================ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-blue-50 border border-blue-200 rounded-2xl hover:bg-blue-100 transition-colors">
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-blue-900 flex items-center gap-3">
              <span className="bg-white p-2 rounded-lg shadow-sm border border-blue-100 text-blue-500"><FiGlobe /></span> تفعيل تعدد اللغات (i18n)
            </h3>
            <p className="text-sm text-blue-700 max-w-lg leading-relaxed">
              يسمح للزوار بقراءة المحتوى باللغة العربية والإنجليزية. تأكد من توفير الترجمات لكل الحقول.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-bold transition-colors ${settings.enableMultiLanguage ? 'text-secondary' : 'text-blue-300'}`}>
              {settings.enableMultiLanguage ? 'مُفعّل' : 'مُعطّل'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={!!settings.enableMultiLanguage} 
                onChange={e => setSettings({...settings, enableMultiLanguage: e.target.checked})}
              />
              <div className="w-14 h-7 bg-blue-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-secondary shadow-inner"></div>
            </label>
          </div>
        </div>

        {/* ============================================
            SECTION 5: Default Language
            ============================================ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-amber-50 border border-amber-200 rounded-2xl hover:bg-amber-100 transition-colors">
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-amber-900 flex items-center gap-3">
              <span className="bg-white p-2 rounded-lg shadow-sm border border-amber-100 text-amber-500"><FiFlag /></span> اللغة الافتراضية للموقع
            </h3>
            <p className="text-sm text-amber-700 max-w-lg leading-relaxed">
              اختر اللغة التي سيظهر بها الموقع أولاً للزوار الجدد.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={settings.defaultLocale || 'ar'}
              onChange={e => setSettings({...settings, defaultLocale: e.target.value as 'ar' | 'en'})}
              className="bg-white border-2 border-amber-200 text-amber-900 px-6 py-3 rounded-xl font-bold outline-none focus:ring-4 focus:ring-amber-200 transition-all cursor-pointer"
            >
              <option value="ar">العربية (Arabic)</option>
              <option value="en">الإنجليزية (English)</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
