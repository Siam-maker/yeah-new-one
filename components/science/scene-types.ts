import type { AtlasPoint } from "@/lib/content/atlas";

export type Boundary = "convergent" | "divergent" | "transform";

export type SceneSpec =
  | { kind: "ocean"; depth: number }
  | { kind: "strata"; layer: number }
  | { kind: "plates"; boundary: Boundary; progress: number }
  | { kind: "globe"; location: AtlasPoint; showBoundaries: boolean; heading: number; points: readonly AtlasPoint[]; zoom: number; markerColor: string; onSelect: (id: string) => void };
