"use client";

import { useState } from "react";
import { earthLayers } from "@/lib/content/earth-interior";
import { LiveScene } from "./live-scene";

export function EarthInterior() {
  const [selected, setSelected] = useState(1);
  const [rotation, setRotation] = useState(-24);
  const [attempt3D, setAttempt3D] = useState(false);
  const layer = earthLayers[selected];

  return <div className="interior-exhibit">
    <LiveScene
      scene={{ kind:"interior", selected, rotation, onSelect:setSelected }}
      explicit={attempt3D}
      fallback={<svg viewBox="0 0 460 360" role="img" aria-label="Schematic Earth cross-section with four concentric layers">
        {earthLayers.map(({ name, color, radius }, index) => <ellipse key={name} cx="230" cy="180" rx={radius*88*Math.cos(rotation*Math.PI/180)} ry={radius*88}
          fill={color} stroke={index === selected ? "#fff6de" : "#251b1b"} strokeWidth={index === selected ? 4 : 2} />)}
      </svg>}
    />
    <section className="pane lab-controls">
      <div className="pill-row" aria-label="Layers of Earth">{earthLayers.map((item, index) => <button className="ghost-button" type="button" key={item.name}
        aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.name}</button>)}</div>
      <div aria-live="polite"><p className="mono section-label">{layer.state}</p><h3 className="subhead">{layer.name}</h3><p className="interior-depth">{layer.depth}</p><p>{layer.detail}</p></div>
      <label>Cutaway angle <span>{rotation}°</span><input type="range" min="-55" max="55" value={rotation} aria-valuetext={`${rotation} degrees`} onChange={(event) => setRotation(event.currentTarget.valueAsNumber)} /></label>
      <button type="button" className="ghost-button scene-opt-in" aria-pressed={attempt3D} onClick={() => setAttempt3D(!attempt3D)}>Enable interactive 3D</button>
      <p className="lab-key">The cutaway exaggerates the crust. Depths are approximate and vary by location.</p>
      <a className="editorial-link" href="https://pubs.usgs.gov/gip/interior/">USGS · The Interior of the Earth</a>
    </section>
  </div>;
}
