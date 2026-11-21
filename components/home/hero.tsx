"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export function Hero() {
  const hero = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const motion = gsap.matchMedia(hero);
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".hero-title > span", {
        yPercent: 55,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.to(".hero-art-image", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => motion.revert();
  }, []);

  return (
    <section ref={hero} className="hero" aria-labelledby="hero-title">
      <div aria-hidden="true" className="hero-art">
        <div className="hero-art-image">
          <Image src="/images/obsidian.webp" alt="" fill preload sizes="(max-width: 700px) 100vw, 78vw" />
        </div>
      </div>
      <div className="shell hero-inner">
        <div className="hero-index mono"><span className="status-dot" /> The field journal <span className="index-rule" /> Issue 001</div>
        <div className="hero-content">
          <p className="hero-kicker mono">A field guide to the unseen</p>
          <h1 id="hero-title" className="hero-title"><span>UNDER THE</span><span>SURFACE<span className="title-dot">.</span></span></h1>
          <p className="hero-description">From the ocean floor to the edge of deep time. An independent magazine about the worlds hidden in plain sight.</p>
          <a className="button button-accent" href="#discoveries">Begin the descent <ArrowDown size={17} aria-hidden="true" /></a>
        </div>
        <figure className="hero-caption mono">
          <Plus size={16} aria-hidden="true" />
          <figcaption><strong>Fig. 01</strong><span>Obsidian study</span></figcaption>
        </figure>
        <div className="hero-bottom mono">
          <a href="#discoveries"><ArrowDown size={13} aria-hidden="true" /> Scroll to explore</a>
          <a href="#depth">Enter the depth lab <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
