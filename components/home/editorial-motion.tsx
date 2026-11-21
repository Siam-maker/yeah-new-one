"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allowMotion } from "@/components/motion/preferences";
import { createScrollMotion } from "@/components/motion/scroll-motion";

export function EditorialMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const media = createScrollMotion(root);
    media.add(allowMotion, () => {
      for (const element of root.querySelectorAll<HTMLElement>("[data-reveal]")) {
        // Content restored in the viewport or reached via a deep link is already readable.
        if (element.getBoundingClientRect().top < window.innerHeight * 0.96) continue;

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out", immediateRender: false },
          scrollTrigger: { trigger: element, start: "top 96%", once: true },
        });

        switch (element.dataset.reveal) {
          case "handoff":
            timeline.fromTo(element.querySelector("h2"), {
              clipPath: "inset(-15% 72% -15% -3%)", y: 16, opacity: 0.45,
            }, {
              clipPath: "inset(-15% -3% -15% -3%)", y: 0, opacity: 1, duration: 0.78,
              clearProps: "clipPath",
            }).from(element.querySelectorAll(".section-label, .editorial-link"), {
              y: 10, opacity: 0.4, stagger: 0.12, duration: 0.58,
            }, 0.05);
            break;
          case "discovery":
            timeline.fromTo(element.querySelector(".discovery-media"), {
              clipPath: "inset(5% 13% 26% 10%)", yPercent: 8, opacity: 0.4,
            }, {
              clipPath: "inset(0% 0% 0% 0%)", yPercent: 0, opacity: 1, duration: 0.73,
              clearProps: "clipPath",
            }).from(element.querySelectorAll(".card-category, .discovery-copy h3"), {
              y: 11, opacity: 0.45, stagger: 0.09, duration: 0.48,
            }, 0.15);
            break;
          case "story":
            timeline.fromTo(element.querySelector("h3"), {
              clipPath: "inset(-15% 56% -15% -3%)", y: 8, opacity: 0.55,
            }, {
              clipPath: "inset(-15% -3% -15% -3%)", y: 0, opacity: 1, duration: 0.55,
              clearProps: "clipPath",
            });
            break;
          default:
            timeline.from(element, { y: 12, opacity: 0.6, duration: 0.48 });
        }
      }

      let refreshTimer = 0;
      const resize = new ResizeObserver(() => {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(true), 100);
      });
      resize.observe(root);
      return () => {
        resize.disconnect();
        window.clearTimeout(refreshTimer);
      };
    });
    return () => media.revert();
  }, []);

  return <div ref={scope}>{children}</div>;
}
