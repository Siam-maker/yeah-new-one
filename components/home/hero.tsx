"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { allowMotion, finePointer } from "@/components/motion/preferences";
import { createScrollMotion } from "@/components/motion/scroll-motion";
import { ExhibitImage } from "@/components/editorial/exhibit-image";
import Link from "next/link";
import { AbyssStage, type AbyssCamera } from "./abyss/abyss-stage";

export function Hero() {
  const hero = useRef<HTMLElement>(null);
  const entrance = useRef<gsap.core.Timeline | null>(null);
  const camera = useRef<AbyssCamera>({ x:0, y:0, descent:0 });

  useEffect(() => {
    const section = hero.current;
    if (!section) return;
    const media = createScrollMotion(section);

    media.add(allowMotion, () => {
      entrance.current = gsap.timeline({ defaults:{ ease:"power3.out" } })
        .from(".hero-haze",{ opacity:0,scale:.92,duration:1.25 },0)
        .from(".hero-index",{ opacity:0,y:6,duration:.52 },.1)
        .from(".hero-word",{ yPercent:106,stagger:.11,duration:.98,clearProps:"transform" },.15)
        .from(".hero-brief",{ opacity:0,y:11,duration:.72 },.43);
      gsap.timeline({
        defaults:{ ease:"none" },
        scrollTrigger:{ trigger:section,start:"top top",end:"bottom top",scrub:.42 },
      }).to(camera.current,{ descent:1 },0)
        .to(".hero-art-image",{ yPercent:6,scale:1.09 },0)
        .to(".hero-haze",{ yPercent:-12,opacity:.3 },0)
        .to(".hero-content",{ yPercent:-7 },0);
      return () => { entrance.current = null; };
    });

    media.add(`${allowMotion} and ${finePointer}`, () => {
      function steer(event:PointerEvent) {
        if (event.pointerType !== "mouse") return;
        const box = section!.getBoundingClientRect();
        camera.current.x = gsap.utils.clamp(-1,1,(event.clientX-box.left)/box.width*2-1);
        camera.current.y = gsap.utils.clamp(-1,1,(event.clientY-box.top)/box.height*2-1);
      }
      function center() { camera.current.x=0;camera.current.y=0; }
      section.addEventListener("pointermove",steer,{ passive:true });
      section.addEventListener("pointerleave",center);
      return () => {
        section.removeEventListener("pointermove",steer);
        section.removeEventListener("pointerleave",center);
        center();
      };
    });

    return () => media.revert();
  },[]);

  return <section className="hero edition-hero" ref={hero} aria-labelledby="hero-title">
    <div aria-hidden="true" className="hero-art"><div className="hero-art-frame">
      <div className="hero-art-image"><ExhibitImage src="/images/cavern-threshold.webp" alt="" fill fetchPriority="high" loading="eager" sizes="100vw" /></div>
      <AbyssStage camera={camera} />
      <div className="hero-haze" />
    </div></div>
    <div className="shell hero-inner">
      <div className="hero-index"><span>Independent science journal</span><span className="index-rule" /><span>Issue 001</span></div>
      <div className="hero-content">
        <h1 className="hero-title" id="hero-title">
          <span className="hero-title-mask"><span className="hero-word">The world</span></span>{" "}
          <span className="hero-title-mask"><em className="hero-word">beneath.</em></span>
        </h1>
        <div className="hero-brief">
          <p className="hero-description">A field guide to the forces that shape oceans, rock, and distant worlds.</p>
          <a href="#discoveries" className="button button-accent" data-pointer="magnetic" onClick={()=>entrance.current?.progress(1)}>
            <span className="button-content">Begin the descent <ArrowDown size={17} aria-hidden="true" /></span>
          </a>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#introduction" onClick={()=>entrance.current?.progress(1)}>Skip introduction <ArrowDown size={15} aria-hidden="true" /></a>
        <Link href="/lab/ocean-depth">Enter the depth lab <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
    </div>
  </section>;
}
