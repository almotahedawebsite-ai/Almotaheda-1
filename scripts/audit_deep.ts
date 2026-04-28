import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const cfg = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(cfg),
    projectId: cfg.projectId,
  });
}

const db = admin.firestore();

async function main() {
  // Check for projects in alternative collections
  const possibleProjectCollections = ['projects', 'portfolio', 'work_history', 'previous_work', 'workHistory'];
  for (const col of possibleProjectCollections) {
    const snap = await db.collection(col).limit(3).get();
    if (!snap.empty) {
      console.log(`✅ Found data in "${col}" (${snap.size} docs sample):`);
      snap.docs.forEach(d => console.log(`  [${d.id}] = ${JSON.stringify(d.data()).substring(0, 200)}`));
    } else {
      console.log(`❌ "${col}" is empty or doesn't exist`);
    }
  }

  // Check key_clients (might be portfolio)
  console.log('\n=== key_clients ===');
  const kcSnap = await db.collection('key_clients').get();
  kcSnap.docs.forEach(d => {
    const data = d.data();
    console.log(`[${d.id}] name_ar="${data.name?.ar}" | category="${data.category}" | desc_ar="${(data.description?.ar || '').substring(0, 80)}"`);
    console.log(`  images: ${JSON.stringify(data.images || data.image || 'NONE').substring(0, 200)}`);
    console.log(`  order=${data.order} isActive=${data.isActive}`);
    console.log('');
  });

  // Full settings
  console.log('\n=== FULL SETTINGS ===');
  const settingsSnap = await db.collection('settings').get();
  settingsSnap.docs.forEach(d => {
    console.log(`\n[${d.id}]:`);
    console.log(JSON.stringify(d.data(), null, 2));
  });

  // Payments and bookings
  console.log('\n=== PAYMENTS ===');
  const paymentsSnap = await db.collection('payments').limit(5).get();
  if (paymentsSnap.empty) {
    console.log('No payments found');
  } else {
    paymentsSnap.docs.forEach(d => console.log(`[${d.id}]`, JSON.stringify(d.data()).substring(0, 300)));
  }

  console.log('\n=== BOOKINGS ===');
  const bookingsSnap = await db.collection('bookings').limit(5).get();
  if (bookingsSnap.empty) {
    console.log('No bookings found');
  } else {
    bookingsSnap.docs.forEach(d => console.log(`[${d.id}]`, JSON.stringify(d.data()).substring(0, 300)));
  }

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
