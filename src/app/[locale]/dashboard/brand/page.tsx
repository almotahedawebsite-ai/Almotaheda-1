'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';
import { SiteSettings } from '@/domain/types/settings';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { TranslatableField } from '@/presentation/components/Dashboard/TranslatableField';
import { TranslatableString } from '@/domain/types/settings';
import { FiSave } from 'react-icons/fi';

export default function BrandSettingsPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      alert('تم حفظ الهوية بنجاح!');
    } catch (e) {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await CloudinaryService.uploadImage(file);
      setSettings(s => ({ ...s, logoUrl: url }));
    } catch (err) {
      alert('فشل رفع الشعار');
    }
  };

  if (loading) return <div className="p-10">جاري تحميل الإعدادات...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900">الهوية البصرية (Brand Identity)</h1>
          <p className="text-gray-500 mt-1">المكان الذي يُحدد اسم موقعك وشعاره وألوانه التي تنعكس على كل الصفحات.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? 'جاري الحفظ...' : <><FiSave /> حفظ الهوية</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Logo and Name */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <h2 className="text-xl font-bold border-b pb-2">الاسم والشعار</h2>

          <div className="mb-4">
            <TranslatableField 
              label="اسم الموقع (Site Name)"
              value={settings.siteName}
              onChange={(val: TranslatableString) => setSettings({...settings, siteName: val})}
              enableMultiLanguage={!!settings.enableMultiLanguage}
              placeholder="مثال: شركة العقارات الحديثة"
            />
            <p className="text-xs text-gray-400 mt-2">* سيظهر هذا الاسم في الـ Navbar والـ Footer واسم المتصفح.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">لوجو الموقع (Logo)</label>
            <div className="flex items-center gap-6 border-2 border-dashed border-gray-200 rounded-xl p-6">
              <div className="w-24 h-24 bg-gray-50 rounded-xl border flex items-center justify-center overflow-hidden shrink-0">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-400 text-sm">لا يوجد</span>
                )}
              </div>
              <div className="flex-1">
                <input type="file" className="text-sm" onChange={uploadLogo} />
                <p className="text-xs text-gray-400 mt-2">يفضل أن يكون بصيغة PNG وبخلفية شفافة لتتطابق مع الـ Navbar.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Colors */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <h2 className="text-xl font-bold border-b pb-2">ألوان الموقع (CSS Variables)</h2>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between items-center">
              <span>اللون الرئيسي (Primary Color)</span>
              <span className="text-xs font-mono text-gray-500">{settings.primaryColor}</span>
            </label>
            <div className="flex gap-4 items-center">
              <input 
                type="color" 
                className="w-16 h-16 rounded cursor-pointer border-0 p-0" 
                value={settings.primaryColor || '#2563eb'}
                onChange={e => setSettings({...settings, primaryColor: e.target.value})}
              />
              <p className="text-sm text-gray-500 flex-1">لون الأزرار والعناصر البارزة الأساسية في الموقع.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between items-center">
              <span>اللون الثانوي (Secondary Color)</span>
              <span className="text-xs font-mono text-gray-500">{settings.secondaryColor}</span>
            </label>
            <div className="flex gap-4 items-center">
              <input 
                type="color" 
                className="w-16 h-16 rounded cursor-pointer border-0 p-0" 
                value={settings.secondaryColor || '#1e40af'}
                onChange={e => setSettings({...settings, secondaryColor: e.target.value})}
              />
              <p className="text-sm text-gray-500 flex-1">لون الـ Hover والتأثيرات، أو لون خلفية الفوتر.</p>
            </div>
          </div>
          
          <div className="mt-auto p-4 bg-gray-50 rounded-xl border">
            <p className="text-sm text-gray-600 mb-3">تجربة حية للأزرار (Live Preview):</p>
            <button 
              className="px-6 py-2 rounded-lg text-white font-bold w-full transition-colors"
              style={{ backgroundColor: settings.primaryColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = settings.secondaryColor || ''}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = settings.primaryColor || ''}
            >
              اضغط هنا
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
