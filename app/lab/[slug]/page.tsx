import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Masthead, ReferenceList, TextLink } from "@/components/editorial/ui";
import { OceanLab } from "@/components/science/ocean-lab";
import { TimeLab } from "@/components/science/time-lab";
import { PlateLab } from "@/components/science/plate-lab";
import { BiodiversityLab, CarbonLab, ClimateChangeLab, CrossSectionLab, GrowthLab, LightTravelLab, PressureLab, SeismicLab, TemperatureLab } from "@/components/science/extended-labs";
import { labEvidence } from "@/lib/content/lab-evidence";
import { labs } from "@/lib/content/publication";

type Props = { params: Promise<{ slug: string }> };

const experiments = {
  "ocean-depth": OceanLab,
  "geologic-time": TimeLab,
  "plate-tectonics": PlateLab,
  "ocean-pressure": PressureLab,
  "earthquake-waves": SeismicLab,
  "climate-change": ClimateChangeLab,
  "global-temperature": TemperatureLab,
  "carbon-emissions": CarbonLab,
  "population-growth": GrowthLab,
  "biodiversity-distribution": BiodiversityLab,
  "light-travel-time": LightTravelLab,
  "geological-cross-section": CrossSectionLab,
};

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
  const Component = experiments[lab.slug];
  const evidence = labEvidence[lab.slug];
  return <div className="shell">
    <Masthead title={lab.title} category={lab.discipline} description={lab.description} crumbs={[{ label: "Lab", href: "/lab" }, { label: lab.title }]} />
    <div className="layout-flow">
      <div className="grid gap-5"><Component /></div>
      <section className="two-panel"><div><h2 className="subhead">Further reading</h2><div className="link-list"><TextLink href={`/stories/${evidence.reading}`}>Read the companion story</TextLink><TextLink href={`/connections?node=lab-${lab.slug}`}>Trace this experiment’s sources</TextLink></div></div>
        <div><h2 className="subhead">References</h2><ReferenceList keys={evidence.sources} /></div></section>
    </div>
  </div>;
}
