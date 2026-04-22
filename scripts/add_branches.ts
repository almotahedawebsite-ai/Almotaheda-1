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

const BRANCHES = [
  {
    id: 'sheikh-zayed',
    name: { ar: 'فرع الشيخ زايد', en: 'Sheikh Zayed Branch' },
    address: { ar: 'الشيخ زايد، الجيزة', en: 'Sheikh Zayed, Giza' },
    googleMapUrl: 'https://maps.google.com/?q=Sheikh+Zayed+City,Giza,Egypt',
    phone: '',
    workingHours: { ar: 'السبت – الخميس: ٨ص – ٨م', en: 'Sat – Thu: 8AM – 8PM' },
    image: '',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fifth-settlement',
    name: { ar: 'فرع التجمع الخامس', en: '5th Settlement Branch' },
    address: { ar: 'التجمع الخامس، القاهرة الجديدة', en: '5th Settlement, New Cairo' },
    googleMapUrl: 'https://maps.google.com/?q=5th+Settlement,New+Cairo,Egypt',
    phone: '',
    workingHours: { ar: 'السبت – الخميس: ٨ص – ٨م', en: 'Sat – Thu: 8AM – 8PM' },
    image: '',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'alexandria',
    name: { ar: 'فرع الإسكندرية', en: 'Alexandria Branch' },
    address: { ar: 'الإسكندرية', en: 'Alexandria, Egypt' },
    googleMapUrl: 'https://maps.google.com/?q=Alexandria,Egypt',
    phone: '',
    workingHours: { ar: 'السبت – الخميس: ٨ص – ٨م', en: 'Sat – Thu: 8AM – 8PM' },
    image: '',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'alamein',
    name: { ar: 'فرع العلمين الجديدة', en: 'New Alamein Branch' },
    address: { ar: 'العلمين الجديدة، مطروح', en: 'New Alamein, Matrouh' },
    googleMapUrl: 'https://maps.google.com/?q=New+Alamein,Egypt',
    phone: '',
    workingHours: { ar: 'السبت – الخميس: ٨ص – ٨م', en: 'Sat – Thu: 8AM – 8PM' },
    image: '',
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

async function run() {
  console.log('\n🏢 إضافة الفروع الأربعة...');
  for (const branch of BRANCHES) {
    await db.collection('branches').doc(branch.id).set(branch, { merge: true });
    console.log(`  ✔ ${branch.name.ar}`);
  }
  console.log('\n✅ تم إضافة جميع الفروع!');
}

run().catch(console.error);
