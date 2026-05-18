import { ServerSettingsRepository } from '@/infrastructure/repositories/server/ServerSettingsRepository';
import { ServerServiceRepository } from '@/infrastructure/repositories/server/ServerServiceRepository';
import { ServerKeyClientRepository } from '@/infrastructure/repositories/server/ServerKeyClientRepository';
import { ServerBranchRepository } from '@/infrastructure/repositories/server/ServerBranchRepository';
import { ServerBeforeAfterRepository } from '@/infrastructure/repositories/server/ServerBeforeAfterRepository';

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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settingsRepo = new ServerSettingsRepository();
  const serviceRepo = new ServerServiceRepository();
  const clientRepo = new ServerKeyClientRepository();
  const branchRepo = new ServerBranchRepository();
  const beforeAfterRepo = new ServerBeforeAfterRepository();

  const [settings, services, clients, branches, allBeforeAfter] = await Promise.all([
    settingsRepo.getGlobalSettings(),
    serviceRepo.getActive(),
    clientRepo.getActive(),
    branchRepo.getActive(),
    beforeAfterRepo.getActive()
  ]);

  // Shuffle and allow up to 50 images since we have lazy loading
  const shuffledBeforeAfter = [...allBeforeAfter].sort(() => 0.5 - Math.random()).slice(0, 50);

  return (
    <div>
      <HeroSection settings={settings} locale={locale} servicesCount={services.length} />
      <IntroSection locale={locale} />
      <BeforeAfterSection images={shuffledBeforeAfter} />
      <ServicesSection services={services} locale={locale} />
      <LaborSupplySection locale={locale} />
      <KeyClientsSection clients={clients} locale={locale} settings={settings} />
      <WhyUsSection locale={locale} />
      <BranchesSection branches={branches} locale={locale} />
      <SocialMediaSection settings={settings} locale={locale} />
      <ContactSection locale={locale} />
      <ConsultationSection settings={settings} locale={locale} />
      <ContactInfoSection settings={settings} locale={locale} />
    </div>
  );
}

