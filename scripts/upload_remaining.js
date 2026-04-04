require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const artifactDir = "C:\\Users\\decor establishment\\.gemini\\antigravity\\brain\\fb97ad41-944d-4aac-aff9-36e269092865";

const map = {
  'bg_about': 'bg_about',
  'image_about': 'image_about',
  'bg_contact': 'bg_contact',
  'bg_branches': 'bg_branches',
  'bg_services': 'bg_services'
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
  const results = {};
  
  for (const [key, prefix] of Object.entries(map)) {
    const file = files.find(f => f.startsWith(prefix + "_") && f.endsWith(".png"));
    if (!file) {
      console.log(`❌ Skipped ${key}`);
      continue;
    }
    try {
      const url = await uploadToCloudinary(path.join(artifactDir, file));
      console.log(`✅ ${key}: ${url}`);
      results[key] = url;
    } catch (err) {
      console.error(`💥 Failed ${key}:`, err.message);
    }
  }
  
  fs.writeFileSync('C:/Users/decor establishment/Desktop/Almotaheda/tmp_urls.json', JSON.stringify(results, null, 2));
  console.log("Done uploading everything");
}

run().catch(console.error);
