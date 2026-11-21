import type { Metadata } from "next";
import { AtlasWindow, DisciplineExplorer, FeatureSequence } from "@/components/editorial/edition-controls";
import { Masthead, SectionHeading, TextLink } from "@/components/editorial/ui";
import { articles } from "@/lib/content/articles";
import { topics } from "@/lib/content/publication";

export const metadata: Metadata = { title: "Explore", description: "Find a discovery by place, discipline, or the evidence behind it." };

const startingPoints = [
  { slug: "life-below-the-light", label: "Bioluminescence" },
  { slug: "fossils-are-a-sample", label: "The fossil record" },
  { slug: "the-maps-behind-coastal-risk", label: "Coastal risk" },
];

export default function ExplorePage() {
  const chapters = startingPoints.flatMap(({ slug, label }) => {
    const article = articles.find((item) => item.slug === slug);
    return article ? [{ slug, label, title: article.title, deck: article.deck, image: article.image }] : [];
  });
  return <div className="shell">
    <Masthead title="Find your starting point" category="Discovery index" description="Start with a place, an artefact, or a question. Every route leads back to the evidence." />
    <div className="layout-flow">
      <section><SectionHeading title="Three discoveries" href="/stories" linkLabel="Visit the journal" /><FeatureSequence chapters={chapters} /></section>
      <section><SectionHeading title="By discipline" href="/topics" linkLabel="Topic index" />
        <DisciplineExplorer items={topics.map(({ slug, title, image, theme, intro }) => ({ slug, title, image, theme, intro }))} /></section>
      <section><SectionHeading title="By place" /><AtlasWindow /></section>
      <div className="two-panel">
        <section className="pane"><h2 className="subhead">Follow the method</h2><p className="editorial-text">Read the field notes for what a chart, fossil record, or map can establish.</p>
          <div className="mt-4"><TextLink href="/field-notes">Browse the field notes</TextLink></div></section>
        <section className="pane"><h2 className="subhead">Change a variable</h2><p className="editorial-text">Test the relationship between depth and pressure, inspect rock strata, or move the plates.</p>
          <div className="mt-4"><TextLink href="/lab">Choose an experiment</TextLink></div></section>
      </div>
    </div>
  </div>;
}
