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

async function resolveWikimediaUrl(filename: string, width = 600): Promise<string | null> {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json`;
  try {
    const res = await fetch(apiUrl, { headers: { 'User-Agent': 'AlMotahedaBot/1.0 (contact@almotaheda.com)' } });
    const json: any = await res.json();
    const pages = json.query?.pages;
    const page = Object.values(pages)[0] as any;
    return page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url || null;
  } catch { return null; }
}

function downloadImage(url: string, outputPath: string): boolean {
  try {
    execSync(`curl.exe -L -s -o "${outputPath}" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "${url}"`, { timeout: 20000 });
    const stats = fs.statSync(outputPath);
    const head = fs.readFileSync(outputPath).subarray(0, 15).toString('utf8');
    if (head.includes('<!DOCTYPE') || head.includes('<html') || head.includes('<!doctype')) return false;
    return stats.size > 1000;
  } catch { return false; }
}

async function uploadToCloudinary(filePath: string, publicId: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer]), `${publicId}.png`);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'key_clients');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
  const json: any = await res.json();
  if (json.error) throw new Error(`Cloudinary: ${json.error.message}`);
  try { fs.unlinkSync(filePath); } catch {}
  return json.secure_url;
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

interface ImageSource {
  type: 'wiki';
  source: string;
  field: 'logo' | 'image';
}

// Round 2 — using exact filenames from Wikimedia Commons search results
const CLIENTS: Record<string, ImageSource> = {
  'masjid-misr': { type: 'wiki', source: 'Secretary Pompeo Visits Al Fattah Al Alim Mosque in Cairo, Egypt (32819208128).jpg', field: 'image' },
  'majid-hall-ras-altin': { type: 'wiki', source: 'Ras El Tin Palace Alexandria Egypt 1983.jpg', field: 'image' },
  'pyramids-hotel-sahel': { type: 'wiki', source: 'Aswan Pyramisa Isis Island Hotel R01.jpg', field: 'image' },
  'assiut-university': { type: 'wiki', source: 'Assiut University managerial building Panorama.jpg', field: 'image' },
  'porto-golf-marina': { type: 'wiki', source: 'Porto Marina (El Alamein).jpg', field: 'image' },
  'haram-city': { type: 'wiki', source: 'Logo Orascom.svg', field: 'logo' },
  'military-college': { type: 'wiki', source: 'Cairo military academy stadium 2022.jpg', field: 'image' },
  'olympic-city': { type: 'wiki', source: 'New Administrative Capital Banner.jpg', field: 'image' },
};

async function main() {
  const entries = Object.entries(CLIENTS);
  console.log(`\n🖼️  Round 2: Processing ${entries.length} clients...\n`);

  let success = 0, failed = 0;
  const failedList: string[] = [];

  for (const [clientId, src] of entries) {
    console.log(`🔍 [${clientId}] Resolving: "${src.source}"...`);
    const url = await resolveWikimediaUrl(src.source, 800);
    if (!url) {
      console.error(`❌ [${clientId}] Not found\n`);
      failedList.push(clientId); failed++;
      await sleep(2000);
      continue;
    }
    console.log(`   📎 → ${url.substring(0, 80)}...`);

    const tmpPath = path.join(os.tmpdir(), `${clientId}_r2.png`);
    console.log(`📥 [${clientId}] Downloading...`);
    const ok = downloadImage(url, tmpPath);
    if (!ok) {
      console.error(`❌ [${clientId}] Download failed\n`);
      failedList.push(clientId); failed++;
      await sleep(2000);
      continue;
    }

    try {
      console.log(`📤 [${clientId}] Uploading...`);
      const cloudUrl = await uploadToCloudinary(tmpPath, `${clientId}_v2`);
      await db.collection('key_clients').doc(clientId).update({
        [src.field]: cloudUrl, updatedAt: new Date().toISOString(),
      });
      console.log(`✅ [${clientId}] → ${cloudUrl}\n`);
      success++;
    } catch (err: any) {
      console.error(`❌ [${clientId}] ${err.message}\n`);
      failedList.push(clientId); failed++;
    }
    await sleep(2000);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Success: ${success} | ❌ Failed: ${failed}`);
  if (failedList.length > 0) console.log(`Failed: ${failedList.join(', ')}`);
  console.log('='.repeat(60));
  process.exit(0);
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
