"use client";

import { useEffect, useState } from "react";
import { ExhibitImage } from "@/components/editorial/exhibit-image";
import { displayOrbit, planets, lightMinutesPerAu } from "@/lib/content/cosmos";
import { CameraControls, defaultCamera } from "./camera-controls";
import { readCamera, readNumber, useExhibitSnapshot, type ExhibitQuery } from "./exhibit-query";
import { LiveScene } from "./live-scene";
import { planetsBn } from "@/lib/i18n/bengali-instruments";

function OrbitalDiagram({ selected, years, zoom, bn }: { selected: string; years: number; zoom:number; bn:boolean }) {
  return <div className="orbit-diagram">
    <ExhibitImage src="/images/observatory.webp" fill sizes="100vw" alt="" />
    <svg viewBox={`${270-270/zoom} ${160-160/zoom} ${540/zoom} ${320/zoom}`} role="img" aria-label={bn ? "সৌরজগতের সরল ছক" : "Schematic solar system"}>
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

export function CosmicWorld({locale="en",query}:{locale?:"en"|"bn";query?:ExhibitQuery} = {}) {
  const bn=locale==="bn";
  const decimal=new Intl.NumberFormat(locale,{maximumFractionDigits:2});
  const digits=new Intl.NumberFormat(locale);
  const [selected,setSelected] = useState<string>(()=>planets.find(({id})=>id===query?.params.get("planet"))?.id ?? "earth");
  const [years,setYears] = useState(()=>readNumber(query,"years",0,0,35));
  const [view, setView] = useState<"orbits" | "planet">(()=>query?.params.get("view")==="planet" ? "planet" : "orbits");
  const [zoom, setZoom] = useState(()=>readNumber(query,"zoom",1,.8,1.55));
  const [camera,setCamera] = useState(()=>readCamera(query));
  const [playing,setPlaying] = useState(false);
  const [speed,setSpeed] = useState(1);
  const [enable3D,setEnable3D] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setYears((elapsed) => (elapsed + speed/10) % 35);
    },100);
    return () => window.clearInterval(timer);
  },[playing,speed]);
  useExhibitSnapshot(query,{...camera,zoom,planet:selected,years,view});
  const planet = planets.find((body)=>body.id===selected) ?? planets[2];
  const [name,reading] = bn ? planetsBn[planet.id] : [planet.name,planet.reading];
  return <div className="world-experiment cosmic-experiment">
    <div className="cosmic-stage">
      <LiveScene scene={{ kind:"cosmos", selected:planet.id, years, view, zoom, camera, onSelect:setSelected }} explicit={enable3D} locale={locale}
        fallback={view === "orbits" ? <OrbitalDiagram selected={planet.id} years={years} zoom={zoom} bn={bn} /> : <div className="orbit-diagram planet-fallback">
          <ExhibitImage src="/images/observatory.webp" fill sizes="100vw" alt="" />
          <svg viewBox="0 0 540 320" role="img" aria-label={bn ? `${name} গ্রহের চিত্র` : `${name} illustration`}>
            {planet.id === "saturn" && <ellipse cx="270" cy="160" rx={86*zoom} ry={26*zoom} fill="none" stroke="#d5bb94" strokeWidth={9*zoom} transform="rotate(-22 270 160)" />}
            <circle cx="270" cy="160" r={55*zoom} fill={planet.color} />
          </svg>
        </div>} />
      <span className="world-stage-label mono">{view === "orbits" ? bn ? "গ্রহের কক্ষপথের ছক" : "Planets · schematic orbital display" : bn ? `${name} · পৃষ্ঠের উদাহরণ` : `${name} · illustrative surface`}</span>
    </div>
    <div className="lab-layout">
      <section className="pane lab-controls">
        <p className="mono section-label">{bn ? "গ্রহ বাছাই" : "Object navigation"}</p>
        <div className="pill-row">{planets.map((body)=><button key={body.id} type="button" className="ghost-button" aria-pressed={planet.id===body.id}
          onClick={()=>setSelected(body.id)}>{bn ? planetsBn[body.id][0] : body.name}</button>)}</div>
        <div className="pill-row" aria-label={bn ? "পর্যবেক্ষণাগারের দৃশ্য" : "Observatory view"}>
          <button className="ghost-button" type="button" aria-pressed={view === "orbits"} onClick={() => setView("orbits")}>{bn ? "কক্ষপথ দেখুন" : "Orbital view"}</button>
          <button className="ghost-button" type="button" aria-pressed={view === "planet"} onClick={() => setView("planet")}>{bn ? "গ্রহ কাছ থেকে দেখুন" : "Inspect planet"}</button>
        </div>
        <label>{bn ? "ক্যামেরায় কাছে বা দূরে যান" : "Camera zoom"} <span>{decimal.format(zoom)}×</span><input type="range" min=".8" max="1.55" step=".05" value={zoom} aria-valuetext={`${zoom.toFixed(2)} times`} onChange={(event) => setZoom(event.currentTarget.valueAsNumber)} /></label>
        <label htmlFor="orbital-year">{bn ? "অতিবাহিত সময়" : "Elapsed time"} <strong>{decimal.format(years)} {bn ? "পৃথিবী বছর" : "Earth years"}</strong></label>
        <input id="orbital-year" type="range" min="0" max="35" step=".1" value={years} onChange={(event)=>setYears(event.currentTarget.valueAsNumber)} />
        <div className="pill-row">
          <button className="ghost-button" type="button" aria-pressed={playing} onClick={()=>setPlaying(!playing)}>{playing ? bn ? "কক্ষপথ থামান" : "Pause orbit" : bn ? "কক্ষপথ চালান" : "Play orbit"}</button>
          <button className="ghost-button" type="button" onClick={()=>{setPlaying(false);setSelected("earth");setYears(0);setZoom(1);setView("orbits");setSpeed(1);setCamera(defaultCamera);}}>{bn ? "আগের অবস্থায় ফেরান" : "Reset observatory"}</button>
        </div>
        <label>{bn ? "চলার গতি" : "Playback speed"}<select className="control-field" value={speed} onChange={(event)=>setSpeed(Number(event.target.value))}>
          {[.5,1,2].map((value)=><option key={value} value={value}>{decimal.format(value)} {bn ? "মডেলে বছর প্রতি সেকেন্ড" : "simulated years per second"}</option>)}
        </select></label>
        <button className="ghost-button scene-opt-in" type="button" aria-pressed={enable3D} onClick={() => setEnable3D(!enable3D)}>{bn ? "ত্রিমাত্রিক দৃশ্য চালু করুন" : "Enable interactive 3D"}</button>
        <CameraControls value={camera} onChange={setCamera} locale={locale} extra />
        <p className="lab-key">{bn ? "মডেলে বৃত্তাকার কক্ষপথ। লগারিদমিক হিসাবে তাদের দূরত্ব সংকুচিত এবং গ্রহের আকার বড় করে দেখানো হয়েছে। অবস্থান ও পৃষ্ঠের বুনট উদাহরণ।" : "Circular orbits with a shared starting angle. Orbital radii are compressed logarithmically and object sizes are exaggerated. Positions and surface textures are illustrative."}</p>
      </section>
      <section className="pane" aria-live="polite">
        <p className="mono section-label">{bn ? "গ্রহের তথ্য" : "Planet readout"}</p><h2 className="subhead">{name}</h2>
        <p>{reading}</p>
        <dl className="world-metrics">
          <div><dt>{bn ? "কক্ষপথের অর্ধ-দীর্ঘ অক্ষ" : "Orbital semimajor axis"}</dt><dd>{decimal.format(planet.au)} au</dd></div>
          <div><dt>{bn ? "প্রদক্ষিণের সময়" : "Orbital period"}</dt><dd>{decimal.format(planet.years)} {bn ? "বছর" : "years"}</dd></div>
          <div><dt>{bn ? "আনুমানিক ব্যাস" : "Approximate diameter"}</dt><dd>{digits.format(planet.diameter)} km</dd></div>
          <div><dt>{bn ? "সূর্যালোক পৌঁছানোর সময়" : "Sunlight travel time"}</dt><dd>{decimal.format(planet.au*lightMinutesPerAu)} {bn ? "মিনিট" : "min"}</dd></div>
        </dl>
        <div className="planet-comparison">
          <p>{bn ? "পৃথিবীর তুলনায় ব্যাস " : "Diameter relative to Earth "}<strong>{decimal.format(planet.diameter / planets[2].diameter)}×</strong></p>
          <div aria-hidden="true"><span style={{ width:`${planet.diameter/139820*100}%`,background:planet.color }} /><span style={{ width:`${planets[2].diameter/139820*100}%` }} /></div>
          <p className="mono">{name} / {bn ? "পৃথিবী" : "Earth"}</p>
        </div>
      </section>
    </div>
  </div>;
}
