import type { Metadata } from "next";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource-variable/space-grotesk";
import "@fontsource/ibm-plex-mono/latin-400.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SiteInteractions } from "@/components/motion/site-interactions";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Under the Surface — A field guide to the unseen", template: "%s — Under the Surface" },
  description: "An independent digital magazine exploring hidden worlds, from dark oceans to deep time.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#content" className="skip-link">Skip to content</a>
        <SiteInteractions />
        <Header />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
