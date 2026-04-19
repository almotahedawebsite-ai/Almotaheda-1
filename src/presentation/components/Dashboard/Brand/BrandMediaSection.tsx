import React, { Dispatch, SetStateAction } from 'react';
import { SiteSettings } from '@/domain/types/settings';

interface BrandMediaSectionProps {
  settings: Partial<SiteSettings>;
  setSettings: Dispatch<SetStateAction<Partial<SiteSettings>>>;
  uploadMediaImage: (e: React.ChangeEvent<HTMLInputElement>, key: 'heroImage' | 'aboutImage', successMsg: string) => Promise<void>;
  removeMediaImage: (key: 'heroImage' | 'aboutImage', successMsg: string) => Promise<void>;
}

export default function BrandMediaSection({
  settings,
  setSettings,
  uploadMediaImage,
  removeMediaImage
}: BrandMediaSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">صورة الهيدر الرئيسية (Hero Image)</label>
        <div className="flex flex-col gap-4 border-2 border-dashed border-gray-200 rounded-xl p-6">
          {(settings as any).heroImage ? (
            <div className="relative w-full h-40 bg-gray-50 rounded-xl overflow-hidden border group">
              <img src={(settings as any).heroImage} alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => removeMediaImage('heroImage', 'تم حذف صورة الهيدر')} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm">حذف الصورة</button>
              </div>
            </div>
          ) : (
            <div className="w-full h-40 bg-gray-50 rounded-xl border flex items-center justify-center text-gray-400 text-sm">لا توجد صورة هيدر</div>
          )}
          <div>
            <input type="file" className="text-sm w-full" onChange={e => uploadMediaImage(e, 'heroImage', 'تم رفع صورة الهيدر بنجاح')} />
            <p className="text-xs text-gray-400 mt-2">تُعرض هذه الصورة في خلفية واجهة الموقع الرئيسية.</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">صورة قسم الاستشارة (Consultation/About)</label>
        <div className="flex flex-col gap-4 border-2 border-dashed border-gray-200 rounded-xl p-6">
          {(settings as any).aboutImage ? (
            <div className="relative w-full h-40 bg-gray-50 rounded-xl overflow-hidden border group">
              <img src={(settings as any).aboutImage} alt="About" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => removeMediaImage('aboutImage', 'تم حذف صورة الاستشارة')} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm">حذف الصورة</button>
              </div>
            </div>
          ) : (
            <div className="w-full h-40 bg-gray-50 rounded-xl border flex items-center justify-center text-gray-400 text-sm">لا توجد صورة استشارة</div>
          )}
          <div>
            <input type="file" className="text-sm w-full" onChange={e => uploadMediaImage(e, 'aboutImage', 'تم رفع صورة الاستشارة بنجاح')} />
            <p className="text-xs text-gray-400 mt-2">تُعرض هذه الصورة بجانب أو خلف قسم 'احصل على استشارة مجانية'.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
