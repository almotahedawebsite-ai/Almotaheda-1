import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

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
const now = new Date().toISOString();

async function phase1_services() {
  console.log('\n' + '='.repeat(60));
  console.log('📦 PHASE 1: SERVICES');
  console.log('='.repeat(60));

  const batch = db.batch();

  // 1.1 Delete "خدمات المطاعم" (restaurant-services)
  const restaurantServicesRef = db.collection('services').doc('restaurant-services');
  const restaurantServicesSnap = await restaurantServicesRef.get();
  if (restaurantServicesSnap.exists) {
    console.log('✅ 1.1 Deleting "خدمات المطاعم" (restaurant-services)');
    batch.delete(restaurantServicesRef);
  } else {
    console.log('⚠️ 1.1 "restaurant-services" not found — skipping');
  }

  // 1.2 Rename "خدمات المطاعم - تنظيف الهود" → "تنظيف المطاعم"
  const restaurantHoodRef = db.collection('services').doc('restaurant-hood');
  const restaurantHoodSnap = await restaurantHoodRef.get();
  if (restaurantHoodSnap.exists) {
    console.log('✅ 1.2 Renaming "خدمات المطاعم - تنظيف الهود" → "تنظيف المطاعم"');
    batch.update(restaurantHoodRef, {
      'name.ar': 'تنظيف المطاعم',
      'name.en': 'Restaurant Cleaning',
      updatedAt: now,
    });
  }

  // 1.3 Reorder services to put المفروشات in top 6
  // New order: internal-cleaning=1, deep-cleaning=2, facade-cleaning=3, 
  //            furniture-cleaning=4, sanitization=5, pest-control=6,
  //            restaurant-hood=7, maintenance=8, landscaping=9, 
  //            pool-maintenance=10, corporate-factory=11,
  //            labor-supply=12, contracts=13
  const orderUpdates: Record<string, number> = {
    'internal-cleaning': 1,
    'deep-cleaning': 2,
    'facade-cleaning': 3,
    'furniture-cleaning': 4,
    'sanitization': 5,
    'pest-control': 6,
    'restaurant-hood': 7,
    'maintenance': 8,
    'landscaping': 9,
    'pool-maintenance': 10,
    'corporate-factory': 11,
    'labor-supply': 12,
    'contracts': 13,
  };

  for (const [id, order] of Object.entries(orderUpdates)) {
    const ref = db.collection('services').doc(id);
    const snap = await ref.get();
    if (snap.exists) {
      batch.update(ref, { order, updatedAt: now });
    }
  }
  console.log('✅ 1.3 Reordered services — المفروشات now in top 6 (order=4)');

  await batch.commit();
  console.log('✅ Phase 1 COMMITTED\n');

  // Verify
  const verifySnap = await db.collection('services').orderBy('order', 'asc').get();
  console.log('📋 Verification — top 6 services on Home:');
  verifySnap.docs.slice(0, 6).forEach((d, i) => {
    const data = d.data();
    console.log(`  ${i + 1}. [${d.id}] order=${data.order} "${data.name?.ar}"`);
  });
  console.log(`  ... and ${verifySnap.size - 6} more services`);
}

