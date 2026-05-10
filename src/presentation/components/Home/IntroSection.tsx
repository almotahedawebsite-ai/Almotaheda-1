export default function IntroSection({ locale }: { locale: string }) {
  if (locale !== 'ar') return null;

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
      <div className="container mx-auto px-6">
        {/* Main Intro */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-brand-navy dark:text-white mb-8 leading-tight">
            الشركه المتحدة للنظافة والخدمات الفندقية
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-loose text-center">
            خبرة اكثر من سبع سنوات في مجال النظافة الشاملة للمنازل والفيلات والشركات والمصانع والمدارس والمستشفيات وايضاً نظافة المداخن وهود المطاعم والفنادق وتنظيف وتلميع الواجهات الزجاجية والكلادينج والرخام مهما بلغ أرتفاع الواجهة، وايضاً لدينا قسم خاص بمكافحة الحشرات والقضاء عليها تماماً لأن لدينا فريق عمل ذو خبرة ومدرب تدريباً فنياً عالياً على القيام بمثل هذه الأعمال من خلال برنامج تدريبي صارم و دون التقصير فيها،كما لدينا فريق متخصص في التعقيم ضد الفيروسات والجراثيم , ونعمل ايضاَ على تحسين معاييرنا العالية لكي نصبح الأفضل في هذا المجال وبالفعل اصبحنا، عليك ان تثق بأننا سنقوم بجميع الأعمال المطلوبة علي أكمل وجه في اسرع وقت ممكن و بافضل جوده فقط عليك الاتصال بنا وسنأتي إلى مقرك للمعاينه ونقدم لك عرض سعر مجاني أحجز جميع خدماتنا الان.
          </p>
        </div>
      </div>
    </section>
  );
}
