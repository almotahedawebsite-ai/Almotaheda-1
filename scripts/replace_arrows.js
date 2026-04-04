const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements, addImport = true) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (addImport && !content.includes('FiArrowLeft')) {
    if (content.includes("from 'react-icons/fi';")) {
      content = content.replace("from 'react-icons/fi';", ", FiArrowLeft } from 'react-icons/fi';");
      content = content.replace("{ , FiArrowLeft }", "{ FiArrowLeft }");
      content = content.replace("}, FiArrowLeft }", ", FiArrowLeft }");
      // fix duplicates possibly later
    } else {
      content = content.replace(/(import .*;\n)/, "$1import { FiArrowLeft } from 'react-icons/fi';\n");
    }
  }
  for (const r of replacements) {
    if (r.regex) {
      content = content.replace(r.from, r.to);
    } else {
      content = content.split(r.from).join(r.to);
    }
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

// 1. page.tsx
replaceInFile(path.resolve('src/app/[locale]/page.tsx'), [
  { from: "{locale === 'ar' ? 'استكشف خدماتنا' : 'Explore Services'} ←", to: "<span className=\"flex items-center justify-center gap-2\">{locale === 'ar' ? 'استكشف خدماتنا' : 'Explore Services'} <FiArrowLeft /></span>" },
  { from: "{locale === 'ar' ? 'اعرف المزيد' : 'Learn More'} <span className=\"mr-1\">←</span>", to: "<span className=\"flex items-center gap-2\">{locale === 'ar' ? 'اعرف المزيد' : 'Learn More'} <FiArrowLeft /></span>" }
]);

// 2. dashboard/services/page.tsx
replaceInFile(path.resolve('src/app/[locale]/dashboard/services/page.tsx'), [
  { from: "أضف خدمة جديدة ←", to: "<span className=\"flex items-center gap-1\">أضف خدمة جديدة <FiArrowLeft /></span>" }
]);

// 3. dashboard/page.tsx
replaceInFile(path.resolve('src/app/[locale]/dashboard/page.tsx'), [
  { from: "إدارة القسم <span>←</span>", to: "<span className=\"flex items-center gap-1\">إدارة القسم <FiArrowLeft /></span>" }
]);

// 4. dashboard/key-clients/page.tsx
replaceInFile(path.resolve('src/app/[locale]/dashboard/key-clients/page.tsx'), [
  { from: "أضف عميل جديد ←", to: "<span className=\"flex items-center gap-1\">أضف عميل جديد <FiArrowLeft /></span>" }
]);

// 5. dashboard/contracts/page.tsx
replaceInFile(path.resolve('src/app/[locale]/dashboard/contracts/page.tsx'), [
  { from: "أضف عقد جديد ←", to: "<span className=\"flex items-center gap-1\">أضف عقد جديد <FiArrowLeft /></span>" }
]);

// 6. dashboard/branches/page.tsx
replaceInFile(path.resolve('src/app/[locale]/dashboard/branches/page.tsx'), [
  { from: "أضف فرع جديد ←", to: "<span className=\"flex items-center gap-1\">أضف فرع جديد <FiArrowLeft /></span>" }
]);

console.log('done arrows');
