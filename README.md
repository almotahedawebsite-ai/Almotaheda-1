# 🏗️ Agency Starter Kit & Modular E-commerce Engine

موقع متكامل واحترافي مبني بأحدث تقنيات **Next.js 15**, **Firebase**, و **Modular Architecture**. هذا المشروع مصمم ليكون "محرك بناء مواقع" (Website Engine) مرن للغاية، حيث يمكن استخدامه كموقع تعريفي للشركات أو كمتجر إلكتروني متكامل بضغطة زر.

## ✨ المميزات الرئيسية (Key Features)

- **🧩 الهندسة التركيبية (Modular Architecture)**: تم عزل موديول المتجر (`src/modules/ecom`) بالكامل. يمكنك تفعيله أو تعطيله عبر `NEXT_PUBLIC_ENABLE_STORE` في ملف الـ `.env`.
- **🌍 دعم تعدد اللغات (Full i18n)**: واجهة كاملة باللغتين العربية والإنجليزية مع توجيه ذكي (Dynamic Routing).
- **🏎️ نظام كاش ذكي (On-Demand Revalidation)**: أداء فائق السرعة يعتمد على تقنيات الكاش الثابت مع التحديث الفوري عند الطلب من لوحة التحكم.
- **🛡️ حماية متطورة (Server-Side Auth)**: حماية كاملة للوحة التحكم ومسارات المدير باستخدام Firebase Admin SDK و Session Cookies.
- **⚡ سكريبت تهيئة سريعة (Plug & Play)**: ابدأ مشروعك الجديد في ثوانٍ باستخدام `npm run setup:db`.

---

## 🛠️ كيف تبدأ (Getting Started)

### 1. المتطلبات (Prerequisites)
- [Node.js 20+](https://nodejs.org/)
- حساب على [Firebase Console](https://console.firebase.google.com/)

### 2. إعداد المتغيرات البيئية (.env.local)
قم بنسخ ملف `.env.template` إلى ملف جديد باسم `.env.local` واملأ البيانات المطلوبة:
```bash
cp .env.template .env.local
```
تأكد من وضع مفاتيح **Firebase Admin SDK** (التي يتم استخراجها من إعدادات المشروع في فايربيز).

### 3. تنصيب المكتبات
```bash
npm install
```

### 4. تهيئة قاعدة البيانات (للمشاريع الجديدة) 🚀
هذه الخطوة هامة جداً، ستقوم بإنشاء جميع الجداول والإعدادات الافتراضية وحساب المدير:
```bash
npm run setup:db
```

### 5. تشغيل الموقع في بيئة التطوير
```bash
npm run dev
```

---

## 💻 الأوامر المتاحة (Available Scripts)

- `npm run dev`: تشغيل الموقع محلياً.
- `npm run build`: بناء النسخة النهائية للإنتاج.
- `npm run start`: تشغيل النسخة المبنية.
- `npm run setup:db`: سكريبت التهيئة التلقائية لقاعدة البيانات (يُشغل مرة واحدة عند البدء).

---

## 📦 موديول المتجر (E-commerce Module)
يمكنك التحكم في ظهور المتجر بالكامل عن طريق تعديل القيمة في `.env.local`:
- `NEXT_PUBLIC_ENABLE_STORE="true"`: تفعيل السلة، المتجر، وإدارة المنتجات.
- `NEXT_PUBLIC_ENABLE_STORE="false"`: إيقاف المتجر وتحويل الموقع إلى موقع تعريفي بسيط.

---

تم تطويره بمنتهى الاحترافية ليكون منصة انطلاق قوية لمشاريعك القادمة. 🔥🏗️
