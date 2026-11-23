import type { Metadata } from "next";
import { Suspense } from "react";
import { WorldViewer } from "@/components/science/world-viewer";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Masthead, TextLink } from "@/components/editorial/ui";
import { ExhibitImage } from "@/components/editorial/exhibit-image";

export const metadata: Metadata = {title:"3D World",description:"Explore the ocean, rocks, the solar system, and a geographic Earth through interactive scientific models."};

const exhibits = [
  {title:"Descend through the ocean", subject:"Oceanography", href:"/lab/ocean-depth", image:"/images/ocean-column.webp",description:"Control depth and compare the light, pressure, and organisms of five zones."},
  {title:"Look inside Earth", subject:"Geology", href:"/atlas#earth-interior", image:"/images/weathered-section.webp",description:"Rotate a cutaway and inspect the crust, mantle, and core."},
  {title:"Orbit the Sun", subject:"Astronomy", href:"/lab/observatory", image:"/images/observatory.webp",description:"Advance the clock in a model solar system and inspect the planets."},
  {title:"Survey a changing planet", subject:"Geography", href:"/atlas?view=globe", image:"/data/bathymetry.webp",description:"Rotate a globe with real Atlas layers, including ocean depth, biodiversity, and population."},
];

export default function WorldPage() {
  return <div className="shell world-directory">
    <Masthead title="Enter the 3D World" category="Scientific environments"
      description="Choose one environment. Controls and an illustrated alternative are available with each experience." />
    <Suspense fallback={<p role="status">Loading the exhibit…</p>}><WorldViewer /></Suspense>
    <h2 className="subhead">Explore the full exhibits</h2>
    <div className="world-directory-grid">{exhibits.map((item) => <Link href={item.href} className="world-link" key={item.href}>
      <ExhibitImage src={item.image} alt="" fill sizes="(max-width:760px) 92vw, 46vw" />
      <div><p className="mono">{item.subject}</p><h2>{item.title}</h2><p>{item.description}</p></div><ArrowUpRight aria-hidden="true" />
    </Link>)}</div>
    <div className="pill-row"><TextLink href="/lab">All experiments</TextLink><TextLink href="/learn">Guided science courses</TextLink></div>
  </div>;
}
