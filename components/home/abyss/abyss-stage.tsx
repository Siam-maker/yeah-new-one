"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type RefObject } from "react";
import { allowMotion } from "@/components/motion/preferences";

const AbyssScene = dynamic(() => import("./abyss-scene"), { ssr: false });
const cinematicDesktop = `${allowMotion} and (min-width: 1024px) and (hover: hover) and (pointer: fine)`;

export type AbyssCamera = { x: number; y: number; descent: number };

export function AbyssStage({ camera }: { camera: RefObject<AbyssCamera> }) {
  const stage = useRef<HTMLDivElement>(null);
  const [source, setSource] = useState<string>();
  const [dpr, setDpr] = useState(1);
  const [software, setSoftware] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;

    const desktop = window.matchMedia(cinematicDesktop);
    let supported: boolean | undefined;
    let intersecting = false;

    function sync() {
      if (!desktop.matches || !intersecting) {
        if (!desktop.matches) setSource(undefined);
        setVisible(false);
        return;
      }

      const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
      if (device.connection?.saveData || (device.deviceMemory ?? 8) < 4) return;

      if (supported === undefined) {
        try {
          const probe = document.createElement("canvas").getContext("webgl2", { antialias: false });
          supported = Boolean(probe);
          if (probe) {
            const debug = probe.getExtension("WEBGL_debug_renderer_info");
            const renderer = debug && probe.getParameter(debug.UNMASKED_RENDERER_WEBGL);
            setSoftware(typeof renderer === "string" && /swiftshader|llvmpipe|software/i.test(renderer));
            probe.getExtension("WEBGL_lose_context")?.loseContext();
          }
        } catch {
          supported = false;
        }
      }

      if (supported) {
        setSource("/images/obsidian-surface.webp");
        setVisible(!document.hidden);
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      sync();
    });
    observer.observe(element);

    desktop.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    if (!source || !stage.current) return;

    const resolution = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const pixelBudget = Math.sqrt((software ? 320_000 : 1_000_000) / Math.max(1, width * height));
      setDpr(Math.min(window.devicePixelRatio, 1.25, pixelBudget));
    });
    resolution.observe(stage.current);
    return () => resolution.disconnect();
  }, [source, software]);

  return (
    <div ref={stage} className="abyss-stage">
      {source && <AbyssScene camera={camera} active={visible} source={source} dpr={dpr} fps={software ? 20 : 60} />}
    </div>
  );
}