async function phase2_portfolio() {
  console.log('\n' + '='.repeat(60));
  console.log('🏗️ PHASE 2: PORTFOLIO / KEY_CLIENTS');
  console.log('='.repeat(60));

  const batch = db.batch();

  // 2.1 Delete "حي الوزارات" (hay-alwezarat)
  const hayRef = db.collection('key_clients').doc('hay-alwezarat');
  const haySnap = await hayRef.get();
  if (haySnap.exists) {
    console.log('✅ 2.1 Deleting "حي الوزارات"');
    batch.delete(hayRef);
  }

  // 2.2 Delete duplicate "الكيان العسكري" (military-entity) — keep military-college
  const militaryEntityRef = db.collection('key_clients').doc('military-entity');
  const militaryEntitySnap = await militaryEntityRef.get();
  if (militaryEntitySnap.exists) {
    console.log('✅ 2.2 Deleting duplicate "الكيان العسكري" (military-entity)');
    batch.delete(militaryEntityRef);
  }

  // Rename military-college → "الكلية الحربية للكيان العسكري"
  const militaryCollegeRef = db.collection('key_clients').doc('military-college');
  const militaryCollegeSnap = await militaryCollegeRef.get();
  if (militaryCollegeSnap.exists) {
    console.log('✅ 2.2 Renaming military-college → "الكلية الحربية للكيان العسكري"');
    batch.update(militaryCollegeRef, {
      'name.ar': 'الكلية الحربية للكيان العسكري',
      'name.en': 'Military College of the Military Entity',
      updatedAt: now,
    });
  }

  // 2.3 Rename projects
  const renames: Record<string, { ar: string; en: string }> = {
    'nta': { ar: 'الأكاديمية الوطنية لتأهيل الشباب بالشيخ زايد', en: 'National Training Academy, Sheikh Zayed' },
    'regal-heights': { ar: 'فندق رمال هايتس الغردقة', en: 'Rimal Heights Hotel, Hurghada' },
    'pyramids-hotel-sahel': { ar: 'بيراميزا', en: 'Pyramisa' },
    'majid-hall-ras-altin': { ar: 'قاعدة رأس التين البحرية بالإسكندرية', en: 'Ras Al-Tin Naval Base, Alexandria' },
    'barrag-smouha': { ar: 'أبراج الصفوة بسموحة', en: 'Al-Safwa Towers, Smouha' },
  };

  for (const [id, name] of Object.entries(renames)) {
    const ref = db.collection('key_clients').doc(id);
    const snap = await ref.get();
    if (snap.exists) {
      console.log(`✅ 2.3 Renaming [${id}] → "${name.ar}"`);
      batch.update(ref, { name, updatedAt: now });
    } else {
      console.log(`⚠️ 2.3 [${id}] not found!`);
    }
  }

  // 2.4 Merge Sunrise hotels → keep maraki-hotel as sunrise-group
  const sunriseHotelsToDelete = ['milton-hotel', 'montmari-hotel', 'white-hills-hotel', 'arabian-hotel'];
  
  // Update maraki-hotel → Sunrise Group
  const marakiRef = db.collection('key_clients').doc('maraki-hotel');
  const marakiSnap = await marakiRef.get();
  if (marakiSnap.exists) {
    console.log('✅ 2.4 Converting maraki-hotel → Sunrise Group');
    batch.update(marakiRef, {
      'name.ar': 'Sunrise Group',
      'name.en': 'Sunrise Group',
      'description.ar': 'فندق مراكي وفندق ميلتون وفندق مونتماري وفندق وايت هيلز وفندق أرابيان',
      'description.en': 'Maraki Hotel, Milton Hotel, Montmari Hotel, White Hills Hotel, and Arabian Hotel',
      updatedAt: now,
    });
  }

  for (const id of sunriseHotelsToDelete) {
    const ref = db.collection('key_clients').doc(id);
    const snap = await ref.get();
    if (snap.exists) {
      console.log(`✅ 2.4 Deleting merged hotel: ${id}`);
      batch.delete(ref);
    }
  }

  // 2.5 Delete مدينتي + update كرافت زون + add ستريت مول
  const madinatyRef = db.collection('key_clients').doc('madinaty');
  const madinatySnap = await madinatyRef.get();
  if (madinatySnap.exists) {
    console.log('✅ 2.5 Deleting "مدينتي"');
    batch.delete(madinatyRef);
  }

  // Rename existing craft-zone → كرافت زون بمدينتي
  const craftZoneRef = db.collection('key_clients').doc('craft-zone');
  const craftZoneSnap = await craftZoneRef.get();
  if (craftZoneSnap.exists) {
    console.log('✅ 2.5 Renaming craft-zone → "كرافت زون بمدينتي"');
    batch.update(craftZoneRef, {
      'name.ar': 'كرافت زون بمدينتي',
      'name.en': 'Craft Zone, Madinaty',
      updatedAt: now,
    });
  }

  // Add ستريت مول بمدينتي
  const streetMallRef = db.collection('key_clients').doc('street-mall-madinaty');
  console.log('✅ 2.5 Adding "ستريت مول بمدينتي"');
  batch.set(streetMallRef, {
    id: 'street-mall-madinaty',
    name: { ar: 'ستريت مول بمدينتي', en: 'Street Mall, Madinaty' },
    description: { ar: '', en: '' },
    logo: '',
    image: '',
    category: 'commercial',
    order: 63,
    isActive: true,
    createdAt: now,
  });

  // 2.6 Add new projects
  // Update existing masjid-misr → add العاصمة الإدارية
  const masjidRef = db.collection('key_clients').doc('masjid-misr');
  const masjidSnap = await masjidRef.get();
  if (masjidSnap.exists) {
    console.log('✅ 2.6 Updating masjid-misr → "مسجد مصر (العاصمة الإدارية)"');
    batch.update(masjidRef, {
      'name.ar': 'مسجد مصر (العاصمة الإدارية)',
      'name.en': 'Masjid Misr (New Administrative Capital)',
      updatedAt: now,
    });
  }

  // Add المدينة الأولمبية
  const olympicRef = db.collection('key_clients').doc('olympic-city');
  console.log('✅ 2.6 Adding "المدينة الأولمبية (العاصمة الإدارية)"');
  batch.set(olympicRef, {
    id: 'olympic-city',
    name: { ar: 'المدينة الأولمبية (العاصمة الإدارية)', en: 'Olympic City (New Administrative Capital)' },
    description: { ar: '', en: '' },
    logo: '',
    image: '',
    category: 'government',
    order: 26,
    isActive: true,
    createdAt: now,
  });

  // Add قصر الرئاسة
  const palaceRef = db.collection('key_clients').doc('presidential-palace');
  console.log('✅ 2.6 Adding "قصر الرئاسة في العالمين الجديدة"');
  batch.set(palaceRef, {
    id: 'presidential-palace',
    name: { ar: 'قصر الرئاسة في العالمين الجديدة', en: 'Presidential Palace, New Alamein' },
    description: { ar: '', en: '' },
    logo: '',
    image: '',
    category: 'government',
    order: 27,
    isActive: true,
    createdAt: now,
  });

  // Add بورتو جولف (مارينا)
  const portoRef = db.collection('key_clients').doc('porto-golf-marina');
  console.log('✅ 2.6 Adding "بورتو جولف (مارينا)"');
  batch.set(portoRef, {
    id: 'porto-golf-marina',
    name: { ar: 'بورتو جولف (مارينا)', en: 'Porto Golf Marina' },
    description: { ar: '', en: '' },
    logo: '',
    image: '',
    category: 'commercial',
    order: 64,
    isActive: true,
    createdAt: now,
  });

  await batch.commit();
  console.log('\n✅ Phase 2 COMMITTED\n');

  // Verify
  const verifySnap = await db.collection('key_clients').orderBy('order', 'asc').get();
  console.log('📋 Verification — All key_clients:');
  verifySnap.docs.forEach((d) => {
    const data = d.data();
    console.log(`  [${d.id}] order=${data.order} | cat="${data.category}" | "${data.name?.ar}"`);
  });
}

async function phase2_update_settings_places() {
  console.log('\n' + '='.repeat(60));
  console.log('⚙️ PHASE 2.7: UPDATE topRequestedPlaces in settings');
  console.log('='.repeat(60));

  // Build new topRequestedPlaces from current key_clients
  const snap = await db.collection('key_clients').orderBy('order', 'asc').get();
  const places = snap.docs.map(d => {
    const data = d.data();
    return {
      ar: data.name?.ar || '',
      en: data.name?.en || '',
      category: data.category || '',
    };
  });

  await db.collection('settings').doc('global_settings').update({
    topRequestedPlaces: places,
  });

  console.log(`✅ Updated topRequestedPlaces with ${places.length} entries`);
}

async function main() {
  await phase1_services();
  await phase2_portfolio();
  await phase2_update_settings_places();
  
  console.log('\n' + '🎉'.repeat(20));
  console.log('ALL DB CHANGES COMPLETE!');
  console.log('🎉'.repeat(20));

  process.exit(0);
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
