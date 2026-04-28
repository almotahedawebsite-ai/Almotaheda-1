import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

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

async function main() {
  // ========== SERVICES ==========
  console.log('='.repeat(60));
  console.log('📦 SERVICES');
  console.log('='.repeat(60));
  const servicesSnap = await db.collection('services').orderBy('order', 'asc').get();
  servicesSnap.docs.forEach((doc) => {
    const d = doc.data();
    console.log(`[${doc.id}] order=${d.order} | name_ar="${d.name?.ar}" | showOnHome=${d.showOnHome} | isActive=${d.isActive}`);
    console.log(`  desc_ar: ${(d.description?.ar || '').substring(0, 80)}...`);
    console.log(`  image: ${d.image || 'NONE'}`);
    if (d.children && d.children.length > 0) {
      d.children.forEach((c: any, i: number) => {
        console.log(`  child[${i}]: "${c.name?.ar}" | order=${c.order}`);
      });
    }
    console.log('');
  });

  // ========== PROJECTS ==========
  console.log('='.repeat(60));
  console.log('🏗️ PROJECTS');
  console.log('='.repeat(60));
  const projectsSnap = await db.collection('projects').orderBy('order', 'asc').get();
  projectsSnap.docs.forEach((doc) => {
    const d = doc.data();
    console.log(`[${doc.id}] order=${d.order} | name_ar="${d.name?.ar}" | category="${d.category}" | isActive=${d.isActive}`);
    console.log(`  desc_ar: ${(d.description?.ar || '').substring(0, 100)}`);
    console.log(`  images: ${(d.images || []).length} images`);
    console.log('');
  });

  // ========== SETTINGS (payment/whatsapp) ==========
  console.log('='.repeat(60));
  console.log('⚙️ SETTINGS');
  console.log('='.repeat(60));
  const settingsSnap = await db.collection('settings').get();
  settingsSnap.docs.forEach((doc) => {
    const d = doc.data();
    console.log(`[${doc.id}]:`);
    console.log(JSON.stringify(d, null, 2).substring(0, 500));
    console.log('');
  });

  // ========== Check collections that might relate to payments ==========
  console.log('='.repeat(60));
  console.log('💳 PAYMENT-RELATED COLLECTIONS');
  console.log('='.repeat(60));
  const collections = await db.listCollections();
  for (const col of collections) {
    console.log(`Collection: ${col.id}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
