import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Masthead, ReferenceList, TextLink } from "@/components/editorial/ui";
import { OceanLab } from "@/components/science/ocean-lab";
import { TimeLab } from "@/components/science/time-lab";
import { PlateLab } from "@/components/science/plate-lab";
import { BiodiversityLab, CarbonLab, ClimateChangeLab, CrossSectionLab, GrowthLab, LightTravelLab, PressureLab, SeismicLab, TemperatureLab } from "@/components/science/extended-labs";
import { labs } from "@/lib/content/publication";

type Props = { params: Promise<{ slug: string }> };

const experiments = {
  "ocean-depth": { Component: OceanLab, reading: "/stories/life-below-the-light", source: ["light", "pressure", "bio"] },
  "geologic-time": { Component: TimeLab, reading: "/stories/the-memory-of-rock", source: ["time", "rocks"] },
  "plate-tectonics": { Component: PlateLab, reading: "/stories/tectonic-plates-in-motion", source: ["plates", "boundaries"] },
  "ocean-pressure": { Component: PressureLab, reading: "/stories/life-below-the-light", source: ["pressure"] },
  "earthquake-waves": { Component: SeismicLab, reading: "/stories/tectonic-plates-in-motion", source: ["usgsWaves", "plates"] },
  "climate-change": { Component: ClimateChangeLab, reading: "/stories/two-records-of-a-changing-ocean", source: ["gistemp", "epaSea"] },
  "global-temperature": { Component: TemperatureLab, reading: "/stories/reading-a-warmer-world", source: ["gistemp"] },
  "carbon-emissions": { Component: CarbonLab, reading: "/stories/the-maps-behind-coastal-risk", source: ["carbon", "coasts"] },
  "population-growth": { Component: GrowthLab, reading: "/stories/reading-a-population-pyramid", source: ["unPopulation", "urban"] },
  "biodiversity-distribution": { Component: BiodiversityLab, reading: "/stories/life-below-the-light", source: ["occurrence", "light"] },
  "light-travel-time": { Component: LightTravelLab, reading: "/stories/the-light-that-took-its-time", source: ["lightSpeed", "hubble"] },
  "geological-cross-section": { Component: CrossSectionLab, reading: "/stories/the-memory-of-rock", source: ["rocks", "time"] },
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
