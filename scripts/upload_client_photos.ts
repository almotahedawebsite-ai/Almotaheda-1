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

// ── صور → ID العميل في Firestore ──────────────────────────────────────────
const PHOTO_MAP: Record<string, string> = {
  'البرج الأيقوني.jfif':              'iconic-tower',
  'الجامعة المصرية اليابانية.jfif':  'japanese-university',
  'جامعة بدر.webp':                   'badr-university',
  'رأسة مجلس الوزراء.jpg':            'cabinet',
  'طلعت مصطفى.jfif':                  'talaat-moustafa', // يتم إنشاؤه إن لم يكن موجوداً
  'مدينتي.jfif':                       'madinaty',
  'وزارة الكهرباء والطاقة.jfif':      'ministry-electricity',
};

const PHOTOS_DIR = join(process.cwd(), 'customers photos');

async function uploadToCloudinary(filePath: string, fileName: string): Promise<string> {
  const buffer = readFileSync(filePath);
  const ext = fileName.split('.').pop() || 'jpg';
  const mimeMap: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', jfif: 'image/jpeg', webp: 'image/webp', png: 'image/png' };
  const mime = mimeMap[ext.toLowerCase()] || 'image/jpeg';

  const form = new FormData();
  form.set('file', new File([buffer], fileName, { type: mime }));
  form.set('upload_preset', UPLOAD_PRESET);
  form.set('folder', 'key_clients');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form as any,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cloudinary error: ${err}`);
  }
  const data = await res.json() as { secure_url: string };
  return data.secure_url;
}

async function run() {
  console.log('\n📸 رفع صور العملاء على Cloudinary...\n');

  for (const [fileName, clientId] of Object.entries(PHOTO_MAP)) {
    const filePath = join(PHOTOS_DIR, fileName);
    try {
      process.stdout.write(`  ⬆ ${fileName} → [${clientId}] ... `);
      const url = await uploadToCloudinary(filePath, fileName);
      
      // تحديث logo في Firestore
      const ref = db.collection('key_clients').doc(clientId);
      const snap = await ref.get();
      if (snap.exists) {
        await ref.update({ logo: url, updatedAt: new Date().toISOString() });
      } else {
        // إنشاء doc جديد للعميل إن لم يكن موجوداً (طلعت مصطفى)
        await ref.set({
          id: clientId,
          name: { ar: 'مجموعة طلعت مصطفى', en: 'Talaat Moustafa Group' },
          logo: url,
          description: { ar: '', en: '' },
          image: '',
          category: 'commercial',
          order: 63,
          isActive: true,
          createdAt: new Date().toISOString(),
        });
      }
      console.log(`✔ ${url.split('/').slice(-2).join('/')}`);
    } catch (err: any) {
      console.log(`❌ ${err.message}`);
    }
  }

  console.log('\n✅ اكتمل رفع الصور!');
}

run().catch(console.error);
