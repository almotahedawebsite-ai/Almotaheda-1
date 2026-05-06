

export default function WhatWeCleanSection({ locale }: { locale: string }) {
  if (locale !== 'ar') return null;

  const categories = [
    {
      title: 'النظافه الداخليه للمنازل',
      items: [
        'الحمامات',
        'المطابخ',
        'غرف النوم والمعيشه',
        'جميع الارضيات',
        'الروف',
        'السجاد والستائر والانتريهات',
        'الاثاث المكتبي',
        'تعقيم وتطهير المكان بالكامل',
        'اباده الحشرات'
      ]
    },
    {
      title: 'نظافه الواجهات',
      items: [
        'نظافه الواجهات الزجاجيه',
        'نظافه الواجهات الرخاميه',
        'نظافه واجهات الكلادينج'
      ]
    },
    {
      title: 'هود المطاعم والمداخن',
      items: [
        'تنظيف ماكينه الشفط',
        'تنظيف الخطوط الرائسيه والافقيه والاكواع كامله',
        'تنظيف الطنابيش والفلاتر الاستنلس',
        'ازاله الدهون'
      ]
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-brand-navy dark:text-white mb-4">شاهد ما يمكننا تنظيفه</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            نغطي كافة تفاصيل النظافة بأدق المعايير
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-slate-800 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all">
              <h3 className="text-xl font-black text-brand-teal mb-6 pb-4 border-b border-gray-200 dark:border-slate-600">
                {cat.title}
              </h3>
              <ul className="space-y-4">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-brand-teal shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
