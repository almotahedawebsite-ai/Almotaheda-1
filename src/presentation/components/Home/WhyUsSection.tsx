import Image from 'next/image';
import { FiCheckCircle, FiAward } from 'react-icons/fi';

export default function WhyUsSection({ locale }: { locale: string }) {
  const reasons = [
    'الامانه',
    'المظهر اللائق والزي الموحد',
    'النظافه الداخليه والخارجيه',
    'الرقي في التعامل مع العملاء',
    'التفاني والاخلاص في العمل',
    'اتمام المهام المطلوبه علي اكمل وجه',
    'مدربين علي اعلي مستوي'
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-900/50" id="why-us-section">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 bg-brand-navy/10 text-brand-navy dark:text-brand-teal px-5 py-2 rounded-full text-sm font-black mb-2">
              <FiAward /> {locale === 'ar' ? 'لماذا المتحدة؟' : 'Why Al-Motaheda?'}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight text-center">
              {locale === 'ar' ? 'لماذا نحن ؟' : 'Why Us?'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed text-center">
              {locale === 'ar' 
                ? 'نحن نعلم ان السماح لشخص ما بدخول منزلك او مكتبك او شركتك او مؤسستك امر كبير ، لذلك يتم فحص واختيار جميع عمال الشركه المتحده بدقه وحرص وفقأ للمعايير التي تناسب وتلائم شركاء النجاح للشركه المتحدة للنظافه والخدمات الفندقيه ويتميز الموظفين لدينا بالاتي:'
                : 'We know that allowing someone into your home or office is a big deal. Therefore, all employees are carefully selected according to the highest standards.'
              }
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {reasons.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-teal shrink-0 text-xl" />
                  <span className="font-bold text-gray-800 dark:text-gray-200">{locale === 'ar' ? reason : reason}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="aspect-square rounded-[3rem] overflow-hidden relative shadow-2xl">
               <Image src="https://res.cloudinary.com/dsr72hebx/image/upload/v1775240899/hero_hhzeus.jpg" alt="لماذا نحن" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" loading="lazy" quality={70} />
               <div className="absolute inset-0 bg-brand-navy/20 mix-blend-multiply"></div>
             </div>
             {/* Decorative element */}
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-teal/20 rounded-full blur-3xl z-[-1]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
