import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { ExhibitImage } from "@/components/editorial/exhibit-image";
import Link from "next/link";
import { articles, readingMinutes } from "@/lib/content/articles";
import { fieldNotes } from "@/lib/content/field-notes";
import { journeys } from "@/lib/content/journeys";
import { topics } from "@/lib/content/publication";
import { getNewsletterEndpoint } from "@/lib/newsletter";
import { Newsletter } from "@/components/publishing/newsletter";
import { PressureInstrument } from "@/components/science/pressure-instrument";
import { AtlasWindow, DisciplineExplorer, FeatureSequence } from "./edition-controls";
import { TextLink } from "./ui";

const highlights = [
  { slug:"life-below-the-light",label:"Ocean & marine life" },
  { slug:"the-memory-of-rock",label:"Earth & geology" },
  { slug:"reading-a-warmer-world",label:"Climate & atmosphere" },
];

const latest = ["reading-a-population-pyramid","two-records-of-a-changing-ocean","fossils-are-a-sample"];

export function HomeIssue() {
  const chapters = highlights.flatMap(({ slug,label })=>{
    const article = articles.find((item)=>item.slug===slug);
    return article ? [{ slug,label,title:article.title,deck:article.deck,image:article.image }] : [];
  });

  return <div className="edition-body reconstruction-home">
    <section className="edition-manifesto editorial-paper" id="introduction" tabIndex={-1}>
      <div className="shell opening-spread">
        <div data-reveal="handoff">
          <p className="section-label">From the editors</p>
          <h2>Read the world<br /> <em>in cross-section.</em></h2>
          <p>Light in the deep ocean. Air trapped in ancient ice. Continents that move a few centimetres a year. Follow the evidence into the parts of our world that rarely come into view.</p>
        </div>
        <figure className="opening-specimen" data-reveal="plate">
          <div><ExhibitImage src="/images/weathered-section.webp" alt="Editorial illustration of sloping sediment beds and weathered ledges." fill sizes="(max-width:700px) 88vw, 32vw" /></div>
          <figcaption><span>Sedimentary layers · Editorial illustration</span><TextLink href="/stories/the-memory-of-rock">Read the story</TextLink></figcaption>
        </figure>
      </div>
    </section>

    <section className="edition-section discovery-gallery" id="discoveries" tabIndex={-1} data-discipline="ocean">
      <div className="shell edition-section-head" data-reveal="handoff">
        <div><p className="section-label">Featured discoveries</p><h2>Into the unseen.</h2></div>
        <div className="pill-row"><TextLink href="/explore">Explore the index</TextLink><TextLink href="/journeys">Take a guided journey</TextLink></div>
      </div>
      <div className="shell"><FeatureSequence chapters={chapters} /></div>
    </section>

    <section className="edition-universe discipline-room">
      <div className="shell edition-section">
        <div className="edition-section-head" data-reveal="handoff">
          <div><p className="section-label">Scientific disciplines</p><h2>Seven ways <em>to look.</em></h2></div>
          <TextLink href="/topics">All disciplines</TextLink>
        </div>
        <DisciplineExplorer items={topics.map(({ slug,title,image,theme,intro })=>({ slug,title,image,theme,intro }))} />
      </div>
    </section>

    <section className="editorial-paper journal-room" id="latest-stories">
      <div className="shell edition-section edition-journal">
        <div className="edition-section-head" data-reveal="handoff">
          <div><p className="section-label">Research & stories</p><h2>The latest evidence.</h2></div>
          <TextLink href="/stories">Visit the journal</TextLink>
        </div>
        <div className="edition-journal-layout">
          <div className="edition-journal-lead" data-reveal="plate">
            <ExhibitImage src="/images/ice-margin.webp" alt="Editorial illustration of a glacial ice margin." fill sizes="(max-width:760px) 92vw, 51vw" />
            <Link href="/stories/reading-a-warmer-world"><span>Cover story</span><strong>Reading a warmer world</strong><ArrowUpRight size={21} aria-hidden="true" /></Link>
          </div>
          <div className="edition-journal-list">{latest.map((slug)=>{
            const article = articles.find((item)=>item.slug===slug);
            return article && <article key={slug} data-reveal="story"><p>{readingMinutes(article)} min read</p>
              <h3><Link href={`/stories/${slug}`}>{article.title}</Link></h3><p>{article.deck}</p>
              <details className="story-preview"><summary>Preview<span className="sr-only"> {article.title}</span></summary>
                <p>{article.sections[0]?.paragraphs[0]}</p><TextLink href={`/stories/${slug}`}>Read the story</TextLink>
              </details></article>;
          })}</div>
        </div>
      </div>
    </section>

    <section className="edition-lab pressure-room" id="depth-lab" data-discipline="ocean">
      <div className="pressure-art"><ExhibitImage src="/images/ocean-column.webp" alt="" fill sizes="100vw" /></div>
      <div className="shell edition-section edition-lab-layout">
        <div>
          <p className="section-label">Interactive laboratory</p><h2>Feel the weight<br /> <em>of the ocean.</em></h2>
          <p>Change the depth and compare the pressure. Each layer puts a different weight of seawater above you.</p>
          <TextLink href="/lab/ocean-depth">Enter the underwater lab</TextLink>
          <div className="world-quicklinks"><TextLink href="/lab/geological-cross-section">Read the rock</TextLink><TextLink href="/lab/observatory">Enter the observatory</TextLink></div>
        </div>
        <PressureInstrument />
      </div>
    </section>

    <section className="edition-atlas atlas-room">
      <div className="shell edition-section">
        <div className="edition-section-head" data-reveal="handoff">
          <div><p className="section-label">Field atlas</p><h2>A planet <em>in layers.</em></h2></div>
          <p>Read the same planet through different evidence, from seafloor topography to climate observations.</p>
        </div>
        <AtlasWindow />
        <div className="world-quicklinks"><TextLink href="/demographics">Explore population and age structure</TextLink><TextLink href="/demographics?year=2050">Compare projections</TextLink></div>
        <div className="evidence-strip evidence-strip-grid">
          <Link href="/lab/ocean-depth"><span>11,000 m</span><small>Depth explorer range</small><ArrowUpRight size={17} aria-hidden="true" /></Link>
          <Link href="/atlas?layer=climate&year=1880"><span>1880</span><small>First year in the temperature record</small><ArrowUpRight size={17} aria-hidden="true" /></Link>
          <Link href="/demographics?year=1950"><span>1950</span><small>Start of the UN population series</small><ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>

    <section className="editorial-paper journey-room">
      <div className="shell edition-section">
        <div className="edition-section-head" data-reveal="handoff"><div><p className="section-label">Guided expeditions</p><h2>Choose your route.</h2></div><TextLink href="/journeys">All journeys</TextLink></div>
        <div className="journey-spread">
          <Link className="journey-cover-link" href="/journeys?route=mariana" data-reveal="plate"><ExhibitImage src="/images/deep-sea.webp" alt="" fill sizes="(max-width:760px) 92vw,48vw" />
            <span>Into the Mariana Trench <ArrowUpRight size={19} aria-hidden="true" /></span>
          </Link>
          <ol>{journeys.map((journey)=><li key={journey.id}><Link href={`/journeys?route=${journey.id}`}><h3>{journey.title}</h3><p>{journey.introduction}</p><ArrowUpRight size={17} aria-hidden="true" /></Link></li>)}</ol>
        </div>
      </div>
    </section>

    <section className="edition-section connection-room">
      <div className="shell connection-spread">
        <div data-reveal="handoff">
          <p className="section-label">The knowledge graph</p><h2>One question<br /> <em>leads to another.</em></h2>
          <p>Trace a story back to its sources, find a nearby concept, or try an experiment that tests it.</p>
          <TextLink href="/connections">Explore the connections</TextLink>
        </div>
        <div className="connection-reading">
          <Link href="/connections?node=topic-ocean-life">Ocean & marine life <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/connections?node=story-life-below-the-light">Life below the light <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/connections?node=term-bioluminescence">Bioluminescence <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>

    <section className="shell edition-section">
      <div className="edition-section-head" data-reveal="handoff">
        <div><p className="section-label">Field notes and archive</p><h2>Follow a question.</h2></div>
        <TextLink href="/library">Your reading desk</TextLink>
      </div>
      <form className="archive-finder" action="/search">
        <label className="sr-only" htmlFor="archive-query">Search the archive</label>
        <Search size={24} aria-hidden="true" />
        <input id="archive-query" type="search" name="q" placeholder="Search articles, topics or places" />
        <button className="button button-accent" type="submit">Search <ArrowRight size={20} aria-hidden="true" /></button>
      </form>
      <ol className="archive-notes">{fieldNotes.map((note)=><li key={note.id}>
        <Link href={`/field-notes#${note.id}`}><span>{note.discipline}</span><strong>{note.title}</strong><ArrowUpRight size={17} aria-hidden="true" /></Link>
      </li>)}</ol>
    </section>

    <section className="edition-finale">
      <div className="finale-image"><ExhibitImage src="/images/observatory.webp" alt="" fill sizes="100vw" /></div>
      <div className="shell finale-content" data-reveal="handoff">
        <h2>Keep <em>looking.</em></h2><TextLink href="/field-notes">Read the field notes</TextLink>
      </div>
    </section>
    <div className="dispatch-room"><div className="shell"><Newsletter enabled={Boolean(getNewsletterEndpoint())} /></div></div>
  </div>;
}
