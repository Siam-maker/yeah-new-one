import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BackSide, Quaternion, SRGBColorSpace, TextureLoader, Vector3, type Texture } from "three";
import { cameraOffset, transitionAmount } from "./scene-camera";
import type { SceneSpec } from "./scene-types";

type ClimateModel = Extract<SceneSpec,{kind:"climate"}>;
const radiativePaths = [
  {id:"incoming",from:[-3.15,.82,.15],to:[-1.04,.35,.15],color:"#f4d7a0"},
  {id:"reflection",from:[-1.0,1.05,.35],to:[-2.15,2.07,.8],color:"#a8e5ed"},
  {id:"infrared",from:[.76,.71,.8],to:[2.5,1.84,.81],color:"#f2a794"},
] as const;

function Ray({from,to,color,selected,onSelect}: {
  from:readonly [number,number,number]; to:readonly [number,number,number]; color:string; selected:boolean; onSelect:()=>void;
}) {
  const {length,orientation} = useMemo(()=>{
    const span = new Vector3(...to).sub(new Vector3(...from));
    return {length:span.length(),orientation:new Quaternion().setFromUnitVectors(new Vector3(0,1,0),span.normalize())};
  },[from,to]);
  const width = selected ? .045 : .023;
  return <group position={[...from]} quaternion={orientation} onClick={(event)=>{event.stopPropagation();onSelect();}}>
    <mesh position={[0,length/2-.075,0]}><cylinderGeometry args={[width,width,length-.15,8]} /><meshBasicMaterial color={color} /></mesh>
    <mesh position={[0,length-.12,0]}><coneGeometry args={[width*2.5,.24,12]} /><meshBasicMaterial color={color} /></mesh>
    <mesh position={[0,length/2,0]}><cylinderGeometry args={[.16,.16,length,8]} /><meshBasicMaterial visible={false} /></mesh>
  </group>;
}

export function ClimateStage({model,active}:{model:ClimateModel;active:boolean}) {
  const [texture,setTexture] = useState<Texture>();
  const target = useRef(new Vector3());
  const aim = useRef(new Vector3());
  const desired = useRef(new Vector3());
  useEffect(()=>{
    let current = true;
    const earth = new TextureLoader().load("/images/earth-map.webp",(image)=>{if(current) setTexture(image);});
    earth.colorSpace = SRGBColorSpace;
    return ()=>{current=false;earth.dispose();};
  },[]);
  useFrame(({camera,invalidate},dt)=>{
    target.current.set(model.camera.x-.33,model.camera.y+.37,0);
    cameraOffset(0,.35,8.8,model.camera,desired.current).add(target.current);
    const amount=transitionAmount(active,dt);
    camera.position.lerp(desired.current,amount);
    aim.current.lerp(target.current,amount);
    camera.lookAt(aim.current);
    if(active&&(camera.position.distanceTo(desired.current)>.01||aim.current.distanceTo(target.current)>.01)) invalidate();
  });
  return <>
    <color attach="background" args={["#101e2a"]} />
    <ambientLight intensity={.58} /><directionalLight position={[-5,2,2]} intensity={3.15} color="#ffe0ae" />
    <mesh rotation={[.1,.8,-.18]}><sphereGeometry args={[1.25,64,40]} /><meshStandardMaterial key={texture ? "mapped" : "unmapped"} map={texture} color={texture ? "#ffffff" : "#5e8c9d"} roughness={.78} /></mesh>
    <mesh><sphereGeometry args={[1.327,56,32]} /><meshBasicMaterial side={BackSide} color="#6ad1ed" transparent opacity={.34} depthWrite={false} blending={AdditiveBlending} /></mesh>
    <mesh rotation={[.2,.17,.35]}><torusGeometry args={[1.65,.008,5,112]} /><meshBasicMaterial color="#5b7f92" transparent opacity={.55} /></mesh>
    {radiativePaths.map(({id,from,to,color})=><Ray key={id} from={from} to={to} color={color} selected={model.process===id} onSelect={()=>model.onInspect(id)} />)}
  </>;
}
