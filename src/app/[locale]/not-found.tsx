import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center p-4 font-sans" dir="rtl">
      <div className="max-w-md w-full">
        <h1 className="text-9xl font-black text-gray-200 mb-4 tracking-tighter">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">عفواً، الصفحة غير موجودة</h2>
        <p className="text-gray-500 mb-10 text-lg leading-relaxed">
          يبدو أن الرابط الذي تبحث عنه قد تم حذفه، أو أنك قمت بكتابته بشكل خاطئ.
        </p>
        <Link 
          href="/" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 inline-block"
        >
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
