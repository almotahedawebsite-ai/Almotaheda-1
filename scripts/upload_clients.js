require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const artifactDir = "C:\\Users\\decor establishment\\.gemini\\antigravity\\brain\\fb97ad41-944d-4aac-aff9-36e269092865";

async function uploadToCloudinary(filePath) {
  const fileBlob = new Blob([fs.readFileSync(filePath)], { type: 'image/png' });
  const formData = new FormData();
  formData.append('file', fileBlob, path.basename(filePath));
  formData.append('upload_preset', 'ml_default');

  const res = await fetch("https://api.cloudinary.com/v1_1/dsr72hebx/image/upload", {
    method: 'POST', body: formData
  });

  const data = await res.json();
  return data.secure_url;
}

async function run() {
  const file = fs.readdirSync(artifactDir).find(f => f.startsWith("bg_clients_") && f.endsWith(".png"));
  if (file) {
    const url = await uploadToCloudinary(path.join(artifactDir, file));
    console.log("URL:", url);
  }
}

run().catch(console.error);
