import React from 'react';
import { FiAward, FiShield, FiZap } from 'react-icons/fi';
export default function WhyUsSection({ locale }: { locale: string }) {
  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-900/50" id="why-us-section">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-brand-navy/10 text-brand-navy dark:text-brand-teal px-5 py-2 rounded-full text-sm font-black mb-4">
            <FiAward /> {locale === 'ar' ? 'لماذا المتحدة؟' : 'Why Al-Motaheda?'}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
            {locale === 'ar' ? 'لأننا الأفضل في مجالنا' : 'Because We Are The Best'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: <FiAward />, title: locale === 'ar' ? 'خبرة واحترافية' : 'Experience & Professionalism', desc: locale === 'ar' ? 'فريق مدرب ومؤهل بخبرة سنوات في مجال النظافة والصيانة' : 'Trained and qualified team with years of experience' },
            { icon: <FiShield />, title: locale === 'ar' ? 'جودة مضمونة' : 'Guaranteed Quality', desc: locale === 'ar' ? 'نلتزم بأعلى معايير الجودة مع ضمان رضا العميل الكامل' : 'We commit to the highest quality standards with full satisfaction guarantee' },
            { icon: <FiZap />, title: locale === 'ar' ? 'سرعة التنفيذ' : 'Fast Execution', desc: locale === 'ar' ? 'ننجز المهام في الوقت المحدد مع الحفاظ على أعلى مستوى من الإتقان' : 'We complete tasks on time while maintaining the highest level of perfection' },
          ].map((item, idx) => (
            <div key={idx} className="group bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 text-center card-hover">
              <span className="text-5xl mb-6 block text-brand-navy group-hover:-translate-y-2 transition-transform flex justify-center">{item.icon}</span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
