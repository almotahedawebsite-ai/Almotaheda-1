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
  const settingsRef = db.collection('settings').doc('global_settings');
  const doc = await settingsRef.get();

  if (!doc.exists) {
    console.error('❌ Settings document not found!');
    process.exit(1);
  }

  const current = doc.data();
  console.log('📋 Current socialLinks:', JSON.stringify(current?.socialLinks, null, 2));

  const newSocialLinks = [
    {
      platform: 'Facebook',
      url: 'https://www.facebook.com/United.Cleaning.Services',
      icon: '',
    },
    {
      platform: 'Instagram',
      url: 'https://www.instagram.com/united.cleaning.services/',
      icon: '',
    },
    {
      platform: 'TikTok',
      url: 'https://www.tiktok.com/@united.cleaning.services?is_from_webapp=1&sender_device=pc',
      icon: '',
    },
  ];

  await settingsRef.update({ socialLinks: newSocialLinks });

  console.log('\n✅ Social links updated successfully!');
  console.log('📋 New socialLinks:', JSON.stringify(newSocialLinks, null, 2));

  process.exit(0);
}

main().catch(console.error);
