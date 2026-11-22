"use client";

import { useId, useState } from "react";
import { zoneAt } from "@/lib/content/ocean";

export function PressureInstrument() {
  const id = useId();
  const [depth, setDepth] = useState(1000);
  const zone = zoneAt(depth);
  return <section className="instrument pressure-instrument" aria-label="Ocean pressure experiment">
    <div className="instrument-head"><p className="mono">{zone.name}</p><p><strong className="instrument-reading">{1 + depth / 10}</strong> <span>atm</span></p></div>
    <div className="depth-ruler" aria-hidden="true"><span style={{ width: `${depth / 110}%` }} /></div>
    <label htmlFor={id}>Water depth <strong>{depth.toLocaleString("en")} m</strong></label>
    <input id={id} type="range" min="0" max="11000" step="100" value={depth} onChange={(event) => setDepth(event.currentTarget.valueAsNumber)} />
    <p className="instrument-note">Approximate absolute pressure. Start at 1 atmosphere and add about 1 for every 10 metres of seawater.</p>
  </section>;
}
