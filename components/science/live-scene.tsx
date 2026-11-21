"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "motion/react";
import { useReducedMotionPreference } from "@/components/motion/preferences";
import type { SceneSpec } from "./scene-types";

const SceneView = dynamic(() => import("./scene-view"), { ssr: false });

export function LiveScene({ scene, fallback, explicit = false, onModeChange }: {
  scene: SceneSpec; fallback: ReactNode; explicit?: boolean; onModeChange?: (is3D: boolean) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const detectedQuality = useRef<number | undefined>(undefined);
  const visible = useInView(container);
  const reduced = useReducedMotionPreference();
  const [quality, setQuality] = useState(0);
  const [ready, setReady] = useState(false);
  const [faulted, setFaulted] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const desktop = matchMedia("(min-width: 1024px) and (pointer: fine)");

    function inspect() {
      if (!explicit && !desktop.matches) {
        setQuality(0);
        return;
      }
      if (detectedQuality.current === undefined) {
        try {
          const device = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
          const probe = !device.connection?.saveData && (device.deviceMemory ?? 4) >= 4
            ? document.createElement("canvas").getContext("webgl2", { antialias: false })
            : null;
          const debug = probe?.getExtension("WEBGL_debug_renderer_info");
          const renderer = debug && probe?.getParameter(debug.UNMASKED_RENDERER_WEBGL);
          detectedQuality.current = probe ? (/swiftshader|llvmpipe|software/i.test(String(renderer)) ? 0.7 : 1.25) : 0;
          probe?.getExtension("WEBGL_lose_context")?.loseContext();
        } catch {
          detectedQuality.current = 0;
        }
      }
      setQuality(detectedQuality.current ?? 0);
    }

    inspect();
    desktop.addEventListener("change", inspect);
    return () => desktop.removeEventListener("change", inspect);
  }, [visible, explicit]);

  const show3D = quality > 0 && !faulted && (!reduced || explicit);
  const has3D = show3D && ready;
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFaulted(true); setReady(false); }, []);

  useEffect(() => { onModeChange?.(has3D); }, [has3D, onModeChange]);
  return <div className="scene-frame" ref={container} data-mode={has3D ? "3d" : "illustration"}>
    <div className="scene-fallback">{fallback}</div>
    {show3D && <div className="scene-canvas" data-ready={ready || undefined}>
      <SceneView scene={scene} quality={quality} active={visible && !reduced} onReady={onReady} onFailure={onFailure} />
    </div>}
  </div>;
}
