"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  AdditiveBlending, DoubleSide, MathUtils, SRGBColorSpace, TextureLoader,
  type ShaderMaterial, type Texture, type WebGLRenderer,
} from "three";
import type { AbyssCamera } from "./abyss-stage";
import { caveFragment, caveVertex, moteFragment, moteVertex, shaftFragment } from "./cave-shaders";

import { buildCaveGeometry } from "./cave-geometry";

const cameraDistance = 3.1;
const motePositions = new Float32Array(Array.from({ length: 76 }, (_, index) => [
  Math.sin(index * 8.73) * 4.3 + 0.95,
  Math.cos(index * 5.31) * 2.8,
  -1 - (index % 37) * .48,
]).flat());

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Cave({ rock, steering, active, fps, detail, ambientMotion }: {
  rock: Texture;
  steering: RefObject<AbyssCamera>;
  active: boolean;
  fps: number;
  detail: number;
  ambientMotion: boolean;
}) {
  const { invalidate, gl } = useThree();
  const geometry = useMemo(() => buildCaveGeometry(detail), [detail]);
  const rockUniforms = useMemo(() => ({ rock: { value: rock }, time: { value: 0 }, descent: { value: 0 } }), [rock]);
  const shaftUniforms = useMemo(() => ({ time: { value: 0 } }), []);
  const caveMaterial = useRef<ShaderMaterial>(null);
  const shaftMaterial = useRef<ShaderMaterial>(null);
  const moteMaterial = useRef<ShaderMaterial>(null);
  const elapsed = useRef(0);
  const motes = useMemo(() => ({ time: { value: 0 }, pixelRatio: { value: 1 } }), []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let last = 0;
    const frameInterval = 1000 / fps;
    let settlingUntil = 0;
    let previous = { ...steering.current };

    function tick(now: number) {
      const position = steering.current;
      const moved = Math.abs(position.x-previous.x) + Math.abs(position.y-previous.y) + Math.abs(position.descent-previous.descent) > .001;
      if (moved) {
        previous = { ...position };
        settlingUntil = now + 620;
      }
      if ((ambientMotion || now < settlingUntil) && now-last >= frameInterval) {
        last = now;
        invalidate();
      }
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, fps, invalidate, steering, ambientMotion]);

  useFrame(({ camera }, delta) => {
    const { x, y, descent } = steering.current;
    const step = Math.min(delta, 0.07);
    camera.position.x = MathUtils.damp(camera.position.x, -.56 + x*.54 + descent*.78, 4, step);
    camera.position.y = MathUtils.damp(camera.position.y, -y * 0.33 - descent * 0.4, 4, step);
    camera.position.z = MathUtils.damp(camera.position.z, cameraDistance - descent * 8.2, 4, step);
    if (active) elapsed.current += step;

    if (caveMaterial.current) {
      caveMaterial.current.uniforms.time.value = elapsed.current;
      caveMaterial.current.uniforms.descent.value = descent;
    }
    if (shaftMaterial.current) shaftMaterial.current.uniforms.time.value = elapsed.current;

    const particles = moteMaterial.current;
    if (particles) {
      particles.uniforms.time.value = elapsed.current;
      particles.uniforms.pixelRatio.value = gl.getPixelRatio();
    }
  });

  return (
    <>
      <color attach="background" args={["#0d1917"]} />
      <mesh geometry={geometry}>
        <shaderMaterial ref={caveMaterial} vertexShader={caveVertex} fragmentShader={caveFragment}
          uniforms={rockUniforms} side={DoubleSide} toneMapped={false} />
      </mesh>
      <mesh position={[1.65, 1.05, -8.25]} rotation={[0, .21, -.29]} renderOrder={2}>
        <planeGeometry args={[7, 7]} />
        <shaderMaterial ref={shaftMaterial} vertexShader={caveVertex} fragmentShader={shaftFragment}
          uniforms={shaftUniforms} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </mesh>
      <points renderOrder={3}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[motePositions, 3]} />
        </bufferGeometry>
        <shaderMaterial ref={moteMaterial} vertexShader={moteVertex} fragmentShader={moteFragment} uniforms={motes}
          transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </points>
    </>
  );
}

export default function AbyssScene({ camera, active, source, dpr, fps, detail, ambientMotion }: {
  camera: RefObject<AbyssCamera>;
  active: boolean;
  source: string;
  dpr: number;
  fps: number;
  detail: number;
  ambientMotion: boolean;
}) {
  const [rock, setRock] = useState<Texture | null>(null);
  const [renderer, setRenderer] = useState<WebGLRenderer | null>(null);
  const [lost, setLost] = useState(false);
  const stopScene = useCallback(() => {
    setLost(true);
    setRenderer(null);
    setRock(null);
  }, []);

  useEffect(() => {
    if (lost) return;
    let current = true;
    const art = new TextureLoader().load(source, (texture) => {
      if (current) setRock(texture);
    }, undefined, () => {
      if (current) stopScene();
    });
    art.colorSpace = SRGBColorSpace;
    return () => {
      current = false;
      art.dispose();
    };
  }, [lost, source, stopScene]);

  useEffect(() => {
    if (!renderer) return;
    const canvas = renderer.domElement;
    function handleLoss(event:Event) { event.preventDefault();stopScene(); }
    canvas.addEventListener("webglcontextlost",handleLoss);
    return () => canvas.removeEventListener("webglcontextlost",handleLoss);
  }, [renderer, stopScene]);

  if (lost || !rock) return null;

  return (
    <SceneBoundary onFailure={stopScene}>
      <div className="abyss-canvas" data-ready={renderer ? "" : undefined} data-running={active ? "" : undefined}>
        <Canvas camera={{ position: [-.56, 0, cameraDistance], fov: 55, near: 0.1, far: 40 }} dpr={dpr}
          frameloop="demand"
          style={{ pointerEvents: "none" }}
          gl={{ antialias: false, powerPreference: "low-power", alpha: true }}
          onCreated={({ gl }) => setRenderer(gl)}>
          <Cave rock={rock} steering={camera} active={active} fps={fps} detail={detail} ambientMotion={ambientMotion} />
        </Canvas>
      </div>
    </SceneBoundary>
  );
}
