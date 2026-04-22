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

async function run() {
  // 1. قراءة كل الخدمات الموجودة
  const snap = await db.collection('services').orderBy('order', 'asc').get();
  const services = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  
  console.log('\n📋 الخدمات الموجودة حالياً:');
  services.forEach((s: any) => {
    console.log(`  [${s.id}] ${s.name?.ar || s.name} (order: ${s.order})`);
  });

  // ===================================================================
  // الدمج الأول: الصيانة
  // ===================================================================
  // نبحث عن الخدمات المرتبطة بالصيانة
  const maintenanceIds = services
    .filter((s: any) => {
      const name = (s.name?.ar || s.name || '').toLowerCase();
      return (
        name.includes('صيان') ||
        name.includes('كهرب') ||
        name.includes('سباك') ||
        name.includes('نقاش') ||
        name.includes('دهان')
      );
    })
    .map((s: any) => s.id);

  console.log('\n🔧 خدمات الصيانة التي سيتم دمجها:', maintenanceIds);

  // ===================================================================
  // الدمج الثاني: المفروشات
  // ===================================================================
  const furnitureIds = services
    .filter((s: any) => {
      const name = (s.name?.ar || s.name || '').toLowerCase();
      return (
        name.includes('مفروش') ||
        name.includes('انتريه') ||
        name.includes('سجاد') ||
        name.includes('موكيت') ||
        name.includes('ستار') ||
        name.includes('كنب')
      );
    })
    .map((s: any) => s.id);

  console.log('🛋️  خدمات المفروشات التي سيتم دمجها:', furnitureIds);

  // ===================================================================
  // تحديث / إنشاء الخدمة الموحدة: الصيانة
  // ===================================================================
  const maintenanceService = {
    id: 'maintenance',
    name: { ar: 'الصيانة', en: 'Maintenance Services' },
    slug: 'maintenance',
    description: {
      ar: 'نقدم خدمات صيانة شاملة للمنازل والشركات تشمل: أعمال الكهرباء، السباكة، النقاشة والدهانات، وجميع أعمال الصيانة الدورية والطارئة بأيدي متخصصين معتمدين.',
      en: 'We provide comprehensive maintenance services for homes and businesses including: electrical work, plumbing, painting, and all periodic and emergency maintenance by certified specialists.',
    },
    image: '',
    video: '',
    icon: '🔧',
    category: 'maintenance',
    order: 20,
    isActive: true,
    createdAt: new Date().toISOString(),
    subServices: [
      { ar: 'صيانة منازل وشركات', en: 'Home & Business Maintenance' },
      { ar: 'أعمال الكهرباء', en: 'Electrical Work' },
      { ar: 'أعمال السباكة', en: 'Plumbing' },
      { ar: 'نقاشة ودهانات', en: 'Painting & Decoration' },
    ],
  };

  await db.collection('services').doc('maintenance').set(maintenanceService, { merge: true });
  console.log('\n✔ تم إنشاء/تحديث خدمة الصيانة الموحدة');

  // ===================================================================
  // تحديث / إنشاء الخدمة الموحدة: المفروشات
  // ===================================================================
  const furnitureService = {
    id: 'furniture-cleaning',
    name: { ar: 'تنظيف المفروشات', en: 'Furniture & Upholstery Cleaning' },
    slug: 'furniture-cleaning',
    description: {
      ar: 'خدمة متكاملة لتنظيف وتعقيم جميع أنواع المفروشات: الانتريهات والكنب، السجاد والموكيت، الستائر والمفروشات بأحدث المعدات وأفضل المواد.',
      en: 'Comprehensive cleaning and sanitizing of all furniture types: sofas & lounges, carpets & rugs, curtains and all upholstery using the latest equipment.',
    },
    image: '',
    video: '',
    icon: '🛋️',
    category: 'furniture',
    order: 15,
    isActive: true,
    createdAt: new Date().toISOString(),
    subServices: [
      { ar: 'تنظيف الانتريهات والكنب', en: 'Sofa & Lounge Cleaning' },
      { ar: 'تنظيف السجاد والموكيت', en: 'Carpet & Rug Cleaning' },
      { ar: 'تنظيف الستائر', en: 'Curtain Cleaning' },
      { ar: 'تنظيف المفروشات عموماً', en: 'General Upholstery Cleaning' },
    ],
  };

  await db.collection('services').doc('furniture-cleaning').set(furnitureService, { merge: true });
  console.log('✔ تم إنشاء/تحديث خدمة المفروشات الموحدة');

  // ===================================================================
  // تعطيل الخدمات القديمة المدمجة (بدل الحذف للحفاظ على السلامة)
  // ===================================================================
  const toDeactivate = [...new Set([...maintenanceIds, ...furnitureIds])].filter(
    id => id !== 'maintenance' && id !== 'furniture-cleaning'
  );

  if (toDeactivate.length > 0) {
    console.log('\n⚠️  تعطيل الخدمات القديمة (isActive: false):');
    for (const id of toDeactivate) {
      await db.collection('services').doc(id).update({ isActive: false });
      console.log(`  ✔ تم تعطيل: ${id}`);
    }
  } else {
    console.log('\nℹ️  لا توجد خدمات قديمة مكتشفة تلقائياً — تم إنشاء الخدمتين الجديدتين فقط.');
  }

  console.log('\n✅ اكتمل الدمج!');
  console.log('   - خدمة الصيانة الموحدة: [maintenance]');
  console.log('   - خدمة المفروشات الموحدة: [furniture-cleaning]');
}

run().catch(console.error);
