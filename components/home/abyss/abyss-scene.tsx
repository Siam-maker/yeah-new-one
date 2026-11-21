"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  AdditiveBlending, MathUtils, SRGBColorSpace, TextureLoader, Vector2,
  type ShaderMaterial, type Texture, type WebGLRenderer,
} from "three";
import type { AbyssCamera } from "./abyss-stage";
import { caveFragment, caveVertex, moteFragment, moteVertex } from "./cave-shaders";

const surfaces = [-0.96, -0.05, 0.84];
const cameraDistance = 6;
const motePositions = new Float32Array(Array.from({ length: 56 }, (_, index) => [
  Math.sin(index * 8.73) * 4.3 + 0.95,
  Math.cos(index * 5.31) * 2.8,
  Math.sin(index * 3.74) * 1.55 + 1.5,
]).flat());

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Cave({ rock, steering, active, fps }: {
  rock: Texture;
  steering: RefObject<AbyssCamera>;
  active: boolean;
  fps: number;
}) {
  const { invalidate, viewport, gl } = useThree();
  const aspect = viewport.aspect || 1;
  const uniforms = useMemo(() => {
    const image = rock.image as HTMLImageElement;
    const ratio = aspect / (image.naturalWidth / image.naturalHeight);
    const crop = new Vector2(Math.min(1, ratio), Math.min(1, 1 / ratio));
    return surfaces.map((_, layer) => ({
      rock: { value: rock }, crop: { value: crop }, layer: { value: layer },
      time: { value: 0 }, descent: { value: 0 },
    }));
  }, [aspect, rock]);
  const surfaceMaterials = useRef<(ShaderMaterial | null)[]>([]);
  const moteMaterial = useRef<ShaderMaterial>(null);
  const elapsed = useRef(0);
  const motes = useMemo(() => ({ time: { value: 0 }, pixelRatio: { value: 1 } }), []);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let last = 0;
    const frameInterval = 1000 / fps;

    function tick(now: number) {
      if (now - last >= frameInterval) {
        last = now - (now - last) % frameInterval;
        invalidate();
      }
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, fps, invalidate]);

  useFrame(({ camera }, delta) => {
    const { x, y, descent } = steering.current;
    const step = Math.min(delta, 0.07);
    camera.position.x = MathUtils.damp(camera.position.x, x * 0.30, 4, step);
    camera.position.y = MathUtils.damp(camera.position.y, -y * 0.22 - descent * 0.17, 4, step);
    camera.position.z = MathUtils.damp(camera.position.z, cameraDistance - descent * 0.34, 4, step);
    if (active) elapsed.current += step;

    for (const surface of surfaceMaterials.current) {
      if (!surface) continue;
      surface.uniforms.time.value = elapsed.current;
      surface.uniforms.descent.value = descent;
    }

    const particles = moteMaterial.current;
    if (particles) {
      particles.uniforms.time.value = elapsed.current;
      particles.uniforms.pixelRatio.value = gl.getPixelRatio();
    }
  });

  return (
    <>
      {surfaces.map((z, index) => {
        const overscan = (cameraDistance - z) / cameraDistance * 1.13;
        return (
          <mesh key={z} position={[0, 0, z]} renderOrder={index}>
            <planeGeometry args={[viewport.width * overscan, viewport.height * overscan]} />
            <shaderMaterial ref={(material) => { surfaceMaterials.current[index] = material; }} vertexShader={caveVertex} fragmentShader={caveFragment} uniforms={uniforms[index]}
              transparent={index > 0} depthWrite={index === 0} toneMapped={false} />
          </mesh>
        );
      })}
      <points renderOrder={surfaces.length}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[motePositions, 3]} />
        </bufferGeometry>
        <shaderMaterial ref={moteMaterial} vertexShader={moteVertex} fragmentShader={moteFragment} uniforms={motes}
          transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </points>
    </>
  );
}

export default function AbyssScene({ camera, active, source, dpr, fps }: {
  camera: RefObject<AbyssCamera>;
  active: boolean;
  source: string;
  dpr: number;
  fps: number;
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
    canvas.addEventListener("webglcontextlost", stopScene);
    return () => canvas.removeEventListener("webglcontextlost", stopScene);
  }, [renderer, stopScene]);

  if (lost || !rock) return null;

  return (
    <SceneBoundary onFailure={stopScene}>
      <div className="abyss-canvas" data-ready={renderer ? "" : undefined} data-running={active ? "" : undefined}>
        <Canvas camera={{ position: [0, 0, cameraDistance], fov: 45, near: 0.1, far: 20 }} dpr={dpr}
          frameloop="demand"
          style={{ pointerEvents: "none" }}
          gl={{ antialias: false, powerPreference: "low-power", alpha: true }}
          onCreated={({ gl }) => setRenderer(gl)}>
          <Cave rock={rock} steering={camera} active={active} fps={fps} />
        </Canvas>
      </div>
    </SceneBoundary>
  );
}
