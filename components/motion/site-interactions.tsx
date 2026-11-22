"use client";

import { useEffect, useRef } from "react";

export function SiteInteractions() {
  const indicator = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (CSS.supports("animation-timeline", "scroll(root block)")) return;
    const root = document.documentElement;
    const bar = indicator.current;
    function update() {
      const maximum = root.scrollHeight - root.clientHeight;
      const fraction = maximum > 0 ? Math.max(0, Math.min(1, window.scrollY / maximum)) : 0;
      if (bar) bar.style.transform = `scaleX(${fraction})`;
    }
    window.addEventListener("scroll",update,{ passive:true });
    const resize = new ResizeObserver(update);
    resize.observe(document.body);
    update();
    return () => {
      window.removeEventListener("scroll",update);
      resize.disconnect();
    };
  }, []);
  return <div ref={indicator} aria-hidden="true" className="scroll-progress" />;
}
