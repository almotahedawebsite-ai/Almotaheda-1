import React, { Dispatch, SetStateAction } from 'react';
import { TranslatableField } from '@/presentation/components/Dashboard/TranslatableField';
import { TranslatableString, SiteSettings } from '@/domain/types/settings';
import { FiCheckCircle, FiRefreshCw, FiCamera } from 'react-icons/fi';

interface CompanyAboutSectionProps {
  settings: Partial<SiteSettings>;
  setSettings: Dispatch<SetStateAction<Partial<SiteSettings>>>;
  uploadAboutImage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export default function CompanyAboutSection({
  settings,
  setSettings,
  uploadAboutImage
}: CompanyAboutSectionProps) {
  return (
    <div className="space-y-6">
      <TranslatableField 
        label="عنوان صفحة من نحن"
        value={settings.aboutTitle}
        onChange={(val: TranslatableString) => setSettings({...settings, aboutTitle: val})}
        enableMultiLanguage={!!settings.enableMultiLanguage}
        placeholder="مثال: رواد التكنولوجيا الحديثة"
      />

      <TranslatableField 
        label="النص التعريفي الشامل (Content Body)"
        value={settings.aboutContent}
        onChange={(val: TranslatableString) => setSettings({...settings, aboutContent: val})}
        enableMultiLanguage={!!settings.enableMultiLanguage}
        isTextArea={true}
        placeholder="اكتب رسالة الشركة ورؤيتها هنا بالتفصيل..."
      />

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
          صورة فريق العمل أو المقر
          {settings.aboutImage && <span className="text-green-500 text-xs text-bold flex items-center gap-1">تم الرفع بنجاح <FiCheckCircle /></span>}
        </label>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden">
           {settings.aboutImage ? (
             <>
               <img src={settings.aboutImage} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Background" />
               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={uploadAboutImage} />
               <div className="relative z-10 bg-white px-6 py-2 rounded-full shadow font-bold text-sm flex items-center gap-2">تغيير الصورة <FiRefreshCw /></div>
             </>
           ) : (
             <>
               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={uploadAboutImage} />
               <span className="text-3xl mb-2 text-gray-400"><FiCamera /></span>
               <p className="font-bold text-gray-600">اضغط لرفع صورة الغلاف لصفحة من نحن</p>
               <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP المدعومة</p>
             </>
           )}
        </div>
      </div>
    </div>
  );
}
