"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
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
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: element, start: "top 96%", once: true },
        });

        if (element.dataset.reveal === "discovery") {
          timeline
            .from(element.querySelector(".discovery-media"), {
              yPercent: 9,
              opacity: 0.35,
              duration: 0.64,
              immediateRender: false,
            })
            .from(element.querySelectorAll(".card-category, .discovery-copy h3"), {
              y: 9,
              opacity: 0.45,
              duration: 0.46,
              stagger: 0.08,
              immediateRender: false,
            }, 0.1);
        } else {
          timeline.from(element, { y: 12, opacity: 0.6, duration: 0.48, immediateRender: false });
        }
      }
    });
    return () => media.revert();
  }, []);

  return <div ref={scope}>{children}</div>;
}
