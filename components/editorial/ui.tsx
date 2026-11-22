import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ExhibitImage } from "@/components/editorial/exhibit-image";
import type { ReactNode } from "react";
import { articles, readingMinutes } from "@/lib/content/articles";
import { labs, sources, topics, type SourceKey } from "@/lib/content/publication";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return <nav aria-label="Breadcrumbs" className="breadcrumbs">
    <Link href="/">Home</Link>
    {items.map(({ label, href }) => <span className="inline-flex items-center gap-2" key={label}>
      <ChevronRight size={14} aria-hidden="true" />
      {href ? <Link href={href}>{label}</Link> : <span aria-current="page">{label}</span>}
    </span>)}
  </nav>;
}

export function Masthead({ title, description, category, crumbs }: {
  title: string; description: string; category?: string; crumbs?: Crumb[];
}) {
  return <header className="page-masthead">
    {crumbs && <Breadcrumbs items={crumbs} />}
    {category && <p className="mono section-label mt-5">{category}</p>}
    <h1 className="display-title">{title}</h1>
    <p className="standfirst">{description}</p>
  </header>;
}

export function SectionHeading({ label, title, href, linkLabel, id }: {
  label?: string; title: string; href?: string; linkLabel?: string; id?: string;
}) {
  return <div className="section-heading" data-reveal="section">
    <div>{label && <p className="mono section-label">{label}</p>}<h2 className="section-title" id={id}>{title}</h2></div>
    {href && <TextLink href={href}>{linkLabel}</TextLink>}
  </div>;
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="editorial-link">{children} <ArrowUpRight size={17} aria-hidden="true" /></Link>;
}

export function ReferenceList({ keys }: { keys: readonly SourceKey[] }) {
  return <ul className="reference-list">
    {keys.map((key) => { const source = sources[key]; return <li key={key}>
      <a href={source.url}>{source.title}</a><span>{source.name}</span>
    </li>; })}
  </ul>;
}

export function Tile({ title, image, href, meta, description }: { title: string; image: string; href: string; meta: string; description: string }) {
  return <Link className="editorial-tile" href={href}>
    <div className="tile-image"><ExhibitImage src={image} alt="" fill sizes="(max-width: 430px) 90vw,(max-width: 760px) 45vw, 31vw" /></div>
    <div className="tile-copy"><p className="mono tile-meta">{meta}</p><h3>{title}</h3><p className="editorial-text">{description}</p></div>
  </Link>;
}

export function StoryTiles({ slugs }: { slugs?: readonly string[] }) {
  return <div className="editorial-tiles">{articles.filter((article) => !slugs || slugs.includes(article.slug)).map((article) => (
    <Tile key={article.slug} title={article.title} href={`/stories/${article.slug}`} image={article.image}
      meta={`${topics.find(({ slug }) => slug === article.topic)?.title} · ${readingMinutes(article)} min read`} description={article.deck} />
  ))}</div>;
}

export function LabTiles() {
  return <div className="editorial-tiles">{labs.map((lab) => (
    <Tile key={lab.slug} title={lab.title} href={`/lab/${lab.slug}`} image={lab.image} meta={lab.discipline} description={lab.description} />
  ))}</div>;
}

export function TopicIndex() {
  return <ol className="field-index">{topics.map((topic, index) => <li key={topic.slug}>
    <Link href={`/topics/${topic.slug}`}>
      <span className="mono field-count">0{index + 1}</span><h3>{topic.title}</h3><span className="editorial-text">{topic.intro}</span><ArrowUpRight size={23} aria-hidden="true" />
    </Link>
  </li>)}</ol>;
}
