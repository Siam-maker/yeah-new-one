import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BackSide, BufferGeometry, CanvasTexture, Float32BufferAttribute, MathUtils, Quaternion, SRGBColorSpace, TextureLoader, Vector3, type Group, type Texture } from "three";
import type { RenderProfile } from "./render-profile";
import type { SceneSpec } from "./scene-types";

function geographicPoint(lon: number, lat: number, radius: number) {
  const angle = lon * Math.PI / 180;
  const phi = lat * Math.PI / 180;
  return new Vector3(radius * Math.cos(phi) * Math.cos(angle), radius * Math.sin(phi), -radius * Math.cos(phi) * Math.sin(angle));
}

const north = new Vector3(0, 1, 0);
const atmosphereVertex = `
  varying vec3 normalInView;
  varying vec3 viewDirection;
  void main() {
    vec4 vertex=modelViewMatrix*vec4(position,1.);
    normalInView=normalize(normalMatrix*normal);
    viewDirection=normalize(-vertex.xyz);
    gl_Position=projectionMatrix*vertex;
  }
`;
const atmosphereFragment = `
  varying vec3 normalInView;
  varying vec3 viewDirection;
  void main() {
    vec3 normal=normalize(normalInView);
    float edge=1.-abs(dot(normal,normalize(viewDirection)));
    float sun=dot(normal,normalize(vec3(-.76,.46,.21)));
    float light=pow(max(0.,edge),3.6)*smoothstep(-.76,.74,sun);
    float highAir=pow(max(0.,edge),8.3);
    vec3 air=mix(vec3(.12,.28,.39),vec3(.40,.69,.71),smoothstep(0.,.73,sun));
    gl_FragColor=vec4(air,light*.56+highAir*.085);
  }
`;

export function Globe({ scene, active, profile }: { scene: Extract<SceneSpec, { kind: "globe" }>; active: boolean; profile: RenderProfile }) {
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
    if (!scene.showBoundaries) return;
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
  }, [scene.showBoundaries]);

  const hasCountryOverlay = Boolean(scene.countryColors);
  useEffect(() => {
    if (!hasCountryOverlay) return;
    const controller = new AbortController();
    fetch("/data/country-paths.json", { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("Map unavailable"); return response.json() as Promise<Record<string, string>>; })
      .then(setCountryPaths).catch(() => {});
    return () => controller.abort();
  }, [hasCountryOverlay]);

  const paths = useMemo(() => new Map(
    Object.entries(countryPaths ?? {}).map(([id, path]) => [id, new Path2D(path)]),
  ), [countryPaths]);
  const countryOverlay = useMemo(() => {
    if (!paths.size || !scene.countryColors) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1440;
    canvas.height = 720;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(4, 4);
    for (const [id, color] of Object.entries(scene.countryColors)) {
      const shape = paths.get(id);
      if (!shape) continue;
      context.fillStyle = color;
      context.fill(shape, "evenodd");
      context.strokeStyle = id === scene.location.id ? "#fff0cf" : id === scene.comparedId ? "#edaa81" : "#3c565e";
      context.lineWidth = id === scene.location.id || id === scene.comparedId ? .85 : .29;
      context.stroke(shape);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return { texture, context };
  }, [paths, scene.countryColors, scene.location.id, scene.comparedId]);
  useEffect(() => () => countryOverlay?.texture.dispose(), [countryOverlay]);

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
      <mesh><sphereGeometry args={[1.5, profile.segments, Math.floor(profile.segments*.61)]} /><meshStandardMaterial key={map ? "textured" : "plain"} map={map} color={map ? "#ffffff" : "#295476"} roughness={.85} /></mesh>
      {countryOverlay && <mesh onClick={(event) => {
        if (!event.uv || event.delta > 5) return;
        const {x,y} = event.uv;
        for (const [id, path] of paths) {
          if (!scene.countryColors?.[id] || !countryOverlay.context.isPointInPath(path,x*1440,(1-y)*720,"evenodd")) continue;
          event.stopPropagation();
          scene.onSelect(id);
          break;
        }
      }}><sphereGeometry args={[1.507, profile.segments, Math.floor(profile.segments*.61)]} /><meshBasicMaterial map={countryOverlay.texture} alphaTest={.4} toneMapped={false} /></mesh>}
      <mesh renderOrder={3}>
        <sphereGeometry args={[1.555,48,32]} />
        <shaderMaterial side={BackSide} blending={AdditiveBlending} transparent depthWrite={false}
          vertexShader={atmosphereVertex} fragmentShader={atmosphereFragment} />
      </mesh>
      {scene.showBoundaries && boundaries && <lineSegments geometry={boundaries}><lineBasicMaterial color="#ff996d" /></lineSegments>}
      <mesh position={geographicPoint(scene.location.lon,scene.location.lat,1.542)} quaternion={new Quaternion().setFromUnitVectors(new Vector3(0,0,1),geographicPoint(scene.location.lon,scene.location.lat,1))}>
        <ringGeometry args={[.087,.108,24]} /><meshBasicMaterial color="#f6d391" transparent opacity={.9} />
      </mesh>
      {scene.points.map((location) => (
        <mesh key={location.id} position={geographicPoint(location.lon, location.lat, 1.548)} onClick={(event) => { event.stopPropagation(); scene.onSelect(location.id); }}>
          <sphereGeometry args={[location.id === scene.location.id ? .065 : .032, 10, 7]} />
          <meshBasicMaterial color={location.id === scene.location.id ? "#f0ede5" : scene.markerColor} />
        </mesh>
      ))}
    </group>
  </>;
}
