"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Color, type WebGLRenderer } from "three";
import { Planetarium } from "./planetarium";
import { Interior, Strata, Tectonic } from "./geology-stage";
import { ClimateStage } from "./climate-stage";
import { Ocean } from "./ocean-stage";
import { Globe } from "./globe-stage";
import type { RenderProfile } from "./render-profile";
import type { SceneSpec } from "./scene-types";

class VisualBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Stage({ scene, profile, active }: { scene: SceneSpec; profile: RenderProfile; active: boolean }) {
  switch (scene.kind) {
    case "interior": return <Interior model={scene} active={active} />;
    case "ocean": return <Ocean model={scene} active={active} profile={profile} />;
    case "strata": return <Strata layer={scene.layer} active={active} />;
    case "plates": return <Tectonic boundary={scene.boundary} progress={scene.progress} active={active} />;
    case "cosmos": return <Planetarium model={scene} active={active} />;
    case "climate": return <ClimateStage model={scene} active={active} />;
    case "globe": return <Globe scene={scene} active={active} profile={profile} />;
  }
}

function AdaptiveResolution({ profile, active }: { profile:RenderProfile; active:boolean }) {
  const setDpr = useThree((state) => state.setDpr);
  const samples = useRef(0);
  useFrame((state, delta) => {
    if (!active || delta > .15 || profile.dpr === profile.floor) return;
    samples.current = delta > profile.frameMs * 1.7 / 1000 ? samples.current + 1 : Math.max(0,samples.current-1);
    if (samples.current < 24) return;
    const current = state.viewport.dpr;
    if (current > profile.floor) setDpr(Math.max(profile.floor,current-.15));
    samples.current = 0;
  });
  return null;
}

export default function SceneView({ scene, profile, active, onReady, onFailure }: {
  scene: SceneSpec; profile: RenderProfile; active: boolean; onReady: () => void; onFailure: () => void;
}) {
  const [renderer, setRenderer] = useState<WebGLRenderer>();
  const ocean = scene.kind === "ocean";
  useEffect(() => {
    if (!renderer) return;
    const canvas = renderer.domElement;
    function fail(event: Event) { event.preventDefault(); setRenderer(undefined); onFailure(); }
    canvas.addEventListener("webglcontextlost", fail);
    return () => canvas.removeEventListener("webglcontextlost", fail);
  }, [renderer, onFailure]);

  return <VisualBoundary onFailure={onFailure}>
    <Canvas frameloop="demand" dpr={Math.min(profile.dpr, window.devicePixelRatio || 1)} camera={{ position: [0, ocean ? 1.2 : .05, ocean ? 8.6 : 7.4], near: .1, far: 90, fov: ocean ? 52 : 43 }}
      gl={{ antialias: false, powerPreference: profile.name === "high" ? "high-performance" : "low-power", alpha: true }} onCreated={({ gl, scene: root }) => {
        if (!ocean && scene.kind !== "cosmos" && scene.kind !== "climate") {
          root.background = new Color(scene.kind === "globe" || scene.kind === "interior" ? "#121e25" : "#221d1b");
        }
        setRenderer(gl);
        onReady();
      }}>
      <AdaptiveResolution profile={profile} active={active} />
      <Stage scene={scene} active={active} profile={profile} />
    </Canvas>
  </VisualBoundary>;
}
