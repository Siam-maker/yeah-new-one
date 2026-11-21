import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Masthead, ReferenceList, TextLink } from "@/components/editorial/ui";
import { OceanLab } from "@/components/science/ocean-lab";
import { TimeLab } from "@/components/science/time-lab";
import { PlateLab } from "@/components/science/plate-lab";
import { labs } from "@/lib/content/publication";

type Props = { params: Promise<{ slug: string }> };

const experiments = {
  "ocean-depth": { Component: OceanLab, reading: "/stories/life-below-the-light", source: ["light", "pressure", "bio"] },
  "geologic-time": { Component: TimeLab, reading: "/stories/the-memory-of-rock", source: ["time", "rocks"] },
  "plate-tectonics": { Component: PlateLab, reading: "/stories/tectonic-plates-in-motion", source: ["plates", "boundaries"] },
} as const;

export function generateStaticParams() { return labs.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lab = labs.find((item) => item.slug === slug);
  return lab ? { title: lab.title, description: lab.description } : {};
}

export default async function LabDetail({ params }: Props) {
  const { slug } = await params;
  const lab = labs.find((item) => item.slug === slug);
  if (!lab) notFound();
  const { Component, reading, source } = experiments[lab.slug];
  return <div className="shell">
    <Masthead title={lab.title} category={lab.discipline} description={lab.description} crumbs={[{ label: "Lab", href: "/lab" }, { label: lab.title }]} />
    <div className="layout-flow">
      <div className="grid gap-5"><Component /></div>
      <section className="two-panel"><div><h2 className="subhead">Further reading</h2><TextLink href={reading}>Read the companion story</TextLink></div>
        <div><h2 className="subhead">References</h2><ReferenceList keys={source} /></div></section>
    </div>
  </div>;
}
