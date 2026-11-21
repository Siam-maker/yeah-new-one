"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { eons, type TimeUnit } from "@/lib/content/geologic-time";
import { LiveScene } from "./live-scene";
import { ScienceDiagram } from "@/components/editorial/diagram";

function levelAt(path: number[]) {
  let entries: TimeUnit[] = eons;
  for (const index of path) entries = entries[index].children ?? [];
  return entries;
}

export function TimeLab() {
  const [path, setPath] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const entries = levelAt(path);
  const selected = entries[index];
  const title = path.length ? levelAt(path.slice(0, -1))[path[path.length - 1]].name : "All geological time";

  function zoomIn() {
    if (!selected.children) return;
    setPath([...path, index]);
    setIndex(0);
  }

  function zoomOut() {
    if (path.length === 0) return;
    setIndex(path[path.length - 1]);
    setPath(path.slice(0, -1));
  }

  return <>
    <section className="pane lab-controls" aria-label="Geologic timeline navigation">
      <div><p className="mono section-label">{["Eons", "Eras", "Periods"][path.length]} · Millions of years ago</p><h2 className="subhead">{title}</h2></div>
      <div className="timeline-track" aria-label="Time intervals">
        {entries.map((era, item) => <button key={era.name} type="button" aria-pressed={index === item} onClick={() => setIndex(item)}>
          {era.name}<span className="mono">{era.from.toLocaleString("en-US")}–{era.to}</span>
        </button>)}
      </div>
      <div className="pill-row">
        <button className="ghost-button" type="button" aria-disabled={index === 0} onClick={() => setIndex(Math.max(0, index - 1))}><ChevronLeft size={18} /> Older</button>
        <button className="ghost-button" type="button" aria-disabled={index === entries.length - 1} onClick={() => setIndex(Math.min(entries.length - 1, index + 1))}>Younger <ChevronRight size={18} /></button>
        <button className="ghost-button" type="button" aria-disabled={!selected.children} onClick={zoomIn}><Plus size={18} /> Zoom in</button>
        <button className="ghost-button" type="button" aria-disabled={!path.length} onClick={zoomOut}><Minus size={18} /> Zoom out</button>
      </div>
    </section>
    <div className="lab-layout">
      <LiveScene scene={{ kind: "strata", layer: (index + path.length * 2) % 6 }} fallback={<ScienceDiagram kind="strata" />} />
      <section className="pane" aria-live="polite">
        <p className="mono section-label">{selected.from.toLocaleString("en-US")}–{selected.to} million years ago</p>
        <h2 className="subhead">{selected.name}</h2>
        <p className="standfirst">{selected.event}</p>
        <p className="lab-key">Dates are approximate. The coloured strata illustrate how layers can be read. A real outcrop does not hold an evenly spaced record of this timeline.</p>
      </section>
    </div>
  </>;
}
