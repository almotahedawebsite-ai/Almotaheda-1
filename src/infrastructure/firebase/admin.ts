import * as admin from 'firebase-admin';

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Handle the private key newline issues commonly found in environment variables
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

function initializeAdmin() {
  if (admin.apps.length > 0) return admin.app();

  const cert = 
    firebaseAdminConfig.clientEmail && firebaseAdminConfig.privateKey
      ? admin.credential.cert({
          projectId: firebaseAdminConfig.projectId,
          clientEmail: firebaseAdminConfig.clientEmail,
          privateKey: firebaseAdminConfig.privateKey,
        })
      : undefined;

  return admin.initializeApp({
    credential: cert,
    projectId: firebaseAdminConfig.projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const adminApp = initializeAdmin();
const adminDb = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();

export { adminApp, adminDb, adminAuth, adminStorage };
