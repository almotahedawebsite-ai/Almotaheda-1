import React from 'react';
import { TranslatableField } from '@/presentation/components/Dashboard/TranslatableField';
import { TranslatableString } from '@/domain/types/settings';
import { FiImage, FiSearch, FiInfo, FiSettings, FiChevronDown, FiAlertTriangle, FiBriefcase, FiPlus, FiTrash2, FiHome } from 'react-icons/fi';

export default function GlobalSettingsTab({
  settings,
  setSettings,
  uploadImage
}: {
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  uploadImage: (e: React.ChangeEvent<HTMLInputElement>, field: 'faviconUrl' | 'metaGraphImage') => Promise<void>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Visual Identity */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-xl font-black flex items-center gap-2">
          <FiImage className="text-brand-teal" /> الهوية البصرية
        </h2>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Favicon (أيقونة المتصفح)</label>
          <div className="flex items-center gap-4">
            {settings.faviconUrl && <img src={settings.faviconUrl} alt="Favicon" className="w-12 h-12 rounded bg-gray-50 border p-1" />}
            <input type="file" className="text-sm" onChange={e => uploadImage(e, 'faviconUrl')} />
          </div>
          <input
            type="text"
            value={settings.faviconUrl || ''}
            onChange={e => setSettings({ ...settings, faviconUrl: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 mt-2 text-sm"
            dir="ltr"
            placeholder="أو ألصق رابط الأيقونة"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Open Graph Image (صورة المشاركة)</label>
          <p className="text-xs text-gray-400 mb-2">هذه الصورة تظهر لما حد يشارك لينك الموقع على فيسبوك/واتساب/تويتر</p>
          <div className="space-y-3">
            {settings.metaGraphImage && <img src={settings.metaGraphImage} alt="OG" className="w-full h-40 object-cover rounded-xl border" />}
            <input type="file" className="text-sm" onChange={e => uploadImage(e, 'metaGraphImage')} />
          </div>
        </div>
      </section>

      {/* Global Meta */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-xl font-black flex items-center gap-2">
          <FiSearch className="text-blue-500" /> البيانات الوصفية الأساسية
        </h2>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm flex gap-3 items-start">
          <span className="text-xl"><FiInfo /></span>
          <div>
            <p className="font-bold mb-1">ايه هي الـ Meta Tags؟</p>
            <p className="text-blue-600">دي البيانات اللي بتظهر في نتائج بحث جوجل — العنوان والوصف اللي الزوار بيشوفوه قبل ما يضغطوا على الموقع</p>
          </div>
        </div>
        <TranslatableField 
          label="عنوان الموقع العام (Meta Title)"
          value={settings.metaTitle || ''}
          onChange={(val: TranslatableString) => setSettings({...settings, metaTitle: val})}
          enableMultiLanguage={!!settings.enableMultiLanguage}
          placeholder="مثال: المتحدة لخدمات النظافة | تنظيف واجهات وفلل وقصور"
        />
        <TranslatableField 
          label="وصف الموقع العام (Meta Description)"
          value={settings.metaDescription || ''}
          onChange={(val: TranslatableString) => setSettings({...settings, metaDescription: val})}
          enableMultiLanguage={!!settings.enableMultiLanguage}
          isTextArea={true}
          placeholder="اكتب وصفاً جذاباً 150-160 حرف — ده اللي بيظهر في جوجل تحت العنوان"
        />
      </section>

      {/* Schemas */}
      <section className="md:col-span-2 space-y-6">
        <details className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden" open={false}>
          <summary className="p-6 text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center bg-gray-50/50 hover:bg-gray-50 transition-colors outline-none select-none">
            <span className="flex items-center gap-2"><FiSettings className="text-gray-500" /> إعدادات الـ SEO المتقدمة (Schema)</span>
            <span className="transition duration-300 group-open:-rotate-180 bg-white text-gray-400 p-1.5 rounded-lg text-sm border shadow-sm"><FiChevronDown /></span>
          </summary>
          
          <div className="p-8 space-y-8 border-t border-gray-100">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm flex gap-3 items-start">
              <span className="text-xl"><FiAlertTriangle /></span>
              <p>هذه الإعدادات تقنية وتؤثر على فهم محركات البحث لمحتوى شركتك. يرجى تعديلها بحذر.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
                  Website Schema (JSON-LD)
                </label>
                <p className="text-xs text-gray-400">بيعرّف جوجل باسم الموقع والروابط الأساسية</p>
                <textarea 
                  className="w-full p-4 font-mono text-xs bg-slate-900 text-green-400 rounded-2xl h-56 outline-none focus:ring-2 focus:ring-brand-teal/30 transition-all border-none custom-scrollbar" 
                  value={settings.websiteSchema || ''}
                  onChange={e => setSettings({...settings, websiteSchema: e.target.value})}
                  placeholder='{ "@context": "https://schema.org", "@type": "WebSite", ... }'
                  dir="ltr"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Organization Schema (JSON-LD)
                </label>
                <p className="text-xs text-gray-400">بيعرّف جوجل ببيانات الشركة (اللوجو، السوشيال ميديا، الاتصال)</p>
                <textarea 
                  className="w-full p-4 font-mono text-xs bg-slate-900 text-green-400 rounded-2xl h-56 outline-none focus:ring-2 focus:ring-brand-teal/30 transition-all border-none custom-scrollbar" 
                  value={settings.organizationSchema || ''}
                  onChange={e => setSettings({...settings, organizationSchema: e.target.value})}
                  placeholder='{ "@context": "https://schema.org", "@type": "Organization", ... }'
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </details>
      </section>
      {/* ── Portfolio: Stats ── */}
      <section className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-xl font-black flex items-center gap-2">
          <FiHome className="text-brand-teal" /> أرقام سابقة الأعمال
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">عدد الشقق التي تم تقديم الخدمة لها</label>
            <input
              type="number"
              min={0}
              value={settings.apartmentsCleanedCount ?? ''}
              onChange={e => setSettings({ ...settings, apartmentsCleanedCount: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold"
              placeholder="مثال: 1500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">عدد الفيلات التي تم تقديم الخدمة لها</label>
            <input
              type="number"
              min={0}
              value={settings.villasCleanedCount ?? ''}
              onChange={e => setSettings({ ...settings, villasCleanedCount: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold"
              placeholder="مثال: 450"
            />
          </div>
        </div>
      </section>

      {/* ── Portfolio: Places ── */}
      <section className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-xl font-black flex items-center gap-2">
            <FiBriefcase className="text-brand-teal" /> سابقة الأعمال (أبرز المواقع)
          </h2>
          <button
            type="button"
            onClick={() => {
              const places = settings.topRequestedPlaces ?? [];
              setSettings({
                ...settings,
                topRequestedPlaces: [...places, { ar: '', en: '', category: 'hotels' }],
              });
            }}
            className="inline-flex items-center gap-2 bg-brand-teal text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-teal/80 transition-colors"
          >
            <FiPlus /> إضافة مكان جديد
          </button>
        </div>

        <div className="space-y-3">
          {(settings.topRequestedPlaces ?? []).map((place: { ar: string; en: string; category?: string }, idx: number) => (
            <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-100">
              {/* Category */}
              <select
                value={place.category ?? 'hotels'}
                onChange={e => {
                  const updated = [...(settings.topRequestedPlaces ?? [])];
                  updated[idx] = { ...updated[idx], category: e.target.value };
                  setSettings({ ...settings, topRequestedPlaces: updated });
                }}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold bg-white shrink-0"
              >
                <option value="hotels">🏨 فنادق</option>
                <option value="government">🏛️ حكومي</option>
                <option value="military">🛡️ عسكري</option>
                <option value="malls">🛍️ مولات</option>
                <option value="universities">🎓 جامعات</option>
                <option value="commercial">🏪 تجاري</option>
                <option value="towers">🏙️ أبراج</option>
                <option value="companies">📊 شركات</option>
              </select>
              {/* Arabic name */}
              <input
                type="text"
                value={place.ar}
                onChange={e => {
                  const updated = [...(settings.topRequestedPlaces ?? [])];
                  updated[idx] = { ...updated[idx], ar: e.target.value };
                  setSettings({ ...settings, topRequestedPlaces: updated });
                }}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                placeholder="الاسم بالعربي"
                dir="rtl"
              />
              {/* English name */}
              <input
                type="text"
                value={place.en}
                onChange={e => {
                  const updated = [...(settings.topRequestedPlaces ?? [])];
                  updated[idx] = { ...updated[idx], en: e.target.value };
                  setSettings({ ...settings, topRequestedPlaces: updated });
                }}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                placeholder="English name"
                dir="ltr"
              />
              {/* Delete */}
              <button
                type="button"
                onClick={() => {
                  const updated = (settings.topRequestedPlaces ?? []).filter((_: unknown, i: number) => i !== idx);
                  setSettings({ ...settings, topRequestedPlaces: updated });
                }}
                className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-xl hover:bg-red-50"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          {(settings.topRequestedPlaces ?? []).length === 0 && (
            <p className="text-gray-400 text-center py-6 text-sm">لا توجد أماكن مضافة — اضغط "إضافة مكان جديد"</p>
          )}
        </div>
      </section>
    </div>
  );
}
