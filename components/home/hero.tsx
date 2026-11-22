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
  const [enableCave,setEnableCave] = useState(false);
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
      <div className="hero-art-image"><ExhibitImage src="/images/basalt-inlet.webp" alt="" fill preload sizes="(max-width: 740px) 100vw, 74vw" /></div>
      <AbyssStage camera={camera} enabled={enableCave} onWakeChange={onWakeChange} />
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
          <p className="hero-description">A field guide to the forces that shape oceans, rock, and distant worlds.</p>
          <a href="#discoveries" className="button button-accent">
            <span className="button-content">Begin the descent <ArrowDown size={17} aria-hidden="true" /></span>
          </a>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#introduction">Skip introduction <ArrowDown size={15} aria-hidden="true" /></a>
        <Link href="/lab/ocean-depth" prefetch={false}>Enter the depth lab <ArrowUpRight size={15} aria-hidden="true" /></Link>
        <button className="hero-scene-toggle" type="button" aria-pressed={enableCave} onClick={() => setEnableCave(!enableCave)}>3D cave</button>
      </div>
    </div>
  </section>;
}
