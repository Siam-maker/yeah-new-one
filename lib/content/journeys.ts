import type { SourceKey } from "./publication";

type Stop = { kind: string; title: string; text: string; href: string };
export type Journey = { id:string; title:string; theme:string; image:string; introduction:string; stops:Stop[]; sources:SourceKey[] };

export const journeys: Journey[] = [
  {
    id:"mariana", title:"Into the Mariana Trench", theme:"ocean", image:"/images/deep-sea.webp",
    introduction:"Begin at the surface, follow sunlight to its limit, and see how plate motion shapes one of the deepest trenches on Earth.",
    stops:[
      { kind:"Topic", title:"Read the water column", text:"Look for the distinction between the depth zones and the depth at which light permits photosynthesis.", href:"/topics/ocean-life" },
      { kind:"Story", title:"Life below the light", text:"Find one example of an animal using light to disappear and another using it to signal.", href:"/stories/life-below-the-light" },
      { kind:"Atlas", title:"Locate the Mariana Trench", text:"Switch to the globe and trace the plate boundary beside the trench. Use the bathymetry legend to distinguish the trench from the surrounding seafloor.", href:"/atlas?layer=ocean&location=mariana&bathy=1&plates=1" },
      { kind:"Lab", title:"Descend to the hadal zone", text:"Compare the pressure at the surface and at the hadal preset. Look for the organisms and terrain shown in the model.", href:"/lab/ocean-depth" },
    ],
    sources:["light","bio","pressure","bathymetry","plates"],
  },
  {
    id:"moving-planet", title:"Across a moving planet", theme:"earth", image:"/images/rift.webp",
    introduction:"Follow evidence of moving plates from a visible fault to the seismic signals that help reveal Earth's interior.",
    stops:[
      { kind:"Topic", title:"Read a geological landscape", text:"Find the evidence geologists can use to infer motion that took place long before people could record it.", href:"/topics/earth-geology" },
      { kind:"Story", title:"Tectonic plates in motion", text:"Compare what happens to the crust at a spreading ridge and at a subduction zone.", href:"/stories/tectonic-plates-in-motion" },
      { kind:"Atlas", title:"Trace the San Andreas Fault", text:"Inspect the selected fault alongside the PB2002 boundaries. Change the zoom to see what detail the map retains.", href:"/atlas?layer=tectonics&location=san-andreas&plates=1" },
      { kind:"Lab", title:"Run a plate-boundary model", text:"Compare convergent, divergent, and transform motion. Identify which motion best describes the Atlas location.", href:"/lab/plate-tectonics" },
    ],
    sources:["plates","boundaries","usgsWaves","rocks"],
  },
  {
    id:"solar-system", title:"From Earth to the outer solar system", theme:"space", image:"/images/observatory.webp",
    introduction:"Use Earth as a reference, then trace how orbital distances change the time it takes light to reach the giant planets.",
    stops:[
      { kind:"Atlas", title:"Start from Earth", text:"Use the Earth globe as a spatial reference before moving to the schematic orbital model.", href:"/atlas?view=globe&layer=ocean&location=pacific" },
      { kind:"Topic", title:"Read distance and time", text:"Learn why astronomers describe distance in units based on the speed of light.", href:"/topics/space-time" },
      { kind:"Story", title:"The light that took its time", text:"Distinguish the travel time of a signal from the age of the object sending it.", href:"/stories/the-light-that-took-its-time" },
      { kind:"Lab", title:"Inspect the giant planets", text:"Select Jupiter and Neptune, compare their diameters with Earth, and compare the time sunlight takes to reach them.", href:"/lab/observatory" },
    ],
    sources:["lightSpeed","hubble","webb"],
  },
];
