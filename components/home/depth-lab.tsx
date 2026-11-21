"use client";

import { useState } from "react";
import { Activity, ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const layers = [
  { depth: "0–200 m", name: "Sunlight zone", note: "Sunlight supports photosynthesis here, feeding much of the ocean’s food web.", color: "#a9b5ff" },
  { depth: "200–1,000 m", name: "Twilight zone", note: "Light fades quickly. Many animals here make light using chemical reactions.", color: "#536bff" },
  { depth: "1,000–4,000 m", name: "Midnight zone", note: "Sunlight is absent, but some animals emit flashes of their own.", color: "#a49aff" },
  { depth: "4,000–6,000 m", name: "Abyssal zone", note: "In the deep, cold ocean, many animals feed on material that drifts down from above.", color: "#ff8064" },
];

export function DepthLab() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const layer = layers[index];

  return (
    <section className="depth-panel" aria-labelledby="depth-title">
      <div className="depth-copy">
        <div className="section-label mono"><Activity size={16} aria-hidden="true" /> Interactive field lab</div>
        <h2 id="depth-title" className="section-title">THE DESCENT</h2>
        <p>Move through four ocean layers and see where sunlight gives way to darkness.</p>
        <label className="mono depth-label" htmlFor="ocean-layer">Ocean layer</label>
        <input id="ocean-layer" type="range" min={0} max={layers.length - 1} step={1} value={index} aria-valuetext={layer.name} onChange={(event) => setIndex(event.currentTarget.valueAsNumber)} />
        <div className="depth-buttons">
          <button type="button" aria-label="Shallower layer" disabled={index === 0} onClick={() => setIndex(index - 1)}><ArrowLeft size={17} /></button>
          <button type="button" aria-label="Deeper layer" disabled={index === layers.length - 1} onClick={() => setIndex(index + 1)}><ArrowRight size={17} /></button>
        </div>
      </div>
      <div className="depth-visual" style={{ "--layer-color": layer.color } as React.CSSProperties}>
        <div className="depth-rings" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((ring) => <i key={ring} style={{ inset: ring * 8 + "%" }} />)}
        </div>
        <div className="depth-readout" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={layer.name} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.16 }}>
              <p className="mono">{layer.depth}</p>
              <h3>{layer.name}</h3>
              <p>{layer.note}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
