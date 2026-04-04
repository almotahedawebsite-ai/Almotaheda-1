import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables manually for standalone script execution
dotenv.config({ path: join(process.cwd(), '.env.local') });
dotenv.config({ path: join(process.cwd(), '.env') });

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_DATABASE_URL,
} = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error('\n❌ ERROR: Firebase Admin credentials missing or empty in .env.local / .env');
  console.log('👉 Please ensure you have copied .env.template to .env.local and filled in the values.');
  process.exit(1);
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: FIREBASE_DATABASE_URL,
  });
}

const db = admin.firestore();

// ======================================
// DEFAULT GLOBAL SETTINGS (المتحدة Brand)
// ======================================
const DEFAULT_GLOBAL_SETTINGS = {
  siteName: { ar: 'المتحدة', en: 'Al-Motaheda' },
  metaTitle: { ar: 'المتحدة لخدمات النظافة | الرئيسية', en: 'Al-Motaheda Cleaning Service | Home' },
  metaDescription: { ar: 'شركة المتحدة لخدمات النظافة والتعقيم والصيانة - خبرة واحترافية في تنظيف الواجهات والمفروشات والفلل والمصانع والمستشفيات', en: 'Al-Motaheda - Professional cleaning, sanitization, and maintenance services' },
  primaryColor: '#0A2463',
  secondaryColor: '#3E92CC',
  enableDarkMode: false,
  enableMultiLanguage: false,
  defaultLocale: 'ar',
  contactEmail: '',
  contactPhone: '',
  contactWhatsapp: '',
  contactAddress: { ar: '', en: '' },
  aboutTitle: { ar: 'من نحن', en: 'About Us' },
  aboutContent: { ar: 'شركة المتحدة لخدمات النظافة - نقدم خدمات متكاملة في النظافة والتعقيم والصيانة بأعلى معايير الجودة والاحترافية. نخدم القطاع السكني والتجاري والصناعي والحكومي.', en: 'Al-Motaheda Cleaning Service - Comprehensive cleaning, sanitization, and maintenance services with the highest quality standards.' },
  whatsappCta: '',
  instapayQrImage: '',
  eWalletNumber: '',
  socialLinks: [],
};

// ======================================
// SERVICES (الخدمات)
// ======================================
const SERVICES = [
  { id: 'internal-cleaning', name: { ar: 'النظافة الداخلية', en: 'Internal Cleaning' }, slug: 'internal-cleaning', category: 'cleaning', order: 1 },
  { id: 'deep-cleaning', name: { ar: 'التنظيف العميق (ديب كلينج)', en: 'Deep Cleaning' }, slug: 'deep-cleaning', category: 'cleaning', order: 2 },
  { id: 'facade-cleaning', name: { ar: 'تنظيف الواجهات', en: 'Facade Cleaning' }, slug: 'facade-cleaning', category: 'cleaning', order: 3 },
  { id: 'furniture-cleaning', name: { ar: 'تنظيف المفروشات', en: 'Furniture Cleaning' }, slug: 'furniture-cleaning', category: 'cleaning', order: 4 },
  { id: 'upholstery-carpet', name: { ar: 'انتريهات وسجاد وموكيت وستائر ومراتب', en: 'Upholstery, Carpet, Curtains & Mattresses' }, slug: 'upholstery-carpet', category: 'cleaning', order: 5 },
  { id: 'sanitization', name: { ar: 'التعقيم', en: 'Sanitization' }, slug: 'sanitization', category: 'sanitization', order: 6 },
  { id: 'pest-control', name: { ar: 'مكافحة وإبادة الحشرات', en: 'Pest Control & Extermination' }, slug: 'pest-control', category: 'pest-control', order: 7 },
  { id: 'restaurant-hood', name: { ar: 'خدمات المطاعم - تنظيف الهود', en: 'Restaurant Services - Hood Cleaning' }, slug: 'restaurant-hood', category: 'restaurant', order: 8 },
  { id: 'home-maintenance', name: { ar: 'صيانة المنازل والشركات', en: 'Home & Office Maintenance' }, slug: 'home-maintenance', category: 'maintenance', order: 9 },
  { id: 'electrical-plumbing', name: { ar: 'كهرباء وسباكة ونقاشة ونجارة وأعمال الجبس بورد', en: 'Electrical, Plumbing, Painting, Carpentry & Gypsum Board' }, slug: 'electrical-plumbing', category: 'maintenance', order: 10 },
  { id: 'landscaping', name: { ar: 'خدمة اللاند سكيب - صيانة وتركيب', en: 'Landscaping - Maintenance & Installation' }, slug: 'landscaping', category: 'landscaping', order: 11 },
  { id: 'pool-maintenance', name: { ar: 'نظافة وتعقيم وصيانة حمامات السباحة', en: 'Pool Cleaning, Sanitization & Maintenance' }, slug: 'pool-maintenance', category: 'maintenance', order: 12 },
  { id: 'restaurant-services', name: { ar: 'خدمات المطاعم', en: 'Restaurant Services' }, slug: 'restaurant-services', category: 'restaurant', order: 13 },
  { id: 'corporate-factory', name: { ar: 'خدمات الشركات والمصانع', en: 'Corporate & Factory Services' }, slug: 'corporate-factory', category: 'corporate', order: 14 },
  { id: 'labor-supply', name: { ar: 'توريد عمالة', en: 'Labor Supply' }, slug: 'labor-supply', category: 'labor', order: 15 },
  { id: 'contracts', name: { ar: 'التعاقدات', en: 'Contracts' }, slug: 'contracts', category: 'contracts', order: 16 },
];

