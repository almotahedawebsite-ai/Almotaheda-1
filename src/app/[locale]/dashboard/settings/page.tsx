'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';
import { SiteSettings } from '@/domain/types/settings';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { triggerRevalidation } from '@/app/actions/revalidate';
import { FiSearch, FiSave, FiGlobe, FiFileText } from 'react-icons/fi';

import GlobalSettingsTab from '@/presentation/components/Dashboard/Settings/GlobalSettingsTab';
import PagesSettingsTab from '@/presentation/components/Dashboard/Settings/PagesSettingsTab';

export default function GlobalSettingsPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'global' | 'pages'>('global');
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
      await triggerRevalidation('settings');
      alert('تم حفظ إعدادات الـ SEO بنجاح! \nالتغييرات هتظهر في الموقع فوراً.');
    } catch (e) {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, field: 'faviconUrl' | 'metaGraphImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await CloudinaryService.uploadImage(file);
      setSettings(s => ({ ...s, [field]: url }));
    } catch (err) {
      alert('فشل رفع الصورة');
    }
  };

  const updatePageSeo = (pageKey: string, field: string, value: any) => {
    const current = settings.pagesSeo || {};
    const pageData = current[pageKey] || { h1: { ar: '', en: '' }, h2: { ar: '', en: '' }, metaTitle: { ar: '', en: '' }, metaDescription: { ar: '', en: '' } };
    setSettings({
      ...settings,
      pagesSeo: {
        ...current,
        [pageKey]: { ...pageData, [field]: value },
      },
    });
  };

  if (loading) return <div className="p-10 font-bold text-gray-400 text-center">جاري تحميل الإعدادات...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><FiSearch className="text-brand-teal" /> إعدادات الـ SEO والأرشفة</h1>
          <p className="text-gray-500 mt-1">تحكم في ظهور موقعك في نتائج جوجل ومنصات التواصل</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-brand-teal hover:bg-brand-navy text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 shrink-0 flex items-center gap-2"
        >
          {saving ? 'جاري الحفظ...' : <><FiSave /> حفظ التعديلات</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-100">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'global' ? 'bg-brand-teal text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <FiGlobe /> الإعدادات العامة
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'pages' ? 'bg-brand-teal text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <FiFileText /> إعدادات الصفحات (H1/H2/Meta)
        </button>
      </div>

      {/* ================== TAB 1: Global SEO ================== */}
      {activeTab === 'global' && (
        <GlobalSettingsTab settings={settings} setSettings={setSettings} uploadImage={uploadImage} />
      )}

      {/* ================== TAB 2: Per-Page SEO ================== */}
      {activeTab === 'pages' && (
        <PagesSettingsTab settings={settings} updatePageSeo={updatePageSeo} />
      )}
    </div>
  );
}

