import { ServerSettingsRepository } from '@/infrastructure/repositories/server/ServerSettingsRepository';
import { ServerServiceRepository } from '@/infrastructure/repositories/server/ServerServiceRepository';
import { ServerKeyClientRepository } from '@/infrastructure/repositories/server/ServerKeyClientRepository';
import { ServerBranchRepository } from '@/infrastructure/repositories/server/ServerBranchRepository';

import HeroSection from '@/presentation/components/Home/HeroSection';
import IntroSection from '@/presentation/components/Home/IntroSection';
import ServicesSection from '@/presentation/components/Home/ServicesSection';
import LaborSupplySection from '@/presentation/components/Home/LaborSupplySection';
import KeyClientsSection from '@/presentation/components/Home/KeyClientsSection';
import WhyUsSection from '@/presentation/components/Home/WhyUsSection';
import BranchesSection from '@/presentation/components/Home/BranchesSection';
import ConsultationSection from '@/presentation/components/Home/ConsultationSection';
import ContactSection from '@/presentation/components/Home/ContactSection';
import ContactInfoSection from '@/presentation/components/Home/ContactInfoSection';
import SocialMediaSection from '@/presentation/components/Home/SocialMediaSection';

import BeforeAfterSection from '@/presentation/components/Home/BeforeAfterSection';
import FacadeCleaningSection from '@/presentation/components/Home/FacadeCleaningSection';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settingsRepo = new ServerSettingsRepository();
  const serviceRepo = new ServerServiceRepository();
  const clientRepo = new ServerKeyClientRepository();
  const branchRepo = new ServerBranchRepository();

  console.log('--- STARTING HOMEPAGE FETCHES ---');
  const [settings, services, clients, branches] = await Promise.all([
    settingsRepo.getGlobalSettings().then(r => { console.log('✓ Settings fetch complete'); return r; }),
    serviceRepo.getActive().then(r => { console.log('✓ Services fetch complete'); return r; }),
    clientRepo.getActive().then(r => { console.log('✓ Clients fetch complete'); return r; }),
    branchRepo.getActive().then(r => { console.log('✓ Branches fetch complete'); return r; })
  ]);
  console.log('--- ALL FETCHES COMPLETE ---');

  return (
    <div>
      <HeroSection settings={settings} locale={locale} servicesCount={services.length} />
      <IntroSection locale={locale} />
      <ServicesSection services={services} locale={locale} />
      <LaborSupplySection locale={locale} />
      <KeyClientsSection clients={clients} locale={locale} settings={settings} />
      <WhyUsSection locale={locale} />
      <BeforeAfterSection locale={locale} />
      <FacadeCleaningSection settings={settings} locale={locale} />
      <BranchesSection branches={branches} locale={locale} />
      <SocialMediaSection settings={settings} locale={locale} />
      <ContactSection locale={locale} />
      <ConsultationSection settings={settings} locale={locale} />
      <ContactInfoSection settings={settings} locale={locale} />
    </div>
  );
}

