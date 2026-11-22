"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "motion/react";
import { useReducedMotionPreference } from "@/components/motion/preferences";
import { renderProfile, type RenderProfile } from "./render-profile";
import type { SceneSpec } from "./scene-types";

const SceneView = dynamic(() => import("./scene-view"), { ssr:false });

export function LiveScene({ scene, fallback, explicit = false, onModeChange }: {
  scene: SceneSpec; fallback: ReactNode; explicit?: boolean; onModeChange?: (is3D: boolean) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const visible = useInView(container);
  const near = useInView(container, { margin:"120px", once:true });
  const reduced = useReducedMotionPreference();
  const [profile, setProfile] = useState<RenderProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [faulted, setFaulted] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    if (!near) return;
    const desktop = matchMedia("(min-width: 1024px) and (pointer: fine)");
    function inspect() {
      const next = explicit || (!reduced && desktop.matches) ? renderProfile() : null;
      setProfile(next);
      if (!next) setReady(false);
    }
    inspect();
    desktop.addEventListener("change",inspect);
    return () => desktop.removeEventListener("change",inspect);
  }, [near, explicit, reduced]);

  useEffect(() => {
    function sync() { setTabVisible(document.visibilityState === "visible"); }
    sync();
    document.addEventListener("visibilitychange",sync);
    return () => document.removeEventListener("visibilitychange",sync);
  }, []);

  const show3D = profile !== null && !faulted;
  const has3D = show3D && ready;
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFaulted(true); setReady(false); }, []);

  useEffect(() => { onModeChange?.(has3D); }, [has3D,onModeChange]);
  return <div className="scene-frame" ref={container} data-mode={has3D ? "3d" : "illustration"} data-profile={show3D ? profile.name : undefined}>
    <div className="scene-fallback">{fallback}</div>
    {show3D && <div className="scene-canvas" data-ready={ready || undefined}>
      <SceneView scene={scene} profile={profile} active={visible && tabVisible && !reduced} onReady={onReady} onFailure={onFailure} />
    </div>}
    {faulted && <p className="scene-runtime-note" role="status">3D rendering ended. The illustration and controls are still available. <button type="button" onClick={()=>setFaulted(false)}>Retry 3D</button></p>}
  </div>;
}
