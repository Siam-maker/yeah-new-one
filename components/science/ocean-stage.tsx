import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, DoubleSide, Fog, MathUtils, type Group } from "three";
import { zoneAt } from "@/lib/content/ocean";
import { terrainSurface } from "./terrain";
import type { RenderProfile } from "./render-profile";

const particulates = new Float32Array(Array.from({ length: 154 }, (_, i) => [
  Math.sin(i * 57.8) * 14, Math.cos(i * 21.09) * 9, -i % 32 + 7,
]).flat());

const habitats = {
  sunlight:{ visibility:34,density:.32,light:3.1,bed:-5.2,roughness:.88,particles:75 },
  twilight:{ visibility:27,density:.49,light:1.6,bed:-5.8,roughness:.94,particles:118 },
  midnight:{ visibility:21,density:.56,light:.85,bed:-4.4,roughness:.98,particles:133 },
  abyssal:{ visibility:24,density:.48,light:.72,bed:-2.5,roughness:.98,particles:147 },
  hadal:{ visibility:18,density:.74,light:.45,bed:-3.05,roughness:1,particles:154 },
};

export function Ocean({ depth, active, profile }: { depth: number; active: boolean; profile: RenderProfile }) {
  const layer = zoneAt(depth);
  const habitat = habitats[layer.id];
  const ground = useRef<Group>(null);
  const dust = useRef<Group>(null);
  const school = useRef<Group>(null);
  const { invalidate } = useThree();
  const seabed = useMemo(() => terrainSurface(layer.id), [layer.id]);
  const particles = useMemo(() => particulates.slice(0,habitat.particles*3), [habitat.particles]);
  useEffect(() => () => seabed.dispose(), [seabed]);
  const fogTarget = useMemo(() => new Color(layer.fog), [layer.fog]);

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(invalidate, profile.frameMs);
    return () => window.clearInterval(timer);
  }, [active, invalidate, profile.frameMs]);

  useFrame(({ camera, clock, scene }, delta) => {
    const ease = active ? 1 - Math.exp(-3 * Math.min(delta, .1)) : 1;
    if (scene.background instanceof Color) scene.background.lerp(fogTarget, ease);
    if (scene.fog instanceof Fog) {
      scene.fog.color.lerp(fogTarget, ease);
      scene.fog.far = MathUtils.lerp(scene.fog.far, habitat.visibility, ease);
    }
    const y = 2.4 - Math.log10(1 + depth / 100) * 2.45;
    camera.position.y = active ? MathUtils.damp(camera.position.y, y, 3, Math.min(delta, .1)) : y;
    if (ground.current) ground.current.position.y = MathUtils.lerp(ground.current.position.y,habitat.bed,ease);
    if (dust.current) dust.current.rotation.z = active ? clock.elapsedTime * .025 : 0;
    if (school.current) school.current.position.x = active ? Math.sin(clock.elapsedTime * .35) * 1.7 : 0;
  });

  return <>
    <color attach="background" args={["#174b68"]} />
    <fog attach="fog" args={["#174b68", 5, 25]} />
    <ambientLight intensity={depth < 1000 ? 0.75 : 0.35} />
    <directionalLight position={[-4, 9, 0]} color={layer.color} intensity={habitat.light} />
    {depth >= 1000 && <>
      <pointLight position={[.2,-1,-2.8]} color="#a4c6c7" intensity={36} distance={20} />
      <pointLight position={[-3,-2.8,-7.5]} color={layer.id === "hadal" ? "#6c7f9d" : "#789ea2"} intensity={13} distance={13} />
    </>}
    <group ref={dust}>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[particles, 3]} /></bufferGeometry>
        <pointsMaterial size={depth >= 4000 ? .075 : .045} color={depth >= 4000 ? "#c4dbde" : "#7eb5ee"} transparent opacity={habitat.density} depthWrite={false} />
      </points>
    </group>
    {depth < 1000 && <group rotation={[0, 0, -.37]} position={[-1, 6, -9]}>
      {[0, 1, 2, 3].map((ray) => <mesh key={ray} position={[ray * 1.25, 0, -ray * .5]}>
        <coneGeometry args={[1.0 + ray * .2, 15, 9, 1, true]} />
        <meshBasicMaterial color="#67cced" transparent opacity={(layer.id === "sunlight" ? .08 : .03) - ray * .004} depthWrite={false} />
      </mesh>)}
    </group>}
    <group ref={ground} position={[0,-4.4,-4]}><mesh geometry={seabed}><meshStandardMaterial vertexColors roughness={habitat.roughness} side={DoubleSide} /></mesh></group>
    {layer.id === "hadal" ? <group position={[0,-2.55,-6]}>
      {[-1,1].map((side) => <group key={side} position={[side*1.6,side*.18,0]} rotation={[0,side*.4,.66]}>
        <mesh scale={[.67,.23,.24]}><torusGeometry args={[.56,.17,10,24,4.15]} /><meshStandardMaterial color="#ae8871" roughness={.86} /></mesh>
        {[0,1,2,3].map((limb) => <mesh key={limb} position={[-.25+limb*.14,-.18,-.01]} rotation={[0,0,-.45]}><coneGeometry args={[.045,.32,6]} /><meshStandardMaterial color="#c3aa97"/></mesh>)}
      </group>)}
    </group> : layer.id === "abyssal" ? <group position={[0,-3.45,-7]}>
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
            <sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={layer.id === "sunlight" ? "#618ca3" : layer.id === "twilight" ? "#44546c" : "#2b263c"} roughness={.8} />
          </mesh>
          <mesh position={[-1.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[.73, 1, .3]}>
            <coneGeometry args={[.39, .72, 6]} /><meshStandardMaterial color="#203f56" />
          </mesh>
          {depth >= 200 && [0,1,2].map((point) => <mesh key={point} position={[.45-point*.25,-.12,.21]}>
            <sphereGeometry args={[layer.id === "midnight" ? .055 : .034,7,7]} /><meshBasicMaterial color={layer.id === "midnight" ? "#8ceeee" : "#9faeff"} />
          </mesh>)}
        </group>
      ))}
    </group>}
  </>;
}
