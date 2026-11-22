import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Masthead, ReferenceList, StoryTiles, TextLink } from "@/components/editorial/ui";
import { ScienceDiagram } from "@/components/editorial/diagram";
import { RecordVisit } from "@/components/publishing/reading-preferences";
import { DisciplineInstrument } from "@/components/science/discipline-instrument";
import { topics, labs, termId } from "@/lib/content/publication";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return topics.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = topics.find((item) => item.slug === slug);
  return topic ? { title: topic.title, description: topic.intro } : {};
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = topics.find((item) => item.slug === slug);
  if (!topic) notFound();
  const experiments: readonly string[] = topic.experiments;

  return <div className="shell topic-dispatch" data-discipline={topic.theme}>
    <RecordVisit type="topics" title={topic.title} href={`/topics/${slug}`} />
    <div className="topic-hero">
      <Masthead title={topic.title} category="Topic guide" description={topic.intro}
        crumbs={[{ label: "Topics", href: "/topics" }, { label: topic.title }]} />
      <div className="topic-hero-image"><Image src={topic.image} alt="" fill sizes="(max-width: 760px) 92vw, 50vw" /></div>
    </div>
    <div className="layout-flow">
      <div className="two-panel"><section><h2 className="subhead">The science</h2><p className="editorial-text">{topic.background}</p>
        <h2 className="subhead mt-8">What changed our view</h2><p className="editorial-text">{topic.discoveries}</p></section>
        <ScienceDiagram kind={topic.diagram} /></div>
      <div className="two-panel"><section className="pane"><h2 className="subhead">Key concepts</h2><dl className="concept-list">
        {topic.concepts.map(({ title, text }) => <div key={title} id={`concept-${termId(title)}`}><dt>{title}</dt><dd>{text}</dd></div>)}
      </dl></section><section className="pane"><h2 className="subhead">Facts to keep</h2><ul className="list-disc space-y-3 pl-5">
        {topic.facts.map((fact) => <li key={fact}>{fact}</li>)}
      </ul><h2 className="subhead mt-8">Related experiments</h2><div className="link-list">{labs.filter((item) => experiments.includes(item.slug)).map((lab) =>
        <TextLink key={lab.slug} href={`/lab/${lab.slug}`}>{lab.title}</TextLink>)}</div></section></div>
      <section><h2 className="subhead">Read the evidence</h2><DisciplineInstrument slug={slug} /></section>
      <section><h2 className="subhead">Further reading</h2><StoryTiles slugs={topic.articles} /></section>
      <section className="topic-reference"><h2 className="subhead">References</h2><ReferenceList keys={topic.sources} /><div className="mt-5"><TextLink href={`/connections?node=topic-${slug}`}>Explore this discipline’s connections</TextLink></div></section>
    </div>
  </div>;
}
