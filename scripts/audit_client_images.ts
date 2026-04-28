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
  const snap = await db.collection('key_clients').orderBy('order', 'asc').get();
  
  console.log('='.repeat(80));
  console.log(`Total key_clients: ${snap.size}`);
  console.log('='.repeat(80));
  
  snap.docs.forEach(d => {
    const data = d.data();
    const hasImage = !!(data.image && data.image.trim());
    const hasLogo = !!(data.logo && data.logo.trim());
    console.log(`[${d.id}] "${data.name?.ar}" | image: ${hasImage ? '✅' : '❌'} | logo: ${hasLogo ? '✅' : '❌'} | cat: ${data.category || '—'}`);
    if (hasImage) console.log(`   img: ${data.image}`);
    if (hasLogo) console.log(`   logo: ${data.logo}`);
  });
}

main().catch(console.error).then(() => process.exit(0));
