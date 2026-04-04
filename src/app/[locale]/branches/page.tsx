import React from 'react';
import { ServerBranchRepository } from '@/infrastructure/repositories/server/ServerBranchRepository';
import { tField } from '@/domain/types/settings';
import { FiMap, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';

export default async function BranchesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const repo = new ServerBranchRepository();
  const branches = await repo.getActive();

  return (
    <div className="pt-20 animate-fade-in-up">
      {/* Header */}
      <section className="py-20 flex items-center justify-center text-white text-center relative overflow-hidden min-h-[40vh]">
        {/* Background Layering */}
        <img 
          src="https://res.cloudinary.com/dsr72hebx/image/upload/v1775242954/bg_branches_1775242882621_fpe6nh.jpg"
          alt="Branches Background"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-95"
        />
        <div className="absolute inset-0 hero-gradient opacity-40 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/40 via-brand-navy/30 to-brand-navy z-10" />

        {/* Animated Effects */}
        <div className="absolute inset-0 z-10 overflow-hidden mix-blend-screen opacity-50 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-teal rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-black mb-4">
            <FiMap /> {locale === 'ar' ? 'فروعنا' : 'Our Branches'}
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            {locale === 'ar' ? 'فروعنا في أنحاء الجمهورية' : 'Our Branches Across Egypt'}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {locale === 'ar' ? 'نغطي العديد من المحافظات لنكون دائماً بالقرب منك' : 'We cover multiple governorates to always be near you'}
          </p>
        </div>
      </section>

      {/* Branches Grid */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          {branches.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <FiMap className="text-6xl mb-4 text-brand-navy" />
              <p className="text-gray-400 text-lg font-bold">{locale === 'ar' ? 'سيتم إضافة الفروع قريباً' : 'Branches coming soon'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {branches.map((branch) => (
                <div 
                  key={branch.id} 
                  className="card-hover bg-gray-50 dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-700"
                >
                  {branch.image ? (
                    <img src={branch.image} alt={tField(branch.name, locale)} className="w-full h-52 object-cover" />
                  ) : (
                    <div className="w-full h-52 bg-gradient-to-br from-brand-navy to-brand-teal flex items-center justify-center text-7xl text-white/20">
                      <FiMap />
                    </div>
                  )}
                  <div className="p-8 space-y-4">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">{tField(branch.name, locale)}</h3>
                    
                    {tField(branch.address, locale) && (
                      <div className="flex items-start gap-3">
                        <FiMapPin className="text-brand-teal text-lg mt-0.5" />
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{tField(branch.address, locale)}</p>
                      </div>
                    )}
                    
                    {branch.phone && (
                      <div className="flex items-center gap-3">
                        <FiPhone className="text-brand-teal text-lg" />
                        <a href={`tel:${branch.phone}`} className="text-gray-600 dark:text-gray-300 font-mono hover:text-brand-teal transition-colors" dir="ltr">{branch.phone}</a>
                      </div>
                    )}
                    
                    {tField(branch.workingHours, locale) && (
                      <div className="flex items-center gap-3">
                        <FiClock className="text-brand-teal text-lg" />
                        <p className="text-gray-600 dark:text-gray-300">{tField(branch.workingHours, locale)}</p>
                      </div>
                    )}
                    
                    {branch.googleMapUrl && (
                      <a 
                        href={branch.googleMapUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-brand-teal/10 hover:bg-brand-teal hover:text-white text-brand-teal px-5 py-2.5 rounded-xl font-bold text-sm transition-all mt-2"
                      >
                        <FiMap /> {locale === 'ar' ? 'اعرض على الخريطة' : 'View on Map'}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
