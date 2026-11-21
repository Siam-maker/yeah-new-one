"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AdditiveBlending, BackSide, BufferGeometry, CanvasTexture, Color, DoubleSide, Float32BufferAttribute, Fog, MathUtils, Quaternion, SRGBColorSpace, TextureLoader, Vector3,
  type Group, type Texture, type WebGLRenderer,
} from "three";
import { Planetarium } from "./planetarium";
import { strataBed, terrainSurface } from "./terrain";
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
  const seabed = useMemo(() => terrainSurface(), []);
  useEffect(() => () => seabed.dispose(), [seabed]);
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
    {depth >= 1000 && <spotLight position={[3,3,6]} color="#9ac5d2" intensity={115} angle={.48} penumbra={.87} distance={24} />}
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
    <mesh geometry={seabed} position={[0, -.8 - Math.max(0, 4.0 - Math.log10(depth+1)), -4]}>
      <meshStandardMaterial vertexColors roughness={.94} side={DoubleSide} />
    </mesh>
    {depth >= 4000 ? <group position={[0,-3.45,-7]}>
      {[-1, 1].map((side) => <group key={side} position={[side*2.1,0,side*.65]} rotation={[0,side*.5,0]}>
        <mesh scale={[1.05,.24,.33]}><sphereGeometry args={[1,20,12]} /><meshStandardMaterial color={side > 0 ? "#836656" : "#6c5368"} roughness={1} /></mesh>
        {[-.56,-.28,0,.28,.56].map((offset) => <mesh key={offset} position={[offset,.17,.14]} scale={[.16,.11,.2]}>
          <sphereGeometry args={[1,9,7]} /><meshStandardMaterial color="#917764" roughness={1} />
        </mesh>)}
      </group>)}
    </group> : <group ref={school}>
      {Array.from({ length: depth < 200 ? 8 : 5 }, (_, index) => (
        <group key={index} position={[-4 + index * 1.42, Math.sin(index * 1.65) * 1.1, -3 - index % 4 * 1.7]}
          rotation={[0, index % 2 ? .34 : -.31, Math.sin(index) * .1]} scale={depth > 1000 ? .8 + index % 2 * .25 : .52}>
          <mesh scale={[.92, .34, .22]}>
            <sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#143047" roughness={.8} />
          </mesh>
          <mesh position={[-1.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[.73, 1, .3]}>
            <coneGeometry args={[.39, .72, 6]} /><meshStandardMaterial color="#203f56" />
          </mesh>
          {depth >= 200 && <mesh position={[.48, -.1, .20]}>
            <sphereGeometry args={[.054, 7, 7]} /><meshBasicMaterial color="#98cfff" />
          </mesh>}
        </group>
      ))}
    </group>}
  </>;
}



function Strata({ layer, active }: { layer: number; active: boolean }) {
  const layers = useRef<Group>(null);
  const rocks = useMemo(() => Array.from({length:6}, (_, index) => strataBed(index)), []);
  useEffect(() => () => rocks.forEach((rock) => rock.dispose()), [rocks]);

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
    <group ref={layers}>{rocks.map((rock,index) => <mesh key={index} geometry={rock}>
      <meshStandardMaterial vertexColors roughness={.89} side={DoubleSide} />
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
  const [countryPaths, setCountryPaths] = useState<Record<string, string>>();
  const [boundaries, setBoundaries] = useState<BufferGeometry>();
  const { invalidate } = useThree();

  useEffect(() => {
    let current = true;
    const texture = new TextureLoader().load(scene.bathymetry ? "/data/bathymetry-globe.webp" : "/images/earth-map.webp", (image) => { if (current) setMap(image); });
    texture.colorSpace = SRGBColorSpace;
    return () => { current = false; texture.dispose(); };
  }, [scene.bathymetry]);

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

  const hasCountryOverlay = Boolean(scene.countryColors);
  useEffect(() => {
    if (!hasCountryOverlay) return;
    const controller = new AbortController();
    fetch("/data/country-paths.json", { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("Map unavailable"); return response.json() as Promise<Record<string, string>>; })
      .then(setCountryPaths).catch(() => {});
    return () => controller.abort();
  }, [hasCountryOverlay]);

  const countryTexture = useMemo(() => {
    if (!countryPaths || !scene.countryColors) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1440;
    canvas.height = 720;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(4, 4);
    for (const [id, color] of Object.entries(scene.countryColors)) {
      if (!countryPaths[id]) continue;
      const shape = new Path2D(countryPaths[id]);
      context.fillStyle = color;
      context.fill(shape, "evenodd");
      context.strokeStyle = id === scene.location.id ? "#fff2cc" : "#52616a";
      context.lineWidth = id === scene.location.id ? .8 : .35;
      context.stroke(shape);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [countryPaths, scene.countryColors, scene.location.id]);
  useEffect(() => () => countryTexture?.dispose(), [countryTexture]);

  const target = useMemo(() => {
    const longitude = (scene.location.lon + scene.heading) * Math.PI / 180;
    const latitude = scene.location.lat * Math.PI / 180;
    const horizontal = new Quaternion().setFromAxisAngle(north, -Math.PI / 2 - longitude);
    const vertical = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), latitude);
    return horizontal.premultiply(vertical);
  }, [scene.heading, scene.location.lat, scene.location.lon]);

  useFrame(({ camera }, delta) => {
    if (!globe.current) return;
    const targetDistance = 6.35 / (1 + (scene.zoom - 1) * .35);
    camera.position.z = active ? MathUtils.damp(camera.position.z, targetDistance, 6, Math.min(delta, .08)) : targetDistance;
    if (active && Math.abs(camera.position.z - targetDistance) > .006) invalidate();
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
      {countryTexture && <mesh><sphereGeometry args={[1.507, 64, 38]} /><meshBasicMaterial map={countryTexture} alphaTest={.4} toneMapped={false} /></mesh>}
      <mesh renderOrder={3}>
        <sphereGeometry args={[1.555,48,32]} />
        <shaderMaterial side={BackSide} blending={AdditiveBlending} transparent depthWrite={false}
          vertexShader={`varying vec3 n; varying vec3 v; void main(){ vec4 p=modelViewMatrix*vec4(position,1.0); n=normalize(normalMatrix*normal); v=normalize(-p.xyz); gl_Position=projectionMatrix*p; }`}
          fragmentShader={`varying vec3 n; varying vec3 v; void main(){ float rim=pow(1.0-abs(dot(normalize(n),normalize(v))),2.6); gl_FragColor=vec4(.24,.71,1.0,rim*.5); }`} />
      </mesh>
      {scene.showBoundaries && boundaries && <lineSegments geometry={boundaries}><lineBasicMaterial color="#ff996d" /></lineSegments>}
      {scene.points.map((location) => (
        <mesh key={location.id} position={geographicPoint(location.lon, location.lat, 1.548)} onClick={(event) => { event.stopPropagation(); scene.onSelect(location.id); }}>
          <sphereGeometry args={[location.id === scene.location.id ? .065 : .032, 10, 7]} />
          <meshBasicMaterial color={location.id === scene.location.id ? "#f0ede5" : scene.markerColor} />
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
    case "cosmos": return <Planetarium model={scene} active={active} />;
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
        if (!ocean && scene.kind !== "cosmos") root.background = new Color("#161c27");
        setRenderer(gl);
        onReady();
      }}>
      <Stage scene={scene} active={active} quality={quality} />
    </Canvas>
  </VisualBoundary>;
}
