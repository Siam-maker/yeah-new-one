import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, Color, CatmullRomCurve3, DoubleSide, Fog, MathUtils, RepeatWrapping, TextureLoader, Vector3, type Group, type Texture } from "three";
import { zoneAt } from "@/lib/content/ocean";
import { terrainSurface } from "./terrain";
import { pelagicFins, pelagicMesh } from "./pelagic-mesh";
import { cameraOffset, transitionAmount } from "./scene-camera";
import type { SceneSpec } from "./scene-types";
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

const shaftVertex = `
  varying vec2 surface;
  void main(){
    surface=uv;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
  }`;
const surfaceFragment = `
  varying vec2 surface;
  void main(){
    vec2 uv=surface*vec2(19.,12.);
    float wind=sin(uv.x*1.3+sin(uv.y*.8)*1.6)*cos(uv.y*1.4+uv.x*.26);
    float broken=sin(uv.x*2.+uv.y*1.9)*sin(uv.y*1.5+uv.x*.27);
    float crest=pow(max(0.,wind*.57+broken*.47),3.);
    float edge=smoothstep(0.,.22,surface.y)*smoothstep(0.,.33,1.-surface.y)*smoothstep(0.,.22,surface.x)*smoothstep(0.,.22,1.-surface.x);
    gl_FragColor=vec4(.39,.62,.68,(.07+crest*.45)*edge);
  }`;
const shaftFragment = `
  uniform float clarity;
  varying vec2 surface;
  void main(){
    float taper=.11+surface.y*.24;
    float edge=exp(-pow(abs(surface.x-.5)/taper,2.));
    float falloff=pow(surface.y,.77)*smoothstep(0.,.17,surface.y)*(1.-smoothstep(.86,1.,surface.y));
    gl_FragColor=vec4(.33,.64,.68,edge*falloff*clarity);
  }`;

