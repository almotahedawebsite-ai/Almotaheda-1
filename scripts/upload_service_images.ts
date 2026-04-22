import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { readFileSync } from 'fs';

dotenv.config({ path: join(process.cwd(), '.env.local') });

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_DATABASE_URL } = process.env;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

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

const BRAIN_DIR = `C:\\Users\\GGG\\.gemini\\antigravity\\brain\\aec1ad32-e2fa-4c69-a38f-c0ce12cea072`;

// صورة → service ID في Firestore
const SERVICE_IMAGES: { file: string; id: string }[] = [
  { file: 'service_internal_cleaning_1776885851735.png',   id: 'internal-cleaning' },
  { file: 'service_deep_cleaning_1776885868938.png',       id: 'deep-cleaning' },
  { file: 'service_facade_cleaning_1776885884703.png',     id: 'facade-cleaning' },
  { file: 'service_furniture_cleaning_1776885898909.png',  id: 'furniture-cleaning' },
  { file: 'service_sanitization_1776885913060.png',        id: 'sanitization' },
  { file: 'service_pest_control_1776885930225.png',        id: 'pest-control' },
  { file: 'service_restaurant_hood_1776885946650.png',     id: 'restaurant-hood' },
  { file: 'service_maintenance_1776885960841.png',         id: 'maintenance' },
  { file: 'service_landscaping_1776885975412.png',         id: 'landscaping' },
  { file: 'service_pool_maintenance_1776885990356.png',    id: 'pool-maintenance' },
  { file: 'service_restaurant_services_1776886004100.png', id: 'restaurant-services' },
  { file: 'service_corporate_factory_1776886021732.png',   id: 'corporate-factory' },
  { file: 'service_labor_supply_1776886039085.png',        id: 'labor-supply' },
  { file: 'service_contracts_1776886056663.png',           id: 'contracts' },
];

async function uploadToCloudinary(filePath: string, fileName: string): Promise<string> {
  const buffer = readFileSync(filePath);
  const form = new FormData();
  form.append('file', new File([buffer], fileName, { type: 'image/png' }));
  form.append('upload_preset', UPLOAD_PRESET);
  form.append('folder', 'services');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json() as { secure_url: string };
  return data.secure_url;
}

async function run() {
  console.log('\n🖼️  رفع صور الخدمات على Cloudinary...\n');

  for (const { file, id } of SERVICE_IMAGES) {
    const filePath = join(BRAIN_DIR, file);
    process.stdout.write(`  ⬆ [${id}] ... `);
    try {
      // ✅ تحقق أولاً — تجاهل الخدمات التي لديها صورة بالفعل
      const existing = await db.collection('services').doc(id).get();
      if (existing.exists && existing.data()?.image) {
        console.log(`⏭ تم التخطي (لديها صورة بالفعل)`);
        continue;
      }
      const url = await uploadToCloudinary(filePath, file);
      await db.collection('services').doc(id).update({
        image: url,
        updatedAt: new Date().toISOString(),
      });
      console.log(`✔ ${url.split('/').slice(-1)[0]}`);
    } catch (err: any) {
      console.log(`❌ ${err.message?.slice(0, 80)}`);
    }
  }

  console.log('\n✅ اكتملت عملية الرفع!');
}

run().catch(console.error);
