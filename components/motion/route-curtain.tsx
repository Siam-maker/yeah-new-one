"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotionPreference } from "./preferences";

const environments = {
  ocean: { label: "Ocean environments", image: "/images/ocean-column.webp", color: "#173b4a" },
  geology: { label: "Earth and geology", image: "/images/strata-wall.webp", color: "#3c2d26" },
  space: { label: "Space and time", image: "/images/observatory.webp", color: "#202538" },
  climate: { label: "Climate and atmosphere", image: "/images/ice-margin.webp", color: "#263a40" },
  biodiversity: { label: "Life and biodiversity", image: "/images/fossil.webp", color: "#30362a" },
  atlas: { label: "Planetary atlas", image: "/data/bathymetry-globe.webp", color: "#203b41" },
  population: { label: "Population observatory", image: "/data/atlas-land.svg", color: "#26403e" },
  journal: { label: "The journal", image: "/images/glacier.webp", color: "#283839" },
  library: { label: "Publication archive", image: "/images/obsidian.webp", color: "#262729" },
  home: { label: "Under the Surface", image: "/images/cavern-threshold.webp", color: "#252621" },
};

function describe(path: string) {
  if (path === "/") return environments.home;
  if (path.startsWith("/demographics")) return environments.population;
  if (path.startsWith("/atlas")) return environments.atlas;
  if (/observatory|space-time|light-travel/.test(path)) return environments.space;
  if (/geolog|earthquake|tectonic|memory-of-rock/.test(path)) return environments.geology;
  if (/climate|temperature|warmer|ice/.test(path)) return environments.climate;
  if (/biodiversity|chemical|fossil/.test(path)) return environments.biodiversity;
  if (/ocean|below-the-light|twilight|journeys/.test(path)) return environments.ocean;
  return path.startsWith("/stories") ? environments.journal : environments.library;
}

type IndexedHistory = Window & { navigation?: { currentEntry: { index: number } | null } };

function browserEntryIndex() {
  const index = (window as IndexedHistory).navigation?.currentEntry?.index;
  return index != null && index >= 0 ? index : undefined;
}

export function RouteCurtain() {
  const path = usePathname();
  const reduced = useReducedMotionPreference();
  const root = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLSpanElement>(null);
  const channel = useRef<HTMLSpanElement>(null);
  const previous = useRef(path);
  const trail = useRef([path]);
  const cursor = useRef(0);
  const visitingHistory = useRef(false);
  const previousEntry = useRef<number | undefined>(undefined);

  useEffect(() => {
    function recordEntry() {
      if (window.location.pathname === previous.current) previousEntry.current = browserEntryIndex();
    }
    function historyNavigation() {
      visitingHistory.current = window.location.pathname !== previous.current;
      if (!visitingHistory.current) recordEntry();
    }
    recordEntry();
    window.addEventListener("popstate", historyNavigation);
    window.addEventListener("hashchange", recordEntry);
    return () => {
      window.removeEventListener("popstate", historyNavigation);
      window.removeEventListener("hashchange", recordEntry);
    };
  }, []);

  useLayoutEffect(() => {
    if (path === previous.current) return;
    previous.current = path;
    const entry = browserEntryIndex();
    const priorEntry = previousEntry.current;
    previousEntry.current = entry;
    const adjacent = trail.current[cursor.current - 1] === path ? cursor.current - 1 : cursor.current + 1;
    const index = visitingHistory.current
      ? trail.current[adjacent] === path ? adjacent : trail.current.lastIndexOf(path)
      : -1;
    const returning = visitingHistory.current && (entry != null && priorEntry != null
      ? entry < priorEntry
      : index >= 0 && index < cursor.current);
    if (index >= 0) cursor.current = index;
    else {
      trail.current = [...trail.current.slice(0, cursor.current+1), path];
      cursor.current++;
    }
    visitingHistory.current = false;

    const curtain = root.current;
    if (reduced || !curtain || !plate.current) return;
    const destination = describe(path);
    plate.current.style.backgroundImage = `url("${destination.image}")`;
    curtain.style.setProperty("--curtain-tint", destination.color);
    curtain.dataset.direction = returning ? "back" : "forward";
    if (channel.current) channel.current.textContent = destination.label;
    if (heading.current) {
      const title = document.querySelector("main h1")?.textContent?.trim();
      heading.current.textContent = title && title.toLowerCase() !== destination.label.toLowerCase() ? title : "";
    }

    const shutter = returning ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
    const motion = gsap.context(() => {
      gsap.set(curtain,{ visibility:"visible", clipPath:"inset(0% 0% 0% 0%)" });
      gsap.timeline({
        defaults: { ease:"power3.inOut" },
        onComplete: () => { curtain.style.visibility = "hidden"; },
      })
        .fromTo(".curtain-plate", { scale:1.12, xPercent:returning ? -2 : 2 }, { scale:1.01,xPercent:0,duration:.7 },0)
        .fromTo(".curtain-seam", { scaleX:.12 }, { scaleX:1,duration:.37 },0)
        .fromTo(".curtain-copy", { clipPath:"inset(0% 0% 100% 0%)", y:7 }, { clipPath:"inset(0% 0% 0% 0%)",y:0,duration:.34 },.025)
        .to(curtain,{ clipPath:shutter,duration:.51 },.28);
    },curtain);
    return () => motion.revert();
  },[path,reduced]);

  return <div className="route-curtain" ref={root} aria-hidden="true">
    <div className="curtain-plate" ref={plate} />
    <div className="curtain-copy"><span className="curtain-channel" ref={channel} /><span className="curtain-heading" ref={heading} /></div>
    <div className="curtain-seam" />
  </div>;
}
