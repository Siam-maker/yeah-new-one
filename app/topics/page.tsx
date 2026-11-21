import type { Metadata } from "next";
import { Masthead, TextLink } from "@/components/editorial/ui";
import { DisciplineExplorer } from "@/components/editorial/edition-controls";
import { topics } from "@/lib/content/publication";

export const metadata: Metadata = { title: "Topics", description: "Seven scientific disciplines from ocean dynamics to the human footprint." };

export default function TopicsPage() {
  return <div className="shell">
    <Masthead title="Seven ways to look" category="Scientific disciplines" description="Choose a discipline. Every guide brings together the science, the evidence, an instrument you can use, and further reading." />
    <div className="layout-flow">
      <DisciplineExplorer items={topics.map(({ slug, title, image, theme, intro }) => ({ slug, title, image, theme, intro }))} />
      <section><h2 className="subhead">Start with evidence</h2><p className="standfirst">Field notes trace the decisions behind a chart, map or observation.</p>
        <div className="mt-4"><TextLink href="/field-notes">Browse the methods and observations</TextLink></div></section>
    </div>
  </div>;
}
