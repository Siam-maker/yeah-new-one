"use client";

import { useState } from "react";
import { Activity, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotionPreference } from "@/components/motion/preferences";

const layers = [
  {
    depth: "0–200 m",
    name: "Sunlight zone",
    note: "Sunlight supports photosynthesis here, feeding much of the ocean’s food web.",
    light: "Enough for photosynthesis",
    water: "#242c59",
    accent: "#a9b5ff",
  },
  {
    depth: "200–1,000 m",
    name: "Twilight zone",
    note: "Light fades quickly. Many animals here make light using chemical reactions.",
    light: "Faint sunlight",
    water: "#17214c",
    accent: "#93a3ff",
  },
  {
    depth: "1,000–4,000 m",
    name: "Midnight zone",
    note: "Sunlight is absent, but some animals emit flashes of their own.",
    light: "No sunlight",
    water: "#141632",
    accent: "#a49aff",
  },
  {
    depth: "4,000–6,000 m",
    name: "Abyssal zone",
    note: "In the deep, cold ocean, many animals feed on material that drifts down from above.",
    light: "No sunlight",
    water: "#15131e",
    accent: "#ff8064",
  },
];

const lastLayer = layers.length - 1;
const ease = [0.22, 1, 0.36, 1] as const;

export function DepthLab() {
  const [{ index, direction }, setDepth] = useState({ index: 0, direction: 0 });
  const reduced = useReducedMotionPreference();
  const layer = layers[index];

  function selectLayer(value: number, relative = false) {
    setDepth((current) => {
      const next = Math.min(lastLayer, Math.max(0, relative ? current.index + value : value));
      if (next === current.index) return current;
      return { index: next, direction: Math.sign(next - current.index) };
    });
  }

  return (
    <section className="depth-panel" aria-labelledby="depth-title">
      <div className="depth-copy">
        <div className="section-label mono"><Activity size={16} aria-hidden="true" /> Interactive field lab</div>
        <h2 id="depth-title" className="section-title">THE DESCENT</h2>
        <p>Move through four ocean layers and see where sunlight gives way to darkness.</p>
        <label className="mono depth-label" htmlFor="ocean-layer">Ocean layer</label>
        <input id="ocean-layer" type="range" min={0} max={lastLayer} step={1} value={index}
          aria-valuetext={`${layer.name}, ${layer.depth}`}
          onChange={(event) => selectLayer(event.currentTarget.valueAsNumber)} />
        <div className="depth-buttons">
          <button type="button" aria-label="Shallower layer" aria-disabled={index === 0} onClick={() => selectLayer(-1, true)}><ArrowLeft size={17} /></button>
          <button type="button" aria-label="Deeper layer" aria-disabled={index === lastLayer} onClick={() => selectLayer(1, true)}><ArrowRight size={17} /></button>
        </div>
      </div>
      <motion.div className="depth-visual" initial={false} animate={{ backgroundColor: layer.water }}
        transition={{ duration: reduced ? 0 : 0.65, ease }}>
        <motion.div className="depth-rings" aria-hidden="true" initial={false}
          animate={{ rotate: reduced ? -12 : -12 + index * 7, scale: reduced ? 1 : 1 - index * 0.07, color: layer.accent }}
          transition={{ duration: reduced ? 0 : 0.75, ease }}>
          {[0, 1, 2, 3, 4, 5].map((ring) => <i key={ring} style={{ inset: ring * 8 + "%" }} />)}
        </motion.div>
        <p role="status" className="sr-only">{layer.name}, {layer.depth}. {layer.light}. {layer.note}</p>
        <div className="depth-readout">
          <motion.div key={layer.name}
            initial={reduced || direction === 0 ? false : { opacity: 0.5, y: direction * 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.34, ease }}>
            <p className="mono depth-range" style={{ color: layer.accent }}>{layer.depth}</p>
            <h3>{layer.name}</h3>
            <p className="depth-note">{layer.note}</p>
            <p className="mono depth-light">Light · {layer.light}</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
