import React, { Dispatch, SetStateAction } from 'react';
import { TranslatableField } from '@/presentation/components/Dashboard/TranslatableField';
import { TranslatableString, SiteSettings } from '@/domain/types/settings';

interface BrandLogoSectionProps {
  settings: Partial<SiteSettings>;
  setSettings: Dispatch<SetStateAction<Partial<SiteSettings>>>;
  uploadBrandImage: (e: React.ChangeEvent<HTMLInputElement>, key: 'logoUrl' | 'faviconUrl' | 'metaGraphImage', successMsg: string) => Promise<void>;
}

export default function BrandLogoSection({
  settings,
  setSettings,
  uploadBrandImage,
}: BrandLogoSectionProps) {
  return (
    <div className="flex flex-col gap-6">
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
        <label className="block text-sm font-bold text-gray-700 mb-2">لوجو الموقع الرئيسي (Logo)</label>
        <div className="flex items-center gap-6 border-2 border-dashed border-gray-200 rounded-xl p-6">
          <div className="w-24 h-24 bg-gray-50 rounded-xl border flex items-center justify-center overflow-hidden shrink-0">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <span className="text-gray-400 text-sm">لا يوجد</span>
            )}
          </div>
          <div className="flex-1">
            <input type="file" className="text-sm" onChange={e => uploadBrandImage(e, 'logoUrl', 'تم رفع اللوجو وحفظه بنجاح!')} />
            <p className="text-xs text-gray-400 mt-2">يُستخدم هذا الشعار في الـ Navbar والـ Footer. يفضل أن يكون بصيغة PNG وبخلفية شفافة.</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">أيقونة المتصفح (Favicon)</label>
        <div className="flex items-center gap-6 border-2 border-dashed border-gray-200 rounded-xl p-6">
          <div className="w-16 h-16 bg-gray-50 rounded-xl border flex items-center justify-center overflow-hidden shrink-0">
            {settings.faviconUrl ? (
              <img src={settings.faviconUrl} alt="Favicon" className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-gray-400 text-sm">لا يوجد</span>
            )}
          </div>
          <div className="flex-1">
            <input type="file" className="text-sm" onChange={e => uploadBrandImage(e, 'faviconUrl', 'تم رفع أيقونة المتصفح بنجاح!')} />
            <p className="text-xs text-gray-400 mt-2">تظهر هذه الأيقونة في تبويبات المتصفح بجانب اسم الموقع. (يُفضل أن تكون مربعة 1:1 بصيغة PNG أو ICO).</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">صورة المشاركة (OpenGraph / SEO Image)</label>
        <div className="flex items-center gap-6 border-2 border-dashed border-gray-200 rounded-xl p-6">
          <div className="w-32 h-20 bg-gray-50 rounded-xl border flex items-center justify-center overflow-hidden shrink-0">
            {settings.metaGraphImage ? (
              <img src={settings.metaGraphImage} alt="OG Image" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-sm">لا يوجد</span>
            )}
          </div>
          <div className="flex-1">
            <input type="file" className="text-sm" onChange={e => uploadBrandImage(e, 'metaGraphImage', 'تم رفع صورة المشاركة بنجاح!')} />
            <p className="text-xs text-gray-400 mt-2">تظهر هذه الصورة عند مشاركة رابط الموقع على واتساب، فيسبوك، تويتر وغيرها. (يُفضل مقاس 1200x630).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