export function Ocean({ model, active, profile }: { model: Extract<SceneSpec,{kind:"ocean"}>; active: boolean; profile: RenderProfile }) {
  const { depth, clarity: coefficient, camera:view } = model;
  const layer = zoneAt(depth);
  const habitat = habitats[layer.id];
  const clarity = Math.exp(-coefficient*depth*.17)*.43;
  const orbit = useRef(new Vector3());
  const aim = useRef(new Vector3());
  const look = useRef(new Vector3());
  const shaftUniforms = useMemo(()=>({ clarity:{ value:clarity } }),[clarity]);
  const ground = useRef<Group>(null);
  const dust = useRef<Group>(null);
  const school = useRef<Group>(null);
  const { invalidate } = useThree();
  const fish = useMemo(() => [pelagicMesh(), pelagicFins()] as const, []);
  useEffect(() => () => fish.forEach((geometry) => geometry.dispose()), [fish]);
  const [bump,setBump] = useState<Texture>();
  useEffect(()=>{
    let current=true;
    const texture=new TextureLoader().load("/images/obsidian-surface.webp",(result)=>{if(current)setBump(result);});
    texture.wrapS=texture.wrapT=RepeatWrapping;
    texture.repeat.set(7,7);
    return ()=>{current=false;texture.dispose();};
  },[]);
  const filaments=useMemo(()=>Array.from({length:7},(_,strand)=>{
    const theta=strand/7*Math.PI*2;
    return new CatmullRomCurve3(Array.from({length:8},(_,segment)=>new Vector3(
      Math.cos(theta)*(.32+segment*.019)+Math.sin(segment*1.15+strand)*.084,
      -segment*.145,
      Math.sin(theta)*(.32+segment*.022),
    )));
  }),[]);
  const seabed = useMemo(() => terrainSurface(layer.id), [layer.id]);
  const particles = useMemo(() => particulates.slice(0,habitat.particles*3), [habitat.particles]);
  useEffect(() => () => seabed.dispose(), [seabed]);
  const fogTarget = useMemo(() => new Color(layer.fog), [layer.fog]);

  useEffect(() => {
    if (!active || profile.name === "low") return;
    const timer = window.setInterval(invalidate, profile.frameMs);
    const stop = window.setTimeout(() => window.clearInterval(timer), 2250);
    return () => {
      window.clearTimeout(stop);
      window.clearInterval(timer);
    };
  }, [active, depth, invalidate, profile.frameMs, profile.name]);

  useFrame(({ camera, clock, scene }, delta) => {
    const animated = active && profile.name !== "low";
    const ease = transitionAmount(animated,delta,4);
    if (scene.background instanceof Color) scene.background.lerp(fogTarget, ease);
    if (scene.fog instanceof Fog) {
      scene.fog.color.lerp(fogTarget, ease);
      scene.fog.far = MathUtils.lerp(scene.fog.far, habitat.visibility / (1 + (coefficient-.035)*7), ease);
    }
    const y = 2.2 - Math.log10(1 + depth / 100) * 1.68;
    const z = 12.8 - Math.log10(1 + depth / 195) * 1.55;
    look.current.set(view.x, y + view.y - .55, -4.5);
    cameraOffset(0,.9,z,view,orbit.current).add(look.current);
    camera.position.lerp(orbit.current,ease);
    aim.current.lerp(look.current,ease);
    camera.lookAt(aim.current);
    if (animated && (aim.current.distanceTo(look.current) > .01 || camera.position.distanceTo(orbit.current) > .015)) invalidate();
    if (ground.current) ground.current.position.y = MathUtils.lerp(ground.current.position.y,habitat.bed,ease);
    if (dust.current) {
      dust.current.rotation.z = animated ? clock.elapsedTime * .016 : 0;
      dust.current.position.y = animated ? -.28 * Math.sin(clock.elapsedTime * .23) : 0;
    }
    if (school.current) school.current.position.x = animated ? Math.sin(clock.elapsedTime * .35) * 1.7 : 0;
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
    {layer.id === "sunlight" && <mesh rotation={[-Math.PI/2,0,0]} position={[0,4,-13]}>
      <planeGeometry args={[34,34]} />
      <shaderMaterial vertexShader={shaftVertex} fragmentShader={surfaceFragment} side={DoubleSide}
        transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
    </mesh>}
    {depth < 1000 && <group rotation={[0,.19,-.27]} position={[-1,4.5,-10]}>
      {[0,1,2].slice(0,profile.name==="low" ? 2 : 3).map((ray)=><mesh key={ray} position={[ray*2.48,0,-ray*.57]}>
        <planeGeometry args={[3.8+ray*.9,16]} />
        <shaderMaterial uniforms={shaftUniforms} vertexShader={shaftVertex} fragmentShader={shaftFragment}
          side={DoubleSide} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false}/>
      </mesh>)}
    </group>}
    <group ref={ground} position={[0,-4.4,-4]} onClick={(event)=>{event.stopPropagation();model.onInspect("seabed");}}>
      <mesh geometry={seabed}><meshStandardMaterial key={bump ? "mapped" : "unmapped"} vertexColors roughness={habitat.roughness} bumpMap={bump} bumpScale={.12} side={DoubleSide} /></mesh>
      {[-5.5,-3.3,-1.3,2.2,4.8,8].map((x,index)=> <mesh key={x} position={[x,-1.75,-2.8-index%3*2.5]} scale={[1.2+index%2, .46+index%3*.27,1.1]} rotation={[.2,index*.73,.1]}>
        <icosahedronGeometry args={[1,1]} /><meshStandardMaterial roughness={.9} color={index%2 ? "#4e5854" : "#586d73"} />
      </mesh>)}
      {model.hotspot === "seabed" && <mesh position={[0,-.46,-3]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.7,.75,48]} /><meshBasicMaterial color="#b9e1de" side={DoubleSide} /></mesh>}
    </group>
    <group onClick={(event)=>{event.stopPropagation();model.onInspect("organism");}}>
    {layer.id === "midnight" && <group position={[-1.5,.17,-5.1]} rotation={[.12,0,-.14]}>
      <mesh scale={[.64,.36,.64]}><sphereGeometry args={[1,31,19,0,Math.PI*2,0,Math.PI*.60]} /><meshPhysicalMaterial color="#7ba4bc" emissive="#258a9a" emissiveIntensity={.48} transparent opacity={.63} roughness={.3} side={DoubleSide} depthWrite={false} /></mesh>
      <mesh position={[0,-.105,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.60,.018,8,42]} /><meshBasicMaterial color="#9fe2db" transparent opacity={.78} /></mesh>
      {filaments.map((curve,index)=><mesh key={index}><tubeGeometry args={[curve,25,.009,4,false]} /><meshBasicMaterial color="#7cc5bd" transparent opacity={.69} /></mesh>)}
    </group>}
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
          <mesh geometry={fish[0]}>
            <meshStandardMaterial vertexColors color={layer.id === "midnight" ? "#6e7890" : "#ffffff"} metalness={.15} roughness={.55} side={DoubleSide} />
          </mesh>
          <mesh geometry={fish[1]}>
            <meshStandardMaterial color="#627e8c" transparent opacity={.77} roughness={.8} side={DoubleSide} />
          </mesh>
          <mesh position={[.58,.054,.10]}><sphereGeometry args={[.043,8,6]} /><meshStandardMaterial color="#151d20" roughness={.28} /></mesh>
          {depth >= 200 && [0,1,2].map((point) => <mesh key={point} position={[.45-point*.25,-.12,.21]}>
            <sphereGeometry args={[layer.id === "midnight" ? .055 : .034,7,7]} /><meshBasicMaterial color={layer.id === "midnight" ? "#8ceeee" : "#9faeff"} />
          </mesh>)}
        </group>
      ))}
    </group>}
    </group>
  </>;
}
