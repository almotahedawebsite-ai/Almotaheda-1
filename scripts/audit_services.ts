import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env.local') });

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_DATABASE_URL } = process.env;

if (!admin.apps || admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: FIREBASE_DATABASE_URL,
  });
}

const db = admin.firestore();

// ─── محتوى الخدمات الكامل ────────────────────────────────────────────────────
const SERVICE_CONTENT: Record<string, { descAr: string; descEn: string; icon: string; slug: string }> = {
  'internal-cleaning': {
    slug: 'internal-cleaning',
    icon: '🏠',
    descAr: 'خدمة تنظيف داخلي شاملة للمنازل والشقق والمكاتب تشمل تنظيف وتلميع الأرضيات، الحوائط، الأسقف، الحمامات، المطابخ، الأثاث وجميع الأسطح الداخلية بأحدث المعدات ومواد تنظيف عالية الجودة.',
    descEn: 'Comprehensive internal cleaning for homes, apartments, and offices including floor polishing, walls, ceilings, bathrooms, kitchens, furniture, and all interior surfaces using the latest equipment and high-quality cleaning products.',
  },
  'deep-cleaning': {
    slug: 'deep-cleaning',
    icon: '🔍',
    descAr: 'خدمة التنظيف العميق (ديب كلينج) المتخصصة للأماكن التي تحتاج تنظيفاً دقيقاً من الداخل والخارج، تشمل تنظيف المناطق الصعبة الوصول، إزالة الأوساخ العميقة والترسبات والبكتيريا بأجهزة بخار متخصصة.',
    descEn: 'Specialized deep cleaning service for places requiring thorough cleaning inside and out, including hard-to-reach areas, removing deep dirt, deposits, and bacteria with specialized steam equipment.',
  },
  'facade-cleaning': {
    slug: 'facade-cleaning',
    icon: '🏢',
    descAr: 'خدمة تنظيف واجهات المباني والأبراج والفلل بأحدث تقنيات الغسيل بالضغط العالي، إزالة الأتربة والبقع والطحالب والدهانات القديمة وتلميع الزجاج والرخام والجرانيت بأمان تام.',
    descEn: 'Building facade, tower, and villa cleaning using the latest high-pressure washing techniques, removing dust, stains, algae, and old paint, polishing glass, marble, and granite with complete safety.',
  },
  'furniture-cleaning': {
    slug: 'furniture-cleaning',
    icon: '🛋️',
    descAr: 'خدمة متكاملة لتنظيف وتعقيم جميع أنواع المفروشات: الانتريهات والكنب، السجاد والموكيت، الستائر والمراتب، بأحدث المعدات وأفضل المواد المعتمدة للحفاظ على الألوان والخامات.',
    descEn: 'Comprehensive cleaning and sanitizing of all furniture types including sofas, carpets, rugs, curtains, and mattresses using the latest equipment and certified materials to preserve colors and fabrics.',
  },
  'sanitization': {
    slug: 'sanitization',
    icon: '🦠',
    descAr: 'خدمة تعقيم وتطهير شاملة للمنازل والشركات والمستشفيات والمدارس باستخدام مواد معتمدة من وزارة الصحة تقضي على الفيروسات والبكتيريا والجراثيم بنسبة 99.9%.',
    descEn: 'Comprehensive sanitization and disinfection for homes, offices, hospitals, and schools using Ministry of Health-approved materials that eliminate viruses, bacteria, and germs by 99.9%.',
  },
  'pest-control': {
    slug: 'pest-control',
    icon: '🐛',
    descAr: 'خدمة مكافحة وإبادة الحشرات والقوارض الشاملة باستخدام مبيدات آمنة ومرخصة وفعّالة، تشمل النمل والصراصير والبق والفئران والثعابين وجميع الآفات مع ضمان طويل الأمد.',
    descEn: 'Comprehensive pest and rodent control using safe, licensed, and effective pesticides covering ants, cockroaches, bedbugs, mice, snakes, and all pests with long-term guarantee.',
  },
  'restaurant-hood': {
    slug: 'restaurant-hood',
    icon: '🍽️',
    descAr: 'خدمة متخصصة لتنظيف هود وشفاط المطاعم والمطابخ الصناعية وإزالة الشحوم والدهون المتراكمة، مع تنظيف مجاري الهواء والمداخن للحفاظ على معايير السلامة والصحة.',
    descEn: 'Specialized service for cleaning restaurant hoods, industrial kitchen exhaust systems, removing accumulated grease and fat, and cleaning air ducts and chimneys to maintain safety and health standards.',
  },
  'maintenance': {
    slug: 'maintenance',
    icon: '🔧',
    descAr: 'خدمات صيانة شاملة للمنازل والشركات تشمل: أعمال الكهرباء، السباكة، النقاشة والدهانات، النجارة، أعمال الجبس بورد، وجميع أعمال الصيانة الدورية والطارئة بأيدي متخصصين معتمدين.',
    descEn: 'Comprehensive maintenance services for homes and businesses including electrical work, plumbing, painting, carpentry, gypsum board, and all periodic and emergency maintenance by certified specialists.',
  },
  'landscaping': {
    slug: 'landscaping',
    icon: '🌿',
    descAr: 'خدمة اللاند سكيب الشاملة: تصميم وتركيب وصيانة الحدائق والمسطحات الخضراء، تنسيق الزهور والنباتات، تركيب أنظمة الري الأوتوماتيكي، وصيانة جميع العناصر الخضراء.',
    descEn: 'Comprehensive landscaping: design, installation and maintenance of gardens and green spaces, flower and plant arrangement, automatic irrigation systems installation, and maintenance of all green elements.',
  },
  'pool-maintenance': {
    slug: 'pool-maintenance',
    icon: '🏊',
    descAr: 'خدمة متكاملة لنظافة وتعقيم وصيانة حمامات السباحة: تنظيف الحوض والمصافي، معادلة المياه وإضافة الكيماويات، تشغيل وصيانة المضخات والفلاتر، والكشف عن التسريبات.',
    descEn: 'Comprehensive pool cleaning, sanitization, and maintenance: pool and filter cleaning, water balancing and chemical treatment, pump and filter operation and maintenance, and leak detection.',
  },
  'restaurant-services': {
    slug: 'restaurant-services',
    icon: '🍴',
    descAr: 'حزمة خدمات متكاملة للمطاعم والكافيهات تشمل التنظيف اليومي والعميق، تعقيم المطابخ والأسطح، مكافحة الحشرات، صيانة معدات المطابخ، وتوريد عمالة متخصصة.',
    descEn: 'Comprehensive service package for restaurants and cafes including daily and deep cleaning, kitchen and surface sanitization, pest control, kitchen equipment maintenance, and specialized labor supply.',
  },
  'corporate-factory': {
    slug: 'corporate-factory',
    icon: '🏭',
    descAr: 'خدمات نظافة وتعقيم وصيانة متخصصة للشركات والمصانع والمستودعات: تنظيف المعدات والآلات، الأرضيات الصناعية، تعقيم بيئات الإنتاج، وتوريد عمالة تنظيف دائمة.',
    descEn: 'Specialized cleaning, sanitization, and maintenance services for companies, factories, and warehouses: equipment and machinery cleaning, industrial floors, production environment sanitization, and permanent cleaning labor supply.',
  },
  'labor-supply': {
    slug: 'labor-supply',
    icon: '👷',
    descAr: 'توريد عمالة نظافة مدربة ومؤهلة للشركات والفنادق والمستشفيات والمجمعات السكنية، بعقود يومية وشهرية وسنوية، مع الإشراف المستمر وضمان الجودة.',
    descEn: 'Supply of trained and qualified cleaning labor for companies, hotels, hospitals, and residential compounds, with daily, monthly, and annual contracts, continuous supervision, and quality guarantee.',
  },
  'contracts': {
    slug: 'contracts',
    icon: '📋',
    descAr: 'عقود صيانة دورية وتنظيف شاملة للمنشآت والشركات والفنادق والمجمعات السكنية، بأسعار تنافسية مع ضمان جودة الخدمة على مدار العام وأولوية في الاستجابة الطارئة.',
    descEn: 'Periodic maintenance and comprehensive cleaning contracts for facilities, companies, hotels, and residential compounds, at competitive prices with year-round service quality guarantee and emergency response priority.',
  },
};

