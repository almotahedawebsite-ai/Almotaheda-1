import React from 'react';
import { ServerSettingsRepository } from '@/infrastructure/repositories/server/ServerSettingsRepository';
import { ServerServiceRepository } from '@/infrastructure/repositories/server/ServerServiceRepository';
import { ServerKeyClientRepository } from '@/infrastructure/repositories/server/ServerKeyClientRepository';
import { ServerBranchRepository } from '@/infrastructure/repositories/server/ServerBranchRepository';

import HeroSection from '@/presentation/components/Home/HeroSection';
import ServicesSection from '@/presentation/components/Home/ServicesSection';
import KeyClientsSection from '@/presentation/components/Home/KeyClientsSection';
import WhyUsSection from '@/presentation/components/Home/WhyUsSection';
import BranchesSection from '@/presentation/components/Home/BranchesSection';
import ConsultationSection from '@/presentation/components/Home/ConsultationSection';
import ContactSection from '@/presentation/components/Home/ContactSection';
import ContactInfoSection from '@/presentation/components/Home/ContactInfoSection';
import SocialMediaSection from '@/presentation/components/Home/SocialMediaSection';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settingsRepo = new ServerSettingsRepository();
  const settings = await settingsRepo.getGlobalSettings();

  const serviceRepo = new ServerServiceRepository();
  const services = await serviceRepo.getActive();

  const clientRepo = new ServerKeyClientRepository();
  const clients = await clientRepo.getActive();

  const branchRepo = new ServerBranchRepository();
  const branches = await branchRepo.getActive();

  return (
    <div className="animate-fade-in-up">
      <HeroSection settings={settings} locale={locale} />
      <ServicesSection services={services} locale={locale} />
      <KeyClientsSection clients={clients} locale={locale} />
      <WhyUsSection locale={locale} />
      <BranchesSection branches={branches} locale={locale} />
      <SocialMediaSection settings={settings} locale={locale} />
      <ContactSection locale={locale} />
      <ConsultationSection settings={settings} locale={locale} />
      <ContactInfoSection settings={settings} locale={locale} />
    </div>
  );
}

