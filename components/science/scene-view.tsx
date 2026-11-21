"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  BufferGeometry, Color, Float32BufferAttribute, Fog, MathUtils, Quaternion, SRGBColorSpace, TextureLoader, Vector3,
  type Group, type Texture, type WebGLRenderer,
} from "three";
import { locations } from "@/lib/content/atlas";
import { zoneAt } from "@/lib/content/ocean";
import type { Boundary, SceneSpec } from "./scene-types";

class VisualBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const particulates = new Float32Array(Array.from({ length: 105 }, (_, i) => [
  Math.sin(i * 57.8) * 14, Math.cos(i * 21.09) * 9, -i % 32 + 7,
]).flat());

function Ocean({ depth, active, quality }: { depth: number; active: boolean; quality: number }) {
  const layer = zoneAt(depth);
  const dust = useRef<Group>(null);
  const school = useRef<Group>(null);
  const { invalidate } = useThree();
  const fogTarget = useMemo(() => new Color(layer.fog), [layer.fog]);

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(invalidate, quality < 1 ? 52 : 29);
    return () => window.clearInterval(timer);
  }, [active, invalidate, quality]);

  useFrame(({ camera, clock, scene }, delta) => {
    const ease = active ? 1 - Math.exp(-3 * Math.min(delta, .1)) : 1;
    if (scene.background instanceof Color) scene.background.lerp(fogTarget, ease);
    if (scene.fog instanceof Fog) {
      scene.fog.color.lerp(fogTarget, ease);
      scene.fog.far = MathUtils.lerp(scene.fog.far, depth < 1000 ? 30 : 20, ease);
    }
    const y = 2.4 - Math.log10(1 + depth / 100) * 2.45;
    camera.position.y = active ? MathUtils.damp(camera.position.y, y, 3, Math.min(delta, .1)) : y;
    if (dust.current) dust.current.rotation.z = active ? clock.elapsedTime * .025 : 0;
    if (school.current) school.current.position.x = active ? Math.sin(clock.elapsedTime * .35) * 1.7 : 0;
  });

  return <>
    <color attach="background" args={["#174b68"]} />
    <fog attach="fog" args={["#174b68", 5, 25]} />
    <ambientLight intensity={depth < 1000 ? 0.75 : 0.35} />
    <directionalLight position={[-4, 9, 0]} color={layer.color} intensity={depth < 1000 ? 4 : 1.8} />
    <group ref={dust}>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[particulates, 3]} /></bufferGeometry>
        <pointsMaterial size={depth >= 4000 ? .075 : .045} color={depth >= 4000 ? "#c4dbde" : "#7eb5ee"} transparent opacity={.56} depthWrite={false} />
      </points>
    </group>
    {depth < 1000 && <group rotation={[0, 0, -.37]} position={[-1, 6, -9]}>
      {[0, 1, 2, 3].map((ray) => <mesh key={ray} position={[ray * 1.25, 0, -ray * .5]}>
        <coneGeometry args={[1.0 + ray * .2, 15, 9, 1, true]} />
        <meshBasicMaterial color="#67cced" transparent opacity={.055 - ray * .008} depthWrite={false} />
      </mesh>)}
    </group>}
    <group position={[0, -3.8, -6]}>
      {Array.from({ length: 23 }, (_, index) => <mesh key={index}
        position={[Math.sin(index * 6.2) * (index % 8 + 2), Math.sin(index * 3.2) * 2 - .5, -index % 12 * 1.4]}
        rotation={[index * .11, index * .17, index * .04]} scale={[1.7 + index % 3, .65 + index % 4 * .55, 1.6 + index % 2]}>
        <icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color={depth >= 6000 ? "#3b4853" : "#2c3a4c"} roughness={.94} flatShading />
      </mesh>)}
      <mesh position={[0, -1.5, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[55, 46]} /><meshStandardMaterial color="#302e3a" roughness={1} />
      </mesh>
    </group>
    <group ref={school}>
      {Array.from({ length: depth < 200 ? 8 : depth > 4000 ? 3 : 5 }, (_, index) => (
        <group key={index} position={[-4 + index * 1.42, (depth > 4000 ? -1.8 : 0) + Math.sin(index * 1.65) * 1.1, -3 - index % 4 * 1.7]}
          rotation={[0, index % 2 ? .34 : -.31, Math.sin(index) * .1]} scale={depth > 1000 ? .8 + index % 2 * .25 : .52}>
          <mesh scale={[.92, depth > 4000 ? .18 : .34, .22]}>
            <sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={depth > 4000 ? "#344d53" : "#143047"} roughness={.8} />
          </mesh>
          <mesh position={[-1.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[.73, 1, .3]}>
            <coneGeometry args={[.39, .72, 6]} /><meshStandardMaterial color="#203f56" />
          </mesh>
          {depth >= 200 && depth < 4000 && <mesh position={[.48, -.1, .20]}>
            <sphereGeometry args={[.054, 7, 7]} /><meshBasicMaterial color="#98cfff" />
          </mesh>}
        </group>
      ))}
    </group>
  </>;
}

const rockPalette = ["#6c4045", "#824d3b", "#b77053", "#aa8260", "#d2a27a", "#657a78"];

function Strata({ layer, active }: { layer: number; active: boolean }) {
  const layers = useRef<Group>(null);

  useFrame(({ invalidate }, delta) => {
    const amount = active ? 1 - Math.exp(-6 * Math.min(delta, .07)) : 1;
    for (const [index, band] of (layers.current?.children ?? []).entries()) {
      const x = index === layer ? -.73 : 0;
      band.position.x = MathUtils.lerp(band.position.x, x, amount);
      if (Math.abs(x - band.position.x) > .005) invalidate();
    }
  });

  return <group rotation={[-.12, -.51, 0]}>
    <ambientLight intensity={1.6} /><directionalLight position={[1, 5, 4]} intensity={3.5} />
    <group ref={layers}>{rockPalette.map((color, index) => <mesh key={color} position={[0, (index - 2.5) * .39, 0]} rotation={[0, 0, index * .015 - .045]}>
      <boxGeometry args={[4.5 + Math.sin(index * 2) * .34, .40, 2.25 + index * .07]} />
      <meshStandardMaterial color={color} roughness={.86} />
    </mesh>)}</group>
  </group>;
}

function Tectonic({ boundary, progress }: { boundary: Boundary; progress: number }) {
  const amount = progress / 100;
  const convergence = boundary === "convergent";
  const opening = boundary === "divergent";
  const slide = !convergence && !opening;

  return <group rotation={[-.2, -.46, 0]}>
    <ambientLight intensity={1.35} /><directionalLight position={[1, 6, 3]} intensity={3} />
    <mesh position={[0, -1.18, 0]}><boxGeometry args={[5.9, .5, 3.2]} /><meshStandardMaterial color="#522936" /></mesh>
    <group position={[-1.4 + (convergence ? amount * .62 : opening ? -amount * .44 : 0), convergence ? -amount * .28 : 0, slide ? -amount * .75 : 0]}
      rotation={[0, 0, convergence ? -amount * .31 : 0]}>
      <mesh position={[0, -.43, 0]}><boxGeometry args={[2.8, .49, 2.9]} /><meshStandardMaterial color="#394a68" /></mesh>
      <mesh position={[0, -.12, 0]}><boxGeometry args={[2.8, .17, 2.85]} /><meshStandardMaterial color="#6592a0" /></mesh>
    </group>
    <group position={[1.4 + (opening ? amount * .44 : 0), 0, slide ? amount * .75 : 0]}>
      <mesh position={[0, -.39, 0]}><boxGeometry args={[2.8, .50, 2.9]} /><meshStandardMaterial color="#8c503e" /></mesh>
      <mesh position={[0, -.06, 0]}><boxGeometry args={[2.8, .18, 2.85]} /><meshStandardMaterial color="#ba926d" /></mesh>
      {convergence && amount > .08 && <mesh position={[-.67, amount * .4, -.19]} scale={[.95, amount * 1.6, .75]}>
        <coneGeometry args={[.84, 1, 6]} /><meshStandardMaterial color="#b6875b" roughness={.95} />
      </mesh>}
    </group>
    {opening && amount > .03 && <mesh position={[0, -.41 + amount * .17, 0]}>
      <boxGeometry args={[amount * .85, .28, 2.8]} /><meshStandardMaterial color="#ff815a" emissive="#9f3323" emissiveIntensity={.55} />
    </mesh>}
  </group>;
}

function geographicPoint(lon: number, lat: number, radius: number) {
  const angle = lon * Math.PI / 180;
  const phi = lat * Math.PI / 180;
  return new Vector3(radius * Math.cos(phi) * Math.cos(angle), radius * Math.sin(phi), -radius * Math.cos(phi) * Math.sin(angle));
}

const north = new Vector3(0, 1, 0);

function Globe({ scene, active }: { scene: Extract<SceneSpec, { kind: "globe" }>; active: boolean }) {
  const globe = useRef<Group>(null);
  const [map, setMap] = useState<Texture>();
  const [boundaries, setBoundaries] = useState<BufferGeometry>();
  const { invalidate } = useThree();

  useEffect(() => {
    let current = true;
    const texture = new TextureLoader().load("/images/earth-map.webp", (image) => { if (current) setMap(image); });
    texture.colorSpace = SRGBColorSpace;
    return () => { current = false; texture.dispose(); };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let geometry: BufferGeometry | undefined;
    fetch("/data/plate-boundaries.json", { signal: controller.signal })
      .then((result) => { if (!result.ok) throw new Error("Boundary data unavailable"); return result.json() as Promise<number[][][]>; })
      .then((lines) => {
        if (controller.signal.aborted) return;
        const positions: number[] = [];
        for (const line of lines) for (let index = 1; index < line.length; index++) {
          for (const [lon, lat] of [line[index - 1], line[index]]) positions.push(...geographicPoint(lon, lat, 1.516).toArray());
        }
        geometry = new BufferGeometry();
        geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
        setBoundaries(geometry);
      }).catch(() => {});
    return () => { controller.abort(); geometry?.dispose(); };
  }, []);

  const target = useMemo(() => {
    const longitude = (scene.location.lon + scene.heading) * Math.PI / 180;
    const latitude = scene.location.lat * Math.PI / 180;
    const horizontal = new Quaternion().setFromAxisAngle(north, -Math.PI / 2 - longitude);
    const vertical = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), latitude);
    return horizontal.premultiply(vertical);
  }, [scene.heading, scene.location.lat, scene.location.lon]);

  useFrame((_, delta) => {
    if (!globe.current) return;
    if (!active || globe.current.quaternion.angleTo(target) < .008) globe.current.quaternion.copy(target);
    else {
      globe.current.quaternion.slerp(target, 1 - Math.exp(-5 * Math.min(delta, .08)));
      invalidate();
    }
  });

  return <>
    <ambientLight intensity={1.08} /><directionalLight position={[-4, 5, 5]} color="#e6f0ff" intensity={1.85} />
    <group ref={globe}>
      <mesh><sphereGeometry args={[1.5, 64, 38]} /><meshStandardMaterial key={map ? "textured" : "plain"} map={map} color={map ? "#ffffff" : "#295476"} roughness={.85} /></mesh>
      {scene.showBoundaries && boundaries && <lineSegments geometry={boundaries}><lineBasicMaterial color="#ff996d" /></lineSegments>}
      {locations.map((location) => (
        <mesh key={location.id} position={geographicPoint(location.lon, location.lat, 1.548)} onClick={(event) => { event.stopPropagation(); scene.onSelect(location.id); }}>
          <sphereGeometry args={[location.id === scene.location.id ? .065 : .032, 10, 7]} />
          <meshBasicMaterial color={location.id === scene.location.id ? "#ffad84" : "#dbeaf9"} />
        </mesh>
      ))}
    </group>
  </>;
}

