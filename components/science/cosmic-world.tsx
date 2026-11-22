"use client";

import { useState } from "react";
import Image from "next/image";
import { displayOrbit, planets, lightMinutesPerAu } from "@/lib/content/cosmos";
import { LiveScene } from "./live-scene";
import { decimal, integer } from "@/lib/content/demographics";

function OrbitalDiagram({ selected, years, zoom }: { selected: string; years: number; zoom:number }) {
  return <div className="orbit-diagram">
    <Image src="/images/observatory.webp" fill sizes="100vw" alt="" />
    <svg viewBox={`${270-270/zoom} ${160-160/zoom} ${540/zoom} ${320/zoom}`} role="img" aria-label="Schematic solar system">
      <circle cx="270" cy="164" r="13" fill="#ffda92" />
      {planets.map((planet,index) => {
        const orbit = displayOrbit(planet.au) * 41;
        const phase = years/planet.years * Math.PI * 2 + index * 1.1;
        const x = 270 + orbit*Math.cos(phase);
        const y = 164 + orbit*Math.sin(phase)*.52;
        const active = selected === planet.id;
        return <g key={planet.id}>
          <ellipse cx="270" cy="164" rx={orbit} ry={orbit*.52} fill="none" stroke={active ? "#cec2ff" : "#a3a9cf"} opacity={active ? ".95" : ".53"} />
          <circle cx={x} cy={y} r={active ? "7" : "4.5"} fill={planet.color} stroke={active ? "#fff3ce" : undefined} />
        </g>;
      })}
    </svg>
  </div>;
}

export function CosmicWorld() {
  const [selected,setSelected] = useState<string>("earth");
  const [years,setYears] = useState(0);
  const [view, setView] = useState<"orbits" | "planet">("orbits");
  const [zoom, setZoom] = useState(1);
  const [enable3D,setEnable3D] = useState(false);
  const planet = planets.find((body)=>body.id===selected) ?? planets[2];
  return <div className="world-experiment cosmic-experiment">
    <div className="cosmic-stage">
      <LiveScene scene={{ kind:"cosmos", selected:planet.id, years, view, zoom, onSelect:setSelected }} explicit={enable3D}
        fallback={view === "orbits" ? <OrbitalDiagram selected={planet.id} years={years} zoom={zoom} /> : <div className="orbit-diagram planet-fallback">
          <Image src="/images/observatory.webp" fill sizes="100vw" alt="" />
          <svg viewBox="0 0 540 320" role="img" aria-label={`${planet.name} illustration`}>
            {planet.id === "saturn" && <ellipse cx="270" cy="160" rx={86*zoom} ry={26*zoom} fill="none" stroke="#d5bb94" strokeWidth={9*zoom} transform="rotate(-22 270 160)" />}
            <circle cx="270" cy="160" r={55*zoom} fill={planet.color} />
          </svg>
        </div>} />
      <span className="world-stage-label mono">{view === "orbits" ? "Planets · schematic orbital display" : `${planet.name} · illustrative surface`}</span>
    </div>
    <div className="lab-layout">
      <section className="pane lab-controls">
        <p className="mono section-label">Object navigation</p>
        <div className="pill-row">{planets.map((body)=><button key={body.id} type="button" className="ghost-button" aria-pressed={planet.id===body.id}
          onClick={()=>setSelected(body.id)}>{body.name}</button>)}</div>
        <div className="pill-row" aria-label="Observatory view">
          <button className="ghost-button" type="button" aria-pressed={view === "orbits"} onClick={() => setView("orbits")}>Orbital view</button>
          <button className="ghost-button" type="button" aria-pressed={view === "planet"} onClick={() => setView("planet")}>Inspect planet</button>
        </div>
        <label>Camera zoom <span>{zoom.toFixed(2)}×</span><input type="range" min=".8" max="1.55" step=".05" value={zoom} aria-valuetext={`${zoom.toFixed(2)} times`} onChange={(event) => setZoom(event.currentTarget.valueAsNumber)} /></label>
        <label htmlFor="orbital-year">Elapsed time <strong>{years.toFixed(1)} Earth years</strong></label>
        <input id="orbital-year" type="range" min="0" max="35" step=".1" value={years} onChange={(event)=>setYears(event.currentTarget.valueAsNumber)} />
        <button className="ghost-button scene-opt-in" type="button" aria-pressed={enable3D} onClick={() => setEnable3D(!enable3D)}>Enable interactive 3D</button>
        <p className="lab-key">Circular orbits with a shared starting angle. Orbital radii are compressed logarithmically and object sizes are exaggerated. Positions and surface textures are illustrative.</p>
      </section>
      <section className="pane" aria-live="polite">
        <p className="mono section-label">Planet readout</p><h2 className="subhead">{planet.name}</h2>
        <p>{planet.reading}</p>
        <dl className="world-metrics">
          <div><dt>Orbital semimajor axis</dt><dd>{planet.au} au</dd></div>
          <div><dt>Orbital period</dt><dd>{decimal.format(planet.years)} years</dd></div>
          <div><dt>Approximate diameter</dt><dd>{integer.format(planet.diameter)} km</dd></div>
          <div><dt>Sunlight travel time</dt><dd>{decimal.format(planet.au*lightMinutesPerAu)} min</dd></div>
        </dl>
        <div className="planet-comparison">
          <p>Diameter relative to Earth <strong>{decimal.format(planet.diameter / planets[2].diameter)}×</strong></p>
          <div aria-hidden="true"><span style={{ width:`${planet.diameter/139820*100}%`,background:planet.color }} /><span style={{ width:`${planets[2].diameter/139820*100}%` }} /></div>
          <p className="mono">{planet.name} / Earth</p>
        </div>
      </section>
    </div>
  </div>;
}
