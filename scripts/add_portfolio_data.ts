import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env.local') });

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_DATABASE_URL,
} = process.env;

if (!admin.apps || admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: FIREBASE_DATABASE_URL,
  });
}

const db = admin.firestore();

// ============================================================
// سابقة الأعمال - KEY CLIENTS
// ============================================================
const NEW_CLIENTS = [
  // ---- فنادق ----
  {
    id: 'sunrise-sharm',
    name: { ar: 'فندق صن رايز شرم', en: 'Sunrise Sharm Hotel' },
    category: 'hotels',
    order: 10,
    logo: '',
  },
  {
    id: 'regal-heights',
    name: { ar: 'فندق ريجال هايتس الغردقة', en: 'Regal Heights Hurghada' },
    category: 'hotels',
    order: 11,
    logo: '',
  },
  {
    id: 'maraki-hotel',
    name: { ar: 'فندق مراكي', en: 'Maraki Hotel' },
    category: 'hotels',
    order: 12,
    logo: '',
  },
  {
    id: 'milton-hotel',
    name: { ar: 'فندق ميلتون', en: 'Milton Hotel' },
    category: 'hotels',
    order: 13,
    logo: '',
  },
  {
    id: 'montmari-hotel',
    name: { ar: 'فندق مونتماري', en: 'Montmari Hotel' },
    category: 'hotels',
    order: 14,
    logo: '',
  },
  {
    id: 'white-hills-hotel',
    name: { ar: 'فندق وايت هيلز', en: 'White Hills Hotel' },
    category: 'hotels',
    order: 15,
    logo: '',
  },
  {
    id: 'arabian-hotel',
    name: { ar: 'فندق أرابيان', en: 'Arabian Hotel' },
    category: 'hotels',
    order: 16,
    logo: '',
  },
  {
    id: 'pyramids-hotel-sahel',
    name: { ar: 'فندق بيراميدز - سهل حشيش', en: 'Pyramids Hotel - Sahl Hasheesh' },
    category: 'hotels',
    order: 17,
    logo: '',
  },

  // ---- وزارات ومؤسسات حكومية ----
  {
    id: 'ministry-electricity',
    name: { ar: 'وزارة الكهرباء والإنتاج الحربي', en: 'Ministry of Electricity & Military Production' },
    category: 'government',
    order: 20,
    logo: '',
  },
  {
    id: 'ministry-information',
    name: { ar: 'وزارة الإعلام', en: 'Ministry of Information' },
    category: 'government',
    order: 21,
    logo: '',
  },
  {
    id: 'ministry-culture',
    name: { ar: 'وزارة الثقافة', en: 'Ministry of Culture' },
    category: 'government',
    order: 22,
    logo: '',
  },
  {
    id: 'cabinet',
    name: { ar: 'رئاسة مجلس الوزراء', en: "Presidency of the Council of Ministers" },
    category: 'government',
    order: 23,
    logo: '',
  },
  {
    id: 'masjid-misr',
    name: { ar: 'مسجد مصر', en: 'Masjid Misr' },
    category: 'government',
    order: 24,
    logo: '',
  },
  {
    id: 'ministry-petroleum',
    name: { ar: 'وزارة البترول (العاصمة الإدارية)', en: 'Ministry of Petroleum (New Administrative Capital)' },
    category: 'government',
    order: 25,
    logo: '',
  },

  // ---- قاعات ومنشآت عسكرية ----
  {
    id: 'majid-hall-ras-altin',
    name: { ar: 'قاعة المجد - قاعدة رأس التين البحرية', en: 'Al-Majd Hall - Ras Al-Tin Naval Base, Alexandria' },
    category: 'military',
    order: 30,
    logo: '',
  },
  {
    id: 'military-college',
    name: { ar: 'الكلية الحربية بالكيان العسكري', en: 'Military College' },
    category: 'military',
    order: 31,
    logo: '',
  },
  {
    id: 'alf-maskan-garage',
    name: { ar: 'جراج الألف مسكن', en: 'Alf Maskan Garage' },
    category: 'military',
    order: 32,
    logo: '',
  },

  // ---- مولات تجارية ----
  {
    id: 'almaza-park-mall',
    name: { ar: 'مول ألماظة بارك - مصر الجديدة', en: 'Almaza Park Mall - Heliopolis' },
    category: 'malls',
    order: 40,
    logo: '',
  },
  {
    id: 'maxim-mall',
    name: { ar: 'مول Maxim - التجمع الخامس', en: 'Maxim Mall - 5th Settlement' },
    category: 'malls',
    order: 41,
    logo: '',
  },

  // ---- جامعات ----
  {
    id: 'japanese-university',
    name: { ar: 'الجامعة اليابانية - برج العرب', en: 'Japanese University - Borg El Arab' },
    category: 'universities',
    order: 50,
    logo: '',
  },
  {
    id: 'assiut-university',
    name: { ar: 'جامعة أسيوط', en: 'Assiut University' },
    category: 'universities',
    order: 51,
    logo: '',
  },
  {
    id: 'may15-university',
    name: { ar: 'جامعة 15 مايو', en: '15th of May University' },
    category: 'universities',
    order: 52,
    logo: '',
  },
  {
    id: 'badr-university',
    name: { ar: 'جامعة بدر', en: 'Badr University' },
    category: 'universities',
    order: 53,
    logo: '',
  },

  // ---- مشاريع ترفيهية وتجارية ----
  {
    id: 'istrimol',
    name: { ar: 'استريمول', en: 'Istrimol' },
    category: 'commercial',
    order: 60,
    logo: '',
  },
  {
    id: 'craft-zone',
    name: { ar: 'كرافت زون', en: 'Craft Zone' },
    category: 'commercial',
    order: 61,
    logo: '',
  },
  {
    id: 'madinaty',
    name: { ar: 'مدينتي', en: 'Madinaty' },
    category: 'commercial',
    order: 62,
    logo: '',
  },

  // ---- أبراج وعقارات ----
  {
    id: 'iconic-tower',
    name: { ar: 'البرج الأيقوني - العاصمة الإدارية', en: 'Iconic Tower - New Administrative Capital' },
    category: 'towers',
    order: 70,
    logo: '',
  },
  {
    id: 'barrag-smouha',
    name: { ar: 'البراج سموحة - الإسكندرية', en: 'Al-Barrag Smouha - Alexandria' },
    category: 'towers',
    order: 71,
    logo: '',
  },

  // ---- شركات ----
  {
    id: 'bidaya-finance',
    name: { ar: 'شركة بداية للتمويل العقاري', en: 'Bidaya Real Estate Finance' },
    category: 'companies',
    order: 80,
    logo: '',
  },
  {
    id: 'haram-city',
    name: { ar: 'شركة هرم سيتي', en: 'Haram City Company' },
    category: 'companies',
    order: 81,
    logo: '',
  },
];

