import type { Metadata } from "next";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/space-grotesk";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-600.css";
import { Header } from "@/components/layout/header";
import { searchEntries } from "@/lib/content/search";
import { Footer } from "@/components/layout/footer";
import { ReadingModeSync } from "@/components/publishing/reading-preferences";
import { SiteInteractions } from "@/components/motion/site-interactions";
import "./globals.css";
import "./publication.css";
import "./science.css";
import "./edition.css";
import "./universe.css";
import "./population.css";
import "./exploration.css";

export const metadata: Metadata = {
  title: { default: "Under the Surface — A field guide to the unseen", template: "%s — Under the Surface" },
  description: "An independent digital magazine exploring hidden worlds, from dark oceans to deep time.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#content" className="skip-link">Skip to content</a>
        <SiteInteractions /><ReadingModeSync />
        <Header entries={searchEntries} />
        <main id="content" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
