"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import gsap from "gsap";
import { allowMotion, finePointer } from "@/components/motion/preferences";
import { createScrollMotion } from "@/components/motion/scroll-motion";
import Image from "next/image";
import Link from "next/link";
import { AbyssStage, type AbyssCamera } from "./abyss/abyss-stage";

export function Hero() {
  const hero = useRef<HTMLElement>(null);
  const camera = useRef<AbyssCamera>({ x: 0, y: 0, descent: 0 });

  useEffect(() => {
    const section = hero.current;
    if (!section) return;

    const media = createScrollMotion(section);
    media.add(allowMotion, () => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-haze", { opacity: 0, scale: 0.91, duration: 1.45 }, 0)
        .from(".hero-index, .hero-kicker", { y: 9, opacity: 0.45, stagger: 0.08, duration: 0.55 }, 0)
        .from(".hero-word", { yPercent: 84, opacity: 0.25, duration: 0.86, stagger: 0.1 }, 0.13)
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
      const frame = section.querySelector<HTMLElement>(".hero-art-frame");
      if (!frame) return;

      gsap.fromTo(".hero-threshold", { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom 28%", scrub: 0.35 },
      });

      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.55 },
      })
        .to(camera.current, { descent: 1 }, 0)
        .to(".hero-art-image", { yPercent: 5, scale: 1.035 }, 0)
        .to(".hero-haze", { yPercent: -7 }, 0)
        .to(".hero-title-mask", { yPercent: -11 }, 0);

      // Counter the first stretch of scroll on the artwork inside the clipped hero.
      const pinDistance = () => Math.round(section.clientHeight * 0.22);
      gsap.to(frame, {
        y: pinDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + pinDistance(),
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      const steer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const bounds = section.getBoundingClientRect();
        camera.current.x = gsap.utils.clamp(-1, 1, (event.clientX - bounds.left) / bounds.width * 2 - 1);
        camera.current.y = gsap.utils.clamp(-1, 1, (event.clientY - bounds.top) / bounds.height * 2 - 1);
      };

      function center() {
        camera.current.x = 0;
        camera.current.y = 0;
      }

      section.addEventListener("pointermove", steer, { passive: true });
      section.addEventListener("pointerleave", center);
      return () => {
        section.removeEventListener("pointermove", steer);
        section.removeEventListener("pointerleave", center);
        center();
      };
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={hero} className="hero" aria-labelledby="hero-title">
      <div aria-hidden="true" className="hero-art">
        <div className="hero-art-frame">
          <div className="hero-art-image">
            <Image src="/images/obsidian.webp" alt="" fill preload sizes="(max-width: 700px) 100vw, 78vw" />
          </div>
          <AbyssStage camera={camera} />
          <div className="hero-haze" />
        </div>
      </div>
      <div className="hero-threshold" aria-hidden="true" />
      <div className="shell hero-inner">
        <div className="hero-index mono"><span className="status-dot" /> The field journal <span className="index-rule" /> Issue 001</div>
        <div className="hero-content">
          <p className="hero-kicker mono">A field guide to the unseen</p>
          <h1 id="hero-title" className="hero-title" aria-label="Under the Surface.">
            <span className="hero-title-mask"><span className="hero-title-line"><span className="hero-word">UNDER</span>{" "}<span className="hero-word">THE</span></span></span>{" "}
            <span className="hero-title-mask"><span className="hero-title-line"><span className="hero-word">SURFACE<span className="title-dot">.</span></span></span></span>
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
          <Link href="/lab/ocean-depth">Enter the depth lab <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
