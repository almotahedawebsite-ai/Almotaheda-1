import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: firebaseAdminConfig.projectId,
      clientEmail: firebaseAdminConfig.clientEmail,
      privateKey: firebaseAdminConfig.privateKey,
    }),
    projectId: firebaseAdminConfig.projectId,
  });
}

const db = admin.firestore();

const correctBranches = [
  {
    id: 'sheikh-zayed',
    name: { ar: 'الفرع الرئيسي', en: 'Main Branch' },
    address: { ar: 'المجاوره الرابع الشيخ زايد الجيزه', en: '4th Neighborhood, Sheikh Zayed, Giza' },
    order: 1,
    isActive: true,
  },
  {
    id: 'fifth-settlement',
    name: { ar: 'فرع التجمع', en: 'Tagamoa Branch' },
    address: { ar: 'الياسمين التجمع الخامس القاهره الجديده', en: 'El Yasmeen, 5th Settlement, New Cairo' },
    order: 2,
    isActive: true,
  },
  {
    id: 'heliopolis',
    name: { ar: 'فرع مصر الجديده', en: 'Heliopolis Branch' },
    address: { ar: 'ميدان الحجاز مصر الجديده', en: 'Hegaz Square, Heliopolis' },
    order: 3,
    isActive: true,
  },
  {
    id: 'alexandria',
    name: { ar: 'فرع الاسكندريه', en: 'Alexandria Branch' },
    address: { ar: 'شارع ٤٥ ميامي الاسكندريه', en: '45 Street, Miami, Alexandria' },
    order: 4,
    isActive: true,
  },
  {
    id: 'north-coast',
    name: { ar: 'فرع الساحل الشمالي', en: 'North Coast Branch' },
    address: { ar: 'العالمين القديمه متفرع من شارع المدارس', en: 'Old Alamein, off Schools Street' },
    order: 5,
    isActive: true,
  },
];

async function main() {
  console.log('=== Updating branches in Firestore ===\n');

  const batch = db.batch();

  // First, delete the old 'alamein' doc since we're replacing it with 'north-coast'
  const oldAlamein = db.collection('branches').doc('alamein');
  const alameinSnap = await oldAlamein.get();
  if (alameinSnap.exists) {
    console.log('Deleting old "alamein" document...');
    batch.delete(oldAlamein);
  }

  for (const branch of correctBranches) {
    const ref = db.collection('branches').doc(branch.id);
    const existing = await ref.get();

    const now = new Date().toISOString();

    if (existing.exists) {
      // Update existing
      console.log(`Updating: ${branch.id} -> "${branch.name.ar}"`);
      batch.update(ref, {
        name: branch.name,
        address: branch.address,
        order: branch.order,
        isActive: branch.isActive,
        updatedAt: now,
      });
    } else {
      // Create new
      console.log(`Creating: ${branch.id} -> "${branch.name.ar}"`);
      batch.set(ref, {
        id: branch.id,
        name: branch.name,
        address: branch.address,
        phone: '',
        image: '',
        googleMapUrl: '',
        workingHours: { ar: '', en: '' },
        order: branch.order,
        isActive: branch.isActive,
        createdAt: now,
      });
    }
  }

  await batch.commit();
  console.log('\n✅ All branches updated successfully!\n');

  // Verify
  console.log('=== Verifying updated branches ===\n');
  const snapshot = await db.collection('branches').orderBy('order', 'asc').get();
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    console.log(`${data.order}. ${data.name?.ar} — ${data.address?.ar}`);
  });

  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
