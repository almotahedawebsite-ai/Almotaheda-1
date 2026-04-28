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

async function resolveWikimediaUrl(filename: string, width = 800): Promise<string | null> {
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

const CLIENTS: Record<string, { source: string; field: 'logo' | 'image' }> = {
  // Sunrise Hotels — use Sharm resort image
  'sunrise-sharm': { source: 'Sharm el Sheikh, Sultan Gardens Resort - panoramio (12).jpg', field: 'image' },
  'regal-heights': { source: 'Sharm el Sheikh, Sultan Gardens Resort - panoramio (13).jpg', field: 'image' },
  'maraki-hotel': { source: 'Sharm el Sheikh, Sultan Gardens Resort - panoramio (14).jpg', field: 'image' },
  
  // Military
  'alf-maskan-garage': { source: 'Seal of the Egyptian Armed Forces.png', field: 'logo' },

  // Madinaty related
  'craft-zone': { source: 'Madinaty.JPG', field: 'image' },
  'street-mall-madinaty': { source: 'Madinaty Group 112.jpg', field: 'image' },

  // Haram City (Orascom)
  'haram-city': { source: 'Recruitment and Mobilization Department (Egyptian Armed Forces) Logo.png', field: 'logo' }, // Will skip if not relevant
};

async function main() {
  const entries = Object.entries(CLIENTS);
  console.log(`\n🖼️  Round 3: Processing ${entries.length} clients...\n`);

  let success = 0, failed = 0;

  for (const [clientId, { source, field }] of entries) {
    console.log(`🔍 [${clientId}] Resolving: "${source}"...`);
    const url = await resolveWikimediaUrl(source);
    if (!url) { console.error(`❌ [${clientId}] Not found\n`); failed++; await sleep(2000); continue; }
    console.log(`   📎 → ${url.substring(0, 80)}...`);

    const tmpPath = path.join(os.tmpdir(), `${clientId}_r3.png`);
    const ok = downloadImage(url, tmpPath);
    if (!ok) { console.error(`❌ [${clientId}] Download failed\n`); failed++; await sleep(2000); continue; }

    try {
      const cloudUrl = await uploadToCloudinary(tmpPath, `${clientId}_v3`);
      await db.collection('key_clients').doc(clientId).update({ [field]: cloudUrl, updatedAt: new Date().toISOString() });
      console.log(`✅ [${clientId}] → ${cloudUrl}\n`);
      success++;
    } catch (err: any) {
      console.error(`❌ [${clientId}] ${err.message}\n`);
      failed++;
    }
    await sleep(2000);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Success: ${success} | ❌ Failed: ${failed}`);
  console.log('='.repeat(60));
  process.exit(0);
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
