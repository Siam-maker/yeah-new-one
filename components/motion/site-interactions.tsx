"use client";

import { motion, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { allowMotion, finePointer } from "./preferences";

export function SiteInteractions() {
  const { scrollYProgress } = useScroll();
  const cursor = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!cursor.current) return;
    const ring = cursor.current;

    const media = window.matchMedia(`${allowMotion} and ${finePointer}`);
    let active: HTMLElement | null = null;
    let frame = 0;

    function clearActive() {
      active?.style.removeProperty("--pointer-x");
      active?.style.removeProperty("--pointer-y");
      active = null;
    }

    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      clearActive();
      ring.removeAttribute("data-visible");
      ring.removeAttribute("data-mode");
    }

    function move(event: PointerEvent) {
      const target = event.pointerType === "mouse" && event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-pointer]")
        : null;

      if (!target) {
        if (active || frame) reset();
        return;
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!target.isConnected) return reset();
        if (target !== active) {
          clearActive();
          active = target;
          ring.dataset.mode = target.dataset.pointer;
        }

        const bounds = target.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) / bounds.width;
        const y = (event.clientY - bounds.top - bounds.height / 2) / bounds.height;
        target.style.setProperty("--pointer-x", x.toFixed(3));
        target.style.setProperty("--pointer-y", y.toFixed(3));

        ring.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        ring.setAttribute("data-visible", "");
      });
    }

    function syncListeners() {
      reset();
      removePointerListeners();
      if (!media.matches) return;

      document.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", reset);
      window.addEventListener("blur", reset);
      window.addEventListener("scroll", reset, { passive: true });
    }

    function removePointerListeners() {
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", reset);
    }

    syncListeners();
    media.addEventListener("change", syncListeners);
    return () => {
      media.removeEventListener("change", syncListeners);
      removePointerListeners();
      reset();
    };
  }, [pathname]);

  return (
    <>
      <motion.div aria-hidden="true" className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      <div aria-hidden="true" className="cursor-companion" ref={cursor} />
    </>
  );
}
