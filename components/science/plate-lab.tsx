"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotionPreference } from "@/components/motion/preferences";
import { LiveScene } from "./live-scene";
import type { Boundary } from "./scene-types";

const models = {
  convergent: { title: "Convergent", copy: "Plates approach. In this ocean–continent example, the oceanic plate dips beneath the continent. A trench, earthquakes and a volcanic arc may develop." },
  divergent: { title: "Divergent", copy: "Plates move apart. Rising mantle can partially melt and supply new crust. Oceanic spreading ridges record this process." },
  transform: { title: "Transform", copy: "Plates slide laterally past each other. Fault segments can stick and then slip, releasing energy as earthquakes." },
} as const;

function CrossSection({ boundary, progress }: { boundary: Boundary; progress: number }) {
  const p = progress / 100;
  const convergent = boundary === "convergent";
  const transform = boundary === "transform";
  return <svg viewBox="0 0 480 250" role="img" aria-label={`${models[boundary].title} boundary schematic`}>
    <rect width="480" height="250" fill="#182031" />
    <rect y="173" width="480" height="77" fill="#56333b" />
    <path d="M0 122 H207 L230 146 H0Z" fill="#70a9ab"
      transform={`translate(${convergent ? p * 33 : transform ? 0 : -p * 32} ${convergent ? p * 11 : transform ? -p * 17 : 0}) rotate(${convergent ? p * 12 : 0} 207 122)`} />
    <path d={convergent ? `M245 124 H296 L${320 + p * 6} ${124 - p * 47} L349 124 H480 V161 H245Z` : "M246 124 H480 V161 H246Z"} fill="#c4986b"
      transform={`translate(${boundary === "divergent" ? p * 33 : 0} ${transform ? p * 17 : 0})`} />
    {boundary === "divergent" && <path d={`M${229 - p * 17} 174 L232 ${143 - p * 29} L${235 + p * 22} 174Z`} fill="#ff7c58" />}
    <text x="22" y="33" fill="#f7f1e6" fontSize="19">{transform ? "Transform plane" : "Cross-section"}</text>
    <text x="22" y="225" fill="#f7f1e6" fontSize="17">{transform ? "Offset exaggerated" : "Upper mantle"}</text>
    <text x="106" y="98" fill="#eac8ba" fontSize="25">{boundary === "divergent" ? "←" : "→"}</text>
    <text x="378" y="98" fill="#eac8ba" fontSize="25">{boundary === "divergent" ? "→" : "←"}</text>
  </svg>;
}

export function PlateLab({ compact = false }: { compact?: boolean }) {
  const [boundary, setBoundary] = useState<Boundary>("convergent");
  const [progress, setProgress] = useState(15);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState(compact ? "cross" : "3d");
  const reduced = useReducedMotionPreference();

  const animating = playing && !reduced && progress < 100;

  useEffect(() => {
    if (!animating) return;
    const timer = window.setInterval(() => setProgress((current) => Math.min(100, current + 2)), 70);
    return () => window.clearInterval(timer);
  }, [animating]);
  return <div className="lab-layout">
    {view === "3d"
      ? <LiveScene scene={{ kind: "plates", boundary, progress }} fallback={<CrossSection boundary={boundary} progress={progress} />} />
      : <div className="science-figure"><CrossSection boundary={boundary} progress={progress} /></div>}
    <section className="pane lab-controls" aria-label="Plate tectonics controls">
      <h2 className="subhead">{models[boundary].title}</h2>
      <div className="pill-row">{(Object.keys(models) as Boundary[]).map((key) => (
        <button className="ghost-button" type="button" key={key} aria-pressed={boundary === key} onClick={() => { setBoundary(key); setPlaying(false); setProgress(15); }}>{models[key].title}</button>
      ))}</div>
      <p className="editorial-text">{models[boundary].copy}</p>
      <label htmlFor="plate-motion" className="control-label">Relative motion · {progress}%</label>
      <input id="plate-motion" type="range" min="0" max="100" value={progress} onChange={(event) => { setPlaying(false); setProgress(event.currentTarget.valueAsNumber); }} />
      <div className="pill-row">
        <button className="ghost-button" type="button" onClick={() => {
          if (reduced) { setProgress(progress >= 100 ? 0 : Math.min(100, progress + 20)); return; }
          if (progress === 100) setProgress(0);
          setPlaying(!animating);
        }}>{animating ? <Pause size={17} /> : <Play size={17} />}{reduced ? "Step forward" : animating ? "Pause" : "Play motion"}</button>
        <button className="ghost-button" type="button" aria-pressed={view === "cross"} onClick={() => setView("cross")}>Cross-section</button>
        <button className="ghost-button" type="button" aria-pressed={view === "3d"} onClick={() => setView("3d")}>3D model</button>
      </div>
      <p className="lab-key">This educational schematic exaggerates movement and geometry. It does not model actual rupture, rates, depths, or future events.</p>
    </section>
  </div>;
}