async function run() {
  console.log('\n📝 تحديث تفاصيل الخدمات...\n');

  const snap = await db.collection('services').orderBy('order', 'asc').get();

  for (const docSnap of snap.docs) {
    const id = docSnap.id;
    const data = docSnap.data();
    const content = SERVICE_CONTENT[id];

    if (!content) {
      console.log(`  ⚠️  لا يوجد محتوى محدد لـ: ${id}`);
      continue;
    }

    const desc = data.description;
    const currentAr = typeof desc === 'string' ? desc : (desc?.ar || '');
    const currentEn = typeof desc === 'object' ? (desc?.en || '') : '';
    const currentIcon = data.icon || '';
    const currentSlug = data.slug || '';

    // فقط حدّث الحقول الفارغة
    const updates: Record<string, any> = {};

    if (!currentAr || !currentEn) {
      updates.description = {
        ar: currentAr || content.descAr,
        en: currentEn || content.descEn,
      };
    }
    if (!currentIcon) updates.icon = content.icon;
    if (!currentSlug) updates.slug = content.slug;

    if (Object.keys(updates).length > 0) {
      await db.collection('services').doc(id).update({
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      console.log(`  ✔ تم تحديث: ${data.name?.ar || id}`);
    } else {
      console.log(`  ✅ مكتمل: ${data.name?.ar || id}`);
    }
  }

  console.log('\n✅ اكتمل تحديث جميع الخدمات!');
}

run().catch(console.error);
