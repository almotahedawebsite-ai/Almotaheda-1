'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';
import { SiteSettings } from '@/domain/types/settings';
import { FiFacebook, FiPieChart, FiTag, FiVideo, FiCamera, FiTarget, FiTrendingUp, FiSave, FiCheckCircle, FiXCircle, FiTrash2, FiLink, FiCode, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const pixelPlatforms = [
  {
    key: 'metaPixelId',
    title: 'فيسبوك / ميتا بيكسل',
    subtitle: 'Meta Pixel ID',
    description: 'لتتبع عملاء الإعلانات اللي جايين من فيسبوك وإنستجرام. ادخل معرف الـ Pixel الخاص بحسابك الإعلاني.',
    placeholder: 'مثال: 562149023847...',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: <FiFacebook />,
    helpUrl: 'https://business.facebook.com/events-manager/pixel',
  },
  {
    key: 'googleAnalyticsId',
    title: 'Google Analytics 4',
    subtitle: 'G-Tag Measurement ID',
    description: 'لتحليل سلوك الزوار على الموقع ومعرفة أعداد الزيارات والصفحات الأكثر مشاهدة.',
    placeholder: 'مثال: G-XXXXXXXXXX',
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: <FiPieChart />,
    helpUrl: 'https://analytics.google.com',
  },
  {
    key: 'googleTagManagerId',
    title: 'Google Tag Manager',
    subtitle: 'GTM Container ID',
    description: 'لإدارة كل أكواد التتبع من مكان واحد بدون ما تحتاج مبرمج. ادخل معرف الحاوية.',
    placeholder: 'مثال: GTM-XXXXXXX',
    color: 'bg-sky-500',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    icon: <FiTag />,
    helpUrl: 'https://tagmanager.google.com',
  },
  {
    key: 'tiktokPixelId',
    title: 'تيك توك بيكسل',
    subtitle: 'TikTok Pixel ID',
    description: 'لتتبع التحويلات من إعلانات تيك توك وقياس أداء الحملات.',
    placeholder: 'مثال: C4XXXXXXXXX...',
    color: 'bg-gray-900',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: <FiVideo />,
    helpUrl: 'https://ads.tiktok.com',
  },
  {
    key: 'snapchatPixelId',
    title: 'سناب شات بيكسل',
    subtitle: 'Snap Pixel ID',
    description: 'لمتابعة أداء إعلانات سناب شات ومعرفة تحويلات الزوار.',
    placeholder: 'مثال: abc123def456...',
    color: 'bg-yellow-400',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: <FiCamera />,
    helpUrl: 'https://business.snapchat.com',
  },
];

export default function TrackingSettingsPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const repo = new SettingsRepository(db);

  useEffect(() => {
    repo.getGlobalSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await repo.saveGlobalSettings(settings);
      alert('تم حفظ أكواد التتبع بنجاح! \nالأكواد هتشتغل تلقائياً على كل صفحات الموقع.');
    } catch (e) {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const activeCount = pixelPlatforms.filter(p => !!(settings as any)[p.key]).length;

  if (loading) return <div className="p-10 font-bold text-gray-400 text-center">جاري تحميل الإعدادات...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><FiTrendingUp className="text-brand-teal" /> أدوات التتبع والبيكسل</h1>
          <p className="text-gray-500 mt-1">اربط موقعك بكل أدوات التحليل والإعلانات — الأكواد تُحقن تلقائياً في كل صفحة</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-brand-teal hover:bg-brand-navy text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 shrink-0 flex items-center gap-2"
        >
          {saving ? 'جاري الحفظ...' : <><FiSave /> حفظ الإعدادات</>}
        </button>
      </div>

      {/* Active Status */}
      <div className="bg-gradient-to-br from-brand-navy to-brand-dark text-white p-6 rounded-3xl flex items-center justify-between">
        <div>
          <p className="text-xl font-black flex items-center gap-2"><FiTarget /> {activeCount} / {pixelPlatforms.length} أداة مُفعّلة</p>
          <p className="text-white/50 text-sm mt-1">كل أداة مُفعّلة هتشتغل تلقائياً على جميع صفحات الموقع</p>
        </div>
        <div className="flex gap-2">
          {pixelPlatforms.map(p => (
            <div
              key={p.key}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                (settings as any)[p.key] ? `${p.color} text-white shadow-lg` : 'bg-white/10 opacity-40'
              }`}
              title={p.title}
            >
              {p.icon}
            </div>
          ))}
        </div>
      </div>

      {/* Pixel Cards */}
      <div className="space-y-4">
        {pixelPlatforms.map((platform) => {
          const value = (settings as any)[platform.key] || '';
          const isActive = !!value;

          return (
            <div
              key={platform.key}
              className={`bg-white rounded-3xl border-2 transition-all overflow-hidden ${
                isActive ? `${platform.borderColor} shadow-md` : 'border-gray-100'
              }`}
            >
              <div className="p-6 flex flex-col sm:flex-row gap-5 items-start">
                {/* Icon */}
                <div className={`w-14 h-14 ${platform.bgColor} rounded-2xl flex items-center justify-center text-2xl shrink-0 ${isActive ? 'shadow-md' : ''}`}>
                  {platform.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">{platform.title}</h3>
                      <p className="text-xs text-gray-400 font-mono">{platform.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><FiCheckCircle /> مُفعّل</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><FiXCircle /> غير مُفعّل</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 leading-relaxed">{platform.description}</p>
                  
                  <div className="flex gap-3 items-center">
                    <input
                      className="flex-1 p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm tracking-wider focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                      value={value}
                      onChange={e => setSettings({ ...settings, [platform.key]: e.target.value.trim() })}
                      placeholder={platform.placeholder}
                      dir="ltr"
                    />
                    {value && (
                      <button
                        onClick={() => setSettings({ ...settings, [platform.key]: '' })}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                        title="مسح"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>

                  <a href={platform.helpUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-teal hover:underline font-bold inline-flex items-center gap-1">
                    <FiLink /> فتح لوحة تحكم {platform.title}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Code Injection */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-slate-900 text-white p-2 rounded-xl"><FiCode /></span>
          <div>
            <h2 className="text-xl font-black text-gray-900">حقن أكواد مخصصة (Custom Code)</h2>
            <p className="text-sm text-gray-500">لإضافة أي كود تتبع أو سكربت مخصص مش موجود أعلاه</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm flex gap-3 items-start">
          <span className="text-xl text-amber-600"><FiAlertTriangle /></span>
          <p>الأكواد دي بتتحقن مباشرة في الموقع. تأكد من صحة الكود قبل الحفظ عشان ميأثرش على أداء الموقع.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-teal"></span>
            كود الـ &lt;head&gt; (يُحقن في رأس الصفحة)
          </label>
          <p className="text-xs text-gray-400 mb-2">للأكواد اللي محتاجة تتحمل قبل ظهور الصفحة (مثل: أكواد تتبع، Meta Tags، خطوط)</p>
          <textarea
            className="w-full p-4 font-mono text-xs bg-slate-900 text-green-400 rounded-2xl h-40 outline-none focus:ring-2 focus:ring-brand-teal/30 transition-all border-none custom-scrollbar"
            value={settings.customHeadCode || ''}
            onChange={e => setSettings({ ...settings, customHeadCode: e.target.value })}
            placeholder="<!-- ألصق كود الـ head هنا -->"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            كود الـ &lt;body&gt; (يُحقن في نهاية الصفحة)
          </label>
          <p className="text-xs text-gray-400 mb-2">للأكواد اللي مش محتاجة تتحمل فوراً (مثل: تشات بوت، أدوات تحليل، ويدجتات)</p>
          <textarea
            className="w-full p-4 font-mono text-xs bg-slate-900 text-green-400 rounded-2xl h-40 outline-none focus:ring-2 focus:ring-brand-teal/30 transition-all border-none custom-scrollbar"
            value={settings.customBodyCode || ''}
            onChange={e => setSettings({ ...settings, customBodyCode: e.target.value })}
            placeholder="<!-- ألصق كود الـ body هنا -->"
            dir="ltr"
          />
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
        <h3 className="font-black text-gray-700 flex items-center gap-2"><FiInfo className="text-blue-500" /> إزاي تحصل على الـ Pixel ID؟</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="font-bold text-gray-800 mb-1 flex items-center gap-1"><FiFacebook className="text-blue-600" /> فيسبوك / ميتا</p>
            <p className="text-gray-500">ادخل على Events Manager → Pixel → هتلاقي الـ Pixel ID (رقم طويل)</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="font-bold text-gray-800 mb-1 flex items-center gap-1"><FiPieChart className="text-amber-500" /> Google Analytics</p>
            <p className="text-gray-500">ادخل على Admin → Data Streams → هتلاقي الـ Measurement ID يبدأ بـ G-</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="font-bold text-gray-800 mb-1 flex items-center gap-1"><FiVideo /> تيك توك</p>
            <p className="text-gray-500">ادخل على TikTok Ads Manager → Assets → Events → الـ Pixel ID</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="font-bold text-gray-800 mb-1 flex items-center gap-1"><FiCamera className="text-yellow-400" /> سناب شات</p>
            <p className="text-gray-500">ادخل على Snap Ads Manager → Events Manager → Snap Pixel ID</p>
          </div>
        </div>
      </div>
    </div>
  );
}
