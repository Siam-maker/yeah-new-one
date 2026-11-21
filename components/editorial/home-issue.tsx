import { ArrowDown, ArrowDownRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/content/articles";
import { PressureGauge } from "@/components/science/ocean-lab";
import { ScienceDiagram } from "./diagram";
import { SectionHeading, StoryTiles, TextLink, TopicIndex } from "./ui";

export function HomeIssue() {
  return <>
    <section id="discoveries" tabIndex={-1} className="editorial-section issue-line">
      <div className="shell">
        <SectionHeading label="The field journal / Issue 001" title="Featured discoveries" href="/explore" linkLabel="Explore the index" />
        <div className="feature-split" data-reveal="discovery">
          <Link className="feature-art discovery-image" href="/stories/life-below-the-light" aria-label="Read Life below the light" data-pointer="tilt">
            <div className="discovery-media"><Image src="/images/ocean-column.webp" alt="" fill sizes="(max-width: 760px) 93vw, 55vw" /></div>
          </Link>
          <div className="feature-text discovery-copy">
            <p className="mono feature-callout">Ocean & life / Featured story</p>
            <h3>Life below<br />the light</h3>
            <p className="editorial-text">At the edge of sunlight, light changes from something to live by into something animals can make.</p>
            <TextLink href="/stories/life-below-the-light">Read the feature</TextLink>
          </div>
        </div>
      </div>
    </section>

    <section className="expedition-band">
      <div className="shell expedition-inner" data-reveal="section">
        <div className="expedition-copy">
          <p className="mono section-label">Interactive expedition</p>
          <h2 className="section-title">Follow the<br />water down.</h2>
          <p className="standfirst">From the sunlit surface to the hadal trenches, travel through five ocean environments and compare the life each one supports.</p>
          <Link className="button button-accent" href="/lab/ocean-depth" data-pointer="magnetic"><span className="button-content">Enter the depth lab <ArrowDownRight size={20} aria-hidden="true" /></span></Link>
        </div>
        <div className="band-image"><Image src="/images/deep-sea.webp" alt="Illustration of a jellyfish with luminous blue tentacles." fill sizes="(max-width: 760px) 92vw, 55vw" style={{ objectPosition: "50% 45%" }} /></div>
      </div>
    </section>

    <section className="shell editorial-section" aria-labelledby="topics-title">
      <SectionHeading label="Four fields of inquiry" title="Worlds to explore" href="/topics" linkLabel="All topics" id="topics-title" />
      <TopicIndex />
    </section>

    <section className="data-inset">
      <div className="shell data-inner" data-reveal="section">
        <div><p className="mono section-label">Pressure / Seawater</p><h2 className="section-title">≈ 1 atm</h2><p className="editorial-text">Pressure increases by roughly one atmosphere per ten metres of seawater. In a trench, the weight of the ocean above becomes one of the main conditions for life.</p><PressureGauge /></div>
        <ScienceDiagram kind="depth" />
      </div>
    </section>

    <section className="shell editorial-section" aria-labelledby="stories-title">
      <SectionHeading label="Long-form reporting" title="Read the traces" href="/stories" linkLabel="Visit the journal" id="stories-title" />
      <div className="story-shelf"><StoryTiles slugs={["the-memory-of-rock", "what-the-ice-keeps", "the-light-that-took-its-time"]} /></div>
    </section>

    <section className="research-band">
      <div className="shell research-inner" data-reveal="section">
        <div className="research-art"><Image src="/images/glacier.webp" alt="Illustration of layers and fractures in glacial ice." fill sizes="(max-width:760px) 93vw, 40vw" /></div>
        <div className="research-copy">
          <p className="mono section-label">How scientists know</p>
          <h2 className="section-title">Air with a past.</h2>
          <p className="standfirst">Air trapped in ice can be younger than the ice around it. That age difference changes how researchers read the record of past climates.</p>
          <TextLink href="/topics/systems-signals">Explore proxies and signals</TextLink>
        </div>
      </div>
    </section>

    <section className="atlas-band editorial-section">
      <div className="shell atlas-preview" data-reveal="section">
        <div>
          <p className="mono section-label">The scientific atlas</p><h2 className="section-title">A planet<br />in motion.</h2>
          <p className="standfirst">Find ocean basins, trenches and plate boundaries on an interactive map. Follow each location into the forces that shaped it.</p>
          <TextLink href="/atlas">Open the Atlas</TextLink>
        </div>
        <figure>
          <Image src="/images/world-map.svg" unoptimized width={720} height={360} alt="World map with plate boundaries highlighted in orange." />
          <figcaption className="mono mt-2">Plate boundaries · Bird (2003)</figcaption>
        </figure>
      </div>
    </section>

    <section className="shell editorial-section" aria-label="Latest journal entries">
      <SectionHeading label="Field notes" title="Latest from the journal" href="/stories" linkLabel="Visit the journal" />
      <div className="latest-list">
        {articles.filter(({ slug }) => ["a-night-shift-in-the-ocean", "tectonic-plates-in-motion", "the-light-that-took-its-time"].includes(slug)).map((story) =>
          <details key={story.slug} className="story" data-reveal="story">
            <summary className="latest-row"><span className="mono latest-category">Journal brief</span><h3>{story.title}</h3><span className="mono latest-time">Under 1 min read</span><ArrowDown size={19} aria-hidden="true" /></summary>
            <div className="latest-preview"><p className="editorial-text">{story.deck}</p><TextLink href={`/stories/${story.slug}`}>Read the full story</TextLink></div>
          </details>)}
      </div>
      <div className="mt-8"><TextLink href="/lab">Browse the scientific lab</TextLink></div>
    </section>
  </>;
}
