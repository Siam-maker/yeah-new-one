import { ArrowDown, ArrowUpRight, Globe2, Orbit, Radio, Waves } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { discoveries, stories, topics } from "@/lib/editorial";

const topicIcons = { earth: Globe2, waves: Waves, orbit: Orbit, signal: Radio };

export function Discoveries() {
  return (
    <section id="discoveries" tabIndex={-1} className="editorial-section shell" aria-labelledby="discoveries-title">
      <div className="section-heading" data-reveal="section">
        <div>
          <p className="section-label mono"><span className="status-dot" /> From the field</p>
          <h2 id="discoveries-title" className="section-title">FEATURED DISCOVERIES</h2>
        </div>
        <Link href="/explore" className="editorial-link mono">Explore the index <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
      <div className="discovery-grid">
        {discoveries.map(({ category, title, description, image, alt, position }) => (
          <article key={title} className="discovery-card" data-reveal="discovery" data-pointer="tilt">
            <div className="discovery-surface">
              <div className="discovery-image">
                <div className="discovery-media">
                  <Image src={image} alt={alt} fill style={{ objectPosition: position }} sizes="(max-width: 700px) 92vw, (max-width: 1000px) 29vw, 35vw" />
                </div>
                <span className="card-category mono">{category}</span>
              </div>
              <div className="discovery-copy"><h3>{title}</h3><p>{description}</p></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Topics() {
  return (
    <section className="editorial-section topic-band" aria-labelledby="topics-title">
      <div className="shell">
        <div className="section-heading" data-reveal="section">
          <div>
            <p className="section-label mono"><span className="status-dot" /> Browse by subject</p>
            <h2 id="topics-title" className="section-title">WORLDS TO EXPLORE</h2>
          </div>
          <Link href="/topics" className="editorial-link mono">All topics <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="topic-grid" data-reveal="section">
          {topics.map(({ name, summary, icon }) => {
            const Icon = topicIcons[icon];
            return (
              <article key={name} className="topic-card">
                <Icon size={29} strokeWidth={1.4} aria-hidden="true" />
                <h3>{name}</h3>
                <p>{summary}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Stories() {
  return (
    <section className="editorial-section shell" aria-labelledby="stories-title">
      <div className="section-heading" data-reveal="section">
        <div>
          <p className="section-label mono"><span className="status-dot" /> The journal</p>
          <h2 id="stories-title" className="section-title">LATEST STORIES</h2>
        </div>
        <Link href="/stories" className="editorial-link mono">Visit the journal <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
      <div className="story-list">
        {stories.map(({ title, category, synopsis }) => (
          <details key={title} className="story" data-reveal="section">
            <summary>
              <span className="story-meta mono">{category}</span>
              <h3>{title}</h3>
              <span className="story-time mono">Under 1 min read</span>
              <ArrowDown size={17} aria-hidden="true" />
            </summary>
            <p>{synopsis}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
