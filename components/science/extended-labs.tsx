"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { usePopulation } from "@/components/demographics/use-population";
import { decimal, integer } from "@/lib/content/demographics";
import { habitatPoints } from "@/lib/content/atlas";
import { seaLevel, seaLevelTrend, temperature } from "@/lib/content/observations";
import { ScienceDiagram } from "@/components/editorial/diagram";
import { DisciplineInstrument } from "./discipline-instrument";
import { PressureInstrument } from "./pressure-instrument";
import { LiveScene } from "./live-scene";
import { ClimateInstrument, TrendGraphic } from "./trend";

export function PressureLab() {
  return <div className="two-panel"><PressureInstrument /><section className="pane"><h2 className="subhead">A ten-metre test</h2>
    <p>The weight of the water column adds pressure. At the surface absolute pressure is about 1 atm. At 100 m it is about 11 atm, or 1.1 MPa.</p>
    <p className="mt-4">Move the control to 100 m and 200 m. Each additional 100 m adds about 10 atm. Seawater density and gravity vary, so this shortcut gives an approximate value.</p></section></div>;
}

export function SeismicLab() {
  const [distance, setDistance] = useState(120);
  const p = distance / 6;
  const s = distance / 3.5;
  const position = (time: number) => 24 + time / 90 * 342;
  return <section className="instrument lab-wide">
    <div className="instrument-head"><p className="mono">P–S arrival gap</p><p><strong className="instrument-reading">{decimal.format(s-p)}</strong> s</p></div>
    <svg viewBox="0 0 390 112" className="data-trend" role="img" aria-label={`P wave at ${decimal.format(p)} seconds. S wave at ${decimal.format(s)} seconds.`}>
      <path d="M24 77H366" stroke="#7795a7" /><path d={`M${position(p)} 80V41 M${position(s)} 80V58`} stroke="#55dce8" strokeWidth="2" />
      <g fill="#f0ede5" fontSize="13"><text x={position(p)} y="32" textAnchor="middle">P</text><text x={position(s)} y="53" textAnchor="middle">S</text><text x="24" y="103">0 s</text><text x="366" y="103" textAnchor="end">90 s</text></g>
    </svg>
    <label htmlFor="seismic-range">Distance from source <strong>{distance} km</strong></label>
    <input id="seismic-range" type="range" min="20" max="300" step="5" value={distance} onChange={(event) => setDistance(event.currentTarget.valueAsNumber)} />
    <p>P arrival {decimal.format(p)} s · S arrival {decimal.format(s)} s</p>
    <p className="instrument-note">Use the gap to estimate distance in uniform rock. This model uses constant example speeds of 6 km/s for compressional P waves and 3.5 km/s for shear S waves. Real paths bend through rocks with different properties.</p>
  </section>;
}

export function ClimateChangeLab() {
  const [year, setYear] = useState(2013);
  const sea = seaLevel.find(([time]) => year === time);
  const heat = temperature.find(([time]) => year === time);
  return <section className="instrument">
    <label htmlFor="climate-lab-year">Observation year <strong>{year}</strong></label>
    <input id="climate-lab-year" type="range" min="1880" max="2013" value={year} onChange={(event) => setYear(event.currentTarget.valueAsNumber)} />
    <div className="two-panel">
      <figure><h2 className="subhead">Surface temperature</h2>
        <TrendGraphic values={temperature.filter(([time]) => time <= 2013)} year={year} label="NASA global temperature anomalies in °C, 1880 to 2013" color="#b2a6ff" />
        <figcaption>{heat?.[1].toFixed(2)} °C relative to 1951–1980. NASA GISTEMP v4.</figcaption></figure>
      <figure><h2 className="subhead">Global mean sea level</h2>
        <TrendGraphic values={seaLevelTrend} year={year} label="CSIRO reconstructed global sea-level change in centimetres, 1880 to 2013" />
        <figcaption>{sea?.[1].toFixed(1)} cm relative to 1880. {sea && `Source bounds ${sea[2].toFixed(1)} to ${sea[3].toFixed(1)} cm.`}</figcaption></figure>
    </div>
    <p className="instrument-note">Compare different baselines and units over a shared period. Warm seawater expands, and melting land ice adds water. Many processes affect the annual records, and a global mean does not predict a local shoreline.</p>
  </section>;
}

export function TemperatureLab() {
  return <div className="two-panel"><ClimateInstrument /><section className="pane"><h2 className="subhead">Read the anomaly</h2>
    <p>An anomaly is a difference relative to a reference period. In this series, a value of +1 °C indicates a global annual mean one degree warmer than the 1951–1980 mean.</p>
    <p className="mt-4">Compare adjacent years and then two years several decades apart. A year-to-year difference has a different meaning from a trend measured over decades.</p></section></div>;
}

export function CarbonLab() {
  return <DisciplineInstrument slug="human-footprint" />;
}

