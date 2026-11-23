import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, DoubleSide, Float32BufferAttribute, MathUtils, RingGeometry, SRGBColorSpace, TextureLoader, Vector3, type Group, type Texture } from "three";
import { plateRelief, strataBed } from "./terrain";
import { earthLayers } from "@/lib/content/earth-interior";
import { cameraOffset, transitionAmount } from "./scene-camera";
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

export function Tectonic({ boundary, progress, active }: { boundary: Boundary; progress: number; active: boolean }) {
  const amount = progress / 100;
  const convergence = boundary === "convergent";
  const opening = boundary === "divergent";
  const slide = !convergence && !opening;
  const section = useRef<Group>(null);
  const relief = useMemo(() => [plateRelief(false), plateRelief(true), plateRelief(true, true)], []);
  useEffect(() => () => relief.forEach((mesh) => mesh.dispose()), [relief]);
  useFrame(({ invalidate }, delta) => {
    if (!section.current) return;
    const angle = -.46 + amount * (slide ? .16 : -.15);
    const rotation = section.current.rotation;
    rotation.y = active ? MathUtils.damp(rotation.y, angle, 6, Math.min(.08, delta)) : angle;
    if (active && Math.abs(angle - rotation.y) > .003) invalidate();
  });

  return <group ref={section} rotation-x={-.2}>
    <ambientLight intensity={1.35} /><directionalLight position={[1, 6, 3]} intensity={3} />
    <mesh position={[0, -1.18, 0]}><boxGeometry args={[5.9, .5, 3.2]} /><meshStandardMaterial color="#522936" /></mesh>
    <group position={[-1.4 + (convergence ? amount * .62 : opening ? -amount * .44 : 0), convergence ? -amount * .28 : 0, slide ? -amount * .75 : 0]}
      rotation={[0, 0, convergence ? -amount * .31 : 0]}>
      <mesh position={[0, -.43, 0]}><boxGeometry args={[2.8, .49, 2.9]} /><meshStandardMaterial color="#394a68" /></mesh>
      <mesh position={[0, -.17, 0]}><boxGeometry args={[2.8, .054, 2.9]} /><meshStandardMaterial color="#456872" roughness={.9} /></mesh>
      <mesh geometry={relief[0]} position={[0, -.141, 0]}><meshStandardMaterial vertexColors roughness={.88} /></mesh>
    </group>
    <group position={[1.4 + (opening ? amount * .44 : 0), 0, slide ? amount * .75 : 0]}>
      <mesh position={[0, -.39, 0]}><boxGeometry args={[2.8, .50, 2.9]} /><meshStandardMaterial color="#8c503e" /></mesh>
      <mesh position={[0, -.11, 0]}><boxGeometry args={[2.8, .075, 2.9]} /><meshStandardMaterial color="#a27d58" roughness={.94} /></mesh>
      <mesh geometry={relief[1]} position={[0, -.071, 0]}><meshStandardMaterial vertexColors roughness={.89} /></mesh>
      {convergence && amount > .08 && <mesh geometry={relief[2]} position={[-.57, -.04, -.1]} scale={[.95, amount * 1.5, .9]}>
        <meshStandardMaterial vertexColors roughness={.94} />
      </mesh>}
    </group>
    {opening && amount > .03 && <mesh position={[0, -.41 + amount * .17, 0]}>
      <boxGeometry args={[amount * .85, .28, 2.8]} /><meshStandardMaterial color="#ff815a" emissive="#9f3323" emissiveIntensity={.55} />
    </mesh>}
  </group>;
}

function cutawayFaces() {
  return earthLayers.map(({radius,color}, index) => {
    const geometry = new RingGeometry(earthLayers[index+1]?.radius ?? 0,radius,94,12);
    const positions = geometry.attributes.position;
    const tint = new Color(color);
    const mineral = new Color();
    const pigments: number[] = [];
    for (let vertex=0; vertex<positions.count; vertex++) {
      const x = positions.getX(vertex), y = positions.getY(vertex);
      const r = Math.hypot(x,y);
      const band = Math.sin(r*79 + .6*Math.sin(x*8-y*14));
      const fleck = Math.cos(x*119+y*49)*Math.sin(y*75-x*31);
      positions.setZ(vertex,.007*band+.003*fleck);
      pigments.push(...mineral.copy(tint).multiplyScalar(.83+.12*band+.07*fleck).toArray());
    }
    geometry.setAttribute("color",new Float32BufferAttribute(pigments,3));
    geometry.computeVertexNormals();
    return geometry;
  });
}

export function Interior({ model, active }: { model: Extract<SceneSpec,{ kind:"interior" }>; active:boolean }) {
  const shell = useRef<Group>(null);
  const orbit = useRef(new Vector3());
  const aim = useRef(new Vector3());
  const focus = useRef(new Vector3());
  const faces = useMemo(()=>cutawayFaces(),[]);
  const [surface,setSurface] = useState<Texture>();
  useEffect(() => () => faces.forEach((face)=>face.dispose()),[faces]);
  useEffect(() => {
    let active = true;
    const texture = new TextureLoader().load("/images/earth-map.webp", (image) => { if (active) setSurface(image); });
    texture.colorSpace = SRGBColorSpace;
    texture.repeat.x = .5;
    texture.offset.x = .5;
    return () => { active=false;texture.dispose(); };
  },[]);
  useFrame(({ camera, invalidate }, delta) => {
    if (!shell.current) return;
    const amount = transitionAmount(active,delta,7);
    const target = MathUtils.degToRad(model.rotation);
    shell.current.rotation.y = MathUtils.lerp(shell.current.rotation.y,target,amount);
    focus.current.set(model.camera.x,model.camera.y,0);
    cameraOffset(0,.22,5.7,model.camera,orbit.current).add(focus.current);
    camera.position.lerp(orbit.current,amount);
    aim.current.lerp(focus.current,amount);
    camera.lookAt(aim.current);
    if (active && (Math.abs(target-shell.current.rotation.y) > .004 || camera.position.distanceTo(orbit.current) > .013 || aim.current.distanceTo(focus.current) > .01)) invalidate();
  });
  return <>
    <ambientLight intensity={.95} /><directionalLight position={[-3,5,6]} color="#ffdfb1" intensity={2.65} />
    <directionalLight position={[4,1,-4]} color="#74abc5" intensity={2.1} />
    <group ref={shell}>
      <mesh>
        <sphereGeometry args={[earthLayers[0].radius,64,44,Math.PI,Math.PI]} />
        <meshStandardMaterial key={surface ? "mapped" : "unmapped"} map={surface} bumpMap={surface} bumpScale={.085} color={surface ? "#eee7d0" : "#6b6d54"} roughness={.69} />
      </mesh>
      {earthLayers.map((layer,index) => {
        const activeLayer = model.selected === index;
        return <group key={layer.name} position={[0,0,activeLayer ? .067 : .014]}>
          <mesh geometry={faces[index]} onClick={(event)=>{event.stopPropagation();model.onSelect(index);}}>
            <meshStandardMaterial vertexColors emissive={layer.color} emissiveIntensity={activeLayer ? .32 : .05} roughness={index >= 2 ? .56 : .83} metalness={index >= 2 ? .23 : .04} side={DoubleSide} />
          </mesh>
          <mesh><torusGeometry args={[layer.radius,.008,8,96]} /><meshBasicMaterial color={activeLayer ? "#ffdd9d" : "#553b34"} /></mesh>
        </group>;
      })}
    </group>
  </>;
}
