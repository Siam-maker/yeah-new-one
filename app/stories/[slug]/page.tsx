import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { articles, articleSectionId, readingMinutes } from "@/lib/content/articles";
import { labs, topics } from "@/lib/content/publication";
import { RecordVisit, ReadingModeButton } from "@/components/publishing/reading-preferences";
import { ZoomFigure } from "@/components/publishing/zoom-figure";
import { ArticleContents, ArticleControls, ReadableArticle } from "@/components/editorial/article-controls";
import { Breadcrumbs, ReferenceList, SectionHeading, StoryTiles, TextLink } from "@/components/editorial/ui";
import { ScienceDiagram } from "@/components/editorial/diagram";
import { OceanLab } from "@/components/science/ocean-lab";
import { DisciplineInstrument } from "@/components/science/discipline-instrument";
import { PlateLab } from "@/components/science/plate-lab";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  return article ? { title: article.title, description: article.deck, openGraph: { type: "article" } } : {};
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const topic = topics.find((item) => item.slug === article.topic);
  const experiment = labs.find((item) => item.slug === article.experiment);
  const related = [...articles.filter((item) => item.topic === article.topic && item.slug !== slug),
    ...articles.filter((item) => item.topic !== article.topic)].slice(0, 3);

  return <div className="shell">
    <ReadableArticle><RecordVisit type="stories" title={article.title} href={`/stories/${slug}`} />
      <div className="story-spread">
      <header className="article-hero editorial-paper">
        <Breadcrumbs items={[{ label: "Journal", href: "/stories" }, { label: article.title }]} />
        <p className="mono section-label mt-5">{topic?.title} · {readingMinutes(article)} min read</p>
        <h1>{article.title}</h1><p className="standfirst">{article.deck}</p>
        <ArticleControls slug={slug} title={article.title} />
        <div className="mt-3"><ReadingModeButton /></div>
      </header>
      <ZoomFigure source={article.image} caption={article.imageDescription} />
      </div>
      <div className="article-grid layout-flow">
        <ArticleContents sections={[...article.sections.map(({ title }, index)=>({ id:articleSectionId(index),title })),{ id:"sources",title:"References" }]} />
        <div className="article-body">
          {article.sections.map(({ title, paragraphs }, index) => <section key={title} id={articleSectionId(index)}>
            <h2>{title}</h2>
            {paragraphs.map((paragraph) => <p key={paragraph.slice(0, 55)}>{paragraph}</p>)}
            {index === 1 && <blockquote>{article.deck}</blockquote>}
            {index === 0 && <ScienceDiagram kind={article.diagram} />}
            {slug === "the-light-that-took-its-time" && index === 1 && <figure className="science-figure observation-figure">
              <Image src="/images/milky-way-msx.webp" width={500} height={500} alt="Infrared observations showing bright and dark features in the centre of the Milky Way." />
              <figcaption>Milky Way centre at 21.34 μm. Grayscale display of MSX / SPIRIT III infrared measurements from AFRL, distributed with Astropy’s sample data. Display uses an asinh contrast stretch. <a href="https://github.com/astropy/astropy-data/blob/gh-pages/galactic_center/gc_msx_e.fits">FITS source</a>.</figcaption>
            </figure>}
          </section>)}
          {experiment && <aside className="pane mt-6"><h2 className="subhead">In the lab</h2>
            <p>{experiment.description}</p><TextLink href={`/lab/${experiment.slug}`}>{experiment.title}</TextLink>
          </aside>}
          {["reading-a-warmer-world", "fossils-are-a-sample", "the-maps-behind-coastal-risk"].includes(slug) && <div className="article-model mt-6"><DisciplineInstrument slug={article.topic} /></div>}
          {slug === "life-below-the-light" && <div className="article-model mt-6 grid gap-4"><OceanLab /></div>}
          {slug === "tectonic-plates-in-motion" && <div className="article-model mt-6"><PlateLab compact /></div>}
          <section id="sources"><h2>References</h2><ReferenceList keys={article.sources} /><div className="mt-5"><TextLink href={`/connections?node=story-${slug}`}>Follow this story’s citations on the graph</TextLink></div></section>
        </div>
      </div>
    </ReadableArticle>
    <section className="layout-flow related-stories"><SectionHeading title="Related stories" href={topic ? `/topics/${topic.slug}` : "/stories"} linkLabel={topic?.title ?? "Browse the journal"} /><StoryTiles slugs={related.map((item) => item.slug)} /></section>
  </div>;
}
