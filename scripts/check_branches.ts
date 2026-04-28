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

async function main() {
  console.log('=== Reading branches from Firestore ===\n');
  
  const snapshot = await db.collection('branches').orderBy('order', 'asc').get();
  
  if (snapshot.empty) {
    console.log('No branches found in the database!');
  } else {
    console.log(`Found ${snapshot.size} branches:\n`);
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      console.log(`--- Branch ID: ${doc.id} ---`);
      console.log(`  Name (ar): ${data.name?.ar}`);
      console.log(`  Name (en): ${data.name?.en}`);
      console.log(`  Address (ar): ${data.address?.ar}`);
      console.log(`  Address (en): ${data.address?.en}`);
      console.log(`  Phone: ${data.phone}`);
      console.log(`  Order: ${data.order}`);
      console.log(`  isActive: ${data.isActive}`);
      console.log(`  Image: ${data.image}`);
      console.log(`  Google Map: ${data.googleMapUrl}`);
      console.log('');
    });
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
