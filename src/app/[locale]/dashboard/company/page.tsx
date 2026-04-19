'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';
import { SiteSettings } from '@/domain/types/settings';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { FiPhone, FiLink, FiFileText } from 'react-icons/fi';
import DashboardPageTemplate from '@/presentation/components/Dashboard/DashboardPageTemplate';
import CompanyContactSection from '@/presentation/components/Dashboard/Company/CompanyContactSection';
import CompanySocialSection from '@/presentation/components/Dashboard/Company/CompanySocialSection';
import CompanyAboutSection from '@/presentation/components/Dashboard/Company/CompanyAboutSection';
import SettingsAccordionGroup from '@/presentation/components/Dashboard/SettingsAccordionGroup';

export default function CorporateSettingsPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const repo = new SettingsRepository(db);

  useEffect(() => {
    repo.getGlobalSettings().then((data) => {
      // Ensure socialLinks is an array to prevent crashes
      setSettings(data.socialLinks ? data : { ...data, socialLinks: [] });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await repo.saveGlobalSettings(settings);
      alert('تم حفظ البيانات المؤسسية بنجاح!');
    } catch (e) {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const uploadAboutImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await CloudinaryService.uploadImage(file);
      setSettings(s => ({ ...s, aboutImage: url }));
    } catch (err) {
      alert('فشل رفع صورة من نحن');
    }
  };

  const handleAddSocialLink = () => {
    const newLinks = [...(settings.socialLinks || []), { platform: 'Facebook', url: '', icon: '' }];
    setSettings({ ...settings, socialLinks: newLinks });
  };

  const handleUpdateSocialLink = (index: number, field: 'platform' | 'url' | 'icon', value: string) => {
    const newLinks = [...(settings.socialLinks || [])];
    newLinks[index][field] = value;
    setSettings({ ...settings, socialLinks: newLinks });
  };

  const handleUploadSocialIcon = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await CloudinaryService.uploadImage(file);
      handleUpdateSocialLink(index, 'icon', url);
    } catch (err) {
      alert('فشل رفع أيقونة السوشيال');
    }
  };

  const handleRemoveSocialLink = (index: number) => {
    const newLinks = [...(settings.socialLinks || [])];
    newLinks.splice(index, 1);
    setSettings({ ...settings, socialLinks: newLinks });
  };

  if (loading) return <div className="p-10">جاري تحميل الإعدادات...</div>;

  const headerActions = (
    <button 
      onClick={handleSave} 
      disabled={saving}
      className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50"
    >
      {saving ? 'جاري الحفظ...' : 'حفظ البيانات'}
    </button>
  );

  const sections = [
    {
      id: 'contact',
      title: 'بيانات التواصل المباشر',
      icon: <FiPhone />,
      content: (
        <SettingsAccordionGroup title="إدارة أرقام وإيميلات التواصل" icon={<FiPhone />}>
          <CompanyContactSection settings={settings} setSettings={setSettings} />
        </SettingsAccordionGroup>
      )
    },
    {
      id: 'social',
      title: 'منصات التواصل الاجتماعي',
      icon: <FiLink />,
      content: (
        <SettingsAccordionGroup title="إدارة حسابات السوشيال ميديا" icon={<FiLink />}>
          <CompanySocialSection 
            settings={settings} 
            setSettings={setSettings} 
            handleAddSocialLink={handleAddSocialLink} 
            handleUpdateSocialLink={handleUpdateSocialLink} 
            handleUploadSocialIcon={handleUploadSocialIcon} 
            handleRemoveSocialLink={handleRemoveSocialLink} 
          />
        </SettingsAccordionGroup>
      )
    },
    {
      id: 'about',
      title: 'قصة الشركة (About Us)',
      icon: <FiFileText />,
      content: (
        <SettingsAccordionGroup title="إدارة نبذة الشركة والمحتوى" icon={<FiFileText />}>
          <CompanyAboutSection settings={settings} setSettings={setSettings} uploadAboutImage={uploadAboutImage} />
        </SettingsAccordionGroup>
      )
    }
  ];

  return (
    <DashboardPageTemplate
      title="البيانات المؤسسية"
      description="التحكم في بيانات التواصل والروابط ونبذة الشركة."
      headerActions={headerActions}
      sections={sections}
    />
  );
}
