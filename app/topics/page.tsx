import type { Metadata } from "next";
import { Masthead, SectionHeading, Tile, TopicIndex } from "@/components/editorial/ui";
import { topics } from "@/lib/content/publication";

export const metadata: Metadata = { title: "Topics", description: "Four scientific fields from darkness in the ocean to astronomical time." };

export default function TopicsPage() {
  return <div className="shell">
    <Masthead title="Worlds to explore" category="Topics" description="Four paths through the publication. Each topic introduces the science, its evidence, and places to dig deeper." />
    <div className="layout-flow">
      <section><SectionHeading title="The field guide" /><TopicIndex /></section>
      <div className="editorial-tiles">{topics.slice(0, 3).map((topic) => <Tile key={topic.slug} title={topic.title} image={topic.image} href={`/topics/${topic.slug}`} meta="Topic guide" description={topic.intro} />)}</div>
    </div>
  </div>;
}
