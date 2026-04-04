require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const artifactDir = "C:\\Users\\decor establishment\\.gemini\\antigravity\\brain\\fb97ad41-944d-4aac-aff9-36e269092865";

const map = {
  'contracts': 'service_contracts',
  'corporate-factory': 'service_corporate',
  'deep-cleaning': 'service_deep_clean',
  'electrical-plumbing': 'service_electrical',
  'facade-cleaning': 'service_facade',
  'furniture-cleaning': 'service_furniture',
  'home-maintenance': 'service_home_maint',
  'internal-cleaning': 'service_internal',
  'labor-supply': 'service_labor',
  'landscaping': 'service_landscaping',
  'pest-control': 'service_pest',
  'pool-maintenance': 'service_pool',
  'restaurant-hood': 'service_rest_hood',
  'restaurant-services': 'service_rest_serv',
  'sanitization': 'service_sanitization',
  'upholstery-carpet': 'service_upholstery'
};

async function uploadToCloudinary(filePath) {
  const fileBlob = new Blob([fs.readFileSync(filePath)], { type: 'image/png' });
  const formData = new FormData();
  formData.append('file', fileBlob, path.basename(filePath));
  formData.append('upload_preset', 'ml_default');

  const res = await fetch("https://api.cloudinary.com/v1_1/dsr72hebx/image/upload", {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (!data.secure_url) throw new Error("No secure URL: " + JSON.stringify(data));
  return data.secure_url;
}

async function run() {
  const files = fs.readdirSync(artifactDir);
  let updated = 0;
  
  for (const [id, prefix] of Object.entries(map)) {
    const file = files.find(f => f.startsWith(prefix + "_") && f.endsWith(".png"));
    if (!file) {
      console.log(`❌ Skipped ${id} (No file found for prefix ${prefix})`);
      continue;
    }
    
    const filePath = path.join(artifactDir, file);
    try {
      console.log(`Uploading ${file} for ${id}...`);
      const url = await uploadToCloudinary(filePath);
      
      console.log(`✅ Uploaded (${url}). Updating Firestore...`);
      await db.collection('services').doc(id).update({ image: url });
      updated++;
    } catch (err) {
      console.error(`💥 Failed ${id}:`, err.message);
    }
  }
  console.log(`\n🎉 Processed ${updated} services successfully!`);
}

run().catch(console.error);
