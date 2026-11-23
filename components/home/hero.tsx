"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { allowMotion, finePointer } from "@/components/motion/preferences";
import { afterFirstScroll } from "@/components/motion/scroll-motion";
import { ExhibitImage } from "@/components/editorial/exhibit-image";
import Link from "next/link";
import { AbyssStage, type AbyssCamera } from "./abyss/abyss-stage";

export function Hero() {
  const hero = useRef<HTMLElement>(null);
  const [caveMode,setCaveMode] = useState<"auto" | "live" | "still">("auto");
  const [caveAttempt,setCaveAttempt] = useState(0);
  const [caveStatus,setCaveStatus] = useState<"still" | "loading" | "live" | "unavailable">("still");
  const wakeCamera = useRef<(() => void) | null>(null);
  const onWakeChange = useCallback((wake: (() => void) | null) => { wakeCamera.current = wake; }, []);
  const camera = useRef<AbyssCamera>({ x:0, y:0, descent:0 });

  useEffect(() => {
    const section = hero.current;
    if (!section) return;
    const cleanup = afterFirstScroll(section, ({ gsap, media }) => {
      media.add(allowMotion, () => {
        gsap.timeline({
          defaults:{ ease:"none" },
          scrollTrigger:{ trigger:section,start:"top top",end:"bottom top",scrub:.42 },
        }).to(camera.current,{ descent:1,onUpdate:() => wakeCamera.current?.() },0)
          .to(".hero-art-image",{ yPercent:6,scale:1.09 },0)
          .to(".hero-haze",{ yPercent:-12,opacity:.3 },0)
          .to(".hero-content",{ yPercent:-7 },0);
      });
    });
    const pointer = matchMedia(`${allowMotion} and ${finePointer}`);
    function steer(event:PointerEvent) {
      if (!pointer.matches || event.pointerType !== "mouse") return;
      const box = section!.getBoundingClientRect();
      camera.current.x = Math.max(-1,Math.min(1,(event.clientX-box.left)/box.width*2-1));
      camera.current.y = Math.max(-1,Math.min(1,(event.clientY-box.top)/box.height*2-1));
      wakeCamera.current?.();
    }
    function center() { camera.current.x=0;camera.current.y=0;wakeCamera.current?.(); }
    section.addEventListener("pointermove",steer,{ passive:true });
    section.addEventListener("pointerleave",center);
    return () => {
      cleanup();
      section.removeEventListener("pointermove",steer);
      section.removeEventListener("pointerleave",center);
    };
  },[]);

  return <section className="hero edition-hero" ref={hero} aria-labelledby="hero-title">
    <div aria-hidden="true" className="hero-art"><div className="hero-art-frame">
      <div className="hero-art-image"><ExhibitImage src="/images/basalt-inlet.webp" alt="" fill preload fetchPriority="high" sizes="(max-width: 740px) 100vw, 74vw" /></div>
      <AbyssStage key={caveAttempt} camera={camera} mode={caveMode} onStatus={setCaveStatus} onWakeChange={onWakeChange} />
      <div className="hero-haze" />
    </div></div>
    <div className="shell hero-inner">
      <div className="hero-index"><span>Issue 001</span><span className="index-rule" aria-hidden="true" /><span>Independent science journal</span></div>
      <div className="hero-content">
        <h1 className="hero-title" id="hero-title">
          <span className="hero-title-mask"><span className="hero-word">The world</span></span>{" "}
          <span className="hero-title-mask"><em className="hero-word">beneath.</em></span>
        </h1>
        <div className="hero-brief">
          <p className="hero-description">Explore the hidden systems shaping our planet and universe through science, interactive 3D experiences, real-world data, visual stories and experiments.</p>
          <div className="pill-row hero-actions">
            <Link href="/explore" className="button button-accent">Explore <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <Link href="/lab" className="ghost-button">Interactive Labs</Link>
          </div>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#discoveries">Begin the descent <ArrowDown size={15} aria-hidden="true" /></a>
        <a href="#introduction">Skip introduction <ArrowDown size={15} aria-hidden="true" /></a>
        <Link href="/lab/ocean-depth" prefetch={false}>Enter the depth lab <ArrowUpRight size={15} aria-hidden="true" /></Link>
        <button className="hero-scene-toggle" type="button" aria-pressed={caveStatus === "live"} onClick={() => {
          if (caveStatus === "live" || caveStatus === "loading") setCaveMode("still");
          else { if (caveStatus === "unavailable") setCaveAttempt((previous)=>previous+1);setCaveMode("live"); }
        }}>3D cave</button>
        <span className="sr-only" role="status">{caveStatus === "unavailable" ? "The cave illustration is active. 3D needs WebGL and motion enabled." : caveStatus === "loading" ? "Loading the 3D cave." : caveStatus === "live" ? "The 3D cave is active." : ""}</span>
      </div>
    </div>
  </section>;
}
