import type { AtlasPoint } from "@/lib/content/atlas";

export type Boundary = "convergent" | "divergent" | "transform";

export type SceneSpec =
  | { kind: "ocean"; depth: number }
  | { kind: "strata"; layer: number }
  | { kind: "plates"; boundary: Boundary; progress: number }
  | { kind: "cosmos"; selected: string; years: number; onSelect: (id: string) => void }
  | { kind: "globe"; location: AtlasPoint; showBoundaries: boolean; bathymetry?: boolean; countryColors?: Record<string, string>; heading: number; points: readonly AtlasPoint[]; zoom: number; markerColor: string; onSelect: (id: string) => void };
