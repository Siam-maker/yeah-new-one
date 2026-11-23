"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type RefObject } from "react";
import { allowMotion } from "@/components/motion/preferences";
import { renderProfile, type RenderProfile } from "@/components/science/render-profile";

const AbyssScene = dynamic(() => import("./abyss-scene"), { ssr:false });

export type AbyssCamera = { x:number; y:number; descent:number };

export function AbyssStage({ camera, mode, onStatus, onWakeChange }: {
  camera: RefObject<AbyssCamera>;
  mode: "auto" | "live" | "still";
  onStatus: (status: "still" | "loading" | "live" | "unavailable") => void;
  onWakeChange: (wake: (() => void) | null) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [profile,setProfile] = useState<RenderProfile | null>(null);
  const [dpr,setDpr] = useState(1);
  const [visible,setVisible] = useState(false);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const media = matchMedia(allowMotion);
    const desktop = matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    let intersects = false;
    let activation = 0;
    let mounted = false;

    function sync() {
      window.clearTimeout(activation);
      if (mode === "still" || !media.matches || (mode === "auto" && !desktop.matches)) {
        setProfile(null);
        setVisible(false);
        mounted = false;
        onStatus(mode === "live" ? "unavailable" : "still");
        return;
      }
      setVisible(intersects && !document.hidden);
      if (!intersects || document.hidden || mounted) return;
      activation = window.setTimeout(() => {
        const candidate = renderProfile();
        if (!candidate || (mode === "auto" && candidate.name === "low")) {
          if (mode === "live") onStatus("unavailable");
          return;
        }
        mounted = true;
        setProfile(candidate);
        onStatus("loading");
      }, mode === "auto" ? 1600 : 0);
    }

    const observer = new IntersectionObserver(([entry]) => { intersects=entry.isIntersecting;sync(); });
    observer.observe(element);
    media.addEventListener("change",sync);
    desktop.addEventListener("change",sync);
    document.addEventListener("visibilitychange",sync);
    return () => {
      window.clearTimeout(activation);
      observer.disconnect();
      media.removeEventListener("change",sync);
      desktop.removeEventListener("change",sync);
      document.removeEventListener("visibilitychange",sync);
    };
  },[mode,onStatus]);

  useEffect(() => {
    if (!profile || !stage.current) return;
    const budget = profile.name==="low" ? 200_000 : profile.name==="balanced" ? 540_000 : 950_000;
    const resize = new ResizeObserver(([entry]) => {
      const { width,height } = entry.contentRect;
      const pixelBudget = Math.sqrt(budget/Math.max(1,width*height));
      setDpr(Math.min(window.devicePixelRatio,profile.dpr,pixelBudget));
    });
    resize.observe(stage.current);
    return () => resize.disconnect();
  },[profile]);

  return <div className="abyss-stage" ref={stage} data-profile={profile?.name}>
    {profile && <AbyssScene camera={camera} active={visible} onWakeChange={onWakeChange} source="/images/obsidian-surface.webp"
      dpr={dpr} fps={Math.round(1000/profile.frameMs)} detail={profile.segments} ambientMotion={profile.name!=="low"} onStatus={onStatus} />}
  </div>;
}
