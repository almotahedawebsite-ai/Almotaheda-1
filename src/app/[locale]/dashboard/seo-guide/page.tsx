'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  FiSearch, FiFileText, FiImage, FiBriefcase, FiTrendingUp, FiPenTool, FiEdit3, FiMap,
  FiBookOpen, FiCheckCircle, FiInfo, FiZap, FiList, FiStar, FiClipboard, FiClock, FiMapPin,
  FiChevronDown, FiArrowLeft, FiCheck
} from 'react-icons/fi';
import { seoSteps, checklist } from '@/infrastructure/constants/seoData';


export default function SeoGuidePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const [expandedStep, setExpandedStep] = useState<string | null>('meta');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-20">

      {/* Header */}
      <div className="bg-gradient-to-br from-brand-navy to-brand-dark text-white p-8 rounded-3xl overflow-hidden relative">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-black mb-4 uppercase tracking-wider"><FiBookOpen /> دليل شامل</span>
          <h1 className="text-3xl font-black mb-3">دليل تحسين SEO من الداشبورد</h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
            دليل خطوة بخطوة لفريق التسويق — كل الإعدادات اللي محتاجينها لتحسين ظهور الموقع في محركات البحث وتتبع الحملات الإعلانية.
          </p>
        </div>
        <div className="absolute -bottom-10 -left-10 text-[10rem] opacity-5 pointer-events-none transform -rotate-12">
          <FiBookOpen />
        </div>
      </div>

      {/* Quick progress */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2"><FiCheckCircle className="text-brand-teal" /> قايمة الإنجاز (SEO Checklist)</h2>
          <span className="bg-brand-teal/10 text-brand-teal px-4 py-1.5 rounded-full text-sm font-black">
            {completedCount}/{checklist.length} — {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-teal to-green-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {checklist.map((item, idx) => (
            <label
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all text-sm ${
                checkedItems[idx]
                  ? 'bg-green-50 border border-green-200 line-through text-green-600'
                  : 'bg-gray-50 border border-gray-100 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <input
                type="checkbox"
                checked={!!checkedItems[idx]}
                onChange={() => toggleCheck(idx)}
                className="w-4 h-4 rounded border-gray-300 text-brand-teal focus:ring-brand-teal/20"
              />
              <span className="text-base">{item.icon}</span>
              <span className="font-bold flex-1">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2"><FiList className="text-brand-teal" /> الخطوات بالتفصيل</h2>

        {seoSteps.map((step) => {
          const isOpen = expandedStep === step.id;
          return (
            <div
              key={step.id}
              className={`bg-white rounded-3xl border-2 transition-all overflow-hidden ${
                isOpen ? 'border-brand-teal shadow-lg shadow-brand-teal/5' : 'border-gray-100'
              }`}
            >
              {/* Step Header */}
              <button
                onClick={() => setExpandedStep(isOpen ? null : step.id)}
                className="w-full p-5 flex items-center gap-4 text-right hover:bg-gray-50/50 transition-colors"
              >
                <div className="w-12 h-12 bg-brand-teal text-white rounded-2xl flex items-center justify-center text-xl font-black shrink-0 shadow-lg shadow-brand-teal/20">
                  {step.number}
                </div>
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xl">{step.icon}</span>
                    <h3 className="text-lg font-black text-gray-900">{step.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`${step.urgencyColor} px-2.5 py-0.5 rounded-lg text-xs font-bold`}>
                      أولوية {step.urgency}
                    </span>
                    <span className="bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                      <FiClock /> {step.time}
                    </span>
                    {step.dashboardPath && (
                      <span className="bg-brand-teal/10 text-brand-teal px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                        <FiMapPin /> {step.dashboardLabel}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xl transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}><FiChevronDown /></span>
              </button>

              {/* Step Content */}
              {isOpen && (
                <div className="px-5 pb-6 pt-0 space-y-5 border-t border-gray-100">
                  {/* Why */}
                  <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                    <h4 className="font-black text-blue-800 mb-2 flex items-center gap-2"><FiInfo /> ليه ده مهم؟</h4>
                    <p className="text-blue-700 leading-relaxed text-sm">{step.why}</p>
                  </div>

                  {/* Go to dashboard link */}
                  {step.dashboardPath && (
                    <Link
                      href={`/${locale}${step.dashboardPath}`}
                      className="flex items-center gap-3 bg-gradient-to-r from-brand-navy to-brand-teal text-white p-4 rounded-2xl font-bold hover:shadow-lg transition-all group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform"><FiZap className="text-yellow-400" /></span>
                      <div>
                        <p className="font-black">ادخل على: {step.dashboardLabel}</p>
                        <p className="text-white/60 text-xs">اضغط هنا للانتقال للصفحة مباشرة</p>
                      </div>
                      <span className="mr-auto text-xl opacity-60 group-hover:-translate-x-1 transition-transform"><FiArrowLeft /></span>
                    </Link>
                  )}

                  {/* Steps */}
                  <div className="space-y-2">
                    <h4 className="font-black text-gray-900 flex items-center gap-2"><FiList /> الخطوات:</h4>
                    <ol className="space-y-2">
                      {step.steps.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl text-sm">
                          <span className="w-6 h-6 bg-brand-teal/10 text-brand-teal rounded-lg flex items-center justify-center text-xs font-black shrink-0">{idx + 1}</span>
                          <span className="text-gray-700 font-medium">{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Tips */}
                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 space-y-2">
                    <h4 className="font-black text-amber-800 flex items-center gap-2"><FiStar /> نصائح مهمة:</h4>
                    <ul className="space-y-2">
                      {step.tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-amber-700 font-medium flex gap-2">
                          <FiCheck className="text-brand-teal mt-1 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Example */}
                  {step.example && (
                    <div className="bg-slate-900 p-5 rounded-2xl text-white space-y-2">
                      <h4 className="font-black text-brand-teal flex items-center gap-2"><FiClipboard /> مثال عملي: {step.example.title}</h4>
                      <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap leading-relaxed bg-black/30 p-4 rounded-xl overflow-x-auto custom-scrollbar">{step.example.desc}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <FiZap className="text-brand-teal" /> روابط سريعة لإعدادات التسويق
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'إعدادات SEO العامة', href: `/${locale}/dashboard/settings`, desc: 'Meta Tags + Schemas', icon: <FiSearch /> },
            { label: 'H1 و H2 للصفحات', href: `/${locale}/dashboard/settings`, desc: 'عناوين كل صفحة', icon: <FiFileText /> },
            { label: 'ربط البيكسل', href: `/${locale}/dashboard/tracking`, desc: 'Meta + GA + TikTok + Snap', icon: <FiTrendingUp /> },
            { label: 'الهوية البصرية', href: `/${locale}/dashboard/brand`, desc: 'اللوجو والألوان', icon: <FiImage /> },
            { label: 'بيانات الشركة', href: `/${locale}/dashboard/company`, desc: 'تليفون + عنوان + إيميل', icon: <FiBriefcase /> },
            { label: 'إعدادات النظام', href: `/${locale}/dashboard/preferences`, desc: 'رقم CTA + InstaPay', icon: <FiTrendingUp /> },
            { label: 'إدارة الخدمات', href: `/${locale}/dashboard/services`, desc: 'أوصاف + صور + فيديوهات', icon: <FiEdit3 /> },
            { label: 'أهم العملاء', href: `/${locale}/dashboard/key-clients`, desc: 'لوجوهات + أوصاف', icon: <FiStar /> },
            { label: 'إدارة الفروع', href: `/${locale}/dashboard/branches`, desc: 'عناوين + خرائط', icon: <FiMap /> },
          ].map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="p-4 rounded-2xl border border-gray-100 hover:border-brand-teal/30 hover:bg-brand-teal/5 transition-all group flex items-start gap-3"
            >
              <div className="text-gray-400 group-hover:text-brand-teal transition-colors mt-0.5">{link.icon}</div>
              <div>
                <p className="font-black text-gray-900 text-sm group-hover:text-brand-teal transition-colors">{link.label}</p>
                <p className="text-xs text-gray-400 mt-1">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pro Tips */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-3xl border border-amber-100 space-y-4">
        <h2 className="text-xl font-black text-amber-900 flex items-center gap-2"><FiZap className="text-amber-600" /> نصائح ذهبية للحملات الإعلانية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Landing Page مخصصة', desc: 'لكل حملة إعلانية، وجّه الترافيك لصفحة الحجز مباشرة مع ?service=xxx لتحديد الخدمة تلقائياً' },
            { title: 'UTM Parameters', desc: 'استخدم UTM في لينكات الحملات عشان تعرف أي حملة جابت حجوزات: ?utm_source=facebook&utm_campaign=cleaning' },
            { title: 'Conversion Tracking', desc: 'صفحة تأكيد الحجز فيها event تلقائي — ربط الـ Pixel بـ Purchase/Lead event' },
            { title: 'Retargeting', desc: 'الـ Pixel فعّال على كل الصفحات — استخدم Custom Audiences لاستهداف اللي زاروا صفحة خدمة معينة' },
            { title: 'Page Speed', desc: 'الموقع مبني على Next.js — سريع تلقائياً. اتأكد إن الصور مضغوطة وبجودة مناسبة' },
            { title: 'Mobile First', desc: '80%+ من الترافيك من الموبايل — اتأكد إن صفحة الحجز سهلة على الموبايل (وده متعمل فعلاً)' },
          ].map((tip, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-amber-100">
              <p className="font-black text-amber-900 mb-1">{tip.title}</p>
              <p className="text-sm text-amber-700 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
