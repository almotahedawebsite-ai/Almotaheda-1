import Image from 'next/image';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default function IntroSection({ locale }: { locale: string }) {
  if (locale !== 'ar') return null;

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
      <div className="container mx-auto px-6">
        {/* Main Intro */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-brand-navy dark:text-white mb-8 leading-tight">
            الشركه المتحدة للنظافة والخدمات الفندقية
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-loose text-center">
            خبرة اكثر من سبع سنوات في مجال النظافة الشاملة للمنازل والفيلات والشركات والمصانع والمدارس والمستشفيات وايضاً نظافة المداخن وهود المطاعم والفنادق وتنظيف وتلميع الواجهات الزجاجية والكلادينج والرخام مهما بلغ أرتفاع الواجهة، وايضاً لدينا قسم خاص بمكافحة الحشرات والقضاء عليها تماماً لأن لدينا فريق عمل ذو خبرة ومدرب تدريباً فنياً عالياً على القيام بمثل هذه الأعمال من خلال برنامج تدريبي صارم و دون التقصير فيها،كما لدينا فريق متخصص في التعقيم ضد الفيروسات والجراثيم , ونعمل ايضاَ على تحسين معاييرنا العالية لكي نصبح الأفضل في هذا المجال وبالفعل اصبحنا، عليك ان تثق بأننا سنقوم بجميع الأعمال المطلوبة علي أكمل وجه في اسرع وقت ممكن و بافضل جوده فقط عليك الاتصال بنا وسنأتي إلى مقرك للمعاينه ونقدم لك عرض سعر مجاني أحجز جميع خدماتنا الان.
          </p>
        </div>
      </div>

      {/* Highlighted Service: Labor Supply (Full Width) */}
      <div className="w-full bg-brand-navy text-white py-12 md:py-24 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/3 flex justify-center">
            <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10 relative group">
              <Image src="/images/labor_supply_team.png" alt="توريد عمالة" fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 192px, 320px" loading="lazy" />
              <div className="absolute inset-0 bg-brand-teal/20 mix-blend-multiply"></div>
            </div>
          </div>
          <div className="md:w-2/3 text-center" dir="rtl">
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 md:mb-6">
              خدمه توريد العماله بنظام العقد الشهري والسنوي
            </h3>
            <p className="text-white/80 text-base md:text-xl leading-relaxed mb-6 md:mb-8 max-w-3xl">
              تقدم الشركه المتحده خدمه توريد العماله بنظام التعاقد الشهري والسنوي لجميع المنشات والمؤسسات العامه والخاصه . حيث تقوم الشركه المتحده لخدمات النظافة بتوريد عمال نظافة للكمبوندات والشركات والمصانع وايضا المنشآت الحكومية معنا سوف تنجز مهامك بكل كفاءة وبكل أمان وعدم خوف علي املاكك أو منشأتك.
            </p>
            <Link href={`/${locale}/booking`} className="inline-flex items-center gap-2 bg-brand-teal hover:bg-white hover:text-brand-navy text-brand-navy px-10 py-4 rounded-xl font-black text-lg transition-colors">
              <FiCheckCircle /> اطلب عمالتك الآن
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
