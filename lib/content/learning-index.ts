export const levels = ["Beginner", "Intermediate", "Advanced"] as const;
export type Level = (typeof levels)[number];

export const learningTracks = [
  { id:"ocean", title:"Read the ocean", subject:"Ocean & marine science", topic:"ocean-life", image:"/images/ocean-column.webp", deck:"Follow water, light, and food from the surface to the deepest trenches.", level:"Beginner" },
  { id:"earth", title:"Read a changing Earth", subject:"Earth science & geology", topic:"earth-geology", image:"/images/weathered-section.webp", deck:"Use rock layers, earthquakes, and the seafloor to reconstruct a moving planet.", level:"Beginner" },
  { id:"climate", title:"Read the climate record", subject:"Climate & atmosphere", topic:"climate-atmosphere", image:"/images/ice-margin.webp", deck:"Separate weather, long-term trends, and conditional futures by examining the records.", level:"Intermediate" },
  { id:"life", title:"Read evidence of life", subject:"Biodiversity & evolution", topic:"evolution-biodiversity", image:"/images/fossil.webp", deck:"Connect adaptation, food webs, and conservation without confusing records with abundance.", level:"Beginner" },
  { id:"space", title:"Read light from space", subject:"Space & astronomy", topic:"space-time", image:"/images/starlight.webp", deck:"Use orbital motion, spectra, and travel time to understand distant systems.", level:"Intermediate" },
  { id:"population", title:"Read population change", subject:"Population & demographics", topic:"human-footprint", image:"/images/harbor.webp", deck:"Compare age structures, settlement patterns, and conditional population projections.", level:"Intermediate" },
  { id:"systems", title:"Follow a chain of evidence", subject:"Interdisciplinary science", topic:"systems-signals", image:"/images/glacier.webp", deck:"Connect records across disciplines and test what each line of evidence can support.", level:"Advanced" },
] as const;

export type TrackId = (typeof learningTracks)[number]["id"];
