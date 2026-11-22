"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotionPreference } from "./preferences";

type Choreography = "ocean" | "geology" | "space" | "atlas" | "journal";

const environments = {
  ocean: { label: "Ocean environments", image: "/images/ocean-column.webp", color: "#142d37", motion: "ocean" },
  geology: { label: "Earth and geology", image: "/images/weathered-section.webp", color: "#332820", motion: "geology" },
  space: { label: "Space and time", image: "/images/observatory.webp", color: "#212436", motion: "space" },
  climate: { label: "Climate and atmosphere", image: "/images/ice-margin.webp", color: "#27363d", motion: "ocean" },
  biodiversity: { label: "Life and biodiversity", image: "/images/fossil.webp", color: "#30362a", motion: "geology" },
  atlas: { label: "Planetary atlas", image: "/data/bathymetry-globe.webp", color: "#203b41", motion: "atlas" },
  population: { label: "Population observatory", image: "/data/atlas-land.svg", color: "#26403e", motion: "atlas" },
  journal: { label: "The journal", image: "/images/glacier.webp", color: "#283839", motion: "journal" },
  library: { label: "Publication archive", image: "/images/obsidian.webp", color: "#262729", motion: "journal" },
  home: { label: "Under the Surface", image: "/images/basalt-inlet.webp", color: "#252621", motion: "geology" },
} as const;

function describe(path: string) {
  if (path === "/") return environments.home;
  if (path.startsWith("/demographics")) return environments.population;
  if (path.startsWith("/atlas")) return environments.atlas;
  if (/observatory|space-time|light-travel|light-that-took/.test(path)) return environments.space;
  if (/geolog|earthquake|tectonic|memory-of-rock/.test(path)) return environments.geology;
  if (/climate|temperature|warmer|ice/.test(path)) return environments.climate;
  if (/biodiversity|chemical|fossil/.test(path)) return environments.biodiversity;
  if (/ocean|below-the-light|twilight|journeys/.test(path)) return environments.ocean;
  return path.startsWith("/stories") ? environments.journal : environments.library;
}

function shutter(kind: Choreography, back: boolean) {
  if (kind === "ocean") {
    return back
      ? ["ellipse(122% 123% at 50% 100%)", "ellipse(2% 0% at 50% 108%)"]
      : ["ellipse(122% 123% at 50% 0%)", "ellipse(2% 0% at 50% -8%)"];
  }
  if (kind === "space") return ["inset(0% 0% 0% 0%)", "inset(47% 50% 53% 50%)"];
  if (kind === "geology") {
    return back
      ? ["polygon(0 0, 100% 0, 100% 30%, 100% 30%, 100% 62%, 100% 62%, 100% 100%, 0 100%)",
        "polygon(0 0, 0 0, 0 30%, 0 30%, 0 62%, 0 62%, 0 100%, 0 100%)"]
      : ["polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 63%, 0 63%, 0 30%, 0 30%)",
        "polygon(100% 0, 100% 0, 100% 100%, 100% 100%, 100% 63%, 100% 63%, 100% 30%, 100% 30%)"];
  }
  return ["inset(0% 0% 0% 0%)", back ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)"];
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
    const direction = returning ? -1 : 1;
    const [openMask, closedMask] = shutter(destination.motion, returning);
    plate.current.style.backgroundImage = `url("${destination.image}")`;
    curtain.style.setProperty("--curtain-tint", destination.color);
    curtain.dataset.direction = returning ? "back" : "forward";
    curtain.dataset.environment = destination.motion;
    if (channel.current) channel.current.textContent = destination.label;
    if (heading.current) {
      const title = document.querySelector("main h1")?.textContent?.trim();
      heading.current.textContent = title && title.toLowerCase() !== destination.label.toLowerCase() ? title : "";
    }

    const motion = gsap.context(() => {
      gsap.set(curtain,{ visibility:"visible",clipPath:openMask });
      const geology = destination.motion === "geology";
      const ocean = destination.motion === "ocean";
      const space = destination.motion === "space";
      const timeline = gsap.timeline({
        defaults: { ease:"power3.out" },
        onComplete: () => { curtain.style.visibility = "hidden"; },
      });
      timeline
        .fromTo(".curtain-plate", { scale:space ? 1 : 1.105,xPercent:ocean ? 0 : direction * 2,yPercent:ocean ? direction * -7 : 0,opacity:.65 },
          { scale:space ? 1.19 : 1.013,xPercent:0,yPercent:0,opacity:1,duration:.59 },0)
        .fromTo(".curtain-detail", { opacity:0,scale:geology ? .74 : 1.055 }, { opacity:1,scale:1,duration:.46 },.02)
        .fromTo(".curtain-copy", { clipPath:"inset(0% 0% 100% 0%)",y:11 }, { clipPath:"inset(0% 0% 0% 0%)",y:0,duration:.34 },.03)
        .to(".curtain-copy", { x:direction * -16,opacity:0,duration:.23,ease:"power2.in" },.37);
      if (geology) {
        timeline.to(curtain,{
          clipPath:returning
            ? "polygon(0 0, 35% 0, 35% 30%, 48% 30%, 48% 62%, 30% 62%, 30% 100%, 0 100%)"
            : "polygon(54% 0, 100% 0, 100% 100%, 62% 100%, 62% 63%, 49% 63%, 49% 30%, 54% 30%)",
          duration:.21,ease:"power1.in",
        },.29).to(curtain,{ clipPath:closedMask,duration:.22,ease:"power2.out" },.50);
      } else {
        timeline.to(curtain,{ clipPath:closedMask,duration:space ? .37 : .43,ease:"power2.inOut" },.29);
      }
    },curtain);
    return () => motion.revert();
  },[path,reduced]);

  return <div className="route-curtain" ref={root} aria-hidden="true">
    <div className="curtain-plate" ref={plate} />
    <div className="curtain-copy"><span className="curtain-channel" ref={channel} /><span className="curtain-heading" ref={heading} /></div>
    <div className="curtain-detail" />
  </div>;
}
