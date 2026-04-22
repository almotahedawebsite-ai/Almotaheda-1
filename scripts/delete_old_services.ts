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

// الخدمات القديمة التي تم دمجها ويجب حذفها نهائياً
const TO_DELETE = [
  'home-maintenance',      // ← مدمج في: الصيانة
  'electrical-plumbing',   // ← مدمج في: الصيانة
  'upholstery-carpet',     // ← مدمج في: تنظيف المفروشات
];

async function run() {
  console.log('\n📋 الخدمات الموجودة الآن:');
  const snap = await db.collection('services').orderBy('order', 'asc').get();
  snap.docs.forEach(d => {
    const data = d.data();
    console.log(`  [${d.id}] ${data.name?.ar || d.id} | isActive: ${data.isActive}`);
  });

  console.log('\n🗑️  حذف الخدمات القديمة...');
  for (const id of TO_DELETE) {
    const ref = db.collection('services').doc(id);
    const doc = await ref.get();
    if (doc.exists) {
      await ref.delete();
      console.log(`  ✔ تم حذف: ${id}`);
    } else {
      console.log(`  ℹ️  غير موجود: ${id}`);
    }
  }

  console.log('\n✅ تم الحذف! الخدمات المتبقية:');
  const after = await db.collection('services').orderBy('order', 'asc').get();
  after.docs.forEach(d => {
    const data = d.data();
    console.log(`  [${d.id}] ${data.name?.ar || d.id} | isActive: ${data.isActive}`);
  });
}

run().catch(console.error);
