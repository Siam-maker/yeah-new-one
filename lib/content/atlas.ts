export const locations = [
  { id: "mariana", name: "Mariana Trench", category: "Trench", lat: 11.35, lon: 142.2, region: "Western Pacific", detail: "Challenger Deep lies near the southern end of this trench, where the Pacific Plate descends beneath the Mariana microplate.", value: "About 10.9 km deep at Challenger Deep" },
  { id: "tonga", name: "Tonga Trench", category: "Trench", lat: -23.3, lon: -174.7, region: "Southwest Pacific", detail: "The Pacific Plate descends beneath the Tonga arc. The trench lies immediately east of the island arc.", value: "An active subduction margin" },
  { id: "puerto-rico", name: "Puerto Rico Trench", category: "Trench", lat: 19.7, lon: -66, region: "North Atlantic", detail: "The trench marks an oblique boundary between the North American and Caribbean plates.", value: "Deepest part of the Atlantic Ocean" },
  { id: "atlantic-ridge", name: "Mid-Atlantic Ridge", category: "Ridge", lat: 24, lon: -45, region: "Atlantic Ocean", detail: "New oceanic crust forms along this system of spreading ridges as neighbouring plates separate.", value: "Divergent boundary" },
  { id: "iceland", name: "Iceland", category: "Geological region", lat: 64.96, lon: -19.02, region: "North Atlantic", detail: "The Mid-Atlantic Ridge crosses Iceland, where spreading coincides with unusually strong volcanism.", value: "Exposed spreading and volcanic terrain" },
  { id: "andes", name: "Central Andes", category: "Geological region", lat: -21, lon: -68.3, region: "Western South America", detail: "Subduction of the Nazca Plate beneath South America helps drive earthquakes, volcanism, and deformation along the margin.", value: "Convergent margin" },
  { id: "himalaya", name: "Himalaya", category: "Geological region", lat: 28, lon: 86.9, region: "Southern Asia", detail: "Continental collision between India and Eurasia shortened and thickened crust to build this mountain belt.", value: "Continental collision" },
  { id: "san-andreas", name: "San Andreas Fault", category: "Fault", lat: 35.9, lon: -120.5, region: "Western North America", detail: "This major fault accommodates part of the motion between the Pacific and North American plates.", value: "Right-lateral transform motion" },
  { id: "pacific", name: "Pacific Ocean", category: "Ocean basin", lat: 2, lon: -145, region: "Pacific basin", detail: "Earth’s largest ocean basin spans a spreading ridge, broad abyssal plains, islands, and several major subduction margins.", value: "Largest ocean basin" },
  { id: "atlantic", name: "Atlantic Ocean", category: "Ocean basin", lat: 1, lon: -29, region: "Atlantic basin", detail: "The Mid-Atlantic Ridge divides much of the basin and records seafloor spreading between plates on either side.", value: "Basin opened by rifting and spreading" },
  { id: "indian", name: "Indian Ocean", category: "Ocean basin", lat: -16, lon: 77, region: "Indian basin", detail: "Several spreading systems meet in the Indian Ocean. Its northern region is shaped by continental margins and monsoon circulation.", value: "Home to the Rodrigues Triple Junction" },
  { id: "southern", name: "Southern Ocean", category: "Ocean basin", lat: -59, lon: 38, region: "Antarctic waters", detail: "The Antarctic Circumpolar Current connects ocean basins around Antarctica.", value: "Encircles Antarctica" },
  { id: "arctic", name: "Arctic Ocean", category: "Ocean basin", lat: 82, lon: 0, region: "Northern polar waters", detail: "A shallow continental shelf surrounds much of this basin. Sea ice varies with the season and over longer periods.", value: "Smallest ocean basin" },
] as const;

export type AtlasLocation = (typeof locations)[number];

export type AtlasLayer = "ocean" | "geology" | "biodiversity" | "climate" | "coastal" | "footprint" | "tectonics" | "environment";

