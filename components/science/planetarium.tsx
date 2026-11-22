"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BackSide, Color, MathUtils, Vector3 } from "three";
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

const origin = new Vector3();
const saturnRings = [
  { inner:1.23, outer:1.44, color:"#8c7b65", opacity:.47 },
  { inner:1.44, outer:1.77, color:"#d5bb94", opacity:.79 },
  { inner:1.81, outer:2.03, color:"#c6af89", opacity:.63 },
];

export function Planetarium({ model, active }: { model: Extract<SceneSpec,{kind:"cosmos"}>; active:boolean }) {
  const materials = useMemo(() => planets.map((planet) => planetSurface(planet.id, planet.color)), []);
  useEffect(() => () => materials.forEach((texture) => texture?.dispose()), [materials]);
  const target = planets.find((item)=>item.id===model.selected) ?? planets[2];

  const aim = useRef(new Vector3());
  const desired = useMemo(() => {
    const index = planets.indexOf(target);
    const phase = model.years / target.years * Math.PI * 2 + index * 1.1;
    const orbit = displayOrbit(target.au);
    return new Vector3(Math.cos(phase)*orbit,0,Math.sin(phase)*orbit);
  }, [model.years,target]);

  useFrame(({ camera, invalidate },delta)=>{
    const near = model.view === "planet";
    const zoom = model.zoom;
    const goal = near ? desired : origin;
    const x = near ? goal.x + .92/zoom : target.au > 5 ? .6 : 0;
    const y = near ? .65/zoom : 7/zoom;
    const z = near ? goal.z + (target.id === "saturn" ? 1.85 : 1.55)/zoom : 10.1/zoom;
    const amount = active ? 1-Math.exp(-7*Math.min(delta,.07)) : 1;
    camera.position.set(MathUtils.lerp(camera.position.x,x,amount),MathUtils.lerp(camera.position.y,y,amount),MathUtils.lerp(camera.position.z,z,amount));
    aim.current.lerp(goal,amount);
    camera.lookAt(aim.current);
    if(active && (Math.abs(camera.position.x-x)+Math.abs(camera.position.y-y)+Math.abs(camera.position.z-z) > .008 || aim.current.distanceTo(goal) > .004)) invalidate();
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
    <mesh><sphereGeometry args={[.43,48,28]} /><shaderMaterial
      vertexShader={`varying vec3 local; varying vec3 n; varying vec3 v; void main(){ local=position; vec4 p=modelViewMatrix*vec4(position,1.); n=normalize(normalMatrix*normal); v=normalize(-p.xyz); gl_Position=projectionMatrix*p; }`}
      fragmentShader={`varying vec3 local; varying vec3 n; varying vec3 v; void main(){ float limb=pow(max(.12,dot(normalize(n),normalize(v))),.62); float grain=.5+.5*sin(local.x*71.+sin(local.z*54.)*2.)*sin(local.y*69.+sin(local.x*47.)); float plume=.5+.5*sin(local.z*13.+local.y*19.+sin(local.x*18.)*.8); vec3 light=mix(vec3(.92,.22,.055),vec3(1.,.84,.42),clamp(limb*.62+grain*.28+plume*.15,0.,1.)); gl_FragColor=vec4(light,1.); }`}/>
    </mesh>
    <mesh><sphereGeometry args={[.51,40,24]} /><meshBasicMaterial color="#e7793b" side={BackSide} transparent opacity={.19} blending={AdditiveBlending} depthWrite={false}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.45,.62,80]} /><meshBasicMaterial color="#e68952" transparent opacity={.14} depthWrite={false} /></mesh>
    <group>
      {planets.map((planet,index)=>{
        const orbit=displayOrbit(planet.au);
        const phase=model.years / planet.years * Math.PI*2 + index * 1.1;
        const selected=planet.id===model.selected;
        const radius=.10+Math.sqrt(planet.diameter/139820)*.27;
        return <group key={planet.id}>
          {model.view === "orbits" && <lineLoop><bufferGeometry><bufferAttribute attach="attributes-position" args={[orbits[index],3]} /></bufferGeometry>
            <lineBasicMaterial color={selected ? "#afa7ff" : "#526187"} transparent opacity={selected ? .96 : .45} /></lineLoop>}
          <group position={[Math.cos(phase)*orbit,0,Math.sin(phase)*orbit]} onClick={(event)=>{event.stopPropagation();model.onSelect(planet.id);}}>
            <mesh><sphereGeometry args={[radius,26,16]} /><meshStandardMaterial map={materials[index]} color={materials[index] ? "#ffffff" : planet.color} roughness={.85} /></mesh>
            {["earth","venus","uranus","neptune"].includes(planet.id) && <mesh><sphereGeometry args={[radius*1.075,24,14]} />
              <meshBasicMaterial color={planet.color} side={BackSide} transparent opacity={.34} blending={AdditiveBlending} depthWrite={false} />
            </mesh>}
            {planet.id==="saturn" && <group rotation={[-Math.PI/2+.14,0,.19]}>
              {saturnRings.map(({ inner,outer,color,opacity })=>
                <mesh key={inner}><ringGeometry args={[radius*inner,radius*outer,64]} /><meshBasicMaterial color={color} side={2} transparent opacity={opacity} /></mesh>
              )}
            </group>}
            {selected && model.view === "orbits" && <mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[radius+0.125,radius+0.146,54]} />
              <meshBasicMaterial color="#d1c7ff" side={2} /></mesh>}
          </group>
        </group>;
      })}
    </group>
  </>;
}
