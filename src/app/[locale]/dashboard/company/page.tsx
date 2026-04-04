'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';
import { SiteSettings } from '@/domain/types/settings';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { TranslatableField } from '@/presentation/components/Dashboard/TranslatableField';
import { TranslatableString } from '@/domain/types/settings';
import { FiPhone, FiChevronDown, FiLink, FiTrash2, FiFileText, FiCheckCircle, FiRefreshCw, FiCamera, FiSettings } from 'react-icons/fi';

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

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4 z-10">
        <div>
          <h1 className="text-2xl font-black text-gray-900">البيانات المؤسسية</h1>
          <p className="text-gray-500 mt-1">التحكم في بيانات التواصل والروابط ونبذة الشركة.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ البيانات'}
        </button>
      </div>

      {/* Stacked Vertical Sections (Resolves squishing) */}
      
      {/* Contact Info */}
      <details className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 open:pb-8" open>
        <summary className="text-xl font-bold pb-4 text-blue-600 cursor-pointer list-none flex justify-between items-center outline-none select-none border-b group-open:mb-6">
          <span className="flex items-center gap-2"><FiPhone /> بيانات التواصل المباشر</span>
          <span className="transition duration-300 group-open:-rotate-180 bg-gray-50 text-gray-400 p-2 rounded-lg text-sm"><FiChevronDown /></span>
        </summary>
        
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
            <label className="block text-sm font-bold text-green-700 mb-2">رقم الواتساب (WhatsApp)</label>
            <input 
              className="w-full p-4 bg-green-50 border-green-200 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none placeholder-green-300" 
              value={settings.contactWhatsapp || ''}
              onChange={e => setSettings({...settings, contactWhatsapp: e.target.value})}
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
             label="عنوان المقر أو العيادة"
             value={settings.contactAddress}
             onChange={(val: TranslatableString) => setSettings({...settings, contactAddress: val})}
             enableMultiLanguage={!!settings.enableMultiLanguage}
             placeholder="مثال: شارع التسعين، التجمع الخامس، القاهرة"
           />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
            رابط خرائط جوجل (Google Maps Embed URL)
            <a href="https://www.google.com/maps" target="_blank" className="text-blue-500 text-xs">افتح الخرائط</a>
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
      </details>

      {/* Dynamic Social Media Links */}
      <details className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <summary className="text-xl font-bold pb-4 text-purple-600 cursor-pointer list-none flex justify-between items-center outline-none select-none border-b group-open:mb-6">
          <div className="flex justify-between items-center w-full ml-4">
            <span className="flex items-center gap-2"><FiLink /> منصات التواصل الاجتماعي</span>
            <button onClick={handleAddSocialLink} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold hover:bg-purple-200 text-sm">
              + إضافة منصة جديدة
            </button>
          </div>
          <span className="transition duration-300 group-open:-rotate-180 bg-gray-50 text-gray-400 p-2 rounded-lg text-sm shrink-0"><FiChevronDown /></span>
        </summary>
        
        <div className="space-y-6">
          {(!settings.socialLinks || settings.socialLinks.length === 0) && (
          <p className="text-center text-gray-400 py-6">لم يتم إضافة مراجع تواصل اجتماعي بعد.</p>
        )}

        <div className="space-y-4">
          {settings.socialLinks?.map((link, idx) => (
            <div key={idx} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-100 flex-wrap md:flex-nowrap">
              {/* Icon Uploader / Preview */}
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
      </details>

      {/* About Us */}
      <details className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <summary className="text-xl font-bold pb-4 text-amber-600 cursor-pointer list-none flex justify-between items-center outline-none select-none border-b group-open:mb-6">
          <span className="flex items-center gap-2"><FiFileText /> قصة الشركة (About Us)</span>
          <span className="transition duration-300 group-open:-rotate-180 bg-gray-50 text-gray-400 p-2 rounded-lg text-sm"><FiChevronDown /></span>
        </summary>
        
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
      </details>

    </div>
  );
}
