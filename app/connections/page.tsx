import type { Metadata } from "next";
import { Masthead } from "@/components/editorial/ui";
import { KnowledgeGraph } from "@/components/exploration/knowledge-graph";
import { connectionData } from "@/lib/content/connections";

export const metadata: Metadata = { title:"Connections", description:"Explore the documented links among scientific topics, journal articles, experiments, and sources." };

export default async function Connections({ searchParams }: { searchParams:Promise<{ node?:string }> }) {
  const { node } = await searchParams;
  const { nodes,links } = connectionData();
  return <div className="shell">
    <Masthead title="Connections" category="Scientific knowledge graph" description="Follow a reference from a story to a source, trace a concept back to a discipline, or find an experiment that puts the idea to work." />
    <div className="layout-flow">
      <KnowledgeGraph nodes={nodes} links={links} initial={typeof node === "string" ? node : nodes[0].id} />
      <p className="editorial-text">Each line comes from a citation, glossary entry, discipline guide, or companion experiment. The graph shows up to nine neighbors at once. The details panel lists all direct connections for the selected type.</p>
    </div>
  </div>;
}
