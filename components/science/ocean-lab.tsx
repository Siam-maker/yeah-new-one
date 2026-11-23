"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { oceanZonesBn } from "@/lib/i18n/bengali-instruments";
import { zones, zoneAt } from "@/lib/content/ocean";
import { CameraControls, defaultCamera } from "./camera-controls";
import { readCamera, readNumber, useExhibitSnapshot, type ExhibitQuery } from "./exhibit-query";
import { LiveScene } from "./live-scene";
import { OceanEnvironment } from "@/components/home/ocean-environment";

const format = new Intl.NumberFormat("en-US");
const maximum = 11000;

export function OceanLab({locale="en",query}:{locale?:"en"|"bn";query?:ExhibitQuery} = {}) {
  const bn=locale==="bn";
  const digits=new Intl.NumberFormat(locale,{maximumFractionDigits:2});
  const [depth, setDepth] = useState(()=>Math.round(readNumber(query,"depth",zones[0].sample,0,maximum)/5)*5);
  const [clarity,setClarity] = useState(()=>[.035,.08,.16].find((value)=>value===Number(query?.params.get("clarity"))) ?? .035);
  const [enable3D,setEnable3D] = useState(false);
  const [camera,setCamera] = useState(()=>readCamera(query));
  const [hotspot,setHotspot] = useState<"organism" | "seabed">(()=>query?.params.get("hotspot")==="seabed" ? "seabed" : "organism");
  useExhibitSnapshot(query,{depth,clarity,hotspot,...camera});
  const zone = zoneAt(depth);
  const index = zones.indexOf(zone);
  const [name,light,life,organism] = bn ? oceanZonesBn[zone.id] : [zone.name,zone.light,zone.life,zone.organism];
  const lightShare = 100 * Math.exp(-clarity * depth);

  return <>
    <div className="lab-layout">
      <div className="ocean-exhibit">
        <LiveScene scene={{ kind: "ocean", depth, clarity, camera, hotspot, onInspect:setHotspot }} explicit={enable3D} locale={locale} fallback={<div className="ocean-fallback" style={{ backgroundColor: zone.fog }}>
          <OceanEnvironment layer={index} />
          <div className="ocean-fallback-trench" />
          <span className="mono ocean-fallback-label">{name} · {digits.format(depth)} m</span>
        </div>} />
        {depth >= 1000 && <span className="ocean-light-key mono">{bn ? "দেখার জন্য কৃত্রিম আলো" : "Artificial light for viewing"}</span>}
      </div>
      <section className="pane lab-controls" aria-labelledby="ocean-controls">
        <div><p className="mono section-label">{bn ? "পানির স্তম্ভ" : "Water column"}</p><h2 id="ocean-controls" className="subhead">{name}</h2></div>
        <label htmlFor="ocean-depth-range" className="control-label">{bn ? "নামার গভীরতা" : "Descent depth"}</label>
        <input id="ocean-depth-range" type="range" min="0" max={maximum} step="5" value={depth}
          aria-valuetext={`${digits.format(depth)} metres, ${name}`}
          onChange={(event) => setDepth(event.currentTarget.valueAsNumber)} />
        <div className="pill-row">
          <button className="ghost-button" type="button" aria-disabled={index === 0} onClick={() => { if (index > 0) setDepth(zones[index - 1].sample); }}><ArrowUp size={17} /> {bn ? "ওপরে উঠুন" : "Shallower"}</button>
          <button className="ghost-button" type="button" aria-disabled={index === zones.length - 1} onClick={() => { if (index < zones.length - 1) setDepth(zones[index + 1].sample); }}><ArrowDown size={17} /> {bn ? "আরও নামুন" : "Deeper"}</button>
        </div>
        <dl className="lab-readout" aria-live="polite">
          <div><dt>{bn ? "গভীরতা" : "Depth"}</dt><dd>{digits.format(depth)} m</dd></div>
          <div><dt>{bn ? "আনুমানিক চাপ" : "Approx. pressure"}</dt><dd>{digits.format(1 + Math.round(depth / 10))} atm</dd></div>
        </dl>
        <div className="lab-optics"><label>{bn ? "পানির স্বচ্ছতা" : "Water clarity"}<select className="control-field" value={clarity} onChange={(event)=>setClarity(Number(event.target.value))}>
          <option value="0.035">{bn ? "স্বচ্ছ পানি · উদাহরণ" : "Clear water \u00b7 example"}</option><option value="0.08">{bn ? "বেশি কণা · উদাহরণ" : "More particles \u00b7 example"}</option><option value="0.16">{bn ? "ঘোলা পানি · উদাহরণ" : "Turbid water \u00b7 example"}</option>
        </select></label>
          <p>{bn ? "মডেলে পৃষ্ঠের আলোর অবশিষ্ট অংশ" : "Modeled surface light remaining"} <strong>{lightShare < .01 ? `< ${digits.format(.01)}` : digits.format(lightShare)}%</strong></p>
          <meter aria-label={bn ? "মডেলে বাকি আলো" : "Modeled light remaining"} min={0} max={100} value={lightShare} />
          <p className="lab-key">{bn ? "সমান গুণের পানির জন্য exp(−k × গভীরতা) সূত্র। স্বচ্ছতার মান উদাহরণ। প্রকৃত আলো তরঙ্গদৈর্ঘ্য ও পানির স্থানীয় অবস্থার ওপর নির্ভর করে।" : "Uniform-water model using exp(\u2212k \u00d7 depth). The clarity settings are illustrative. Real light depends on wavelength and local water conditions."}</p>
        </div>
        <button className="ghost-button" type="button" onClick={()=>{setDepth(zones[0].sample);setClarity(.035);setCamera(defaultCamera);setHotspot("organism");}}>{bn ? "আগের অবস্থায় ফেরান" : "Reset descent"}</button>
        <div><p>{light}</p><p className="editorial-text">{life}</p></div>
        <div className="exhibit-hotspots" aria-label={bn ? "দৃশ্যের তথ্য" : "Ocean hotspots"}>
          <div className="pill-row"><button type="button" className="ghost-button" aria-pressed={hotspot === "organism"} onClick={()=>setHotspot("organism")}>{bn ? "সামুদ্রিক জীবন" : "Marine life"}</button>
            <button type="button" className="ghost-button" aria-pressed={hotspot === "seabed"} onClick={()=>setHotspot("seabed")}>{bn ? "সমুদ্রতল" : "Seabed"}</button></div>
          <p className="lab-key" aria-live="polite">{hotspot === "organism" ? organism : zone.id === "hadal" ? bn ? "খাড়া ঢাল বেয়ে জৈব কণা খাতে নামতে পারে।" : "Steep trench slopes can funnel organic particles into the depression." : bn ? "এই দৃশ্য সমুদ্রতলের গড়নের উদাহরণ। মাপা ও অনুমিত গভীরতা দেখতে অ্যাটলাসের সমুদ্রতল স্তর খুলুন।" : "This illustrative terrain shows relief. Use the Atlas bathymetry layer to inspect measured and interpolated depths."}</p>
        </div>
        <CameraControls value={camera} onChange={setCamera} locale={locale} />
      </section>
    </div>
    <div className="zone-choices" aria-label={bn ? "গভীরতার স্তর বাছুন" : "Jump to a depth zone"}>
      {zones.map((item) => <button className="ghost-button" type="button" key={item.id} aria-pressed={zone.id === item.id} onClick={() => setDepth(item.sample)}>{bn ? oceanZonesBn[item.id][0] : item.name}</button>)}
    </div>
    <div className="scene-opt-in"><button type="button" className="ghost-button" aria-pressed={enable3D} onClick={() => setEnable3D(!enable3D)}>{bn ? "ত্রিমাত্রিক দৃশ্য চালু করুন" : "Enable interactive 3D"}</button></div>
    <p className="lab-key">{bn ? "স্তরের সীমানা আনুমানিক। চাপের হিসাবে পৃষ্ঠে প্রায় ১ atm এবং প্রতি ১০ m সমুদ্রজলে আরও ১ atm ধরা হয়েছে। দৃশ্যের জীব ও বাসস্থান উদাহরণ।" : "Zones are approximate. Pressure uses the rule of thumb of about 1 atmosphere at the surface plus 1 per 10 metres of seawater. The view depicts example habitats and organisms."}</p>
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
