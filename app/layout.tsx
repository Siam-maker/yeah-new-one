import type { Metadata } from "next";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import { LocaleDocument } from "@/components/layout/language-switch";
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
import "./learning.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yeah-new-one.vercel.app"),
  title: { default: "Under the Surface — Explore science, data, and interactive worlds", template: "%s — Under the Surface" },
  description: "Explore oceans, geology, climate, life, space, and population through science stories, guided learning, data, and interactive models.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LocaleDocument />
        <SiteInteractions /><RouteCurtain /><ReadingModeSync />
        <Header />
        <main id="content" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
