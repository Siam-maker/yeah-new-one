"use client";

import { useMemo, useState } from "react";
import { Globe2, Map, Minus, Plus, RotateCcw, RotateCw } from "lucide-react";
import { LiveScene } from "@/components/science/live-scene";
import type { AtlasPoint } from "@/lib/content/atlas";
import { indicatorColors, populationIndicators, type Country, type PopulationIndicator } from "@/lib/content/demographics";
import countryCenters from "@/public/data/country-centers.json";
import { PopulationMap } from "./population-map";

const centers:Record<string, number[]> = countryCenters;

export function PopulationVisual({ countries, country, compared, year, indicator, globe, changeGlobe, onSelect }: {
  countries:Country[]; country:Country; compared?:Country; year:number; indicator:PopulationIndicator;
  globe:boolean; changeGlobe:(next:boolean)=>void; onSelect:(id:string)=>void;
}) {
  const [heading,setHeading] = useState(0);
  const [zoom,setZoom] = useState(1);
  const [rendering,setRendering] = useState(false);
  const scale = populationIndicators[indicator];
  const colors = useMemo(()=>Object.fromEntries(countries.map((item)=>{
    const value = item.records[year]?.[indicator];
    return [item.id,value==null ? "#2c332e" : indicatorColors[scale.breaks.filter((stop)=>value>=stop).length]];
  })),[countries,year,indicator,scale]);
  const center = centers[country.id] ?? [0,0];
  const point:AtlasPoint = { id:country.id,name:country.name,lat:center[0],lon:center[1],region:country.region,category:scale.name,value:"",detail:"" };
  function select(id:string) { setHeading(0);onSelect(id); }
  const map = <PopulationMap countries={countries} year={year} indicator={indicator} selected={country.id} compared={compared?.id} onSelect={select} zoom={zoom} center={center} />;

  return <div className="population-visual">
    <div className="population-viewbar" aria-label="Population map views">
      <button className="ghost-button" type="button" aria-pressed={!globe} onClick={()=>changeGlobe(false)}><Map size={16} aria-hidden="true"/> Map</button>
      <button className="ghost-button" type="button" aria-pressed={globe} onClick={()=>changeGlobe(true)}><Globe2 size={16} aria-hidden="true"/> 3D globe</button>
      <button className="ghost-button" type="button" aria-label="Zoom in" disabled={zoom>=3} onClick={()=>setZoom(Math.min(3,zoom+.5))}><Plus size={16} aria-hidden="true"/></button>
      <button className="ghost-button" type="button" aria-label="Zoom out" disabled={zoom<=1} onClick={()=>setZoom(Math.max(1,zoom-.5))}><Minus size={16} aria-hidden="true"/></button>
      {globe && rendering && <>
        <button className="ghost-button" type="button" aria-label="Rotate west" onClick={()=>setHeading((value)=>value-24)}><RotateCcw size={16} aria-hidden="true"/></button>
        <button className="ghost-button" type="button" aria-label="Rotate east" onClick={()=>setHeading((value)=>value+24)}><RotateCw size={16} aria-hidden="true"/></button>
      </>}
    </div>
    {globe ? <LiveScene explicit onModeChange={setRendering}
      scene={{ kind:"globe", location:point, points:[], countryColors:colors, comparedId:compared?.id, showBoundaries:false,
        heading, zoom, markerColor:"#fff0cf", onSelect:select }} fallback={map} /> : map}
    {globe && rendering && <div className="population-legend" aria-label={`Legend, ${scale.unit}`}>
      {scale.labels.map((label,index)=><span key={label}><i style={{ background:indicatorColors[index] }} />{label}</span>)}
      <span><i style={{ background:"#2c332e" }} />No value</span>
    </div>}
    {compared && <p className="population-map-note">{countries.some((item)=>item.id===compared.id) ?
      <>Outlined countries <strong>{country.name}</strong> and <strong>{compared.name}</strong></> :
      <>{compared.name} is outside the current map filter. Its figures appear in the comparison below.</>}</p>}
  </div>;
}
