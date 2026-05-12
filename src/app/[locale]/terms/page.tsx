import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الشروط والأحكام | المتحدة',
  description: 'الشروط والأحكام الخاصة بخدمات شركة المتحدة.',
};

export default function TermsPage({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';

  return (
    <main className="min-h-screen bg-brand-light">
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-sm border border-brand-navy/5 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-black text-brand-navy mb-8">
              {isEn ? 'Terms & Conditions' : 'الشروط والأحكام'}
            </h1>
            
            <div className="prose prose-lg prose-brand max-w-none text-brand-navy/80" dir={isEn ? 'ltr' : 'rtl'}>
              {isEn ? (
                <>
                  <p>
                    Welcome to the Almotaheda Cleaning, Sterilization, and Maintenance Services website. By using our website and services, you agree to the following terms and conditions.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">1. Provision of Services</h2>
                  <p>
                    We are committed to providing our services with the highest standards of quality and professionalism. The scope of work and cost are determined based on a site inspection or prior agreement with the client.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">2. Bookings and Appointments</h2>
                  <p>
                    Please adhere to the agreed-upon appointments. If you wish to postpone or cancel an appointment, please notify us at least 24 hours in advance.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">3. Pricing and Payment</h2>
                  <p>
                    Prices are subject to change based on service requirements and the volume of work. The payment method will be agreed upon before starting the service.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">4. Client Responsibility</h2>
                  <p>
                    The client must provide a safe working environment and secure valuable and fragile property before work begins. The company is not liable for damages resulting from the client's failure to adhere to these guidelines.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">5. Warranty and Complaints</h2>
                  <p>
                    We strive for our clients' satisfaction. If there are any remarks or complaints about the provided service, please contact us within 48 hours of work completion so we can address them.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">6. Amendments</h2>
                  <p>
                    We reserve the right to amend these terms and conditions at any time. Your continued use of our services after amendments implies your acceptance of them.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    مرحباً بك في موقع شركة المتحدة لخدمات النظافة والتعقيم والصيانة. استخدامك لموقعنا وخدماتنا يعني موافقتك على الشروط والأحكام التالية.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">1. تقديم الخدمات</h2>
                  <p>
                    نلتزم بتقديم خدماتنا بأعلى معايير الجودة والاحترافية. يتم تحديد نطاق العمل والتكلفة بناءً على معاينة الموقع أو الاتفاق المسبق مع العميل.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">2. الحجوزات والمواعيد</h2>
                  <p>
                    نرجو الالتزام بالمواعيد المتفق عليها. في حالة الرغبة في تأجيل أو إلغاء الموعد، يرجى إبلاغنا قبل الموعد بـ 24 ساعة على الأقل.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">3. الأسعار والدفع</h2>
                  <p>
                    الأسعار قابلة للتغيير وفقاً لمتطلبات الخدمة وحجم العمل. يتم الاتفاق على طريقة الدفع قبل البدء في تقديم الخدمة.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">4. مسؤولية العميل</h2>
                  <p>
                    يجب على العميل توفير بيئة عمل آمنة وتأمين الممتلكات الثمينة والقابلة للكسر قبل بدء العمل. الشركة غير مسؤولة عن الأضرار الناتجة عن عدم التزام العميل بهذه التوجيهات.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">5. الضمان والشكاوى</h2>
                  <p>
                    نسعى جاهدين لرضا عملائنا. في حال وجود أي ملاحظات أو شكاوى حول الخدمة المقدمة، يرجى التواصل معنا خلال 48 ساعة من انتهاء العمل لنتمكن من معالجتها.
                  </p>

                  <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">6. التعديلات</h2>
                  <p>
                    نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. استمرارك في استخدام خدماتنا بعد إجراء التعديلات يعد موافقة منك عليها.
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
