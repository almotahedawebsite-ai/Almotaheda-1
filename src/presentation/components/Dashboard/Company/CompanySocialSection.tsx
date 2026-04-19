import React, { Dispatch, SetStateAction } from 'react';
import { SiteSettings } from '@/domain/types/settings';
import { FiTrash2 } from 'react-icons/fi';

interface CompanySocialSectionProps {
  settings: Partial<SiteSettings>;
  setSettings: Dispatch<SetStateAction<Partial<SiteSettings>>>;
  handleAddSocialLink: () => void;
  handleUpdateSocialLink: (index: number, field: 'platform' | 'url' | 'icon', value: string) => void;
  handleUploadSocialIcon: (index: number, e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveSocialLink: (index: number) => void;
}

export default function CompanySocialSection({
  settings,
  handleAddSocialLink,
  handleUpdateSocialLink,
  handleUploadSocialIcon,
  handleRemoveSocialLink
}: CompanySocialSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button onClick={handleAddSocialLink} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold hover:bg-purple-200 text-sm shadow-sm transition-colors cursor-pointer w-full sm:w-auto">
          + إضافة منصة جديدة
        </button>
      </div>

      {(!settings.socialLinks || settings.socialLinks.length === 0) && (
        <p className="text-center text-gray-400 py-6">لم يتم إضافة مراجع تواصل اجتماعي بعد.</p>
      )}

      <div className="space-y-4">
        {settings.socialLinks?.map((link, idx) => (
          <div key={idx} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-100 flex-wrap md:flex-nowrap">
            <div className="w-16 h-16 shrink-0 bg-white border rounded-xl overflow-hidden flex items-center justify-center relative group">
              {link.icon ? (
                link.icon.startsWith('http') ? (
                  <img src={link.icon} className="w-8 h-8 object-contain" alt={link.platform} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: link.icon }} className="w-6 h-6 flex items-center justify-center" />
                )
              ) : (
                <span className="text-gray-300 text-xs">A</span>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleUploadSocialIcon(idx, e)} title="رفع الأيقونة كصورة" />
            </div>

            <div className="flex-1 w-full flex flex-col gap-2">
              <div className="flex gap-3 w-full">
                <div className="w-1/3">
                  <label className="block text-xs font-bold text-gray-500 mb-1">المنصة</label>
                  <input 
                    className="w-full p-3 border rounded-lg outline-none text-sm" 
                    value={link.platform}
                    placeholder="TikTok, YT..."
                    onChange={e => handleUpdateSocialLink(idx, 'platform', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 mb-1">كود الـ SVG الخاص بالأيقونة (اختياري)</label>
                  <input 
                    className="w-full p-3 border rounded-lg outline-none text-sm font-mono text-gray-500" 
                    value={link.icon?.startsWith('http') ? '' : link.icon}
                    placeholder="<svg>...</svg> (أو ارفع صورة بالضغط على المربع المجاور)"
                    dir="ltr"
                    onChange={e => handleUpdateSocialLink(idx, 'icon', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">الرابط القابل للنقر</label>
                <input 
                  className="w-full p-3 border rounded-lg outline-none text-sm" 
                  value={link.url}
                  placeholder="https://..."
                  dir="ltr"
                  onChange={e => handleUpdateSocialLink(idx, 'url', e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={() => handleRemoveSocialLink(idx)} 
              className="mt-6 text-red-500 hover:bg-red-50 p-2 rounded-lg flex items-center justify-center"
              title="حذف المنصة"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
