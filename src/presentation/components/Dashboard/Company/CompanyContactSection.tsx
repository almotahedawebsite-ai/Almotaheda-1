import React, { Dispatch, SetStateAction } from 'react';
import { TranslatableField } from '@/presentation/components/Dashboard/TranslatableField';
import { TranslatableString, SiteSettings } from '@/domain/types/settings';

interface CompanyContactSectionProps {
  settings: Partial<SiteSettings>;
  setSettings: Dispatch<SetStateAction<Partial<SiteSettings>>>;
}

export default function CompanyContactSection({
  settings,
  setSettings,
}: CompanyContactSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف الأساسي</label>
          <input 
            className="w-full p-4 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400" 
            value={settings.contactPhone || ''}
            onChange={e => setSettings({...settings, contactPhone: e.target.value})}
            placeholder="+20 100 000 0000"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-green-700 mb-2">رقم الواتساب العام (للاستفسارات)</label>
          <input 
            className="w-full p-4 bg-green-50 border-green-200 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none placeholder-green-300" 
            value={settings.contactWhatsapp || ''}
            onChange={e => setSettings({...settings, contactWhatsapp: e.target.value})}
            placeholder="+201012345678"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-teal-700 mb-2">رقم واتساب الحجز (الزر العائم / CTA)</label>
          <input 
            className="w-full p-4 bg-teal-50 border-teal-200 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none placeholder-teal-300" 
            value={settings.whatsappCta || ''}
            onChange={e => setSettings({...settings, whatsappCta: e.target.value})}
            placeholder="+201012345678"
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
        <input 
          className="w-full p-4 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400" 
          value={settings.contactEmail || ''}
          onChange={e => setSettings({...settings, contactEmail: e.target.value})}
          placeholder="info@company.com"
          dir="ltr"
        />
      </div>

      <div>
          <TranslatableField 
            label="عنوان المقر"
            value={settings.contactAddress}
            onChange={(val: TranslatableString) => setSettings({...settings, contactAddress: val})}
            enableMultiLanguage={!!settings.enableMultiLanguage}
            placeholder="مثال: شارع التسعين، التجمع الخامس، القاهرة"
          />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
          رابط خرائط جوجل (Google Maps Embed URL)
          <a href="https://www.google.com/maps" target="_blank" rel="noreferrer" className="text-blue-500 text-xs">افتح الخرائط</a>
        </label>
        <textarea 
          className="w-full p-4 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 placeholder-gray-400 text-sm" 
          value={settings.contactMapUrl || ''}
          onChange={e => setSettings({...settings, contactMapUrl: e.target.value})}
          placeholder='الصق الـ Iframe هنا (مثال: <iframe src="https://www.google.com/maps/embed..."></iframe>)'
          dir="ltr"
        />
      </div>
    </div>
  );
}
