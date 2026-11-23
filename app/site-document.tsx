import type { Metadata } from "next";
import { direction, htmlLanguage, type Locale } from "@/lib/i18n/routing";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import { SkipLink } from "@/components/layout/language-switch";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OfflineRegistration } from "@/components/publishing/offline-reading";
import { ReadingModeSync } from "@/components/publishing/reading-preferences";
import { SiteInteractions } from "@/components/motion/site-interactions";
import { RouteCurtain } from "@/components/motion/route-curtain";
import "./globals.css";
import "./publication.css";
import "./science.css";
import "./edition.css";
import "./universe.css";
import "./population.css";
import "./exploration.css";
import "./reconstruction.css";
import "./cinema.css";
import "./learning.css";

export const siteMetadata: Metadata = {
  manifest:"/manifest.webmanifest",
  metadataBase: new URL("https://yeah-new-one.vercel.app"),
  title: { default: "Under the Surface — Explore science, data, and interactive worlds", template: "%s — Under the Surface" },
  description: "Explore oceans, geology, climate, life, space, and population through science stories, guided learning, data, and interactive models.",
};

export function SiteDocument({ children, locale }: Readonly<{ children: React.ReactNode; locale: Locale }>) {
  return (
    <html lang={htmlLanguage(locale)} dir={direction(locale)}>
      <body>
        <SkipLink locale={locale} />
        <SiteInteractions /><RouteCurtain /><ReadingModeSync /><OfflineRegistration />
        <Header />
        <main id="content" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
