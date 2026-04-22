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
  // ---- إعادة تفعيل اللاند سكيب وحمامات السباحة (تم تعطيلهم خطأ) ----
  await db.collection('services').doc('landscaping').update({ isActive: true });
  console.log('✔ تم إعادة تفعيل: اللاند سكيب');

  await db.collection('services').doc('pool-maintenance').update({ isActive: true });
  console.log('✔ تم إعادة تفعيل: حمامات السباحة');

  // ---- تحديث خدمة الصيانة الموحدة (بدون لاند سكيب وبحور) ----
  await db.collection('services').doc('maintenance').set({
    id: 'maintenance',
    name: { ar: 'الصيانة', en: 'Maintenance Services' },
    slug: 'maintenance',
    description: {
      ar: 'نقدم خدمات صيانة شاملة للمنازل والشركات تشمل: أعمال الكهرباء، السباكة، النقاشة والدهانات، النجارة، أعمال الجبس بورد، وجميع أعمال الصيانة الدورية والطارئة بأيدي متخصصين معتمدين.',
      en: 'We provide comprehensive maintenance services for homes and businesses including: electrical work, plumbing, painting, carpentry, gypsum board work, and all periodic and emergency maintenance by certified specialists.',
    },
    image: '',
    video: '',
    icon: '🔧',
    category: 'maintenance',
    order: 9,
    isActive: true,
    createdAt: new Date().toISOString(),
    subServices: [
      { ar: 'صيانة المنازل والشركات', en: 'Home & Business Maintenance' },
      { ar: 'أعمال الكهرباء', en: 'Electrical Work' },
      { ar: 'أعمال السباكة', en: 'Plumbing' },
      { ar: 'نقاشة ودهانات', en: 'Painting & Decoration' },
      { ar: 'نجارة وأعمال الجبس بورد', en: 'Carpentry & Gypsum Board' },
    ],
  }, { merge: true });
  console.log('✔ تم تحديث خدمة الصيانة الموحدة (بدون لاند سكيب وبحور)');

  // ---- تعطيل الخدمتين المدمجتين فقط ----
  await db.collection('services').doc('home-maintenance').update({ isActive: false });
  await db.collection('services').doc('electrical-plumbing').update({ isActive: false });
  console.log('✔ تم تعطيل: صيانة المنازل (القديمة) + كهرباء وسباكة (القديمة)');

  console.log('\n✅ تم التصحيح بنجاح!');
}

run().catch(console.error);
