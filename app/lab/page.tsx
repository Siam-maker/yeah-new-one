import type { Metadata } from "next";
import { LabTiles, Masthead, ReferenceList, SectionHeading, TextLink } from "@/components/editorial/ui";
import { ScienceDiagram } from "@/components/editorial/diagram";

export const metadata: Metadata = { title: "The Lab", description: "Interactive science exhibits about ocean depth, deep time, and plate tectonics." };

export default function LabPage() {
  return <div className="shell">
    <Masthead title="The Lab" category="Interactive science" description="Change a variable, watch what happens, and compare the model with what scientists observe." />
    <div className="layout-flow">
      <section><SectionHeading title="Choose an experiment" /><LabTiles /></section>
      <div className="two-panel"><ScienceDiagram kind="plates" /><section className="pane">
        <h2 className="subhead">Reading a model</h2>
        <p className="editorial-text">Our models isolate a relationship so it is easier to see. The Earth’s actual rates, materials, and shapes vary. Compare a schematic with mapped evidence for a particular location.</p>
        <div className="mt-4"><TextLink href="/atlas">Find plate boundaries in the Atlas</TextLink></div>
        <div className="mt-5"><ReferenceList keys={["plates", "time", "pressure"]} /></div>
      </section></div>
    </div>
  </div>;
}
