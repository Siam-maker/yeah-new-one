"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Globe2, Map, Minus, Plus, RotateCcw, RotateCw } from "lucide-react";
import { atlasLayers, type AtlasLayer, type AtlasPoint } from "@/lib/content/atlas";
import { atlasPoints, emissionsYears, getEmissionSeries, seaLevel, seaLevelTrend, temperature } from "@/lib/content/observations";
import { LiveScene } from "./live-scene";
import { populationIndicators, type PopulationIndicator } from "@/lib/content/demographics";
import { AtlasBookmarks } from "./atlas-bookmarks";
import { TrendGraphic } from "./trend";

const AtlasPopulation = dynamic(() => import("./atlas-population").then((module) => module.AtlasPopulation), { loading: () => <p role="status">Loading country indicators…</p> });
const populationLayers = ["population", "density", "urban"] as const;

function MapPreview({ points, selected, boundaries, bathymetry, color, zoom, onSelect }: {
  points: readonly AtlasPoint[]; selected: AtlasPoint; boundaries: boolean; bathymetry: boolean; color: string;
  zoom: number; onSelect: (id: string) => void;
}) {
  const width = 360 / zoom;
  const height = 180 / zoom;
  const left = Math.max(0, Math.min(360 - width, selected.lon + 180 - width / 2));
  const top = Math.max(0, Math.min(180 - height, 90 - selected.lat - height / 2));

  return <svg className="atlas-map" viewBox={`${left} ${top} ${width} ${height}`} aria-label="World map with selectable locations">
    <rect width="360" height="180" fill="#122437" />
    {bathymetry && <image href="/data/bathymetry.webp" width="360" height="180" />}
    <image href="/data/atlas-land.svg" width="360" height="180" />
    {[30, 60, 90, 120, 150].map((y) => <path key={y} d={`M0 ${y}H360`} stroke="#c8eaf0" strokeOpacity=".14" strokeWidth=".35" />)}
    {[60, 120, 180, 240, 300].map((x) => <path key={x} d={`M${x} 0V180`} stroke="#c8eaf0" strokeOpacity=".14" strokeWidth=".35" />)}
    {boundaries && <image href="/images/world-boundaries.svg" width="360" height="180" />}
    {[...points].sort((a, b) => (b.magnitude ?? 0) - (a.magnitude ?? 0)).map((item) => {
      const x = item.lon + 180;
      const y = 90 - item.lat;
      const within = x >= left && x <= left + width && y >= top && y <= top + height;
      if (!within) return null;
      const active = item.id === selected.id;
      const radius = item.magnitude === undefined ? 2.1 : Math.min(8, 1.3 + Math.sqrt(item.magnitude) / (item.category.includes("settlement") ? 650 : 19));
      return <g key={item.id} transform={`translate(${x},${y}) scale(${1 / zoom})`} role="button" aria-label={item.name}
        aria-pressed={active} tabIndex={0} onClick={() => onSelect(item.id)}
        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(item.id); } }}>
        <circle r={Math.max(5, radius + 2)} fill="transparent" />
        {active && <circle r={radius + 3} fill="none" stroke={color} strokeWidth=".75" />}
        <circle r={radius} fill={color} opacity={active ? 1 : .76} stroke="#05101a" strokeWidth=".65" />
      </g>;
    })}
  </svg>;
}

