import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { Masthead, ReferenceList, SectionHeading, TextLink } from "@/components/editorial/ui";
import { ScienceDiagram } from "@/components/editorial/diagram";
import { labs } from "@/lib/content/publication";

export const metadata: Metadata = { title: "The Lab", description: "Three interactive worlds and twelve experiments in oceanography, geology, climate, astronomy and demography." };

const worlds = [
  { name:"Below the light", discipline:"Oceanography", image:"/images/ocean-column.webp", href:"/lab/ocean-depth", description:"Descend from the sunlit surface to the trenches." },
  { name:"The geological Earth", discipline:"Geology", image:"/images/rift.webp", href:"/lab/geological-cross-section", description:"Read an exposed rock sequence from the bottom up." },
  { name:"The cosmic observatory", discipline:"Astronomy", image:"/images/observatory.webp", href:"/lab/observatory", description:"Advance the orbital clock and measure the travel time of light." },
];

export default function LabPage() {
  return <div className="shell">
    <Masthead title="The Lab" category="Interactive science" description="Change a variable, watch what happens, and compare the model with what scientists observe." />
    <div className="layout-flow">
      <section><SectionHeading title="Three worlds" />
        <div className="world-collection">{worlds.map((world) => <Link href={world.href} className="world-link" key={world.href}>
          <Image src={world.image} alt="" fill sizes="(max-width: 620px) 100vw, 35vw" /><div><p className="mono">{world.discipline}</p><h3>{world.name}</h3><p>{world.description}</p></div><ArrowUpRight size={23} aria-hidden="true" />
        </Link>)}</div></section>
      <section><SectionHeading title="Choose an experiment" />
        <ul className="experiment-index">{labs.map((lab) => <li key={lab.slug}>
          <Link href={`/lab/${lab.slug}`}><span className="mono">{lab.discipline}</span><h3>{lab.title}</h3><p>{lab.description}</p><ArrowUpRight size={19} aria-hidden="true" /></Link>
        </li>)}</ul></section>
      <div className="two-panel"><ScienceDiagram kind="plates" /><section className="pane">
        <h2 className="subhead">Reading a model</h2>
        <p className="editorial-text">Our models isolate a relationship so it is easier to see. The Earth’s actual rates, materials, and shapes vary. Compare a schematic with mapped evidence for a particular location.</p>
        <div className="mt-4"><TextLink href="/atlas">Find plate boundaries in the Atlas</TextLink></div>
        <div className="mt-5"><ReferenceList keys={["plates", "time", "pressure"]} /></div>
      </section></div>
    </div>
  </div>;
}
