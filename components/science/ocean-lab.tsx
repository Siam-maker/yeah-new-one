"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { zones, zoneAt } from "@/lib/content/ocean";
import { LiveScene } from "./live-scene";
import { OceanEnvironment } from "@/components/home/ocean-environment";

const format = new Intl.NumberFormat("en-US");
const maximum = 11000;

export function OceanLab() {
  const [depth, setDepth] = useState<number>(zones[0].sample);
  const zone = zoneAt(depth);
  const index = zones.indexOf(zone);

  return <>
    <div className="lab-layout">
      <LiveScene scene={{ kind: "ocean", depth }} fallback={<div className="ocean-fallback" style={{ backgroundColor: zone.fog }}>
        <OceanEnvironment layer={index} />
        <div className="ocean-fallback-trench" />
        <span className="mono ocean-fallback-label">{zone.name} · {format.format(depth)} m</span>
      </div>} />
      <section className="pane lab-controls" aria-labelledby="ocean-controls">
        <div><p className="mono section-label">Water column</p><h2 id="ocean-controls" className="subhead">{zone.name}</h2></div>
        <label htmlFor="ocean-depth-range" className="control-label">Descent depth</label>
        <input id="ocean-depth-range" type="range" min="0" max={maximum} step="5" value={depth}
          aria-valuetext={`${format.format(depth)} metres, ${zone.name}`}
          onChange={(event) => setDepth(event.currentTarget.valueAsNumber)} />
        <div className="pill-row">
          <button className="ghost-button" type="button" aria-disabled={index === 0} onClick={() => { if (index > 0) setDepth(zones[index - 1].sample); }}><ArrowUp size={17} /> Shallower</button>
          <button className="ghost-button" type="button" aria-disabled={index === zones.length - 1} onClick={() => { if (index < zones.length - 1) setDepth(zones[index + 1].sample); }}><ArrowDown size={17} /> Deeper</button>
        </div>
        <dl className="lab-readout" aria-live="polite">
          <div><dt>Depth</dt><dd>{format.format(depth)} m</dd></div>
          <div><dt>Approx. pressure</dt><dd>{format.format(1 + Math.round(depth / 10))} atm</dd></div>
        </dl>
        <div><p>{zone.light}</p><p className="editorial-text">{zone.life}</p><p><strong>Look for:</strong> {zone.organism}</p></div>
      </section>
    </div>
    <div className="zone-choices" aria-label="Jump to a depth zone">
      {zones.map((item) => <button className="ghost-button" type="button" key={item.id} aria-pressed={zone.id === item.id} onClick={() => setDepth(item.sample)}>{item.name}</button>)}
    </div>
    <p className="lab-key">Zones are approximate. Pressure uses the rule of thumb of about 1 atmosphere at the surface plus 1 per 10 metres of seawater. The view depicts example habitats and organisms.</p>
  </>;
}

export function PressureGauge() {
  const [depth, setDepth] = useState(1000);
  return <div className="pressure-gauge">
    <label htmlFor="pressure-depth">Compare pressure at different depths</label>
    <input id="pressure-depth" type="range" min="0" max="6000" step="100" value={depth}
      aria-valuetext={`${format.format(depth)} metres`} onChange={(event) => setDepth(event.currentTarget.valueAsNumber)} />
    <meter min={1} max={601} value={1 + depth / 10} aria-label="Approximate water pressure" />
    <output htmlFor="pressure-depth">{format.format(depth)} m · ≈ {format.format(1 + depth / 10)} atm</output>
  </div>;
}