// ============================================================
// الإعدادات العامة - أماكن سابقة الأعمال
// ============================================================
const NEW_SETTINGS = {
  apartmentsCleanedCount: 1500,
  villasCleanedCount: 450,
  topRequestedPlaces: [
    // فنادق
    { ar: 'صن رايز شرم', en: 'Sunrise Sharm', category: 'hotels' },
    { ar: 'ريجال هايتس الغردقة', en: 'Regal Heights Hurghada', category: 'hotels' },
    { ar: 'مراكي', en: 'Maraki', category: 'hotels' },
    { ar: 'ميلتون', en: 'Milton', category: 'hotels' },
    { ar: 'مونتماري', en: 'Montmari', category: 'hotels' },
    { ar: 'وايت هيلز', en: 'White Hills', category: 'hotels' },
    { ar: 'أرابيان', en: 'Arabian', category: 'hotels' },
    { ar: 'بيراميدز سهل حشيش', en: 'Pyramids Sahl Hasheesh', category: 'hotels' },
    // حكومي
    { ar: 'وزارة الكهرباء والإنتاج الحربي', en: 'Ministry of Electricity', category: 'government' },
    { ar: 'وزارة الإعلام', en: 'Ministry of Information', category: 'government' },
    { ar: 'وزارة الثقافة', en: 'Ministry of Culture', category: 'government' },
    { ar: 'رئاسة مجلس الوزراء', en: 'Council of Ministers', category: 'government' },
    { ar: 'مسجد مصر', en: 'Masjid Misr', category: 'government' },
    { ar: 'وزارة البترول (العاصمة الإدارية)', en: 'Ministry of Petroleum', category: 'government' },
    // عسكري
    { ar: 'قاعة المجد - رأس التين', en: 'Al-Majd Hall - Ras Al-Tin', category: 'military' },
    { ar: 'الكلية الحربية', en: 'Military College', category: 'military' },
    { ar: 'جراج الألف مسكن', en: 'Alf Maskan Garage', category: 'military' },
    // مولات
    { ar: 'مول ألماظة بارك', en: 'Almaza Park Mall', category: 'malls' },
    { ar: 'مول Maxim التجمع الخامس', en: 'Maxim Mall', category: 'malls' },
    // جامعات
    { ar: 'الجامعة اليابانية - برج العرب', en: 'Japanese University', category: 'universities' },
    { ar: 'جامعة أسيوط', en: 'Assiut University', category: 'universities' },
    { ar: 'جامعة 15 مايو', en: '15th of May University', category: 'universities' },
    { ar: 'جامعة بدر', en: 'Badr University', category: 'universities' },
    // تجاري وترفيه
    { ar: 'استريمول', en: 'Istrimol', category: 'commercial' },
    { ar: 'كرافت زون', en: 'Craft Zone', category: 'commercial' },
    { ar: 'مدينتي', en: 'Madinaty', category: 'commercial' },
    // أبراج
    { ar: 'البرج الأيقوني - العاصمة الإدارية', en: 'Iconic Tower', category: 'towers' },
    { ar: 'البراج سموحة - الإسكندرية', en: 'Al-Barrag Smouha', category: 'towers' },
    // شركات
    { ar: 'شركة بداية للتمويل العقاري', en: 'Bidaya Finance', category: 'companies' },
    { ar: 'شركة هرم سيتي', en: 'Haram City', category: 'companies' },
  ],
};

// ============================================================
// RUN
// ============================================================
async function run() {
  console.log(`\nAdding ${NEW_CLIENTS.length} portfolio clients to Firestore...`);
  for (const client of NEW_CLIENTS) {
    const ref = db.collection('key_clients').doc(client.id);
    await ref.set(
      {
        ...client,
        description: { ar: '', en: '' },
        image: '',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log(`  ✔ Added: ${client.name.ar}`);
  }

  console.log('\nUpdating global settings (stats + places)...');
  const settingsRef = db.collection('settings').doc('global_settings');
  await settingsRef.set(NEW_SETTINGS, { merge: true });
  console.log('  ✔ Settings updated.');

  console.log('\n✅ Done!');
}

run().catch(console.error);
