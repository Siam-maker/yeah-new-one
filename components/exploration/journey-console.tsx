"use client";

import { ExhibitImage } from "@/components/editorial/exhibit-image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { Journey } from "@/lib/content/journeys";
import { ReferenceList } from "@/components/editorial/ui";

const key = "uts:journey-progress";
function subscribe(notify: () => void) {
  window.addEventListener(key,notify);
  window.addEventListener("storage",notify);
  return () => { window.removeEventListener(key,notify); window.removeEventListener("storage",notify); };
}
function snapshot() {
  try { return localStorage.getItem(key) ?? ""; } catch { return ""; }
}
function savedStops(value: string): string[] {
  try {
    const result: unknown = JSON.parse(value);
    return Array.isArray(result) ? result.filter((item): item is string => typeof item === "string") : [];
  } catch { return []; }
}

export function JourneyConsole({ journeys, initial }: { journeys:Journey[]; initial:string }) {
  const [current,setCurrent] = useState(initial);
  const [chosenStop,setPosition] = useState<number | null>(null);
  const [temporary,setTemporary] = useState<string[]>([]);
  const stored = useSyncExternalStore(subscribe,snapshot,()=> "");
  const completed = new Set([...savedStops(stored),...temporary]);
  const journey = journeys.find((item)=>item.id === current) ?? journeys[0];
  const firstUnfinished = journey.stops.findIndex((_,index)=>!completed.has(`${journey.id}:${index}`));
  const position = chosenStop ?? (firstUnfinished < 0 ? journey.stops.length-1 : firstUnfinished);
  const station = journey.stops[position];
  const count = journey.stops.filter((_,index)=>completed.has(`${journey.id}:${index}`)).length;
  const done = completed.has(`${journey.id}:${position}`);

  function finish() {
    setPosition(position);
    const next = [...completed,`${journey.id}:${position}`];
    try {
      localStorage.setItem(key,JSON.stringify(next));
      window.dispatchEvent(new Event(key));
    } catch { setTemporary(next); }
  }

  return <div className="journey-console" data-discipline={journey.theme}>
    <nav className="journey-selector" aria-label="Choose an expedition">
      {journeys.map((item,index)=><button className="ghost-button" key={item.id} type="button" aria-pressed={item.id===journey.id}
        onClick={() => { setCurrent(item.id);setPosition(null); }}><span className="mono">0{index+1}</span>{item.title}</button>)}
    </nav>
    <article className="journey-display">
      <ExhibitImage src={journey.image} alt="" fill sizes="(max-width:760px) 94vw, 86vw" />
      <div><p className="mono section-label">Guided expedition</p><h2 className="subhead">{journey.title}</h2><p>{journey.introduction}</p></div>
    </article>
    <div className="journey-details">
      <section className="journey-progress" aria-label="Expedition progress">
        <p className="mono section-label"><span role="status">{count} of {journey.stops.length} stops completed</span></p>
        <progress max={journey.stops.length} value={count} aria-label="Expedition progress" />
        <ol>{journey.stops.map((stop,index)=><li key={stop.href}><button className="ghost-button" type="button" aria-current={index===position ? "step" : undefined}
          onClick={()=>setPosition(index)}><span className="mono">{index+1}</span><span>{stop.title}</span>{completed.has(`${journey.id}:${index}`) && <><Check size={15} aria-hidden="true"/><span className="sr-only">Completed</span></>}</button></li>)}</ol>
      </section>
      <section className="journey-station">
        <div aria-live="polite"><p className="mono section-label">Stop {position+1} · {station.kind}</p><h3 className="subhead">{station.title}</h3><p>{station.text}</p></div>
        <Link className="editorial-link" href={station.href}>Open {station.kind.toLowerCase()} <ArrowUpRight size={17} aria-hidden="true" /></Link>
        <div className="pill-row">
          <button type="button" className="ghost-button" disabled={position===0} onClick={()=>setPosition(position-1)}><ArrowLeft aria-hidden="true" size={16}/> Previous stop</button>
          <button type="button" className="ghost-button" disabled={done} onClick={finish}>{done ? "Stop completed" : "Mark stop complete"}</button>
          <button type="button" className="ghost-button" disabled={position===journey.stops.length-1} onClick={()=>setPosition(position+1)}>Next stop <ArrowRight aria-hidden="true" size={16}/></button>
        </div>
      </section>
    </div>
    <details className="reference-fold"><summary>Expedition sources</summary><ReferenceList keys={journey.sources} /></details>
  </div>;
}