export function Atlas({ initialLayer, initialLocation, initialIndicator, initialZoom, initialView, initialYear, initialHeading, initialBoundaries, initialBathymetry }: {
  initialLayer: AtlasLayer; initialLocation: string; initialIndicator?: PopulationIndicator; initialZoom: number; initialView: "map" | "globe"; initialYear?: number;
  initialHeading: number; initialBoundaries?: boolean; initialBathymetry?: boolean;
}) {
  const [layer, setLayer] = useState(initialLayer);
  const [indicator, setIndicator] = useState(initialIndicator);
  const [country, setCountry] = useState(initialLocation);
  const [populationYear, setPopulationYear] = useState(initialYear ?? 2023);
  const [seaYear, setSeaYear] = useState(Math.max(1880, Math.min(2013, initialYear ?? 2013)));
  const [selected, setSelected] = useState(initialLocation);
  const [query, setQuery] = useState("");
  const [view, setView] = useState(initialView);
  const [heading, setHeading] = useState(initialHeading);
  const [zoom, setZoom] = useState(initialZoom);
  const [globeReady, setGlobeReady] = useState(false);
  const [boundaries, setBoundaries] = useState(initialBoundaries ?? (initialLayer === "geology" || initialLayer === "tectonics"));
  const [bathymetry, setBathymetry] = useState(initialBathymetry ?? (initialLayer === "ocean"));
  const [climateYear, setClimateYear] = useState(Math.max(1880, Math.min(2025, initialYear ?? 2025)));
  const [emissionYear, setEmissionYear] = useState(initialYear && emissionsYears.includes(initialYear) ? initialYear : 2023);
  const drag = useRef<{ x: number; heading: number } | null>(null);
  const points = atlasPoints(layer, emissionYear);
  const source = atlasLayers[layer];
  const location = points.find((item) => item.id === selected) ?? points[0];
  const filtered = points.filter((point) => `${point.name} ${point.region} ${point.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  const globePoints = points.length > 50 ? [location, ...[...points].filter((point) => point.id !== location.id)
    .sort((a, b) => (b.magnitude ?? 0) - (a.magnitude ?? 0)).slice(0, 47)] : points;

  function select(id: string) { setSelected(id); setHeading(0); }

  function changeLayer(next: AtlasLayer) {
    setIndicator(undefined); setLayer(next); setQuery(""); setSelected(""); setZoom(1); setHeading(0);
    if (next === "ocean") setBathymetry(true);
    if (next === "geology" || next === "tectonics") setBoundaries(true);
  }

  const map = <MapPreview points={points} selected={location} boundaries={boundaries} bathymetry={bathymetry}
    color={source.color} zoom={zoom} onSelect={select} />;
  const degrees = (n: number, positive: string, negative: string) => `${Math.abs(n).toFixed(2)}° ${n < 0 ? negative : positive}`;
  const temp = temperature.find(([year]) => year === climateYear)?.[1];

  const sea = seaLevel.find(([year]) => year === seaYear);
  const selectedYear = indicator ? populationYear : layer === "environment" ? seaYear : layer === "climate" ? climateYear : layer === "footprint" ? emissionYear : undefined;
  const params = new URLSearchParams({ layer:indicator ?? layer, location:indicator ? country || "BGD" : location.id, view, zoom:String(zoom) });
  if (selectedYear) params.set("year",String(selectedYear));
  if (view === "globe" && heading) params.set("heading",String(Math.round(heading)));
  params.set("plates",boundaries ? "1" : "0");
  params.set("bathy",bathymetry ? "1" : "0");

  return <div className="atlas-console">
    <div className="atlas-layers" aria-label="Scientific data layers">
      {(Object.keys(atlasLayers) as AtlasLayer[]).map((key) => <button className="atlas-layer" type="button" key={key}
        aria-pressed={!indicator && key === layer} onClick={() => changeLayer(key)}>
        <span style={{ backgroundColor: atlasLayers[key].color }} />{atlasLayers[key].title}
      </button>)}
      {populationLayers.map((key) => <button className="atlas-layer" type="button" key={key} aria-pressed={indicator === key}
        onClick={() => { setIndicator(key); setHeading(0); }}><span style={{ backgroundColor:"#7ac8b5" }} />{populationIndicators[key].name}</button>)}
    </div>
    <div className="atlas-toolbar">
        <div className="atlas-controls">
          <button className="ghost-button" type="button" aria-pressed={view === "map"} onClick={() => { setView("map"); setGlobeReady(false); }}><Map size={17} /> Map</button>
          <button className="ghost-button" type="button" aria-pressed={view === "globe"} onClick={() => setView("globe")}><Globe2 size={17} /> 3D globe</button>
          <button className="ghost-button" type="button" aria-pressed={boundaries} onClick={() => setBoundaries(!boundaries)}>Plate boundaries</button>
          <button className="ghost-button" type="button" aria-pressed={bathymetry} onClick={() => setBathymetry(!bathymetry)}>Bathymetry</button>
          <button className="ghost-button" type="button" aria-disabled={zoom === 1} onClick={() => setZoom(Math.max(1, zoom - .5))} aria-label="Zoom out"><Minus size={17} /></button>
          <button className="ghost-button" type="button" aria-disabled={zoom === 3} onClick={() => setZoom(Math.min(3, zoom + .5))} aria-label="Zoom in"><Plus size={17} /></button>
          {view === "globe" && globeReady && <>
            <button className="ghost-button" type="button" onClick={() => setHeading(heading - 30)} aria-label="Rotate west"><RotateCcw size={18} /></button>
            <button className="ghost-button" type="button" onClick={() => setHeading(heading + 30)} aria-label="Rotate east"><RotateCw size={18} /></button>
          </>}
        </div>
      <AtlasBookmarks href={`/atlas?${params}`} label={indicator ? `${populationIndicators[indicator].name} · ${country || "BGD"}` : location.name} />
    </div>
    {indicator ? <AtlasPopulation indicator={indicator} country={country} year={populationYear} setYear={setPopulationYear} globe={view === "globe"} zoom={zoom}
      heading={heading} boundaries={boundaries} bathymetry={bathymetry} onModeChange={setGlobeReady} select={(id) => { setCountry(id); setHeading(0); }} /> : <div className="atlas-grid">
      <div className="atlas-map-panel">
        {view === "map" ? map : <div className={globeReady ? "atlas-drag" : undefined} onPointerDown={(event) => {
          if (globeReady && event.pointerType === "mouse" && event.button === 0) drag.current = { x: event.clientX, heading };
        }} onPointerMove={(event) => {
          if (drag.current && event.buttons & 1) setHeading(drag.current.heading + (event.clientX - drag.current.x) * .32);
        }} onPointerUp={() => { drag.current = null; }} onPointerLeave={() => { drag.current = null; }}>
          <LiveScene scene={{ kind: "globe", location, points: globePoints, showBoundaries: boundaries, bathymetry, heading,
            zoom, markerColor: source.color, onSelect: select }} explicit fallback={map} onModeChange={setGlobeReady} />
        </div>}
        <div className="atlas-legend">
          <span><i data-point style={{ backgroundColor: source.color }} /> {layer === "coastal" ? "Settlement size" : layer === "footprint" ? "Annual territorial CO₂" : "Selectable location"}</span>
          {boundaries && <span><i /> Plate boundaries</span>}
          {bathymetry && <span className="bathy-legend"><b /><b /><b /><b /> 200 m → 10,000 m</span>}
        </div>
        <details className="reference-fold"><summary>Layer source and limits</summary><p>{source.note}</p><a href={source.href}>{source.source}</a></details>
      </div>
      <div className="atlas-side">
        <label className="control-label" htmlFor="atlas-filter">Find a location</label>
        <input id="atlas-filter" className="control-field" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this layer" />
        {filtered.length ? <div className="atlas-location-list" aria-label="Matching locations">
          {filtered.map((item) => <button key={item.id} type="button" aria-pressed={item.id === location.id} className="ghost-button" onClick={() => select(item.id)}>{item.name}</button>)}
        </div> : <p className="mt-4" role="status">No locations match “{query}”.</p>}
        <section className="atlas-reading" aria-live="polite">
          <p className="mono section-label" style={{ color: source.color }}>{location.category}</p>
          <h2 className="subhead">{location.name}</h2>
          <p>{location.detail}</p>
          <p className="atlas-value">{location.value}</p>
          <p className="mono">{degrees(location.lat, "N", "S")} · {degrees(location.lon, "E", "W")}</p>
          {location.href && <a className="editorial-link mt-3" href={location.href}>Observation source</a>}
        </section>
        {layer === "climate" && <div className="atlas-record">
          <p className="mono">Global temperature anomaly</p>
          <TrendGraphic values={temperature} year={climateYear} label="Annual global temperature anomaly" color={source.color} />
          <label htmlFor="climate-year">Year <strong>{climateYear}</strong> · {temp?.toFixed(2)} °C</label>
          <input id="climate-year" type="range" min="1880" max="2025" value={climateYear} onChange={(event) => setClimateYear(event.currentTarget.valueAsNumber)} />
        </div>}
        {layer === "environment" && <div className="atlas-record">
          <p className="mono">Global mean sea level · CSIRO</p>
          <TrendGraphic values={seaLevelTrend} year={seaYear} label="Reconstructed global mean sea-level change relative to 1880" color={source.color} />
          <label htmlFor="atlas-sea-year">Year <strong>{seaYear}</strong> · {sea?.[1].toFixed(1)} cm</label>
          <input id="atlas-sea-year" type="range" min="1880" max="2013" value={seaYear} onChange={(event) => setSeaYear(event.currentTarget.valueAsNumber)} />
          {sea && <p>Source error bounds: {sea[2].toFixed(1)} to {sea[3].toFixed(1)} cm.</p>}
        </div>}
        {layer === "footprint" && <div className="atlas-record">
          <label className="control-label" htmlFor="emissions-year">Emissions year</label>
          <select className="control-field" id="emissions-year" value={emissionYear} onChange={(event) => setEmissionYear(Number(event.target.value))}>
            {emissionsYears.map((year) => <option key={year}>{year}</option>)}
          </select>
          <TrendGraphic values={getEmissionSeries(location.id)} year={emissionYear} label={`Territorial CO₂ for ${location.name}`} color={source.color} />
        </div>}
      </div>
    </div>}
  </div>;
}
