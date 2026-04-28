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
  admin.initializeApp({ credential: admin.credential.cert(cfg), projectId: cfg.projectId });
}

const db = admin.firestore();

async function main() {
  // Just list all key_clients with id, name, category, order
  const snap = await db.collection('key_clients').orderBy('order', 'asc').get();
  console.log(`Total key_clients: ${snap.size}\n`);
  snap.docs.forEach(d => {
    const data = d.data();
    console.log(`[${d.id}] order=${data.order} | cat="${data.category}" | name_ar="${data.name?.ar}" | desc_ar="${data.description?.ar || ''}" | logo=${data.logo ? 'YES' : 'NO'}`);
  });

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
