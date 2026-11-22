"use client";

import { ExhibitImage } from "@/components/editorial/exhibit-image";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers3 } from "lucide-react";
import { useRef, useState } from "react";
import type { topics } from "@/lib/content/publication";
import { useReducedMotionPreference } from "@/components/motion/preferences";

type Chapter = { slug: string; title: string; image: string; deck: string; label: string };

export function FeatureSequence({ chapters }: { chapters: Chapter[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotionPreference();

  function advance(step: number) {
    const container = track.current;
    const next = Math.max(0, Math.min(chapters.length - 1, index + step));
    const first = container?.children[0] as HTMLElement | undefined;
    const child = container?.children[next] as HTMLElement | undefined;
    if (first && child) container?.scrollTo({ left: child.offsetLeft - first.offsetLeft, behavior: reduced ? "instant" : "smooth" });
  }

  return <section className="feature-sequence" data-reveal="sequence" aria-label="Featured discovery sequence">
    <div className="sequence-track" ref={track} onScroll={() => {
      const container = track.current;
      const first = container?.children[0] as HTMLElement | undefined;
      if (!container || !first) return;
      let closest = 0;
      let distance = Number.POSITIVE_INFINITY;
      Array.from(container.children).forEach((child, position) => {
        const gap = Math.abs((child as HTMLElement).offsetLeft - first.offsetLeft - container.scrollLeft);
        if (gap < distance) { closest = position; distance = gap; }
      });
      setIndex(closest);
    }}>
      {chapters.map((chapter) => <Link href={`/stories/${chapter.slug}`} key={chapter.slug} className="sequence-item">
        <div className="sequence-image"><ExhibitImage src={chapter.image} alt="" fill sizes="(max-width:760px) 88vw, 70vw" /></div>
        <div className="sequence-copy"><p className="mono">{chapter.label}</p><h3>{chapter.title}</h3><p>{chapter.deck}</p><ArrowUpRight size={27} aria-hidden="true" /></div>
      </Link>)}
    </div>
    <div className="sequence-controls">
      <span className="mono" aria-live="polite">0{index + 1} / 0{chapters.length}</span>
      <div className="sequence-meter" aria-hidden="true"><span style={{ width: `${(index + 1) / chapters.length * 100}%` }} /></div>
      <button className="ghost-button" type="button" aria-label="Previous discovery" aria-disabled={index === 0} onClick={() => advance(-1)}><ArrowLeft size={19} /></button>
      <button className="ghost-button" type="button" aria-label="Next discovery" aria-disabled={index === chapters.length - 1} onClick={() => advance(1)}><ArrowRight size={19} /></button>
    </div>
  </section>;
}

type TopicSummary = Pick<typeof topics[number], "slug" | "title" | "theme" | "image" | "intro">;

export function DisciplineExplorer({ items }: { items: TopicSummary[] }) {
  const [index, setIndex] = useState(0);
  const item = items[index];
  return <div className="discipline-explorer" data-discipline={item.theme}>
    <div className="discipline-selector" aria-label="Select a scientific discipline">
      {items.map((topic, position) => <button type="button" key={topic.slug} aria-pressed={index === position}
        data-discipline={topic.theme} onClick={() => setIndex(position)}>
        <strong>{topic.title}</strong><ArrowUpRight size={17} aria-hidden="true" />
      </button>)}
    </div>
    <div className="discipline-preview" key={item.slug}>
      <div className="discipline-image"><ExhibitImage src={item.image} alt="" fill sizes="(max-width:850px) 92vw, 56vw" /></div>
      <div className="discipline-copy">
        <h3>{item.title}</h3><p>{item.intro}</p>
        <Link className="editorial-link" href={`/topics/${item.slug}`}>Open the topic guide <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    </div>
  </div>;
}

export function AtlasWindow() {
  const [layer, setLayer] = useState<"ocean" | "geology">("ocean");
  return <div className="atlas-window">
    <div className="atlas-window-map" role="img" aria-label={layer === "ocean" ? "Global bathymetry preview" : "Tectonic boundary preview"}>
      {layer === "ocean" && <Image src="/data/bathymetry.webp" alt="" fill unoptimized />}
      <Image src="/data/atlas-land.svg" alt="" fill unoptimized />
      {layer === "geology" && <Image src="/images/world-boundaries.svg" alt="" fill unoptimized />}
      <svg viewBox="0 0 360 180" aria-hidden="true"><path d="M0 45H360 M0 90H360 M0 135H360 M90 0V180 M180 0V180 M270 0V180" stroke="#b4e6e7" strokeWidth=".35" opacity=".3" /></svg>
    </div>
    <div className="atlas-window-toolbar"><p className="mono"><Layers3 size={15} aria-hidden="true" /> Display layer</p>
      <div className="pill-row">
        <button className="ghost-button" type="button" aria-pressed={layer === "ocean"} onClick={() => setLayer("ocean")}>Ocean depth</button>
        <button className="ghost-button" type="button" aria-pressed={layer === "geology"} onClick={() => setLayer("geology")}>Plate boundaries</button>
      </div>
      <Link className="editorial-link" href={`/atlas?layer=${layer}`}>Open the Atlas <ArrowUpRight size={17} aria-hidden="true" /></Link>
    </div>
  </div>;
}
