"use client";

import { useState } from "react";
import { ExhibitImage } from "@/components/editorial/exhibit-image";
import { CameraControls, defaultCamera } from "./camera-controls";
import { readCamera, useExhibitSnapshot, type ExhibitQuery } from "./exhibit-query";
import { LiveScene } from "./live-scene";

const processes = {
  incoming:["Incoming sunlight","The sun supplies shortwave radiation. Land, water, clouds and the atmosphere absorb some of that energy. The uneven distribution of heating helps drive circulation."],
  reflection:["Reflection","Clouds, air and brighter surfaces reflect part of the incoming sunlight. When snow or ice gives way to darker land or water, more sunlight can be absorbed, amplifying warming."],
  infrared:["Outgoing infrared","The surface and atmosphere emit thermal infrared radiation. Greenhouse gases absorb and emit in specific bands. Changing their concentration changes how effectively energy escapes to space for a given temperature profile."],
} as const;
type EnergyProcess=keyof typeof processes;

export function ClimateWorld({query}:{query?:ExhibitQuery}={}) {
  const [process,setProcess] = useState<EnergyProcess>(()=>{const id=query?.params.get("process");return id && Object.hasOwn(processes,id) ? id as EnergyProcess : "incoming";});
  const [camera,setCamera] = useState(()=>readCamera(query));
  const [enable3D,setEnable3D] = useState(false);
  useExhibitSnapshot(query,{process,...camera});
  return <div className="lab-layout climate-exhibit">
    <LiveScene scene={{kind:"climate",process,camera,onInspect:setProcess}} explicit={enable3D} fallback={<div className="climate-world-fallback"><ExhibitImage src="/data/bathymetry.webp" fill alt="" sizes="(max-width:800px) 94vw, 50vw" /><span className="world-stage-label mono">{processes[process][0]} · concept illustration</span></div>} />
    <section className="pane lab-controls">
      <div className="pill-row" aria-label="Radiation pathways">{(Object.keys(processes) as EnergyProcess[]).map((id)=><button className="ghost-button" type="button" key={id} aria-pressed={process===id} onClick={()=>setProcess(id)}>{processes[id][0]}</button>)}</div>
      <div aria-live="polite"><h3 className="subhead">{processes[process][0]}</h3><p>{processes[process][1]}</p></div>
      <CameraControls value={camera} onChange={setCamera} />
      <div className="pill-row"><button type="button" className="ghost-button scene-opt-in" aria-pressed={enable3D} onClick={()=>setEnable3D(!enable3D)}>Enable interactive 3D</button>
        <button type="button" className="ghost-button" onClick={()=>{setProcess("incoming");setCamera(defaultCamera);}}>Reset energy exhibit</button></div>
      <p className="lab-key">Inspect the arrows or use the buttons. Arrow lengths and brightness are illustrative. For measured temperatures, use the climate records experiment.</p>
      <a className="editorial-link" href="https://earthobservatory.nasa.gov/features/EnergyBalance">NASA Earth Observatory · Earth’s energy budget</a>
    </section>
  </div>;
}
