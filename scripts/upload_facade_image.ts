import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

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
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

async function uploadToCloudinary(filePath: string, fileName: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer]), fileName);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'services');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const json: any = await res.json();
  if (json.error) throw new Error(`Cloudinary error: ${json.error.message}`);
  return json.secure_url;
}

async function main() {
  // Find the generated image
  const imgDir = 'C:\\Users\\GGG\\.gemini\\antigravity\\brain\\adcacae8-0e24-4895-a44a-0fa860f54af7';
  const files = fs.readdirSync(imgDir).filter(f => f.startsWith('facade_cleaning_squeegee'));
  
  if (files.length === 0) {
    console.error('❌ No facade image found!');
    process.exit(1);
  }

  const imgPath = path.join(imgDir, files[0]);
  console.log(`📸 Uploading ${files[0]} to Cloudinary...`);
  
  const url = await uploadToCloudinary(imgPath, 'facade_cleaning_squeegee.png');
  console.log(`✅ Uploaded: ${url}`);

  // Update facade-cleaning service image in DB
  console.log('📝 Updating facade-cleaning service image...');
  await db.collection('services').doc('facade-cleaning').update({
    image: url,
    updatedAt: new Date().toISOString(),
  });

  console.log('✅ facade-cleaning image updated in DB!');
  process.exit(0);
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
