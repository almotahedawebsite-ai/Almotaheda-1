import React, { Dispatch, SetStateAction } from 'react';
import { SiteSettings } from '@/domain/types/settings';

interface BrandNavbarSectionProps {
  settings: Partial<SiteSettings>;
  setSettings: Dispatch<SetStateAction<Partial<SiteSettings>>>;
}

export default function BrandNavbarSection({
  settings,
  setSettings,
}: BrandNavbarSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between items-center">
            <span>لون خلفية الناف بار</span>
            <span className="text-xs font-mono text-gray-400">{settings.navbarBgColor || '#ffffff'}</span>
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              className="w-14 h-14 rounded cursor-pointer border-0 p-0"
              value={settings.navbarBgColor || '#ffffff'}
              onChange={e => setSettings({ ...settings, navbarBgColor: e.target.value })}
            />
            <p className="text-sm text-gray-500 flex-1">اللون الأساسي لخلفية الناف بار (بدون التمرير).</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between items-center">
            <span>لون النص والروابط</span>
            <span className="text-xs font-mono text-gray-400">{settings.navbarTextColor || '#1e293b'}</span>
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              className="w-14 h-14 rounded cursor-pointer border-0 p-0"
              value={settings.navbarTextColor || '#1e293b'}
              onChange={e => setSettings({ ...settings, navbarTextColor: e.target.value })}
            />
            <p className="text-sm text-gray-500 flex-1">لون النص والروابط داخل الناف بار.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between items-center">
            <span>الشفافية (قبل التمرير)</span>
            <span className="text-xs font-mono font-bold text-blue-600">{settings.navbarOpacity ?? 95}%</span>
          </label>
          <input
            type="range" min={0} max={100}
            value={settings.navbarOpacity ?? 95}
            onChange={e => setSettings({ ...settings, navbarOpacity: Number(e.target.value) })}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>شفاف تماماً 0%</span>
            <span>معتم 100%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between items-center">
            <span>الشفافية (بعد التمرير)</span>
            <span className="text-xs font-mono font-bold text-blue-600">{settings.navbarScrolledOpacity ?? 97}%</span>
          </label>
          <input
            type="range" min={0} max={100}
            value={settings.navbarScrolledOpacity ?? 97}
            onChange={e => setSettings({ ...settings, navbarScrolledOpacity: Number(e.target.value) })}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>شفاف تماماً 0%</span>
            <span>معتم 100%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm font-bold text-gray-600">معاينة حية (Live Preview):</p>

        <div>
          <p className="text-xs text-gray-400 mb-1">قبل التمرير</p>
          <div
            className="rounded-xl overflow-hidden border border-gray-200"
            style={{
              background: `${settings.navbarBgColor || '#ffffff'}${Math.round(((settings.navbarOpacity ?? 95) / 100) * 255).toString(16).padStart(2, '0').toUpperCase()}`,
              backdropFilter: 'blur(12px)',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span className="font-black text-base" style={{ color: settings.navbarTextColor || '#1e293b' }}>
              {typeof settings.siteName === 'object' ? settings.siteName.ar : settings.siteName || 'المتحدة'}
            </span>
            <div className="flex gap-3">
              {['الرئيسية', 'خدماتنا', 'تواصل'].map(l => (
                <span key={l} className="text-xs font-bold" style={{ color: settings.navbarTextColor || '#1e293b' }}>{l}</span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">بعد التمرير</p>
          <div
            className="rounded-xl overflow-hidden border border-gray-200"
            style={{
              background: `${settings.navbarBgColor || '#ffffff'}${Math.round(((settings.navbarScrolledOpacity ?? 97) / 100) * 255).toString(16).padStart(2, '0').toUpperCase()}`,
              backdropFilter: 'blur(12px)',
              boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span className="font-black text-base" style={{ color: settings.navbarTextColor || '#1e293b' }}>
              {typeof settings.siteName === 'object' ? settings.siteName.ar : settings.siteName || 'المتحدة'}
            </span>
            <div className="flex gap-3">
              {['الرئيسية', 'خدماتنا', 'تواصل'].map(l => (
                <span key={l} className="text-xs font-bold" style={{ color: settings.navbarTextColor || '#1e293b' }}>{l}</span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-2 p-3 bg-gray-50 rounded-lg border">
          💡 <strong>نصيحة:</strong> استخدم شفافية 0% لناف بار شفاف تماماً فوق هيرو الصورة، أو 100% لخلفية معتمة.
        </p>
      </div>
    </div>
  );
}
