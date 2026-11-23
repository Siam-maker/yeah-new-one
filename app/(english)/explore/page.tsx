import { datasets } from "@/lib/content/datasets";
import { CopyCitation } from "@/components/publishing/copy-citation";
import { languageAlternates } from "@/lib/i18n/routing";
import type { Metadata } from "next";
import { AtlasWindow, DisciplineExplorer, FeatureSequence } from "@/components/editorial/edition-controls";
import { Masthead, SectionHeading, TextLink } from "@/components/editorial/ui";
import { DiscoveryIndex } from "@/components/editorial/discovery-index";
import { locations } from "@/lib/content/atlas";
import { articles } from "@/lib/content/articles";
import { labs, topics } from "@/lib/content/publication";

export const metadata: Metadata = { alternates:languageAlternates("/explore","en"), title: "Explore", description: "Find a discovery by place, discipline, or the evidence behind it." };

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
  const entries = [
    ...topics.map((item) => ({ title:item.title, description:item.intro, href:`/topics/${item.slug}`, kind:"Topic", topics:[item.slug] })),
    ...articles.map((item) => ({ title:item.title, description:item.deck, href:`/stories/${item.slug}`, kind:"Story", topics:[item.topic] })),
    ...labs.map((item) => ({ title:item.title, description:item.description, href:`/lab/${item.slug}`, kind:"Experiment", topics:topics.filter((topic) => (topic.experiments as readonly string[]).includes(item.slug)).map((topic) => topic.slug) })),
    ...locations.map((item) => {
      const ocean = item.category === "Ocean basin" || item.category === "Trench";
      return { title:item.name, description:item.detail, href:`/atlas?layer=${ocean ? "ocean" : "geology"}&location=${item.id}`, kind:"Atlas location", topics:ocean ? ["ocean-life","earth-geology"] : ["earth-geology"] };
    }),
  ];
  return <div className="shell">
    <Masthead title="Find your starting point" category="Discovery index" description="Start with a place, an artefact, or a question. Every route leads back to the evidence." />
    <div className="layout-flow">
      <section><SectionHeading title="Three discoveries" href="/stories" linkLabel="Visit the journal" /><FeatureSequence chapters={chapters} /></section>
      <section><SectionHeading title="By discipline" href="/topics" linkLabel="Topic index" />
        <DisciplineExplorer items={topics.map(({ slug, title, image, theme, intro }) => ({ slug, title, image, theme, intro }))} /></section>
      <DiscoveryIndex entries={entries} filters={topics.map(({ slug,title })=>({ value:slug,label:title }))} />
      <section><SectionHeading title="By place" /><AtlasWindow /></section>
      <div className="two-panel">
        <section className="pane"><h2 className="subhead">Follow the method</h2><p className="editorial-text">Read the field notes for what a chart, fossil record, or map can establish.</p>
          <div className="mt-4"><TextLink href="/journeys">Choose a guided expedition</TextLink></div></section>
        <section className="pane"><h2 className="subhead">Change a variable</h2><p className="editorial-text">Test the relationship between depth and pressure, inspect rock strata, or move the plates.</p>
          <div className="mt-4"><TextLink href="/lab">Choose an experiment</TextLink></div></section>
      </div>
    </div>
    <section className="dataset-directory" id="datasets" aria-labelledby="dataset-heading">
      <h2 className="subhead" id="dataset-heading">Scientific datasets</h2>
      {datasets.map((dataset) => <article className="pane" key={dataset.id} id={`dataset-${dataset.id}`}>
        <p className="mono section-label">{dataset.origin}</p><h3 className="subhead">{dataset.title}</h3>
        <p>{dataset.description}</p><div className="pill-row"><a href={dataset.file} download>Download JSON</a><a href={dataset.notes}>Methodology and sources</a><CopyCitation citation={dataset.citation} /></div>
      </article>)}
    </section>
  </div>;
}
