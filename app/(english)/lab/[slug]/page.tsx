import { contentAlternates } from "@/lib/i18n/coverage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Masthead, ReferenceList, TextLink } from "@/components/editorial/ui";
import { experiments } from "@/components/science/lab-experiments";
import { labEvidence } from "@/lib/content/lab-evidence";
import { labs } from "@/lib/content/publication";

const disciplineThemes:Record<string,string> = {
  Oceanography:"ocean", Geology:"earth", Geophysics:"earth", Astronomy:"space", "Climate science":"climate",
  "Environmental science":"climate", Demography:"footprint", "Marine biology":"biodiversity",
};
type Props = { params: Promise<{ slug: string }> };



export function generateStaticParams() { return labs.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lab = labs.find((item) => item.slug === slug);
  return lab ? { title: lab.title, description: lab.description, alternates:contentAlternates(`/lab/${slug}`,"en") } : {};
}

export default async function LabDetail({ params }: Props) {
  const { slug } = await params;
  const lab = labs.find((item) => item.slug === slug);
  if (!lab) notFound();
  const Component = experiments[lab.slug];
  const evidence = labEvidence[lab.slug];
  return <div className="shell laboratory-page" data-discipline={disciplineThemes[lab.discipline]}>
    <Masthead title={lab.title} category={lab.discipline} description={lab.description} crumbs={[{ label: "Lab", href: "/lab" }, { label: lab.title }]} />
    <div className="layout-flow">
      <div className="grid gap-5"><Component /></div>
      <section className="two-panel"><div><h2 className="subhead">Further reading</h2><div className="link-list"><TextLink href={`/stories/${evidence.reading}`}>Read the companion story</TextLink><TextLink href={`/connections?node=lab-${lab.slug}`}>Trace this experiment’s sources</TextLink></div></div>
        <div><h2 className="subhead">References</h2><ReferenceList keys={evidence.sources} /></div></section>
    </div>
  </div>;
}
