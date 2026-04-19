'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';
import { SiteSettings } from '@/domain/types/settings';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { TranslatableField } from '@/presentation/components/Dashboard/TranslatableField';
import { TranslatableString } from '@/domain/types/settings';
import { FiSave, FiImage, FiDroplet, FiCamera, FiLayout } from 'react-icons/fi';
import DashboardPageTemplate from '@/presentation/components/Dashboard/DashboardPageTemplate';
import BrandLogoSection from '@/presentation/components/Dashboard/Brand/BrandLogoSection';
import BrandColorsSection from '@/presentation/components/Dashboard/Brand/BrandColorsSection';
import BrandMediaSection from '@/presentation/components/Dashboard/Brand/BrandMediaSection';
import BrandNavbarSection from '@/presentation/components/Dashboard/Brand/BrandNavbarSection';
import SettingsAccordionGroup from '@/presentation/components/Dashboard/SettingsAccordionGroup';

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

  const revalidateCache = async () => {
    try {
      await fetch('/api/revalidate-settings', { method: 'POST' });
    } catch (err) {
      console.warn('[revalidateCache] فشل تحديث الكاش:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await repo.saveGlobalSettings(settings);
      await revalidateCache();
      alert('تم حفظ الهوية بنجاح! سيظهر اللوجو في الموقع الآن.');
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
      // Auto-save the logo URL immediately after upload
      await repo.saveGlobalSettings({ ...settings, logoUrl: url });
      await revalidateCache();
      alert('تم رفع اللوجو وحفظه بنجاح! سيظهر في الموقع الآن.');
    } catch (err) {
      alert('فشل رفع الشعار');
    }
  };

  const uploadMediaImage = async (e: React.ChangeEvent<HTMLInputElement>, key: 'heroImage' | 'aboutImage', successMsg: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await CloudinaryService.uploadImage(file);
      setSettings(s => ({ ...s, [key]: url }));
      await repo.saveGlobalSettings({ ...settings, [key]: url });
      await revalidateCache();
      alert(successMsg);
    } catch (err) {
      alert('فشل رفع الصورة');
    }
  };

  const removeMediaImage = async (key: 'heroImage' | 'aboutImage', successMsg: string) => {
    setSettings(s => ({ ...s, [key]: '' }));
    await repo.saveGlobalSettings({ ...settings, [key]: '' });
    await revalidateCache();
    alert(successMsg);
  };

  if (loading) return <div className="p-10">جاري تحميل الإعدادات...</div>;

  const headerActions = (
    <button 
      onClick={handleSave} 
      disabled={saving}
      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {saving ? 'جاري الحفظ...' : <><FiSave /> حفظ الهوية</>}
    </button>
  );

  const sections = [
    {
      id: 'logo',
      title: 'الاسم والشعار',
      icon: <FiImage />,
      content: (
        <SettingsAccordionGroup title="إدارة الاسم والشعار" icon={<FiImage />}>
          <BrandLogoSection settings={settings} setSettings={setSettings} uploadLogo={uploadLogo} />
        </SettingsAccordionGroup>
      )
    },
    {
      id: 'colors',
      title: 'ألوان الموقع (CSS Variables)',
      icon: <FiDroplet />,
      content: (
        <SettingsAccordionGroup title="إدارة ألوان الهوية البصرية" icon={<FiDroplet />}>
          <BrandColorsSection settings={settings} setSettings={setSettings} />
        </SettingsAccordionGroup>
      )
    },
    {
      id: 'media',
      title: 'صور الموقع (Website Media)',
      icon: <FiCamera />,
      content: (
        <SettingsAccordionGroup title="إدارة الميديا وصور الموقع" icon={<FiCamera />}>
          <BrandMediaSection settings={settings} setSettings={setSettings} uploadMediaImage={uploadMediaImage} removeMediaImage={removeMediaImage} />
        </SettingsAccordionGroup>
      )
    },
    {
      id: 'navbar',
      title: 'مظهر شريط التنقل (Navbar)',
      icon: <FiLayout />,
      content: (
        <SettingsAccordionGroup title="إعدادات شريط التنقل" icon={<FiLayout />}>
          <BrandNavbarSection settings={settings} setSettings={setSettings} />
        </SettingsAccordionGroup>
      )
    }
  ];

  return (
    <DashboardPageTemplate
      title="الهوية البصرية (Brand Identity)"
      description="المكان الذي يُحدد اسم موقعك وشعاره وألوانه التي تنعكس على كل الصفحات."
      headerActions={headerActions}
      sections={sections}
    />
  );
}