export const atlasLayers = {
  ocean: { title: "Ocean depth", color: "#55dce8", source: "Natural Earth 1:10m bathymetry", note: "Generalized seafloor depth bands. The display omits local shoals and other details required for navigation.", href: "https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-bathymetry/" },
  geology: { title: "Geology", color: "#d8b77f", source: "USGS and Peter Bird, PB2002 (2003)", note: "Selected geological regions and generalized tectonic boundaries. Some boundaries span broad areas and are shown here as lines.", href: "https://doi.org/10.1029/2001GC000252" },
  tectonics: { title: "Plate tectonics", color: "#ffc297", source: "Peter Bird, PB2002 (2003)", note: "Digitized global plate boundaries from the 2003 PB2002 model. Select a location to compare fault and margin types.", href: "https://doi.org/10.1029/2001GC000252" },
  environment: { title: "Sea level change", color: "#99baff", source: "CSIRO historical reconstruction via EPA", note: "Global mean sea-level change relative to 1880, shown in centimetres. The selectable Boston gauge measures local relative sea level and has its own record.", href: "https://www.epa.gov/climate-indicators/climate-change-indicators-sea-level" },
  biodiversity: { title: "Marine life", color: "#81e8c3", source: "NOAA, UNESCO and GBRMPA", note: "Selected habitat examples. Markers identify places to investigate. They cannot show species counts, abundance, or sampling effort.", href: "https://oceanservice.noaa.gov/facts/coralreef.html" },
  climate: { title: "Climate", color: "#afa7ff", source: "NASA GISTEMP v4 via DataHub", note: "Annual global surface temperature anomalies, 1880–2025, relative to 1951–1980. Pins mark observational sites, while the chart describes the globe as a whole.", href: "https://data.giss.nasa.gov/gistemp/" },
  coastal: { title: "Coastal settlements", color: "#ffd093", source: "Natural Earth 1:10m populated places", note: "Mixed-date POP_MAX estimates for selected coastal and delta cities. Marker size represents a settlement estimate. It cannot describe neighbourhood density or flood exposure.", href: "https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-populated-places/" },
  footprint: { title: "CO₂ footprint", color: "#ff8c72", source: "Global Carbon Budget via Our World in Data", note: "Territorial fossil and industrial CO₂ in million tonnes. Points are placed at country label positions. The displayed years are 1990, 2000, 2010, 2020 and 2023.", href: "https://github.com/owid/co2-data" },
} as const;

export type AtlasPoint = {
  id: string; name: string; category: string; lat: number; lon: number; region: string; detail: string;
  value: string; magnitude?: number; href?: string;
};

export const habitatPoints: readonly AtlasPoint[] = [
  { id: "great-barrier", name: "Great Barrier Reef", category: "Coral reef", lat: -18.3, lon: 147.7, region: "Coral Sea", detail: "A long complex of reef and non-reef habitats lies along Australia’s northeastern continental shelf.", value: "Tropical reef system", href: "https://www2.gbrmpa.gov.au/" },
  { id: "monterey", name: "Monterey Canyon", category: "Submarine canyon", lat: 36.77, lon: -122.1, region: "California", detail: "The submarine canyon brings deep-water habitats close to shore and is a long-running site for ocean observations.", value: "Cold-water canyon habitat", href: "https://montereybay.noaa.gov/" },
  { id: "galapagos", name: "Galápagos Marine Reserve", category: "Marine reserve", lat: -.6, lon: -90.55, region: "Eastern Pacific", detail: "Ocean currents and isolated islands shape a mix of tropical, subtropical and cooler-water marine communities.", value: "Island and open-water habitats", href: "https://whc.unesco.org/en/list/1/" },
  { id: "flower-garden", name: "Flower Garden Banks", category: "Reef and bank habitats", lat: 27.9, lon: -93.6, region: "Gulf of Mexico", detail: "Offshore banks rise into sunlit water and support coral communities far from the coastline.", value: "Offshore coral habitats", href: "https://flowergarden.noaa.gov/" },
];

export const climatePoints: readonly AtlasPoint[] = [
  { id: "mauna-loa", name: "Mauna Loa Observatory", category: "Atmospheric station", lat: 19.54, lon: -155.58, region: "Hawaiʻi", detail: "Long-running measurements track atmospheric carbon dioxide at this station. It is a separate record from the global temperature chart.", value: "Atmospheric CO₂ observations", href: "https://gml.noaa.gov/ccgg/trends/" },
  { id: "cape-grim", name: "Cape Grim", category: "Atmospheric station", lat: -40.68, lon: 144.69, region: "Tasmania", detail: "The station samples air that has travelled across the Southern Ocean. Its observations help characterize background atmospheric composition.", value: "Southern Hemisphere baseline station", href: "https://www.csiro.au/en/research/natural-environment/atmosphere/cape-grim" },
  { id: "boston-gauge", name: "Boston tide gauge", category: "Water-level station", lat: 42.35, lon: -71.05, region: "Massachusetts", detail: "The gauge measures sea level relative to the land beneath the station. Its local record is separate from the global temperature chart.", value: "NOAA station 8443970", href: "https://tidesandcurrents.noaa.gov/sltrends/sltrends_station.shtml?id=8443970" },
];

export function atlasLayerForLocation(id: string): AtlasLayer {
  if (habitatPoints.some((point) => point.id === id)) return "biodiversity";
  if (climatePoints.some((point) => point.id === id)) return "climate";
  return locations.some((point) => point.id === id && (point.category === "Geological region" || point.category === "Fault")) ? "geology" : "ocean";
}
