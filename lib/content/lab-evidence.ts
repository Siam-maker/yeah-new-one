import type { SourceKey, labs } from "./publication";

export const labEvidence = {
  "ocean-depth": { reading:"life-below-the-light", sources:["light", "pressure", "bio"] },
  "geologic-time": { reading:"the-memory-of-rock", sources:["time", "rocks"] },
  "plate-tectonics": { reading:"tectonic-plates-in-motion", sources:["plates", "boundaries"] },
  "ocean-pressure": { reading:"life-below-the-light", sources:["pressure"] },
  "earthquake-waves": { reading:"tectonic-plates-in-motion", sources:["usgsWaves", "plates"] },
  "climate-change": { reading:"two-records-of-a-changing-ocean", sources:["gistemp", "epaSea"] },
  "global-temperature": { reading:"reading-a-warmer-world", sources:["gistemp"] },
  "carbon-emissions": { reading:"the-maps-behind-coastal-risk", sources:["carbon", "coasts"] },
  "population-growth": { reading:"reading-a-population-pyramid", sources:["unPopulation", "urban"] },
  "biodiversity-distribution": { reading:"life-below-the-light", sources:["occurrence", "light"] },
  "light-travel-time": { reading:"the-light-that-took-its-time", sources:["lightSpeed", "hubble"] },
  "geological-cross-section": { reading:"the-memory-of-rock", sources:["rocks", "time"] },
} as const satisfies Record<(typeof labs)[number]["slug"],{ reading:string; sources:readonly SourceKey[] }>;
