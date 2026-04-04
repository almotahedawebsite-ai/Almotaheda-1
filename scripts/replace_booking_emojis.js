const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/app/[locale]/booking/page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Add imports
content = content.replace(
  "import Link from 'next/link';",
  "import Link from 'next/link';\nimport { FiClipboard, FiEdit, FiInfo, FiCreditCard, FiSmartphone, FiDollarSign, FiCamera, FiCheckCircle, FiClock, FiHome, FiMessageSquare, FiArrowLeft, FiArrowRight } from 'react-icons/fi';"
);

// Header
content = content.replace(
  /<span className="inline-block bg-white\/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-black mb-4">\s*📋 \{locale === 'ar' \? 'احجز خدمتك' \: 'Book Your Service'\}\s*<\/span>/g,
  `<span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-black mb-4">\n            <FiClipboard /> {locale === 'ar' ? 'احجز خدمتك' : 'Book Your Service'}\n          </span>`
);

// Details
content = content.replace(/📝 بيانات الحجز/g, '<FiEdit /> بيانات الحجز');
content = content.replace(/className="text-2xl font-black text-gray-900 dark:text-white mb-2">/g, 'className="text-2xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">');

content = content.replace(
  /<p className="text-sm text-blue-700 dark:text-blue-300 font-bold">\s*💡 يمكنك/g,
  `<div className="flex items-start gap-2"><FiInfo className="text-blue-700 dark:text-blue-300 mt-1 shrink-0" /><p className="text-sm text-blue-700 dark:text-blue-300 font-bold">\n                    يمكنك`
);
content = content.replace(/لملء بياناتك تلقائياً\s*<\/p>/g, "لملء بياناتك تلقائياً\n                  </p></div>");

content = content.replace(
  /التالي: اختيار طريقة الدفع <span>←<\/span>/g,
  "التالي: اختيار طريقة الدفع <FiArrowLeft />"
);

// Payment Summary
content = content.replace(/📋 ملخص الحجز/g, '<FiClipboard /> ملخص الحجز');
content = content.replace(/className="font-black text-gray-900 dark:text-white mb-3">/g, 'className="font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">');

// Payment method
content = content.replace(/💳 اختر طريقة الدفع/g, '<FiCreditCard /> اختر طريقة الدفع');
content = content.replace(/className="text-2xl font-black text-gray-900 dark:text-white">/g, 'className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">');

content = content.replace(/<span className="text-4xl mb-3 block">📱<\/span>/g, '<FiSmartphone className="text-4xl mb-3 mx-auto" />');
content = content.replace(/<span className="text-4xl mb-3 block">💰<\/span>/g, '<FiDollarSign className="text-4xl mb-3 mx-auto" />');

// Headers
content = content.replace(/h3 className="font-black text-gray-900 dark:text-white">📱 امسح/g, 'h3 className="font-black text-gray-900 dark:text-white flex items-center justify-center gap-2"><FiSmartphone /> امسح');
content = content.replace(/h3 className="font-black text-gray-900 dark:text-white">💰 حوّل/g, 'h3 className="font-black text-gray-900 dark:text-white flex items-center justify-center gap-2"><FiDollarSign /> حوّل');
content = content.replace(/h3 className="font-black text-gray-900 dark:text-white">📸 ارفع/g, 'h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2"><FiCamera /> ارفع');

content = content.replace(/<span className="text-4xl mb-3 block">📸<\/span>/g, '<FiCamera className="text-4xl mb-3 mx-auto" />');

// Buttons
content = content.replace(/← رجوع/g, '<div className="flex items-center justify-center gap-2"><FiArrowRight /> رجوع</div>');
content = content.replace(/'✅ تأكيد الحجز والدفع'/g, '<><FiCheckCircle /> تأكيد الحجز والدفع</>');

// Confirmation
content = content.replace(
  /<div className="w-24 h-24 bg-green-100 dark:bg-green-800\/30 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 animate-scale-in">\s*✅\s*<\/div>/g,
  `<div className="w-24 h-24 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 animate-scale-in text-green-600">\n                  <FiCheckCircle />\n                </div>`
);

content = content.replace(/📋 ملخص حجزك/g, '<FiClipboard /> ملخص حجزك');
content = content.replace(/className="font-black text-gray-900 dark:text-white mb-4 text-lg">/g, 'className="font-black text-gray-900 dark:text-white mb-4 text-lg flex items-center gap-2">');

content = content.replace(
  /<span className="font-bold text-amber-500">⏳ قيد المراجعة<\/span>/g,
  `<span className="font-bold text-amber-500 flex items-center gap-1"><FiClock /> قيد المراجعة</span>`
);

content = content.replace(/🏠 العودة للرئيسية/g, '<div className="flex items-center gap-2"><FiHome /> العودة للرئيسية</div>');
content = content.replace(/💬 تواصل معنا عبر واتساب/g, '<FiMessageSquare /> تواصل معنا عبر واتساب');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('done booking');
