import React, { Dispatch, SetStateAction } from 'react';
import { SiteSettings } from '@/domain/types/settings';

interface BrandColorsSectionProps {
  settings: Partial<SiteSettings>;
  setSettings: Dispatch<SetStateAction<Partial<SiteSettings>>>;
}

export default function BrandColorsSection({
  settings,
  setSettings,
}: BrandColorsSectionProps) {
  return (
    <div className="flex flex-col gap-6">
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
    </div>
  );
}
