import type { Metadata } from "next";
import Image from "next/image";
import { LabTiles, Masthead, SectionHeading, StoryTiles, TextLink, TopicIndex } from "@/components/editorial/ui";

export const metadata: Metadata = { title: "Explore", description: "An editorial index to discoveries about dark oceans, deep time, and hidden signals." };

export default function ExplorePage() {
  return <div className="shell">
    <Masthead title="Explore" category="Field guide / Issue 001" description="Start with a discovery, follow a question into the journal, or test it in the lab." />
    <div className="layout-flow">
      <section aria-label="Start with the ocean"><div className="feature-split">
        <div className="feature-art"><Image src="/images/ocean-column.webp" alt="Illustration of a luminous jellyfish in dark water." fill sizes="(max-width: 760px) 90vw, 55vw" /></div>
        <div className="feature-text"><p className="mono section-label">Field dispatch</p><h3>Beyond sunlight</h3>
          <p className="editorial-text">Read how light, pressure, and marine life change as the water grows deeper.</p><TextLink href="/topics/ocean-life">Explore ocean life</TextLink>
        </div>
      </div></section>
      <section><SectionHeading title="By field" href="/topics" linkLabel="Topic index" /><TopicIndex /></section>
      <section><SectionHeading title="Follow a story" href="/stories" linkLabel="The journal" /><StoryTiles slugs={["life-below-the-light", "the-memory-of-rock", "what-the-ice-keeps"]} /></section>
      <section><SectionHeading title="Try an experiment" href="/lab" linkLabel="All labs" /><LabTiles /></section>
    </div>
  </div>;
}
