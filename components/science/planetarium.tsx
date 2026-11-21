"use client";

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, MathUtils } from "three";
import { displayOrbit, planets } from "@/lib/content/cosmos";
import { planetSurface } from "./planet-surface";
import type { SceneSpec } from "./scene-types";

const stars = new Float32Array(1100 * 3);
const starColors = new Float32Array(stars.length);
for (let i=0;i<1100;i++) {
  const u = i / 1100;
  const theta = i * 2.399963;
  const phi = Math.acos(1-2*u);
  const r = 35 + Math.sin(i*5.4)*6;
  stars.set([r*Math.cos(theta)*Math.sin(phi), r*Math.cos(phi), r*Math.sin(theta)*Math.sin(phi)],i*3);
  const color = new Color(i % 13 === 0 ? "#b5a7f8" : i % 7 === 0 ? "#edce9c" : "#b9ddec");
  starColors.set(color.toArray(),i*3);
}

export function Planetarium({ model, active }: { model: Extract<SceneSpec,{kind:"cosmos"}>; active:boolean }) {
  const materials = useMemo(() => planets.map((planet) => planetSurface(planet.id, planet.color)), []);
  useEffect(() => () => materials.forEach((texture) => texture?.dispose()), [materials]);
  const target = planets.find((item)=>item.id===model.selected) ?? planets[2];

  useFrame(({ camera, invalidate },delta)=>{
    const x = target.au > 5 ? .6 : 0;
    const destination = [x, 7, 10.1];
    const amount = active ? 1-Math.exp(-7*Math.min(delta,.07)) : 1;
    camera.position.set(
      MathUtils.lerp(camera.position.x,destination[0],amount),
      MathUtils.lerp(camera.position.y,destination[1],amount),
      MathUtils.lerp(camera.position.z,destination[2],amount),
    );
    camera.lookAt(0,0,0);
    if (active && (Math.abs(camera.position.y-destination[1]) > .006 || Math.abs(camera.position.x-x) > .006)) invalidate();
  });

  const orbits = useMemo(()=>planets.map((planet)=>new Float32Array(Array.from({length:129},(_,index)=>{
    const theta=index / 128 * Math.PI*2;
    return [Math.cos(theta)*displayOrbit(planet.au),0,Math.sin(theta)*displayOrbit(planet.au)];
  }).flat())),[]);

  return <>
    <points frustumCulled={false}><bufferGeometry>
      <bufferAttribute attach="attributes-position" args={[stars,3]} />
      <bufferAttribute attach="attributes-color" args={[starColors,3]} />
    </bufferGeometry><pointsMaterial size={.065} vertexColors transparent opacity={.8} depthWrite={false} /></points>
    <ambientLight intensity={.43} /><pointLight position={[0,0,0]} intensity={45} color="#ffe0a7" />
    <mesh><sphereGeometry args={[.43,32,16]} /><meshBasicMaterial color="#ffdba1" /></mesh>
    <mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.45,.62,80]} /><meshBasicMaterial color="#e68952" transparent opacity={.14} depthWrite={false} /></mesh>
    <group>
      {planets.map((planet,index)=>{
        const orbit=displayOrbit(planet.au);
        const phase=model.years / planet.years * Math.PI*2 + index * 1.1;
        const selected=planet.id===model.selected;
        const radius=.10+Math.sqrt(planet.diameter/139820)*.27;
        return <group key={planet.id}>
          <lineLoop><bufferGeometry><bufferAttribute attach="attributes-position" args={[orbits[index],3]} /></bufferGeometry>
            <lineBasicMaterial color={selected ? "#afa7ff" : "#526187"} transparent opacity={selected ? .96 : .45} /></lineLoop>
          <group position={[Math.cos(phase)*orbit,0,Math.sin(phase)*orbit]} onClick={(event)=>{event.stopPropagation();model.onSelect(planet.id);}}>
            <mesh><sphereGeometry args={[radius,26,16]} /><meshStandardMaterial map={materials[index]} color={materials[index] ? "#ffffff" : planet.color} roughness={.85} /></mesh>
            {planet.id==="saturn" && <mesh rotation={[-Math.PI/2+.14,0,.19]}>
              <ringGeometry args={[radius*1.32,radius*1.93,48]} /><meshBasicMaterial color="#d5bb94" side={2} transparent opacity={.72} />
            </mesh>}
            {selected && <mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[radius+0.125,radius+0.146,54]} />
              <meshBasicMaterial color="#d1c7ff" side={2} /></mesh>}
          </group>
        </group>;
      })}
    </group>
  </>;
}
