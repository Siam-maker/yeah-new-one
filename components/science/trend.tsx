"use client";

import { useEffect, useId, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotionPreference } from "@/components/motion/preferences";
import { temperature } from "@/lib/content/observations";

export function TrendGraphic({ values, year, label, color = "#55dce8" }: {
  values: [number, number][]; year: number; label: string; color?: string;
}) {
  if (values.length < 2) return null;
  const selected = values.find(([time]) => time === year) ?? values[values.length - 1];
  const bottom = Math.min(0, ...values.map((point) => point[1]));
  const top = Math.max(.01, ...values.map((point) => point[1]));
  const start = values[0][0];
  const end = values[values.length - 1][0];
  const x = (time: number) => 46 + (time - start) / Math.max(1, end - start) * 302;
  const y = (value: number) => 104 - (value - bottom) / (top - bottom) * 82;
  const path = values.map(([time, value]) => `${x(time)},${y(value)}`).join(" ");
  const readings = new Intl.NumberFormat("en", { maximumFractionDigits:2, notation:top > 1000 ? "compact" : "standard" });
  const ticks = bottom < 0 ? [bottom,0,top/2,top] : [0,top/2,top];
  return <svg className="data-trend" viewBox="0 0 360 132" role="img" aria-label={`${label}. ${selected[0]}: ${selected[1]}.`}>
    {ticks.map((value)=><g key={value}><path d={`M46 ${y(value)}H348`} stroke="currentColor" strokeOpacity=".38" strokeDasharray="4 4" />
      <text x="40" y={y(value)+3} textAnchor="end" fontSize="10" fill="currentColor">{readings.format(value)}</text></g>)}
    <polyline points={path} fill="none" stroke={color} strokeWidth="2" />
    <path d={`M${x(selected[0])} 14V108`} stroke={color} strokeOpacity=".55" />
    <circle cx={x(selected[0])} cy={y(selected[1])} r="4" fill={color}><title>{`${selected[0]} · ${selected[1]}`}</title></circle>
    <g fill="currentColor" fontSize="12"><text x="46" y="128">{start}</text><text x="348" y="128" textAnchor="end">{end}</text></g>
  </svg>;
}

export function AnimatedReading({ value, digits }: { value: number; digits: number }) {
  const reduced = useReducedMotionPreference();
  const target = useMotionValue(value);
  const spring = useSpring(target, { damping: 35, stiffness: 160 });
  useEffect(() => { target.set(value); }, [target, value]);
  const current = useTransform(spring, (number) => number.toFixed(digits));
  return <span className="instrument-reading">
    <span className="sr-only">{value.toFixed(digits)}</span>
    {reduced ? <span aria-hidden="true">{value.toFixed(digits)}</span> : <motion.span aria-hidden="true">{current}</motion.span>}
  </span>;
}

export function ClimateInstrument() {
  const id = useId();
  const [year, setYear] = useState(2025);
  const value = temperature.find(([time]) => time === year)?.[1] ?? temperature[temperature.length - 1][1];
  return <section className="instrument" aria-label="Global surface temperature record">
    <div className="instrument-head"><p className="mono">NASA GISTEMP v4</p><p><AnimatedReading value={value} digits={2} /> <span>°C</span></p></div>
    <TrendGraphic values={temperature} year={year} label="Global annual surface temperature anomaly, 1880 to 2025" color="#afa7ff" />
    <label htmlFor={id}>Observation year <strong>{year}</strong></label>
    <input id={id} type="range" min="1880" max="2025" value={year} onChange={(event) => setYear(event.currentTarget.valueAsNumber)} />
    <p className="instrument-note">Annual global anomaly relative to 1951–1980. <a href="https://data.giss.nasa.gov/gistemp/">NASA GISTEMP methods</a></p>
  </section>;
}
