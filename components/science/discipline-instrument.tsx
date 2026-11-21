"use client";

import { useId, useState } from "react";
import { zoneAt } from "@/lib/content/ocean";
import { atlasPoints, emissionsYears } from "@/lib/content/observations";
import { AnimatedReading, ClimateInstrument } from "./trend";

export function PressureInstrument() {
  const id = useId();
  const [depth, setDepth] = useState(1000);
  const zone = zoneAt(depth);
  return <section className="instrument pressure-instrument" aria-label="Ocean pressure experiment">
    <div className="instrument-head"><p className="mono">{zone.name}</p><p><AnimatedReading value={1 + depth / 10} digits={0} /> <span>atm</span></p></div>
    <div className="depth-ruler" aria-hidden="true"><span style={{ width: `${depth / 110}%` }} /></div>
    <label htmlFor={id}>Water depth <strong>{depth.toLocaleString("en")} m</strong></label>
    <input id={id} type="range" min="0" max="11000" step="100" value={depth} onChange={(event) => setDepth(event.currentTarget.valueAsNumber)} />
    <p className="instrument-note">Approximate absolute pressure. Start at 1 atmosphere and add about 1 for every 10 metres of seawater.</p>
  </section>;
}

const beds = [
  ["Caprock", "A resistant layer may protect softer rock beneath it from erosion."],
  ["Sandstone", "Sorting and cross-beds can help distinguish how sand moved before burial."],
  ["Shale", "Fine grains can settle out of relatively calm water."],
  ["Limestone", "Composition and fossils can point to carbonate-producing environments."],
  ["Unconformity", "An erosional surface can separate deposits across missing time."],
  ["Basement rock", "Older igneous or metamorphic material can lie beneath younger sediment."],
] as const;

const fossilWindows = [
  ["Ediacaran", "Some soft-bodied organisms survive as impressions. Preservation conditions strongly shape the record."],
  ["Cambrian", "Hard parts and exceptional soft-tissue deposits preserve different views of marine diversification."],
  ["Devonian", "Fish fossils and plant remains record communities in water and on land at different sites."],
  ["Cretaceous", "Pollen, leaves and bones provide different views of organisms in the same interval."],
] as const;

function SampleInstrument({ mode }: { mode: "rocks" | "fossils" }) {
  const id = useId();
  const items = mode === "fossils" ? fossilWindows : beds;
  const [selected, setSelected] = useState(0);
  return <section className="instrument" aria-label={mode === "rocks" ? "Illustrated core sample" : "Fossil record comparison"}>
    <div className="sample-strips" aria-hidden="true">{items.map(([label], index) =>
      <span key={label} data-selected={index === selected} style={{ "--band": index } as React.CSSProperties} />)}</div>
    <label htmlFor={id}>{mode === "rocks" ? "Inspect a layer" : "Compare intervals"} <strong>{items[selected][0]}</strong></label>
    <input id={id} type="range" min="0" max={items.length - 1} value={selected} aria-valuetext={items[selected][0]}
      onChange={(event) => setSelected(event.currentTarget.valueAsNumber)} />
    <p>{items[selected][1]}</p><p className="instrument-note">Teaching diagram. Bands indicate sequence rather than thickness, abundance or duration.</p>
  </section>;
}

function LightInstrument() {
  const id = useId();
  const [distance, setDistance] = useState(1);
  const seconds = distance * 149597870700 / 299792458;
  return <section className="instrument" aria-label="Light travel time model">
    <div className="instrument-head"><p className="mono">Light travel time</p><p><AnimatedReading value={seconds / 60} digits={2} /> <span>min</span></p></div>
    <div className="light-ruler" style={{ "--distance": distance / 5 } as React.CSSProperties} aria-hidden="true" />
    <label htmlFor={id}>Distance <strong>{distance.toFixed(1)} au</strong></label>
    <input id={id} type="range" min=".1" max="5" step=".1" value={distance} onChange={(event) => setDistance(event.currentTarget.valueAsNumber)} />
    <p className="instrument-note">Distance divided by light speed in vacuum. One astronomical unit is exactly 149,597,870,700 metres.</p>
  </section>;
}

function SignalInstrument() {
  const id = useId();
  const [noise, setNoise] = useState(.5);
  const sample = (scale: number) => Array.from({ length: 96 }, (_, index) =>
    `${index * 4},${66 - Math.sin(index * .15) * 32 + Math.sin(index * 12.43) * scale * 37}`).join(" ");
  return <section className="instrument" aria-label="Signal and noise illustration">
    <div className="instrument-head"><p className="mono">Signal & noise model</p><p><AnimatedReading value={noise * 100} digits={0} /><span>%</span></p></div>
    <svg viewBox="0 0 380 132" className="data-trend" role="img" aria-label="An underlying wave with added procedural variation">
      <polyline points={sample(0)} fill="none" stroke="#827aff" strokeWidth="3" />
      <polyline points={sample(noise)} fill="none" stroke="#55dce8" strokeWidth="1.4" />
    </svg>
    <label htmlFor={id}>Added noise <strong>{Math.round(noise * 100)}%</strong></label>
    <input id={id} type="range" min="0" max="1" step=".05" value={noise} onChange={(event) => setNoise(event.currentTarget.valueAsNumber)} />
    <p className="instrument-note">Cyan is the modeled observation. Violet is the original wave. The controls change an illustrative simulation.</p>
  </section>;
}

function EmissionsInstrument() {
  const [year, setYear] = useState(2023);
  const [first, setFirst] = useState("co2-united-states");
  const [second, setSecond] = useState("co2-india");
  const points = atlasPoints("footprint", year).toSorted((a, b) => a.name.localeCompare(b.name));
  const selected = [points.find((item) => item.id === first), points.find((item) => item.id === second)];
  const max = Math.max(1, ...selected.map((item) => item?.magnitude ?? 0));

  return <section className="instrument" aria-label="Compare national carbon dioxide totals">
    <p className="mono">Territorial CO₂ · Mt</p>
    <div className="compare-controls">
      <label>Territory A<select className="control-field" value={first} onChange={(event) => setFirst(event.currentTarget.value)}>
        {points.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label>Territory B<select className="control-field" value={second} onChange={(event) => setSecond(event.currentTarget.value)}>
        {points.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label>Year<select className="control-field" value={year} onChange={(event) => setYear(Number(event.currentTarget.value))}>
        {emissionsYears.map((time) => <option key={time}>{time}</option>)}</select></label>
    </div>
    <div className="compare-bars">{selected.map((item, index) => <div key={index}><p>{item?.name ?? "No record"} · {item?.value ?? "Unavailable for this year"}</p>
      <span style={{ width: `${(item?.magnitude ?? 0) / max * 100}%` }} /></div>)}</div>
    <p className="instrument-note">Global Carbon Budget via Our World in Data. Annual fossil and industrial CO₂ totals exclude land-use change.</p>
  </section>;
}

export function DisciplineInstrument({ slug }: { slug: string }) {
  switch (slug) {
    case "climate-atmosphere": return <ClimateInstrument />;
    case "earth-geology": return <SampleInstrument mode="rocks" />;
    case "evolution-biodiversity": return <SampleInstrument mode="fossils" />;
    case "space-time": return <LightInstrument />;
    case "human-footprint": return <EmissionsInstrument />;
    case "systems-signals": return <SignalInstrument />;
    default: return <PressureInstrument />;
  }
}
