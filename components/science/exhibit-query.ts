import { useEffect } from "react";
import { defaultCamera, type CameraView } from "./camera-controls";

export type ExhibitState = Record<string,number|string>;
export type ExhibitQuery = { params: Pick<URLSearchParams,"get">; update: (state:ExhibitState)=>void };

export function readNumber(query:ExhibitQuery|undefined,key:string,fallback:number,min:number,max:number) {
  const raw=query?.params.get(key);
  if (!raw?.trim()) return fallback;
  const value=Number(raw);
  return Number.isFinite(value) && value>=min && value<=max ? value : fallback;
}

export function readCamera(query:ExhibitQuery|undefined):CameraView {
  return query ? {
    yaw:readNumber(query,"yaw",0,-55,55),pitch:readNumber(query,"pitch",0,-25,25),zoom:readNumber(query,"zoom",1,.8,1.55),
    x:readNumber(query,"x",0,-1,1),y:readNumber(query,"y",0,-.7,.7),
  } : defaultCamera;
}

export function useExhibitSnapshot(query:ExhibitQuery|undefined,state:ExhibitState) {
  const update=query?.update;
  const serialized=JSON.stringify(state);
  useEffect(()=>{
    update?.(JSON.parse(serialized) as ExhibitState);
  },[serialized,update]);
}
