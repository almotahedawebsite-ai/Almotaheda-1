import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | المتحدة',
  description: 'سياسة الخصوصية الخاصة بشركة المتحدة لخدمات النظافة والتعقيم والصيانة.',
};

export default function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';

  return (
    <main className="min-h-screen bg-brand-light">
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-sm border border-brand-navy/5 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-black text-brand-navy mb-8">
              {isEn ? 'Privacy Policy' : 'سياسة الخصوصية'}
            </h1>
            
            <div className="prose prose-lg prose-brand max-w-none text-brand-navy/80" dir={isEn ? 'ltr' : 'rtl'}>
              {isEn ? (
                <>
                  <p>
                    At Almotaheda, we prioritize the privacy of our clients. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services and website.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">1. Information We Collect</h2>
                  <p>
                    We may collect personal information such as your name, phone number, email, and service address when you request our services or contact us.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">2. How We Use Information</h2>
                  <p>
                    We use the information we collect to provide our services, improve user experience, communicate with you regarding your requests, and send updates about our services (if you agree).
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">3. Data Protection</h2>
                  <p>
                    We take strict security measures to protect your personal data against unauthorized access, modification, disclosure, or destruction.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">4. Information Sharing</h2>
                  <p>
                    We do not sell, rent, or share your personal information with third parties except as required by law or to provide the requested service.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">5. Changes to Privacy Policy</h2>
                  <p>
                    We reserve the right to update this Privacy Policy from time to time. Any changes will be posted on this page.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">6. Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us through the official channels available on our website.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    في شركة المتحدة، نولي أهمية قصوى لخصوصية عملائنا. توضح سياسة الخصوصية هذه كيفية جمعنا لمعلوماتك الشخصية واستخدامها وحمايتها عند استخدامك لخدماتنا وموقعنا الإلكتروني.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">1. المعلومات التي نجمعها</h2>
                  <p>
                    قد نجمع معلومات شخصية مثل الاسم، رقم الهاتف، البريد الإلكتروني، وعنوان الخدمة عند قيامك بطلب خدماتنا أو التواصل معنا.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">2. كيفية استخدام المعلومات</h2>
                  <p>
                    نستخدم المعلومات التي نجمعها لتقديم خدماتنا، تحسين تجربة المستخدم، التواصل معك بخصوص طلباتك، وإرسال تحديثات حول خدماتنا (إذا وافقت على ذلك).
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">3. حماية البيانات</h2>
                  <p>
                    نتخذ إجراءات أمنية صارمة لحماية بياناتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">4. مشاركة المعلومات</h2>
                  <p>
                    لا نقوم ببيع أو تأجير أو مشاركة معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التي يتطلبها القانون أو لتقديم الخدمة المطلوبة.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">5. التغييرات على سياسة الخصوصية</h2>
                  <p>
                    نحتفظ بالحق في تحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">6. التواصل معنا</h2>
                  <p>
                    إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر القنوات الرسمية المتاحة على موقعنا.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
