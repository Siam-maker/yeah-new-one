"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { useCallback,useRef,useState } from "react";
import type { ExhibitState } from "./exhibit-query";

const environments = {
  ocean:{label:"Ocean descent", model:dynamic(()=>import("./ocean-lab").then((mod)=>mod.OceanLab)), href:"/lab/ocean-depth"},
  earth:{label:"Earth cutaway", model:dynamic(()=>import("./earth-interior").then((mod)=>mod.EarthInterior)), href:"/atlas#earth-interior"},
  space:{label:"Solar system", model:dynamic(()=>import("./cosmic-world").then((mod)=>mod.CosmicWorld)), href:"/lab/observatory"},
  climate:{label:"Climate & radiation", model:dynamic(()=>import("./climate-world").then((mod)=>mod.ClimateWorld)), href:"/lab/climate-pathways"},
} as const;
type Environment = keyof typeof environments;

export function WorldViewer() {
  const params = useSearchParams();
  const requested = params.get("scene");
  const current:Environment = requested && Object.hasOwn(environments,requested) ? requested as Environment : "ocean";
  const {model:Scene,label,href} = environments[current];
  const latest = useRef<{scene:Environment;state:ExhibitState} | null>(null);
  const update = useCallback((state:ExhibitState)=>{latest.current={scene:current,state};},[current]);
  const [shared,setShared] = useState<string>();
  const [manual,setManual] = useState<string>();
  return <section className="world-viewer layout-flow" id="live-world" aria-labelledby="world-exhibit-heading">
    <div className="world-exhibit-head">
      <nav className="pill-row" aria-label="Scientific environments">{(Object.keys(environments) as Environment[]).map((id)=><Link key={id} className="ghost-button" aria-current={current===id ? "page" : undefined} scroll={false} prefetch={false} href={`/world?scene=${id}#live-world`} onClick={()=>{setShared(undefined);setManual(undefined);}}>{environments[id].label}</Link>)}</nav>
      <div className="world-share"><button type="button" className="ghost-button" onClick={async()=>{
        const url=new URL("/world",window.location.origin);
        url.searchParams.set("scene",current);
        if (latest.current?.scene===current) for (const [key,value] of Object.entries(latest.current.state)) url.searchParams.set(key,String(value));
        url.hash="live-world";
        try { await navigator.clipboard.writeText(url.href);setShared(current);setManual(undefined); }
        catch { setManual(url.href); }
      }}>{shared===current ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}{shared===current ? "Link copied" : "Share exhibit"}</button>
      {manual && <input aria-label="Shareable exhibit link" className="control-field" value={manual} readOnly onFocus={(event)=>event.currentTarget.select()} />}</div>
    </div>
    <div><h2 className="subhead" id="world-exhibit-heading">{label}</h2><p className="lab-key">Select a subject to inspect it in place. The lab page gives more background and sources.</p></div>
    <Scene key={current} query={{params,update}} />
    <Link className="editorial-link" href={href}>Open experiment and sources</Link>
  </section>;
}
