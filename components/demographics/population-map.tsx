"use client";

import { useEffect, useState } from "react";
import { decimal, indicatorColors, populationIndicators, type Country, type PopulationIndicator } from "@/lib/content/demographics";

export function PopulationMap({ countries, year, indicator, selected, onSelect, zoom = 1, center = [0, 0], bathymetry = false, boundaries = false }: {
  countries: Country[]; year: number; indicator: PopulationIndicator; selected: string; onSelect: (id:string)=>void;
  zoom?: number; center?: number[]; bathymetry?: boolean; boundaries?: boolean;
}) {
  const [paths,setPaths] = useState<Record<string,string>>();
  const [failed,setFailed] = useState(false);
  const [attempt,setAttempt] = useState(0);
  const [hovered,setHovered] = useState<string>();
  const scale = populationIndicators[indicator];

  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/country-paths.json", { signal:controller.signal }).then((response)=>{
      if (!response.ok) throw new Error("Map unavailable");
      return response.json() as Promise<Record<string,string>>;
    }).then(setPaths).catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  },[attempt]);

  const inspect = countries.find((country) => country.id === hovered) ?? countries.find((country) => country.id === selected);
  const width = 360 / zoom;
  const height = 180 / zoom;
  const left = Math.max(0, Math.min(360-width, center[1]+180-width/2));
  const top = Math.max(0, Math.min(180-height, 90-center[0]-height/2));
  const figure = inspect?.records[year]?.[indicator];
  return <figure className="population-map-shell">
    <div className="population-map-header"><p className="mono">{scale.name} · {year}</p>
      <output>{inspect ? `${inspect.name} · ${figure == null ? "No value" : `${decimal.format(figure)} ${scale.unit}`}` : "Select a country"}</output></div>
    <div className="population-map">
      <svg viewBox={`${left} ${top} ${width} ${height}`} aria-label={`Country-level map of ${scale.name.toLowerCase()} in ${year}`}>
        <rect width="360" height="180" fill="#101c2c" />
        {bathymetry && <image href="/data/bathymetry.webp" width="360" height="180" />}
        <path d="M0 45H360 M0 90H360 M0 135H360 M90 0V180 M180 0V180 M270 0V180" stroke="#94c9d4" strokeWidth=".25" opacity=".3" />
        {paths && countries.map((country) => {
          const value = country.records[year]?.[indicator];
          const color = value == null ? "#252b37" : indicatorColors[scale.breaks.filter((n)=>value>=n).length];
          return <path key={country.id} d={paths[country.id]} fill={color} fillRule="evenodd" stroke={selected===country.id ? "#fff4d8" : "#718091"}
            strokeWidth={selected===country.id ? ".85" : ".32"} aria-label={country.name}
            onPointerEnter={() => setHovered(country.id)} onPointerLeave={() => setHovered(undefined)}
            onClick={() => onSelect(country.id)} className="population-country"><title>{country.name}: {value == null ? "No value" : `${decimal.format(value)} ${scale.unit}`}</title></path>;
        })}
        {boundaries && <image href="/images/world-boundaries.svg" width="360" height="180" pointerEvents="none" />}
      </svg>
      {failed && <div className="map-state"><p>Map geometry is unavailable.</p><button className="ghost-button" type="button" onClick={() => { setFailed(false);setAttempt(attempt+1); }}>Try again</button></div>}
      {!paths && !failed && <p className="map-state" role="status">Loading country boundaries…</p>}
    </div>
    <div className="population-legend" aria-label={`Legend, ${scale.unit}`}>
      {scale.labels.map((label,index) => <span key={label}><i style={{ background:indicatorColors[index] }} />{label}</span>)}
      <span><i style={{ background:"#252b37" }} />No value</span>
    </div>
    <figcaption>Country boundaries from Natural Earth. Select a country here or with the keyboard-accessible country list.</figcaption>
  </figure>;
}
