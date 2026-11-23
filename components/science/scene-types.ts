import type { CameraView } from "./camera-controls";
import type { AtlasPoint } from "@/lib/content/atlas";

export type Boundary = "convergent" | "divergent" | "transform";

export type SceneSpec =
  | { kind: "interior"; selected: number; rotation: number; camera: CameraView; onSelect: (index: number) => void }
  | { kind: "ocean"; depth: number; clarity: number; camera: CameraView; hotspot: "organism" | "seabed"; onInspect: (item: "organism" | "seabed") => void }
  | { kind: "strata"; layer: number }
  | { kind: "plates"; boundary: Boundary; progress: number }
  | { kind: "cosmos"; selected: string; years: number; view: "orbits" | "planet"; zoom: number; camera: CameraView; onSelect: (id: string) => void }
  | { kind: "climate"; process: "incoming" | "reflection" | "infrared"; camera: CameraView; onInspect: (item: "incoming" | "reflection" | "infrared") => void }
  | { kind: "globe"; location: AtlasPoint; showBoundaries: boolean; bathymetry?: boolean; countryColors?: Record<string, string>; comparedId?: string; heading: number; points: readonly AtlasPoint[]; zoom: number; markerColor: string; onSelect: (id: string) => void };
