import React from 'react';
import { FiHome, FiLayers, FiStar, FiMap, FiInfo, FiPhone, FiList, FiFileText, FiCheckCircle, FiXCircle, FiChevronDown } from 'react-icons/fi';

export const seoPages = [
  { key: 'home', label: 'الصفحة الرئيسية', icon: <FiHome />, path: '/' },
  { key: 'services', label: 'صفحة الخدمات', icon: <FiLayers />, path: '/services' },
  { key: 'clients', label: 'صفحة العملاء', icon: <FiStar />, path: '/clients' },
  { key: 'branches', label: 'صفحة الفروع', icon: <FiMap />, path: '/branches' },
  { key: 'about', label: 'صفحة من نحن', icon: <FiInfo />, path: '/about' },
  { key: 'contact', label: 'صفحة تواصل معنا', icon: <FiPhone />, path: '/contact' },
  { key: 'booking', label: 'صفحة الحجز', icon: <FiList />, path: '/booking' },
];

export default function PagesSettingsTab({
  settings,
  updatePageSeo
}: {
  settings: any;
  updatePageSeo: (pageKey: string, field: string, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl text-blue-800 text-sm flex gap-3 items-start">
        <span className="text-2xl mt-1"><FiFileText /></span>
        <div>
          <p className="font-bold mb-1">ايه هي H1 و H2 و Meta Tags؟</p>
          <p className="text-blue-600 leading-relaxed">
            <strong>H1</strong> = العنوان الرئيسي للصفحة (بيشوفه جوجل كأهم عنوان) — لازم يكون فيه الكلمة المفتاحية.<br/>
            <strong>H2</strong> = العنوان الفرعي — وصف مختصر تحت الـ H1.<br/>
            <strong>Meta Title</strong> = العنوان اللي بيظهر في نتائج جوجل وعنوان التاب في المتصفح.<br/>
            <strong>Meta Description</strong> = الوصف اللي بيظهر تحت العنوان في نتائج جوجل (150-160 حرف).
          </p>
        </div>
      </div>

      {seoPages.map((page) => {
        const pageData = (settings.pagesSeo || {})[page.key] || {
          h1: { ar: '', en: '' },
          h2: { ar: '', en: '' },
          metaTitle: { ar: '', en: '' },
          metaDescription: { ar: '', en: '' },
        };

        return (
          <details key={page.key} className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <summary className="p-5 cursor-pointer list-none flex justify-between items-center hover:bg-gray-50 transition-colors outline-none select-none">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{page.icon}</span>
                <div>
                  <p className="font-black text-gray-900">{page.label}</p>
                  <p className="text-xs text-gray-400 font-mono" dir="ltr">{page.path}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {(typeof pageData.h1 === 'object' ? (pageData.h1 as any).ar : pageData.h1) ? (
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><FiCheckCircle /> مُعدّ</span>
                ) : (
                  <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><FiXCircle /> غير مُعدّ</span>
                )}
                <span className="transition duration-300 group-open:-rotate-180 bg-gray-100 text-gray-400 p-1.5 rounded-lg text-xs border"><FiChevronDown /></span>
              </div>
            </summary>

            <div className="p-6 border-t border-gray-100 space-y-5 bg-gray-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    <span className="text-brand-teal">H1</span> — العنوان الرئيسي (عربي)
                  </label>
                  <input
                    type="text"
                    value={typeof pageData.h1 === 'object' ? (pageData.h1 as any).ar || '' : pageData.h1 || ''}
                    onChange={(e) => {
                      const current = typeof pageData.h1 === 'object' ? pageData.h1 : { ar: '', en: '' };
                      updatePageSeo(page.key, 'h1', { ...current, ar: e.target.value });
                    }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none bg-white transition-all"
                    placeholder={`مثال: أفضل شركة نظافة في مصر`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    <span className="text-brand-teal">H1</span> — Main Heading (English)
                  </label>
                  <input
                    type="text"
                    value={typeof pageData.h1 === 'object' ? (pageData.h1 as any).en || '' : ''}
                    onChange={(e) => {
                      const current = typeof pageData.h1 === 'object' ? pageData.h1 : { ar: '', en: '' };
                      updatePageSeo(page.key, 'h1', { ...current, en: e.target.value });
                    }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none bg-white transition-all"
                    dir="ltr"
                    placeholder="e.g. Best Cleaning Company in Egypt"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    <span className="text-amber-500">H2</span> — العنوان الفرعي (عربي)
                  </label>
                  <input
                    type="text"
                    value={typeof pageData.h2 === 'object' ? (pageData.h2 as any).ar || '' : pageData.h2 || ''}
                    onChange={(e) => {
                      const current = typeof pageData.h2 === 'object' ? pageData.h2 : { ar: '', en: '' };
                      updatePageSeo(page.key, 'h2', { ...current, ar: e.target.value });
                    }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white transition-all"
                    placeholder="مثال: خبرة تزيد عن 10 سنوات في تنظيف الواجهات والفلل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    <span className="text-amber-500">H2</span> — Subheading (English)
                  </label>
                  <input
                    type="text"
                    value={typeof pageData.h2 === 'object' ? (pageData.h2 as any).en || '' : ''}
                    onChange={(e) => {
                      const current = typeof pageData.h2 === 'object' ? pageData.h2 : { ar: '', en: '' };
                      updatePageSeo(page.key, 'h2', { ...current, en: e.target.value });
                    }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white transition-all"
                    dir="ltr"
                    placeholder="e.g. 10+ Years of Expert Facade & Villa Cleaning"
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Meta Title (عربي) — عنوان جوجل</label>
                <input
                  type="text"
                  value={typeof pageData.metaTitle === 'object' ? (pageData.metaTitle as any).ar || '' : pageData.metaTitle || ''}
                  onChange={(e) => {
                    const current = typeof pageData.metaTitle === 'object' ? pageData.metaTitle : { ar: '', en: '' };
                    updatePageSeo(page.key, 'metaTitle', { ...current, ar: e.target.value });
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none bg-white transition-all"
                  placeholder="العنوان اللي هيظهر في نتائج جوجل (60 حرف كحد أقصى)"
                />
                <p className="text-xs text-gray-400 mt-1 text-left" dir="ltr">
                  {(typeof pageData.metaTitle === 'object' ? (pageData.metaTitle as any).ar || '' : '').length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Meta Description (عربي) — وصف جوجل</label>
                <textarea
                  value={typeof pageData.metaDescription === 'object' ? (pageData.metaDescription as any).ar || '' : pageData.metaDescription || ''}
                  onChange={(e) => {
                    const current = typeof pageData.metaDescription === 'object' ? pageData.metaDescription : { ar: '', en: '' };
                    updatePageSeo(page.key, 'metaDescription', { ...current, ar: e.target.value });
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none bg-white transition-all"
                  rows={2}
                  placeholder="الوصف اللي بيظهر تحت العنوان في جوجل (150-160 حرف)"
                />
                <p className="text-xs text-gray-400 mt-1 text-left" dir="ltr">
                  {(typeof pageData.metaDescription === 'object' ? (pageData.metaDescription as any).ar || '' : '').length}/160 characters
                </p>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
