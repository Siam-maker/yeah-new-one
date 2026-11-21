"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import gsap from "gsap";
import { allowMotion, finePointer } from "@/components/motion/preferences";
import { createScrollMotion } from "@/components/motion/scroll-motion";
import Image from "next/image";

export function Hero() {
  const hero = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = hero.current;
    if (!section) return;

    const media = createScrollMotion(section);
    media.add(allowMotion, () => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-haze", { opacity: 0, scale: 0.91, duration: 1.45 }, 0)
        .from(".hero-index, .hero-kicker", { y: 9, opacity: 0.45, stagger: 0.08, duration: 0.55 }, 0)
        .from(".hero-title-line", { yPercent: 84, opacity: 0.25, duration: 0.86, stagger: 0.12 }, 0.13)
        .from(".hero-title .title-dot", { opacity: 0.15, duration: 0.5 }, 0.54)
        .from(".hero-index .status-dot, .hero-caption svg", { scale: 0.5, opacity: 0.3, duration: 0.65 }, 0.16)
        .from(".hero-description, .hero-content .button, .hero-bottom", {
          y: 10,
          opacity: 0.55,
          stagger: 0.08,
          duration: 0.64,
        }, 0.41);
    });
    media.add(`${allowMotion} and ${finePointer}`, () => {
      gsap.to(".hero-art-image", {
        yPercent: 4.5,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.35 },
      });
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={hero} className="hero" aria-labelledby="hero-title">
      <div aria-hidden="true" className="hero-art">
        <div className="hero-art-image">
          <Image src="/images/obsidian.webp" alt="" fill preload sizes="(max-width: 700px) 100vw, 78vw" />
        </div>
        <div className="hero-haze" />
      </div>
      <div className="shell hero-inner">
        <div className="hero-index mono"><span className="status-dot" /> The field journal <span className="index-rule" /> Issue 001</div>
        <div className="hero-content">
          <p className="hero-kicker mono">A field guide to the unseen</p>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-title-mask"><span className="hero-title-line">UNDER THE</span></span>{" "}
            <span className="hero-title-mask"><span className="hero-title-line">SURFACE<span className="title-dot">.</span></span></span>
          </h1>
          <p className="hero-description">From the ocean floor to the edge of deep time. An independent magazine about the worlds hidden in plain sight.</p>
          <a className="button button-accent" href="#discoveries" data-pointer="magnetic">
            <span className="button-content">Begin the descent <ArrowDown size={17} aria-hidden="true" /></span>
          </a>
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
