import type { Metadata } from "next";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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

export const metadata: Metadata = {
  title: { default: "Under the Surface — A field guide to the unseen", template: "%s — Under the Surface" },
  description: "An independent digital magazine exploring hidden worlds, from dark oceans to deep time.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#content" className="skip-link">Skip to content</a>
        <SiteInteractions /><RouteCurtain /><ReadingModeSync />
        <Header />
        <main id="content" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
