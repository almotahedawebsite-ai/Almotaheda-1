import React, { Dispatch, SetStateAction } from 'react';
import { TranslatableField } from '@/presentation/components/Dashboard/TranslatableField';
import { TranslatableString, SiteSettings } from '@/domain/types/settings';

interface BrandLogoSectionProps {
  settings: Partial<SiteSettings>;
  setSettings: Dispatch<SetStateAction<Partial<SiteSettings>>>;
  uploadLogo: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export default function BrandLogoSection({
  settings,
  setSettings,
  uploadLogo,
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
    </div>
  );
}