// ======================================
// KEY CLIENTS (أهم العملاء)
// ======================================
const KEY_CLIENTS = [
  { id: 'talaat-moustafa', name: { ar: 'شركة طلعت مصطفى', en: 'Talaat Moustafa Group' }, order: 1 },
  { id: 'hay-alwezarat', name: { ar: 'حي الوزارات', en: 'Hay Al-Wezarat' }, order: 2 },
  { id: 'military-entity', name: { ar: 'الكيان العسكري', en: 'Military Entity' }, order: 3 },
  { id: 'military-college', name: { ar: 'الكلية الحربية', en: 'Military College' }, order: 4 },
];

async function setup() {
  console.log('🚀 Starting Database Initialization for المتحدة (Al-Motaheda)...');

  try {
    // 1. Initialize Global Settings
    const settingsRef = db.collection('settings').doc('global_settings');
    const settingsSnap = await settingsRef.get();
    
    if (!settingsSnap.exists) {
      console.log('📦 Creating default global settings for المتحدة...');
      await settingsRef.set(DEFAULT_GLOBAL_SETTINGS);
    } else {
      console.log('✅ Global settings already exist. Skipping.');
    }

    // 2. Seed Services
    console.log('🧹 Seeding cleaning services...');
    for (const service of SERVICES) {
      const serviceRef = db.collection('services').doc(service.id);
      const serviceSnap = await serviceRef.get();
      
      if (!serviceSnap.exists) {
        await serviceRef.set({
          ...service,
          description: { ar: '', en: '' },
          image: '',
          video: '',
          icon: '',
          isActive: true,
          createdAt: new Date().toISOString(),
        });
        console.log(`  ✅ Service: ${service.name.ar}`);
      } else {
        console.log(`  ⏭️ Service "${service.name.ar}" already exists. Skipping.`);
      }
    }

    // 3. Seed Key Clients
    console.log('⭐ Seeding key clients...');
    for (const client of KEY_CLIENTS) {
      const clientRef = db.collection('key_clients').doc(client.id);
      const clientSnap = await clientRef.get();

      if (!clientSnap.exists) {
        await clientRef.set({
          ...client,
          logo: '',
          description: { ar: '', en: '' },
          image: '',
          category: '',
          isActive: true,
          createdAt: new Date().toISOString(),
        });
        console.log(`  ✅ Client: ${client.name.ar}`);
      } else {
        console.log(`  ⏭️ Client "${client.name.ar}" already exists. Skipping.`);
      }
    }

    // 4. Register Super Admin
    const superAdminEmail = process.env.FIREBASE_SUPER_ADMIN || 'gemeslaim10@gmail.com';
    const adminRef = db.collection('admins').doc(superAdminEmail);
    const adminSnap = await adminRef.get();

    if (!adminSnap.exists) {
      console.log(`👤 Registering Super Admin: ${superAdminEmail}...`);
      await adminRef.set({
        email: superAdminEmail,
        role: 'super-admin',
        createdAt: admin.firestore.Timestamp.now()
      });
    } else {
      console.log(`✅ Super Admin (${superAdminEmail}) already registered. Skipping.`);
    }

    console.log('\n✨ Database setup completed successfully for المتحدة!');
    console.log('👉 You can now run "npm run dev" and access the dashboard.');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

setup();
