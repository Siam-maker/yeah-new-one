import type { Metadata } from "next";
import { Masthead, TextLink } from "@/components/editorial/ui";
import { JourneyConsole } from "@/components/exploration/journey-console";
import { journeys } from "@/lib/content/journeys";

export const metadata: Metadata = { title:"Journeys", description:"Follow guided scientific expeditions through the journal, Atlas and laboratories." };

export default async function Journeys({ searchParams }: { searchParams:Promise<{ route?:string }> }) {
  const { route } = await searchParams;
  return <div className="shell expedition-page">
    <Masthead title="Journeys beneath the surface" category="Guided expeditions" description="Choose a route through the journal, Atlas, and labs. Each stop gives you something to look for." />
    <div className="layout-flow">
      <JourneyConsole journeys={journeys} initial={typeof route === "string" ? route : journeys[0].id}/>
      <TextLink href="/connections">Follow another line of evidence in the knowledge graph</TextLink>
    </div>
  </div>;
}
