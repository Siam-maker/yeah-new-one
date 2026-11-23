"use client";

import { useId } from "react";
import { RotateCcw } from "lucide-react";

export type CameraView = { yaw: number; pitch: number; zoom: number; x: number; y: number };
export const defaultCamera: CameraView = { yaw:0, pitch:0, zoom:1, x:0, y:0 };

const fields = [
  {key:"yaw", label:"Rotate", bn:"ঘোরান", min:-55, max:55, step:1, unit:"°"},
  {key:"pitch", label:"Tilt", bn:"কাত করুন", min:-25, max:25, step:1, unit:"°"},
  {key:"zoom", label:"Zoom", bn:"বড় বা ছোট করুন", min:.8, max:1.55, step:.05, unit:"×"},
  {key:"x", label:"Pan horizontally", bn:"ডানে বা বাঁয়ে সরান", min:-1, max:1, step:.05, unit:""},
  {key:"y", label:"Pan vertically", bn:"ওপরে বা নিচে সরান", min:-.7, max:.7, step:.05, unit:""},
] as const;

export function CameraControls({ value, onChange, locale = "en", extra = false }: {
  value: CameraView; onChange: (value: CameraView) => void; locale?: "en" | "bn"; extra?: boolean;
}) {
  const controlId=useId();
  const bn = locale === "bn";
  const format = new Intl.NumberFormat(locale,{maximumFractionDigits:2});
  return <details className="camera-controls reference-fold">
    <summary>{bn ? "ক্যামেরা নিয়ন্ত্রণ" : "Camera controls"}</summary>
    <p>{bn ? "ত্রিমাত্রিক দৃশ্যের দৃষ্টিকোণ বদলান।" : "Adjust the viewpoint in the 3D scene."}</p>
    <div className="camera-sliders">
      {(extra ? fields.filter(({key})=>key!=="zoom") : fields).map(({key,label,bn:translated,min,max,step,unit}) => <label key={key} htmlFor={`${controlId}-${key}`}>
        <span>{bn ? translated : label} <output aria-hidden="true">{format.format(value[key])}{unit}</output></span>
        <input id={`${controlId}-${key}`} type="range" min={min} max={max} step={step} value={value[key]} aria-valuetext={format.format(value[key])+unit}
          onChange={({currentTarget})=>onChange({...value,[key]:currentTarget.valueAsNumber})} />
      </label>)}
    </div>
    <button type="button" className="ghost-button" onClick={()=>onChange(defaultCamera)}><RotateCcw size={14} aria-hidden="true" /> {bn ? "ক্যামেরা আগের অবস্থায় ফেরান" : "Reset camera"}</button>
  </details>;
}
