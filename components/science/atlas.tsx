"use client";

import { useRef, useState } from "react";
import { Globe2, Map, RotateCcw, RotateCw } from "lucide-react";
import { locations, type AtlasLocation } from "@/lib/content/atlas";
import { LiveScene } from "./live-scene";

function WorldMap({ location, boundaries, onSelect }: {
  location: AtlasLocation; boundaries: boolean; onSelect: (id: string) => void;
}) {
  return <svg className="atlas-map" viewBox="0 0 360 180" aria-label="World map with selectable ocean and geological locations">
    <image href="/images/world-land.svg" width="360" height="180" />
    {boundaries && <image href="/images/world-boundaries.svg" width="360" height="180" />}
    {locations.map((item) => (
      <g key={item.id} transform={`translate(${item.lon + 180},${90 - item.lat})`} role="button" aria-label={item.name}
        aria-pressed={item.id === location.id} tabIndex={0} onClick={() => onSelect(item.id)}
        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(item.id); } }}>
        <circle r="6" fill="transparent" />
        <circle r={item.id === location.id ? 3.3 : 2.25} fill={item.id === location.id ? "#ff9c75" : "#f7f1e6"} stroke="#16293b" strokeWidth=".8" />
      </g>
    ))}
  </svg>;
}

export function Atlas() {
  const [selected, setSelected] = useState<string>(locations[0].id);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("map");
  const [heading, setHeading] = useState(0);
  const [globeReady, setGlobeReady] = useState(false);
  const [boundaries, setBoundaries] = useState(true);
  const drag = useRef<{ x: number; heading: number } | null>(null);
  const location = locations.find((item) => item.id === selected) ?? locations[0];
  const filtered = locations.filter((item) => `${item.name} ${item.region} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase()));

  function select(id: string) {
    setSelected(id);
    setHeading(0);
  }

  const map = <WorldMap location={location} boundaries={boundaries} onSelect={select} />;

  return <>
    <div className="lab-layout">
      <div className="atlas-map-panel">
        <div className="atlas-controls">
          <button className="ghost-button" type="button" aria-pressed={view === "map"} onClick={() => { setView("map"); setGlobeReady(false); }}><Map size={17} /> Map</button>
          <button className="ghost-button" type="button" aria-pressed={view === "globe"} onClick={() => setView("globe")}><Globe2 size={17} /> 3D globe</button>
          <button className="ghost-button" type="button" aria-pressed={boundaries} onClick={() => setBoundaries(!boundaries)}>Plate boundaries</button>
          {view === "globe" && globeReady && <>
            <button className="ghost-button" type="button" onClick={() => setHeading(heading - 30)} aria-label="Rotate west"><RotateCcw size={18} /></button>
            <button className="ghost-button" type="button" onClick={() => setHeading(heading + 30)} aria-label="Rotate east"><RotateCw size={18} /></button>
          </>}
        </div>
        {view === "map" ? map : <div className={globeReady ? "atlas-drag" : undefined} onPointerDown={(event) => {
          if (globeReady && event.pointerType === "mouse" && event.button === 0) drag.current = { x: event.clientX, heading };
        }} onPointerMove={(event) => {
          if (drag.current && event.buttons & 1) setHeading(drag.current.heading + (event.clientX - drag.current.x) * .32);
        }} onPointerUp={() => { drag.current = null; }} onPointerLeave={() => { drag.current = null; }}>
          <LiveScene scene={{ kind: "globe", location, showBoundaries: boundaries, heading, onSelect: select }} explicit fallback={map} onModeChange={setGlobeReady} />
        </div>}
        <div className="atlas-legend"><span><i /> Plate boundary</span><span><i data-point /> Selectable location</span></div>
        <p className="lab-key">The map uses Natural Earth coastlines and Bird’s PB2002 boundaries. Location markers are approximate.</p>
      </div>
      <section className="pane atlas-location" aria-live="polite">
        <p className="mono section-label">{location.category} · {location.region}</p>
        <h2 className="subhead">{location.name}</h2>
        <p className="standfirst">{location.detail}</p>
        <p className="mono mt-5">{Math.abs(location.lat).toFixed(2)}° {location.lat < 0 ? "S" : "N"} · {Math.abs(location.lon).toFixed(2)}° {location.lon < 0 ? "W" : "E"}</p>
        <p className="mt-3 font-semibold">{location.value}</p>
      </section>
    </div>
    <section className="pane" aria-labelledby="atlas-location-search">
      <h2 className="subhead" id="atlas-location-search">Find a location</h2>
      <label className="control-label" htmlFor="atlas-filter">Name, region, or feature</label>
      <input id="atlas-filter" className="control-field" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Pacific or trench" />
      {filtered.length ? <div className="atlas-location-list">
        {filtered.map((item) => <button key={item.id} type="button" aria-pressed={item.id === location.id} className="ghost-button" onClick={() => select(item.id)}>{item.name}</button>)}
      </div> : <p className="mt-4" role="status">No locations match “{query}”.</p>}
    </section>
  </>;
}
