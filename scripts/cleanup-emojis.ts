import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables manually for standalone script execution
dotenv.config({ path: join(process.cwd(), '.env.local') });
dotenv.config({ path: join(process.cwd(), '.env') });

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_DATABASE_URL,
} = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error('\n❌ ERROR: Firebase Admin credentials missing.');
  process.exit(1);
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: FIREBASE_DATABASE_URL,
  });
}

const db = admin.firestore();

// Regex to match Emojis (Presentation form)
const emojiRegex = /\p{Emoji_Presentation}/gu;

function stripEmojis(val: any): any {
  if (typeof val === 'string') {
    return val.replace(emojiRegex, '').trim();
  }
  if (Array.isArray(val)) {
    return val.map(stripEmojis);
  }
  if (val !== null && typeof val === 'object') {
    // If it's a Firestore Timestamp, return it
    if (val.toDate && typeof val.toDate === 'function') {
      return val;
    }
    const newObj: any = {};
    for (const [k, v] of Object.entries(val)) {
      newObj[k] = stripEmojis(v);
    }
    return newObj;
  }
  return val;
}

async function cleanupCollection(collectionName: string) {
  console.log(`Scanning collection: ${collectionName}...`);
  const snapshot = await db.collection(collectionName).get();
  
  if (snapshot.empty) {
    console.log(`Collection ${collectionName} is empty.`);
    return;
  }

  let updateCount = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const cleanedData = stripEmojis(data);
    
    // Rough check
    if (JSON.stringify(data) !== JSON.stringify(cleanedData)) {
      await doc.ref.set(cleanedData);
      console.log(`  Updated document: ${doc.id}`);
      updateCount++;
    }
  }
  
  console.log(`Finished ${collectionName}. Updated ${updateCount} documents.`);
}

async function run() {
  console.log('Starting Database Cleanup for Emojis...');
  
  try {
    const collectionsToClean = [
      'services',
      'categories',
      'settings',
      'key_clients',
      'training_programs',
      'tournaments'
    ];

    for (const col of collectionsToClean) {
      await cleanupCollection(col);
    }
    
    console.log('\nCleanup script completed successfully!');
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
}

run();
