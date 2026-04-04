const fs = require('fs');

async function upload() {
  const filePath = "C:\\Users\\decor establishment\\.gemini\\antigravity\\brain\\fb97ad41-944d-4aac-aff9-36e269092865\\hero_cleaning_bg_1775240797621.png";
  const url = "https://api.cloudinary.com/v1_1/dsr72hebx/image/upload";

  const fileBlob = new Blob([fs.readFileSync(filePath)], { type: 'image/png' });
  
  const formData = new FormData();
  formData.append('file', fileBlob, 'hero.png');
  formData.append('upload_preset', 'ml_default');

  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  console.log("SECURE_URL:", data.secure_url);
}

upload().catch(console.error);
