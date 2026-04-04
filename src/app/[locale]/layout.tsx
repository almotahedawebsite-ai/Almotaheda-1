import { Almarai } from 'next/font/google';
import '../globals.css';
import type { Metadata } from 'next';
import React from 'react';
import { ServerSettingsRepository } from '@/infrastructure/repositories/server/ServerSettingsRepository';
import ConditionalLayout from '@/presentation/components/ConditionalLayout';
import { Providers } from '@/presentation/components/Providers';
import { tField } from '@/domain/types/settings';

const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai',
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const repo = new ServerSettingsRepository();
  const settings = await repo.getGlobalSettings();

  return {
    title: tField(settings.metaTitle, locale) || 'المتحدة لخدمات النظافة',
    description: tField(settings.metaDescription, locale) || 'شركة المتحدة لخدمات النظافة والتعقيم والصيانة',
    icons: {
      icon: settings.faviconUrl || '/favicon.ico',
    },
    openGraph: {
      title: tField(settings.metaTitle, locale) || 'المتحدة لخدمات النظافة',
      description: tField(settings.metaDescription, locale),
      images: settings.metaGraphImage ? [{ url: settings.metaGraphImage }] : [],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const repo = new ServerSettingsRepository();
  const settings = await repo.getGlobalSettings();

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <head>
        {/* ===== Google Tag Manager (HEAD) ===== */}
        {settings.googleTagManagerId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${settings.googleTagManagerId}');`,
            }}
          />
        )}

        {/* ===== Google Analytics 4 ===== */}
        {settings.googleAnalyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.googleAnalyticsId}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}

        {/* ===== Meta / Facebook Pixel ===== */}
        {settings.metaPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${settings.metaPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}

        {/* ===== TikTok Pixel ===== */}
        {settings.tiktokPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function (w, d, t) {
                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t._i.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i.length-1;e>=0;e--)if(ttq._i[e]._u===t)return ttq._i[e];return null},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||[],ttq._i.push({_u:e,_t:Date.now(),_o:ttq._o,_h:ttq._h,_v:"1.0.0",partner:o}),ttq._o=ttq._o||{},ttq._h=ttq._h||{};var a=d.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
                  ttq.load('${settings.tiktokPixelId}');
                  ttq.page();
                }(window, document, 'ttq');
              `,
            }}
          />
        )}

        {/* ===== Snapchat Pixel ===== */}
        {settings.snapchatPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
                {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
                a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
                r.src=n;var u=t.getElementsByTagName(s)[0];
                u.parentNode.insertBefore(r,u);})(window,document,
                'https://sc-static.net/scevent.min.js');
                snaptr('init', '${settings.snapchatPixelId}', {});
                snaptr('track', 'PAGE_VIEW');
              `,
            }}
          />
        )}

        {/* ===== Custom Head Code ===== */}
        {settings.customHeadCode && (
          <div dangerouslySetInnerHTML={{ __html: settings.customHeadCode }} />
        )}
      </head>
      <body className={`${almarai.variable} font-sans`}>
        {/* ===== GTM noscript ===== */}
        {settings.googleTagManagerId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {/* JSON-LD Schemas */}
        {settings.websiteSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: settings.websiteSchema }}
          />
        )}
        {settings.organizationSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: settings.organizationSchema }}
          />
        )}

        {/* CSS Variables for brand colors */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${settings.primaryColor || '#0A2463'};
            --secondary: ${settings.secondaryColor || '#3E92CC'};
          }
        ` }} />

        <Providers enableDarkMode={!!settings.enableDarkMode}>
          <ConditionalLayout settings={settings} currentLocale={locale}>
            {children}
          </ConditionalLayout>
        </Providers>

        {/* ===== Custom Body Code (end of body) ===== */}
        {settings.customBodyCode && (
          <div dangerouslySetInnerHTML={{ __html: settings.customBodyCode }} />
        )}
      </body>
    </html>
  );
}
