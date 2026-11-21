import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { articles, readingMinutes } from "@/lib/content/articles";
import { fieldNotes } from "@/lib/content/field-notes";
import { topics } from "@/lib/content/publication";
import { getNewsletterEndpoint } from "@/lib/newsletter";
import { Newsletter } from "@/components/publishing/newsletter";
import { PressureInstrument } from "@/components/science/discipline-instrument";
import { AtlasWindow, DisciplineExplorer, FeatureSequence } from "./edition-controls";
import { TextLink } from "./ui";

const highlights = [
  { slug: "life-below-the-light", label: "Ocean & marine life" },
  { slug: "the-memory-of-rock", label: "Earth & geology" },
  { slug: "reading-a-warmer-world", label: "Climate & atmosphere" },
];

const latest = ["reading-a-warmer-world", "fossils-are-a-sample", "the-maps-behind-coastal-risk"];

export function HomeIssue() {
  const chapters = highlights.flatMap(({ slug, label }) => {
    const article = articles.find((item) => item.slug === slug);
    return article ? [{ slug, label, title: article.title, deck: article.deck, image: article.image }] : [];
  });

  return <div className="edition-body">
    <section className="edition-manifesto" id="introduction" tabIndex={-1}>
      <div className="shell manifesto-layout">
        <div className="chapter-tag mono"><b>01</b> Introduction</div>
        <div data-reveal="handoff"><h2>There’s more beneath<br /> <em>what we see.</em></h2>
          <p>Light in the deep ocean. Air trapped in ancient ice. Continents that move a few centimetres a year. Follow the evidence into the parts of our world that rarely come into view.</p>
        </div>
      </div>
    </section>

    <section className="shell edition-section" id="discoveries" tabIndex={-1}>
      <div className="edition-section-head" data-reveal="handoff">
        <div><div className="chapter-tag mono"><b>02</b> Discoveries</div><h2>Into the unseen.</h2></div>
        <TextLink href="/explore">Explore the index</TextLink>
      </div>
      <FeatureSequence chapters={chapters} />
    </section>

    <section className="edition-universe">
      <div className="shell edition-section">
        <div className="edition-section-head" data-reveal="handoff">
          <div><div className="chapter-tag mono"><b>03</b> Disciplines</div><h2>Seven ways to look.</h2></div>
          <TextLink href="/topics">All disciplines</TextLink>
        </div>
        <DisciplineExplorer items={topics.map(({ slug, title, image, theme, intro }) => ({ slug, title, image, theme, intro }))} />
      </div>
    </section>

    <section className="edition-atlas">
      <div className="shell edition-section">
        <div className="edition-section-head" data-reveal="handoff">
          <div><div className="chapter-tag mono"><b>04</b> Field atlas</div><h2>A planet in layers.</h2></div>
          <p>Read the same planet through different evidence, from seafloor topography to climate observations.</p>
        </div>
        <AtlasWindow />
      </div>
    </section>

    <section className="shell edition-section edition-journal">
      <div className="edition-section-head" data-reveal="handoff">
        <div><div className="chapter-tag mono"><b>05</b> Research & stories</div><h2>The latest evidence.</h2></div>
        <TextLink href="/stories">Visit the journal</TextLink>
      </div>
      <div className="edition-journal-layout">
        <div className="edition-journal-lead">
          <Image src="/images/ice-margin.webp" alt="Editorial illustration of a glacial ice margin." fill sizes="(max-width:760px) 92vw, 51vw" />
          <Link href="/stories/reading-a-warmer-world">Read the cover story <ArrowUpRight size={21} aria-hidden="true" /></Link>
        </div>
        <div className="edition-journal-list">{latest.map((slug) => {
          const article = articles.find((item) => item.slug === slug);
          if (!article) return null;
          return <article key={slug} data-reveal="story"><p className="mono">{readingMinutes(article)} min read</p><h3><Link href={`/stories/${slug}`}>{article.title}</Link></h3><p>{article.deck}</p></article>;
        })}</div>
      </div>
    </section>

    <section className="edition-lab">
      <div className="shell edition-section edition-lab-layout">
        <div>
          <div className="chapter-tag mono"><b>06</b> Interactive laboratory</div><h2>Feel the weight<br /> of the ocean.</h2>
          <p>Change the depth and compare the pressure. Each layer puts a different weight of seawater above you.</p>
          <TextLink href="/lab/ocean-depth">Enter the underwater lab</TextLink>
        </div>
        <PressureInstrument />
      </div>
    </section>

    <section className="shell edition-section">
      <div className="edition-section-head" data-reveal="handoff">
        <div><div className="chapter-tag mono"><b>07</b> Exploration archive</div><h2>Follow a question.</h2></div>
        <TextLink href="/library">Your reading desk</TextLink>
      </div>
      <form className="archive-finder" action="/search">
        <label className="sr-only" htmlFor="archive-query">Search the archive</label>
        <Search size={24} aria-hidden="true" />
        <input id="archive-query" type="search" name="q" placeholder="Search articles, topics or places" />
        <button className="button button-accent" type="submit">Search <ArrowRight size={20} aria-hidden="true" /></button>
      </form>
      <ol className="archive-notes">{fieldNotes.map((note) => <li key={note.id}>
        <Link href={`/field-notes#${note.id}`}><span className="mono">{note.discipline}</span><strong>{note.title}</strong><ArrowUpRight size={17} aria-hidden="true" /></Link>
      </li>)}</ol>
    </section>

    <section className="edition-finale">
      <div className="finale-image"><Image src="/images/ocean-column.webp" alt="" fill sizes="100vw" /></div>
      <div className="shell finale-content" data-reveal="handoff">
        <div className="chapter-tag mono"><b>08</b> Continue exploring</div>
        <h2>Keep looking.</h2>
        <TextLink href="/field-notes">Read the field notes</TextLink>
      </div>
    </section>
    <div className="shell"><Newsletter enabled={Boolean(getNewsletterEndpoint())} /></div>
  </div>;
}