function Stage({ scene, quality, active }: { scene: SceneSpec; quality: number; active: boolean }) {
  switch (scene.kind) {
    case "ocean": return <Ocean depth={scene.depth} active={active} quality={quality} />;
    case "strata": return <Strata layer={scene.layer} active={active} />;
    case "plates": return <Tectonic boundary={scene.boundary} progress={scene.progress} />;
    case "globe": return <Globe scene={scene} active={active} />;
  }
}

export default function SceneView({ scene, quality, active, onReady, onFailure }: {
  scene: SceneSpec; quality: number; active: boolean; onReady: () => void; onFailure: () => void;
}) {
  const [renderer, setRenderer] = useState<WebGLRenderer>();
  const ocean = scene.kind === "ocean";
  useEffect(() => {
    if (!renderer) return;
    const canvas = renderer.domElement;
    function fail() { setRenderer(undefined); onFailure(); }
    canvas.addEventListener("webglcontextlost", fail);
    return () => canvas.removeEventListener("webglcontextlost", fail);
  }, [renderer, onFailure]);

  return <VisualBoundary onFailure={onFailure}>
    <Canvas frameloop="demand" dpr={quality} camera={{ position: [0, ocean ? 1.2 : .05, ocean ? 8.6 : 7.4], near: .1, far: 90, fov: ocean ? 52 : 43 }}
      gl={{ antialias: false, powerPreference: "low-power", alpha: true }} onCreated={({ gl, scene: root }) => {
        if (!ocean) root.background = new Color("#161c27");
        setRenderer(gl);
        onReady();
      }}>
      <Stage scene={scene} active={active} quality={quality} />
    </Canvas>
  </VisualBoundary>;
}
