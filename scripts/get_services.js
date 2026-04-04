require('dotenv').config({ path: '.env.local' });
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function getServices() {
  const snapshot = await db.collection('services').get();
  const services = snapshot.docs.map(doc => doc.data());
  fs.writeFileSync('C:/Users/decor establishment/Desktop/Almotaheda/tmp_services.json', JSON.stringify(services, null, 2));
  console.log(`Saved ${services.length} services`);
}

getServices().catch(console.error);
