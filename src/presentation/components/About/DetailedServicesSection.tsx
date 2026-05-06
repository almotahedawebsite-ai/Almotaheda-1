import { FiCheck } from 'react-icons/fi';

export default function DetailedServicesSection({ locale }: { locale: string }) {
  if (locale !== 'ar') return null;

  const services = [
    {
      title: 'نظافه الواجهات',
      subtitle: 'تنظيف الواجهات الزجاجيه والكلادينج والرخاميه',
      content: (
        <div className="space-y-4">
          <p>
            شركاء النجاح الكرام تعد الشركه المتحده من افضل الشركات علي مستوي مصر في مجال تنظيف وتلميع الواجهات الزجاجيه والكلادينج المختلفه سواء كانت الواجهه ( زجاجيه – رخاميه – كلادينج ) وسواء كانت واجهات للشركات او البنوك اوالمستشفيات او المراكز التجاريه او الفلل والعمارات والقصور لتعطي هذا الطابع المتميز للمنشئه الخاصه بك.
          </p>
          <p>
            وتتميز دائما شركتنا بعده مميزات واليكم اهمها استخدام اجود انواع المنظفات المصنوعه خصصيا للواجهات المعرضه دائما لاشعه الشمس حتي لا تتفاعل معها وتؤثر علي العمر الافتراضي للواجهه وتعطيها المزيد من اللمعان.
          </p>
          <p>
            يتوفر لدينا فريق عمل مميمز ومجهز ومدرب تدريبا فنيا عاليا للقيام بهذه المهمه والنزول من اعلي ارتفاع مهما بلغ طول المنشأه.
          </p>
        </div>
      )
    },
    {
      title: 'النظافه الداخليه',
      subtitle: 'نظافة المنشآت بعد التشطيب والدورية',
      content: (
        <div className="space-y-4">
          <p>
            الشركه المتحده من الشركات المتخصصة فى خدمات نظافة المنشآت حيث توفر للعديد من شركاء النجاح خدمة نظافة وصيانة منشأتهم على درجة ومستوى عالى من الخدمة من حيث النظافة والشكل الجمالى الرائع، فان النظافة الشاملة للمكان اهم ما يميزه، سواء الأرضيات أو الحوائط والسيراميك والرخام والسجاد والأنتريهات…إلخ
          </p>
          <p>
            وكل هذا يتم من خلال أكبر فريق تنظيف محترف وتتوافر فيه العديد من المواصفات المهنية الرائعة كالأمانه والإحتراف والسرعة.
          </p>
          <div className="pt-2">
            <h4 className="font-bold text-brand-teal mb-2">خدمات النظافة الشاملة التي تقدمها الشركة:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> تولي مسؤلية النظافة الشاملة للشركات بصفة دورية سواء يوميا او أسبوعيا أو شهريا.</li>
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> تنظيف جميع الواجهات الزجاجية والرخامية مهما كان الأرتفاع.</li>
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> تنظيف جميع أنواع الأرضيات سواء سيراميك أو رخام وجرانيت أو باركيه بأحدث المعدات.</li>
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> تنظيف جمبع أنواع السجاد والموكيت والستائر والأنتريهات.</li>
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> التعاقد مع الشركات وأصحاب المنازل والأبراج السكنية بتولي مسؤلية النظافة بعد التشطيب وايضا النظافة الدورية.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'التعقيم',
      subtitle: 'كيفيه تعقيم الشركات والمنازل والمدارس والمصانع ضد الفيروسات',
      content: (
        <div className="space-y-4">
          <p>
            لم تعد عملية التنظيف كافية للحصول على منشآت آمنة صحية من الفيروسات التي يمكن أن تتواجد على الأسطح لفترات طويلة للغاية ولا يمكن القضاء عليها بطرق التنظيف العادية، لذلك تحتاج المؤسسات لعمليه تعقيم خاصه.
          </p>
          <div className="pt-2">
            <h4 className="font-bold text-brand-teal mb-2">تحتاج هذه المنشات للتعقيم العميق والكامل لكافه اجزاء المنشاه من خلال:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>تعقيم المدارس:</strong> يشمل الارضيات ومقاعد الطلاب والحمامات واماكن تجمع الطلاب والملاعب لتوفير اعلي قدر من الحمايه للطلاب.</li>
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>تعقيم الشركات:</strong> يشمل ذلك المكاتب والارضيات والزجاج وتنظيف السجاد والحمامات والسلالم والمداخل خاصه مع تعرضها لتردد العديد من الاشخاص عليها.</li>
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>تعقيم المنازل:</strong> تحتاج المنازل لتعقيم بشكل دوري للحفاظ علي صحه المتواجدين داخلها خاصه المطابخ والاسطح والحمامات ومكافحه الحشرات ايضا لتجنب كافه العوامل التي قد تكون سببا في نقل الامراض.</li>
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>تعقيم المصانع:</strong> يشمل ذلك الالات والمعدات والارضيات والحمامات والسلالم والمداخل للحفاظ علي صحه العاملين بالمصنع.</li>
            </ul>
          </div>
          <div className="pt-2">
            <h4 className="font-bold text-brand-teal mb-2">لماذا تعتبر الشركه المتحده الأفضل في التعقيم؟</h4>
            <p>تشمل خدمات الشركه المتحده تعقيم وتنظيف الأسطح بشكل عميق وفعال مما يؤمن الحماية الكاملة والآمنة من الجراثيم والفيروسات وتنفيذ برامج التعقيم وفقا لتوصيات منظمة الصحة العالمية من خلال المنظفات الفعالة القاتلة لجميع الفيروسات باستخدام مواد طبية المخففة بنسبة 95% على جميع الأسطح والأبواب والأرضيات ومواسير الصرف.</p>
          </div>
          <div className="pt-2">
            <h4 className="font-bold text-brand-teal mb-2">ماهي المواد المستخدمه في عمليه التعقيم؟</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>الكحول 70%:</strong> تساعد المادة في التخلص والقضاء على الفيروسات والبكتيريا بالكامل.</li>
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>هيبو كلوريد الصوديوم 10%:</strong> تستخدم في تعقيم الأسطح والمقابض والكراسي والأثاث بحرص شديد.</li>
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>مادة بروكسيد 20%</strong></li>
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>مواد خليط 20%:</strong> مجموعة مطهرة تقضي على الفطريات والبكتيريا نهائيًا.</li>
            </ul>
            <p className="text-sm mt-2 text-gray-500">جميع المواد المستخدمة بمواصفات عالمية ومصرحة من قبل وزارة الصحة ومنظمة الصحة العالمية.</p>
          </div>
        </div>
      )
    },
    {
      title: 'هود المطاعم والمداخن',
      subtitle: 'تنظيف هود المطاعم وخطوط المداخن',
      content: (
        <div className="space-y-4">
          <p>
            تعتبر الشركه المتحده من افضل الشركات الرائده في مجال تنظيف هود المطاعم وخطوط المداخن وتنظيف ماكينه الشفط وتنظيف الخطوط باكملها من الداخل مهما بلغت ارتفاعتها ويمر برنامج تنظيف هود المطاعم بعده خطوات واليكم اهمها:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>اولا:</strong> فك ماكينه الشفط من اعلي وتنظيفها عن طريق ضخ اقوي انواع المواد المصنعه خصيصا لتفتيت الدهون وتسيح الشحوم المتعلقه بمروحه الموتور والتي تقلل من عزم وحركه ماكينه الشفط.</li>
            <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>ثانيا:</strong> تقوم الشركه بتنظيف الخطوط الراسيه والافقيه والاكواع كامله عن طريق فريق عمل متخصص ومدرب تدريبا فنيا للنزول داخل الخط (ألداكت) بنظام حزام الاسبايدر الحديث وتنظيفه من الداخل. وعند عدم امكانيه الدخول يتم فتح ابواب فنيه (ابواب كشف) بالخط لضمان كفاءة التنظيف.</li>
            <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>ثالثا:</strong> بعد الانتهاء من الخطوتين يتم التوجيه الي المطبخ لتنظيف الطنابيش والفلاتر الاستانلس وازاله الدهون المتراكمه عليها ثم استخدام مواد تعطيها لمعه وتجعلها وكانها جديده.</li>
            <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>رابعا:</strong> يتم اختبار قوه الشفط بعد الانتهاء وتصوير الاعمال بالكامل وتسليم اتمام عمليه التنظيف للمسؤل.</li>
          </ul>
          <p className="font-bold text-brand-teal">ولدينا قسم خاص بتركيب هود المطاعم والفنادق وتفصيل المداخن بجميع انواعها وارتفاعتها المختلفه.</p>
        </div>
      )
    },
    {
      title: 'مكافحه واباده الحشرات',
      subtitle: 'مكافحة الحشرات والقوارض',
      content: (
        <div className="space-y-4">
          <p>
            تعتبر الشركه المتحده من الشركات الرائدة في مجال مكافحة الحشرات والقوارض لأن الشركة تمتلك فريق عمل مدرب تدريباً فنياً علي القيام بمكافحة الحشرات والقوارض وتحديد نوعية الحشرة واختيار المصل المناسب لها والذي يقضي عليها تماماً سواء كانت المنشأة ( منزل – شركة – مستشفى – مصنع – مخزن ).
          </p>
          <p>
            ولأن مع تغير فصول السنة تبدء الحشرات في الظهور وخاصة في الاماكن المغلقة وتعد الحشرات من اكثر الكائنات ازعاجاً ولكن مع برنامج مكافحة الحشرات من الشركه المتحده ستتخلص منها نهائياً.
          </p>
          <p>
            وتتميز شركتنا بوجود فريق متخصص يقوم بعملية المعاينة للمنشأة لتحديد نوعية الحشرات لاختيار افضل المبيدات الحشرية ومبيدات القوارض عديمة الرائحة والتي لها فاعلية فائقة.
          </p>
        </div>
      )
    },
    {
      title: 'تنظيف خزانات المياه',
      subtitle: 'خبرة أكثر من 15 سنة في الخزانات',
      content: (
        <div className="space-y-4">
          <p>
            الشركه المتحده من افضل الشركات الرائدة في مجال تنظيف خزانات المياه بشهادة المئات من شركاء النجاح فنحن نقدم هذه الخدمة منذ اكثر من 15 سنة خبرة علي يد عمال ومشرفين مدربين علي اعلي مستوي قادرين علي تنفيذ الخدمة باعلي جودة وفي اقل وقت.
          </p>
          <div className="pt-2">
            <h4 className="font-bold text-brand-teal mb-2">لماذا يمكنك الاعتماد علي الشركه المتحده؟</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>الجودة:</strong> فريقنا مكون من عمال ومشرفين مدربين وعلي درجة عالية من الكفاءة والمهنية.</li>
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>الالتزام:</strong> الالتزام التام بالمواعيد المتفق عليها.</li>
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> <strong>الامانة:</strong> تضمن الشركة ان جميع العمال علي درجة عالية جدا من الامانة فلا قلق علي اي متعلقات.</li>
              <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> استخدام افضل المواد التي اعدت خصصيا لتنظيف الخزانات.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'خدمه توريد العماله',
      subtitle: 'بنظام العقد الشهري والسنوي',
      content: (
        <div className="space-y-4">
          <p>
            تقدم الشركه المتحده خدمه توريد العماله بنظام التعاقد الشهري والسنوي لجميع المنشات والمؤسسات العامه والخاصه.
          </p>
          <p>
            حيث تقوم الشركه بتوريد عمال نظافة للكمبوندات والشركات والمصانع وايضا المنشآت الحكومية. معنا سوف تنجز مهامك بكل كفاءة وبكل أمان وعدم خوف علي املاكك أو منشأتك.
          </p>
        </div>
      )
    },
    {
      title: 'نظافه بعد التشطيب',
      subtitle: 'نظافة شاملة للمنشآت بعد الانتهاء من التشطيبات',
      content: (
        <div className="space-y-4">
          <p>
            تعد النظافة بعد التشطيب من أصعب المهام التي تواجه أصحاب المنشآت بسبب تراكم بقايا الطلاء، الأسمنت، والأتربة الدقيقة في كل الزوايا، والتي يصعب إزالتها بالطرق التقليدية.
          </p>
          <p>
            لذلك، وفرنا في الشركة المتحدة فريقاً مدرباً ومعدات متخصصة لإزالة كافة آثار التشطيبات والبناء، ليصبح مكانك جاهزاً للفرش والاستخدام الفوري بأعلى درجات اللمعان والنظافة التامة.
          </p>
          <ul className="space-y-2 pt-2">
            <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> إزالة بقايا الدهانات والأسمنت من الأرضيات والحوائط.</li>
            <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> تلميع وجلي الرخام والسيراميك والبورسلين.</li>
            <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> تنظيف وتلميع الواجهات الزجاجية والمرايا بالكامل.</li>
            <li className="flex items-start gap-2"><FiCheck className="text-brand-teal mt-1 shrink-0" /> تنظيف وتطهير الحمامات والمطابخ بعد التركيبات.</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-black text-brand-navy dark:text-white mb-4">التفاصيل الشاملة لخدماتنا</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            كل ما تريد معرفته عن منهجيتنا في العمل ومستوى الدقة الذي نقدمه لك
          </p>
        </div>
        
        <div className="space-y-8 md:space-y-12">
          {services.map((srv, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow border-l-4 border-l-brand-teal">
              <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                <div className="md:w-1/3 text-center md:text-right">
                  <h3 className="text-xl md:text-2xl font-black text-brand-navy dark:text-white mb-2">{srv.title}</h3>
                  <p className="text-brand-teal font-bold text-sm mb-4">{srv.subtitle}</p>
                  <div className="h-1 w-12 bg-brand-teal rounded-full hidden md:block"></div>
                </div>
                <div className="md:w-2/3 text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg text-center">
                  {srv.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
