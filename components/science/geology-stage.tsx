import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, MathUtils, SRGBColorSpace, TextureLoader, type Group, type Texture } from "three";
import { strataBed } from "./terrain";
import { earthLayers } from "@/lib/content/earth-interior";
import type { Boundary, SceneSpec } from "./scene-types";

export function Strata({ layer, active }: { layer: number; active: boolean }) {
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

export function Tectonic({ boundary, progress }: { boundary: Boundary; progress: number }) {
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

export function Interior({ model, active }: { model: Extract<SceneSpec,{ kind:"interior" }>; active:boolean }) {
  const shell = useRef<Group>(null);
  const [surface,setSurface] = useState<Texture>();
  useEffect(() => {
    let active = true;
    const texture = new TextureLoader().load("/images/earth-map.webp", (image) => { if (active) setSurface(image); });
    texture.colorSpace = SRGBColorSpace;
    texture.repeat.x = .5;
    texture.offset.x = .5;
    return () => { active=false;texture.dispose(); };
  },[]);
  useFrame(({ invalidate }, delta) => {
    if (!shell.current) return;
    const target = MathUtils.degToRad(model.rotation);
    shell.current.rotation.y = active ? MathUtils.damp(shell.current.rotation.y,target,7,Math.min(.08,delta)) : target;
    if (active && Math.abs(target-shell.current.rotation.y) > .004) invalidate();
  });
  return <>
    <ambientLight intensity={1.5} /><directionalLight position={[-3,5,6]} color="#ffdfb1" intensity={2.8} />
    <group ref={shell}>
      <mesh>
        <sphereGeometry args={[earthLayers[0].radius,52,36,Math.PI,Math.PI]} />
        <meshStandardMaterial map={surface} color={surface ? "#eee7d0" : "#6b6d54"} roughness={.79} />
      </mesh>
      {earthLayers.map((layer,index) => {
        const next = earthLayers[index+1]?.radius ?? 0;
        const activeLayer = model.selected === index;
        return <mesh key={layer.name} position={[0,0,activeLayer ? .065 : .012]} onClick={(event)=>{event.stopPropagation();model.onSelect(index);}}>
          <ringGeometry args={[next,layer.radius,60]} />
          <meshStandardMaterial color={layer.color} emissive={layer.color} emissiveIntensity={activeLayer ? .58 : .11} roughness={.76} side={DoubleSide} />
        </mesh>;
      })}
    </group>
  </>;
}
