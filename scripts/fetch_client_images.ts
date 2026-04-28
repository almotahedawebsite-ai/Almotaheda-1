import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { execSync } from 'child_process';

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

// Step 1: Resolve Wikimedia Commons files to actual downloadable thumbnails via API
async function resolveWikimediaUrl(filename: string, width = 500): Promise<string | null> {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json`;
  try {
    const res = await fetch(apiUrl, { headers: { 'User-Agent': 'AlMotahedaBot/1.0 (contact@almotaheda.com)' } });
    const json: any = await res.json();
    const pages = json.query?.pages;
    const page = Object.values(pages)[0] as any;
    return page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url || null;
  } catch {
    return null;
  }
}

// Step 2: Download image using curl
function downloadImage(url: string, outputPath: string): boolean {
  try {
    execSync(`curl.exe -L -s -o "${outputPath}" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "${url}"`, { timeout: 20000 });
    const stats = fs.statSync(outputPath);
    // Check it's a real image (not HTML error page)
    const head = fs.readFileSync(outputPath, { encoding: 'utf8', flag: 'r' }).substring(0, 15);
    if (head.includes('<!DOCTYPE') || head.includes('<html')) {
      console.log(`   ⚠️ Got HTML instead of image`);
      return false;
    }
    return stats.size > 1000;
  } catch {
    return false;
  }
}

// Step 3: Upload to Cloudinary
async function uploadToCloudinary(filePath: string, publicId: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer]);
  const formData = new FormData();
  formData.append('file', blob, `${publicId}.png`);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'key_clients');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const json: any = await res.json();
  if (json.error) throw new Error(`Cloudinary: ${json.error.message}`);
  try { fs.unlinkSync(filePath); } catch {}
  return json.secure_url;
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

// Client image mapping
// type: 'wiki' -> Wikimedia Commons filename
// type: 'url'  -> direct URL (non-wiki)
interface ImageSource {
  type: 'wiki' | 'url';
  source: string; // wiki filename or direct URL
  field: 'logo' | 'image';
}

const CLIENTS: Record<string, ImageSource> = {
  // ============ GOVERNMENT ============
  'ministry-information': { type: 'wiki', source: 'Coat_of_arms_of_Egypt_(Official).svg', field: 'logo' },
  'ministry-culture': { type: 'wiki', source: 'Coat_of_arms_of_Egypt_(Official).svg', field: 'logo' },
  'ministry-petroleum': { type: 'wiki', source: 'Coat_of_arms_of_Egypt_(Official).svg', field: 'logo' },
  'presidential-palace': { type: 'wiki', source: 'Coat_of_arms_of_Egypt_(Official).svg', field: 'logo' },
  'masjid-misr': { type: 'wiki', source: 'Al-Fattah Al-Aleem Mosque, Egypt.jpg', field: 'image' },

  // ============ MILITARY ============
  'military-college': { type: 'wiki', source: 'Egyptian Military Academy emblem.svg', field: 'logo' },
  'alf-maskan-garage': { type: 'wiki', source: 'Egyptian Armed Forces emblem.svg', field: 'logo' },
  'majid-hall-ras-altin': { type: 'wiki', source: "Ras el-Tin Palace, Alexandria.jpg", field: 'image' },

  // ============ HOTELS ============
  'sunrise-sharm': { type: 'url', source: 'https://www.sunrise-resorts.com/media/wysiwyg/brand-story-img.jpg', field: 'image' },
  'regal-heights': { type: 'url', source: 'https://www.sunrise-resorts.com/media/wysiwyg/brand-story-img.jpg', field: 'image' },
  'maraki-hotel': { type: 'url', source: 'https://www.sunrise-resorts.com/media/wysiwyg/brand-story-img.jpg', field: 'image' },
  'pyramids-hotel-sahel': { type: 'wiki', source: 'Pyramisa Hotel in Cairo.jpg', field: 'image' },

  // ============ UNIVERSITIES ============
  'assiut-university': { type: 'wiki', source: 'Assiut University logo.svg', field: 'logo' },
  'may15-university': { type: 'url', source: 'https://muc.edu.eg/images/logo.png', field: 'logo' },

  // ============ MALLS ============
  'almaza-park-mall': { type: 'url', source: 'https://maximig.com/assets/images/hero-bg.webp', field: 'image' },
  'maxim-mall': { type: 'url', source: 'https://maximig.com/assets/images/hero-bg.webp', field: 'image' },

  // ============ COMMERCIAL ============
  'porto-golf-marina': { type: 'wiki', source: 'Porto Marina Resort & Spa, El Alamein (2014).jpg', field: 'image' },
  'haram-city': { type: 'wiki', source: 'Orascom Development logo.svg', field: 'logo' },

  // ============ TOWERS ============
  'barrag-smouha': { type: 'wiki', source: 'Alexandria Egypt.jpg', field: 'image' },
};

async function main() {
  const entries = Object.entries(CLIENTS);
  console.log(`\n🖼️  Processing ${entries.length} clients...\n`);

  let success = 0;
  let failed = 0;
  const failedList: string[] = [];

  for (const [clientId, src] of entries) {
    let downloadUrl: string | null = null;

    if (src.type === 'wiki') {
      console.log(`🔍 [${clientId}] Resolving Wikimedia: "${src.source}"...`);
      downloadUrl = await resolveWikimediaUrl(src.source, 600);
      if (!downloadUrl) {
        console.error(`❌ [${clientId}] Wiki file not found: ${src.source}\n`);
        failedList.push(clientId);
        failed++;
        continue;
      }
      console.log(`   📎 Resolved → ${downloadUrl.substring(0, 80)}...`);
    } else {
      downloadUrl = src.source;
    }

    // Download
    const tmpPath = path.join(os.tmpdir(), `${clientId}_img.png`);
    console.log(`📥 [${clientId}] Downloading...`);
    const ok = downloadImage(downloadUrl, tmpPath);

    if (!ok) {
      console.error(`❌ [${clientId}] Download failed\n`);
      failedList.push(clientId);
      failed++;
      continue;
    }

    // Upload
    try {
      console.log(`📤 [${clientId}] Uploading to Cloudinary...`);
      const cloudUrl = await uploadToCloudinary(tmpPath, clientId);

      await db.collection('key_clients').doc(clientId).update({
        [src.field]: cloudUrl,
        updatedAt: new Date().toISOString(),
      });

      console.log(`✅ [${clientId}] → ${cloudUrl}\n`);
      success++;
    } catch (err: any) {
      console.error(`❌ [${clientId}] Upload error: ${err.message}\n`);
      failedList.push(clientId);
      failed++;
    }

    // Delay to avoid rate limiting
    await sleep(1500);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Success: ${success} | ❌ Failed: ${failed}`);
  if (failedList.length > 0) {
    console.log(`Failed: ${failedList.join(', ')}`);
  }
  console.log('='.repeat(60));

  process.exit(0);
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
