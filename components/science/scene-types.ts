import type { AtlasLocation } from "@/lib/content/atlas";

export type Boundary = "convergent" | "divergent" | "transform";

export type SceneSpec =
  | { kind: "ocean"; depth: number }
  | { kind: "strata"; layer: number }
  | { kind: "plates"; boundary: Boundary; progress: number }
  | { kind: "globe"; location: AtlasLocation; showBoundaries: boolean; heading: number; onSelect: (id: string) => void };
