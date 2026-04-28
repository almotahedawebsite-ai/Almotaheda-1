'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';
import { SiteSettings } from '@/domain/types/settings';
import { FiSettings, FiSave, FiMoon, FiGlobe, FiFlag } from 'react-icons/fi';

export default function PreferencesPage() {
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
      alert('تم تحديث الإعدادات بنجاح!');
      window.location.reload(); 
    } catch (e) {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 font-bold text-gray-400">جاري تحميل الإعدادات...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-20">
      
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><FiSettings className="text-brand-teal" /> إعدادات النظام</h1>
          <p className="text-gray-500 mt-1">إعدادات الموقع المتقدمة</p>
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
