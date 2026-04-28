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
  const ntaDoc = db.collection('key_clients').doc('nta');
  const docSnap = await ntaDoc.get();
  
  if (docSnap.exists) {
    console.log('NTA document found. Updating logo to Egyptian Coat of Arms as a fallback...');
    await ntaDoc.update({
      // We use the coat of arms since NTA is a government institution. 
      // This is better than a broken image link.
      logo: 'https://res.cloudinary.com/dsr72hebx/image/upload/v1777386566/key_clients/ministry-information_a0ept6.png',
      updatedAt: new Date().toISOString()
    });
    console.log('Successfully updated NTA logo.');
  } else {
    console.log('NTA document not found.');
  }
  process.exit(0);
}

main().catch(console.error);
