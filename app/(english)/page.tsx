import type { Metadata } from "next";
import { languageAlternates } from "@/lib/i18n/routing";
import { HomeIssue } from "@/components/editorial/home-issue";
import { EditorialMotion } from "@/components/home/editorial-motion";
import { TextLink } from "@/components/editorial/ui";
import { Hero } from "@/components/home/hero";

export const metadata: Metadata = { alternates:languageAlternates("/","en") };

export default function Home() {
  return <><Hero />
    <nav className="shell platform-pathways" aria-label="Ways to explore">
      <TextLink href="/learn">Learn a scientific topic</TextLink><TextLink href="/world">Explore the 3D world</TextLink>
      <TextLink href="/atlas">Discover scientific data</TextLink><TextLink href="/journeys">Follow guided journeys</TextLink><TextLink href="/learn/teaching">Teaching resources</TextLink>
    </nav>
    <EditorialMotion><HomeIssue /></EditorialMotion></>;
}