export function GrowthLab() {
  const { data, error, retry } = usePopulation();
  const [country, setCountry] = useState("BGD");
  const [target, setTarget] = useState(2050);
  const [rate, setRate] = useState(1);
  const selected = data?.countries.find((item) => item.id === country);
  const baseline = selected?.records[2023]?.population;
  const projection = selected?.records[target]?.population;
  const calculated = baseline && baseline * (1 + rate / 100) ** (target - 2023);
  const max = Math.max(calculated ?? 0, projection ?? 0, 1);
  return <section className="instrument lab-wide">
    {!data ? <p role="status">{error ? <>Population data is unavailable. <button type="button" className="ghost-button" onClick={retry}>Try again</button></> : "Loading UN population estimates…"}</p> : <>
      <div className="compare-controls">
        <label>Country<select className="control-field" value={country} onChange={(event) => setCountry(event.target.value)}>{data.countries.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Target year<select className="control-field" value={target} onChange={(event) => setTarget(Number(event.target.value))}>
          {[2030, 2040, 2050].map((year) => <option key={year}>{year}</option>)}</select></label>
      </div>
      <label htmlFor="growth-rate">Annual change <strong>{rate.toFixed(1)}%</strong></label>
      <input id="growth-rate" type="range" min="-4" max="5" step="0.1" value={rate} onChange={(event) => setRate(event.currentTarget.valueAsNumber)} />
      {baseline != null && <p>2023 estimate · {integer.format(baseline)} people</p>}
      <div className="compare-bars">{[["Fixed-rate model",calculated],["UN medium projection",projection]].map(([label, value]) => <div key={label}>
        <p>{label} · {typeof value === "number" ? `${integer.format(value)} people` : "Unavailable"}</p><span style={{ width:`${(Number(value) || 0) / max * 100}%` }} /></div>)}</div>
      <p className="instrument-note">The fixed-rate model applies the same percentage to the changing population each year. The UN medium projection uses separate assumptions about fertility, mortality, and migration. Matching its total does not reproduce those assumptions.</p>
      <Link href={`/demographics/${country.toLowerCase()}`} className="editorial-link">Inspect this country’s age structure</Link>
    </>}
  </section>;
}

function separation(a: typeof habitatPoints[number], b: typeof habitatPoints[number]) {
  const rad = Math.PI / 180;
  const h = Math.sin((a.lat-b.lat)*rad/2)**2 + Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin((a.lon-b.lon)*rad/2)**2;
  return 2*6371*Math.asin(Math.sqrt(Math.min(1, h)));
}

export function BiodiversityLab() {
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(1);
  const pair = [habitatPoints[first], habitatPoints[second]];
  const id = useId();
  return <section className="instrument">
    <div className="instrument-head"><p className="mono">Great-circle separation</p><p><strong className="instrument-reading">{integer.format(separation(pair[0], pair[1]))}</strong> km</p></div>
    <div className="compare-controls">{[first,second].map((value,index) => <label key={index}>Site {index === 0 ? "A" : "B"}
      <select className="control-field" value={value} onChange={(event) => (index === 0 ? setFirst : setSecond)(Number(event.target.value))}>
        {habitatPoints.map((point,i) => <option key={point.id} value={i}>{point.name}</option>)}</select></label>)}</div>
    <svg viewBox="0 0 360 180" className="atlas-map" role="img" aria-labelledby={id}>
      <title id={id}>{pair.map((point) => point.name).join(" and ")}</title><rect width="360" height="180" fill="#122437" /><image href="/data/atlas-land.svg" width="360" height="180" />
      {pair.map((point,index) => <circle key={index} cx={point.lon+180} cy={90-point.lat} r={index===0 ? 4 : 2.8} fill={index===0 ? "#55dce8" : "#e5b779"} stroke="#080b10" />)}
    </svg>
    <div className="two-panel">{pair.map((point,index) => <section key={index} className="pane">
      <p className="mono">{point.category}</p><h2 className="subhead">{point.name}</h2><p>{point.detail}</p><a className="editorial-link mt-3" href={point.href}>Site information</a></section>)}</div>
    <p className="instrument-note">Compare habitat and geography at these four documented sites. Distance is calculated between representative points on a spherical Earth. These examples do not measure species richness, abundance, or habitat extent.</p>
  </section>;
}

export function LightTravelLab() {
  return <div className="two-panel"><DisciplineInstrument slug="space-time" /><section className="pane"><h2 className="subhead">Light carries the past</h2>
    <p>Try 1 au for the approximate Sun–Earth distance, then 5 au for a distance approaching Jupiter’s mean orbital radius. Compare how much the signal delay grows.</p>
    <p className="mt-4">The experiment uses a fixed straight-line distance in vacuum. Distances between planets change with their positions in orbit.</p><Link className="editorial-link mt-3" href="/lab/observatory">Explore the orbital clock</Link></section></div>;
}

const layers = [
  ["Crystalline basement", "Older igneous or metamorphic rock can be exposed before sediment is deposited above it."],
  ["Basal conglomerate", "Rounded pebbles in a finer matrix point to transport energetic enough to carry coarse material."],
  ["Limestone", "Carbonate grains and fossils can identify a depositional setting."],
  ["Shale", "Very fine particles can settle in quiet water. Later compaction produces thin layers."],
  ["Sandstone", "Grain size and the geometry of bedding help reconstruct how currents moved the sand."],
  ["Caprock", "A more resistant bed can shield softer layers below it and help form a cliff."],
] as const;

export function CrossSectionLab() {
  const [layer, setLayer] = useState(3);
  const [explicit,setExplicit] = useState(false);
  return <div className="lab-layout">
    <LiveScene scene={{ kind:"strata", layer }} explicit={explicit} fallback={<ScienceDiagram kind="strata" />} />
    <section className="pane lab-controls" aria-label="Geological layers">
      <div><p className="mono section-label">Bed {layer+1} of {layers.length} · bottom to top</p><h2 className="subhead">{layers[layer][0]}</h2><p>{layers[layer][1]}</p></div>
      <label>Inspect a bed<select className="control-field" value={layer} onChange={(event) => setLayer(Number(event.target.value))}>{layers.map(([name],index) => <option key={name} value={index}>{name}</option>)}</select></label>
      <button type="button" className="ghost-button scene-opt-in" aria-pressed={explicit} onClick={() => setExplicit(!explicit)}>Enable interactive 3D</button>
      <p className="lab-key">Compare older and younger beds in this illustrative sequence. Bed numbers indicate relative order in this model. Thickness and absolute ages are unspecified. Faulting, folding and erosion can disrupt real sequences.</p>
    </section>
  </div>;
}
