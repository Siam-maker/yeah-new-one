"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PopulationMap } from "@/components/demographics/population-map";
import { usePopulation } from "@/components/demographics/use-population";
import { decimal, indicatorColors, populationIndicators, populationNoValue, type PopulationIndicator } from "@/lib/content/demographics";
import countryCenters from "@/public/data/country-centers.json";
import { LiveScene } from "./live-scene";
import type { AtlasPoint } from "@/lib/content/atlas";

const centers: Record<string, number[]> = countryCenters;

export function AtlasPopulation({ indicator, country, year, setYear, globe, zoom, heading, boundaries, bathymetry, select, onModeChange }: {
  indicator: PopulationIndicator; country: string; year: number; setYear: (n: number) => void; globe: boolean; zoom: number; heading: number;
  boundaries: boolean; bathymetry: boolean; select: (id: string) => void; onModeChange: (seen: boolean) => void;
}) {
  const { data, error, retry } = usePopulation();
  const [region, setRegion] = useState("All regions");
  const [query, setQuery] = useState("");
  const usableYear = data?.years.includes(year) ? year : 2023;
  const scale = populationIndicators[indicator];
  const countries = useMemo(() => (data?.countries ?? []).filter((item) => region === "All regions" || item.region === region), [data, region]);
  const colors = useMemo(() => Object.fromEntries(countries.map((item) => {
    const value = item.records[usableYear]?.[indicator];
    return [item.id, value == null ? populationNoValue : indicatorColors[scale.breaks.filter((stop) => value >= stop).length]];
  })), [countries, usableYear, indicator, scale]);
  if (!data) return <div className="pane" role="status">{error ? <>Population data is unavailable. <button type="button" className="ghost-button" onClick={retry}>Try again</button></> : "Loading country indicators…"}</div>;
  const current = countries.find((item) => item.id === country) ?? countries.find((item) => item.id === "BGD") ?? countries[0];
  const matching = countries.filter((item) => `${item.name} ${item.id}`.toLowerCase().includes(query.toLowerCase().trim()));
  const value = current.records[usableYear]?.[indicator];
  const [lat, lon] = centers[current.id] ?? [0, 0];
  const map = <PopulationMap countries={countries} year={usableYear} indicator={indicator} selected={current.id} onSelect={select}
    zoom={zoom} center={[lat,lon]} bathymetry={bathymetry} boundaries={boundaries} />;
  const point: AtlasPoint = { id:current.id, name:current.name, category:scale.name, region:current.region, lat, lon, value:"", detail:"" };
  return <div className="atlas-grid atlas-pop-grid">
    <div className="atlas-map-panel">
      {globe ? <>
        <LiveScene scene={{ kind:"globe", location:point, points:[], countryColors:colors, showBoundaries:boundaries, bathymetry, heading, zoom,
          markerColor:"#fff4d8", onSelect:select }} fallback={map} explicit onModeChange={onModeChange} />
        <div className="population-legend" aria-label={`Legend, ${scale.unit}`}>{scale.labels.map((label,index) => <span key={label}><i style={{ background:indicatorColors[index] }} />{label}</span>)}
          <span><i style={{ background:populationNoValue }} />No value</span></div>
      </> : map}
      <details className="reference-fold"><summary>Sources and coverage</summary><p>UN World Population Prospects 2024 supplies population estimates and medium projections. Gapminder distributes the UN density series and World Bank urban shares through 2023 where available. Colors represent national values.</p><Link href="/data/DEMOGRAPHICS.md">Data preparation and limitations</Link></details>
    </div>
    <section className="atlas-side">
      <label className="control-label" htmlFor="atlas-pop-year">Snapshot year</label>
      <select id="atlas-pop-year" className="control-field" value={usableYear} onChange={(event) => setYear(Number(event.target.value))}>
        {data.years.map((option) => <option key={option} value={option}>{option}{option > 2023 ? " · projection" : ""}</option>)}</select>
      <label className="control-label mt-4" htmlFor="atlas-pop-region">Filter by region</label>
      <select id="atlas-pop-region" className="control-field" value={region} onChange={(event) => {
        const next = event.target.value;
        setRegion(next);
        if (next !== "All regions" && current.region !== next) select(data.countries.find((item) => item.region === next)?.id ?? current.id);
      }}>
        {["All regions", ...new Set(data.countries.map((item) => item.region))].map((option) => <option key={option}>{option}</option>)}</select>
      <label className="control-label mt-4" htmlFor="atlas-pop-filter">Find a country</label>
      <input id="atlas-pop-filter" className="control-field" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
      <label className="control-label mt-4" htmlFor="atlas-pop-country">Select a country</label>
      <select id="atlas-pop-country" className="control-field" value={matching.some((item) => item.id === current.id) ? current.id : ""} onChange={(event) => select(event.target.value)}>
        {!matching.some((item) => item.id === current.id) && <option value="" disabled>{matching.length ? "Choose a match" : "No matching countries"}</option>}
        {matching.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <div className="atlas-reading" aria-live="polite"><p className="mono section-label">{scale.name} · {usableYear}</p><h2 className="subhead">{current.name}</h2>
        <p className="atlas-value">{value == null ? "No value available" : `${decimal.format(value)} ${scale.unit}`}</p>
        <Link className="editorial-link" href={`/demographics?indicator=${indicator}&country=${current.id}&year=${usableYear}`}>Open demographic analysis</Link>
      </div>
    </section>
  </div>;
}
