export const navigation = [
  { label: "Explore", href: "/explore" },
  { label: "Topics", href: "/topics" },
  { label: "Journal", href: "/stories" },
  { label: "Lab", href: "/lab" },
  { label: "Atlas", href: "/atlas" },
] as const;

export const sources = {
  light: { name: "NOAA Ocean Exploration", title: "How far does light travel in the ocean?", url: "https://oceanexplorer.noaa.gov/facts/light-distributed.html" },
  bio: { name: "NOAA Ocean Service", title: "What is bioluminescence?", url: "https://oceanservice.noaa.gov/facts/biolum.html" },
  pressure: { name: "NOAA Ocean Service", title: "How does pressure change with ocean depth?", url: "https://oceanservice.noaa.gov/facts/pressure.html" },
  migration: { name: "Hydrobiologia", title: "A review of the adaptive significance and ecosystem consequences of zooplankton diel vertical migrations", url: "https://doi.org/10.1023/B:HYDR.0000008476.23617.b0" },
  plates: { name: "USGS", title: "This Dynamic Earth: The Story of Plate Tectonics", url: "https://pubs.usgs.gov/gip/dynamic/dynamic.html" },
  boundaries: { name: "Geochemistry, Geophysics, Geosystems", title: "An updated digital model of plate boundaries", url: "https://doi.org/10.1029/2001GC000252" },
  time: { name: "International Commission on Stratigraphy", title: "International Chronostratigraphic Chart", url: "https://stratigraphy.org/chart" },
  rocks: { name: "U.S. National Park Service", title: "Grand Canyon geology", url: "https://www.nps.gov/grca/learn/nature/geology.htm" },
  ice: { name: "British Antarctic Survey", title: "Ice cores and climate change", url: "https://www.bas.ac.uk/data/our-data/publication/ice-cores-and-climate-change/" },
  iceData: { name: "NOAA National Centers for Environmental Information", title: "Ice core paleoclimatology", url: "https://www.ncei.noaa.gov/products/paleoclimatology/ice-core" },
  webb: { name: "NASA", title: "James Webb Space Telescope", url: "https://science.nasa.gov/mission/webb/" },
  lightSpeed: { name: "NIST", title: "Speed of light in vacuum", url: "https://physics.nist.gov/cgi-bin/cuu/Value?c" },
  hubble: { name: "NASA", title: "Hubble Deep Fields", url: "https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-deep-fields/" },
  bathymetry: { name: "GEBCO", title: "Gridded bathymetry data", url: "https://www.gebco.net/data_and_products/gridded_bathymetry_data/" },
} as const;

export type SourceKey = keyof typeof sources;

export const labs = [
  { slug: "ocean-depth", title: "Ocean depth explorer", discipline: "Oceanography", image: "/images/ocean-column.webp", description: "Descend through five zones and see how pressure, light, and life change with depth." },
  { slug: "geologic-time", title: "Geological time machine", discipline: "Geology", image: "/images/strata-wall.webp", description: "Zoom from Earth’s earliest history into the eons, eras, and periods that follow." },
  { slug: "plate-tectonics", title: "Plate tectonics simulator", discipline: "Geophysics", image: "/images/canyon.webp", description: "Compare convergent, divergent, and transform boundaries in cross-section and 3D." },
] as const;

export const topics = [
  {
    slug: "ocean-life", title: "Ocean & Life", theme: "ocean", image: "/images/ocean-column.webp",
    intro: "Sunlight illuminates a thin upper layer. Below it, animals navigate a world shaped by pressure, scarce food, and light of their own making.",
    background: "Oceanographers divide the water column by depth and by how much light penetrates it. These overlapping ways of describing the ocean help explain where organisms can photosynthesize, where they feed, and how far they migrate. The depth of useful sunlight changes with the clarity of the water, even when the named depth zones stay the same.",
    discoveries: "The discovery of hydrothermal vent ecosystems showed that some seafloor communities can begin with microbes using chemical energy. In open water, acoustic instruments revealed migrating layers of animals that can rise hundreds of metres after dusk.",
    concepts: [
      { title: "Bioluminescence", text: "Light produced through a chemical reaction in a living organism, used for signaling, hunting, or camouflage." },
      { title: "Vertical migration", text: "A regular shift between layers, often upward after dusk and downward around dawn." },
      { title: "Marine snow", text: "Particles of organic material that sink from upper waters and feed organisms below." },
    ],
    facts: ["Pressure typically increases by about one atmosphere per 10 metres of seawater.", "The hadal zone is largely confined to deep trenches."],
    diagram: "depth", articles: ["life-below-the-light", "a-night-shift-in-the-ocean"], experiments: ["ocean-depth"], sources: ["light", "bio", "pressure", "migration"],
  },
  {
    slug: "earth-geology", title: "Earth & Geology", theme: "earth", image: "/images/strata-wall.webp",
    intro: "A cliff is a cross-section through vanished worlds. Its grains, fractures, and missing layers tell stories on very different clocks.",
    background: "Geology combines field observation, measurements of rock and mineral chemistry, and physical models. Relative dating uses relationships such as superposition and cross-cutting. Numerical ages use calibrated natural clocks and provide independent constraints on the order of events.",
    discoveries: "The collision of continents, magnetic stripes on the seafloor, and mapped earthquake belts helped establish plate tectonics. The geological time scale ties physical sections across continents together through fossils, dating, and formally defined boundaries.",
    concepts: [
      { title: "Stratigraphy", text: "The study of layered deposits and the relationships between them." },
      { title: "Unconformity", text: "A surface that represents a gap in a local geological record." },
      { title: "Subduction", text: "The descent of one tectonic plate beneath another." },
    ],
    facts: ["Relative age and numerical age are different kinds of evidence.", "Oceanic crust typically forms at spreading ridges and is recycled at subduction zones."],
    diagram: "strata", articles: ["the-memory-of-rock", "tectonic-plates-in-motion", "what-the-ice-keeps"], experiments: ["geologic-time", "plate-tectonics"], sources: ["rocks", "time", "plates"],
  },
  {
    slug: "space-time", title: "Space & Time", theme: "space", image: "/images/starlight.webp",
    intro: "Astronomy begins with a delay. Every image of a distant object records light that left long before it arrived at the telescope.",
    background: "Astronomers combine wavelength, brightness, apparent motion, and distance estimates to determine what they see. Different instruments register different wavelengths. An infrared image and a visible-light image of the same object can show different physical processes.",
    discoveries: "Hubble’s deep fields revealed numerous galaxies in small patches of sky. Webb extends observations into the infrared, where it can detect some distant galaxies whose light was stretched to longer wavelengths by cosmic expansion.",
    concepts: [
      { title: "Light-year", text: "The distance light travels in vacuum in one Julian year." },
      { title: "Lookback time", text: "The interval between emission of the light we observe and its reception." },
      { title: "Redshift", text: "A shift toward longer wavelengths that can have several physical causes." },
    ],
    facts: ["Light travels at exactly 299,792,458 metres per second in vacuum.", "Cosmological distances require specifying what kind of distance is being compared."],
    diagram: "light", articles: ["the-light-that-took-its-time"], experiments: ["geologic-time"], sources: ["lightSpeed", "hubble", "webb"],
  },
  {
    slug: "systems-signals", title: "Systems & Signals", theme: "signals", image: "/images/glacier.webp",
    intro: "Much of science depends on reading traces. A band in ice or an echo in water can reveal a process that no observer saw directly.",
    background: "Signals are measured outputs, while proxies are indirect records used to infer another quantity. A proxy must be interpreted with context: the same observation can respond to several factors. Repeated observations, calibration, and independent methods help distinguish plausible explanations.",
    discoveries: "Polar ice traps samples of ancient air. Together with chemical and physical measurements of the ice, that evidence lets researchers compare greenhouse gases, temperature proxies, and events such as volcanic eruptions across long intervals.",
    concepts: [
      { title: "Proxy", text: "A measurable trace used to infer a quantity that cannot be measured directly in the past or at a distance." },
      { title: "Calibration", text: "A comparison against a known standard or independently measured relationship." },
      { title: "Signal-to-noise ratio", text: "A measure of how much of an observation of interest stands out from variation that obscures it." },
    ],
    facts: ["The air in an ice-core bubble is generally younger than the ice around it.", "Independent records can help reveal errors or local effects in one measurement."],
    diagram: "ice", articles: ["what-the-ice-keeps", "a-night-shift-in-the-ocean"], experiments: ["ocean-depth", "geologic-time"], sources: ["ice", "iceData", "migration"],
  },
] as const;

export const glossary = [
  { term: "Abyssal zone", topic: "Ocean & Life", definition: "The open-ocean depth zone commonly placed between about 4,000 and 6,000 metres.", related: ["Hadal zone", "Hydrostatic pressure"], article: "life-below-the-light" },
  { term: "Albedo", topic: "Systems & Signals", definition: "The fraction of incoming radiation reflected by a surface, often expressed between zero and one.", related: ["Proxy"], article: "what-the-ice-keeps" },
  { term: "Bathymetry", topic: "Ocean & Life", definition: "The measurement and mapping of the depths and relief of bodies of water.", related: ["Hadal zone"], article: "tectonic-plates-in-motion" },
  { term: "Bioluminescence", topic: "Ocean & Life", definition: "Light produced by a chemical reaction in a living organism.", related: ["Counterillumination", "Diel vertical migration"], article: "life-below-the-light" },
  { term: "Counterillumination", topic: "Ocean & Life", definition: "Camouflage in which an animal emits downward light to match the brightness above it.", related: ["Bioluminescence"], article: "life-below-the-light" },
  { term: "Diel vertical migration", topic: "Ocean & Life", definition: "Regular movement between depths over a day–night cycle.", related: ["Marine snow"], article: "a-night-shift-in-the-ocean" },
  { term: "Eon", topic: "Earth & Geology", definition: "The largest formal division of geologic time, subdivided into eras.", related: ["Stratigraphy"], article: "the-memory-of-rock" },
  { term: "Firn", topic: "Systems & Signals", definition: "Compacted snow that has survived a melt season and is transforming into glacial ice.", related: ["Proxy"], article: "what-the-ice-keeps" },
  { term: "Hadal zone", topic: "Ocean & Life", definition: "The ocean’s deepest zone, generally below about 6,000 metres and concentrated in trenches.", related: ["Abyssal zone", "Subduction"], article: "tectonic-plates-in-motion" },
  { term: "Hydrostatic pressure", topic: "Ocean & Life", definition: "Pressure due to the weight of a resting fluid above a point.", related: ["Abyssal zone"], article: "life-below-the-light" },
  { term: "Light-year", topic: "Space & Time", definition: "The distance light travels in a vacuum in one Julian year.", related: ["Lookback time", "Redshift"], article: "the-light-that-took-its-time" },
  { term: "Lookback time", topic: "Space & Time", definition: "The time elapsed between emission of light and its arrival at an observer.", related: ["Light-year", "Redshift"], article: "the-light-that-took-its-time" },
  { term: "Marine snow", topic: "Ocean & Life", definition: "Sinking particles of organic debris and associated material in the ocean.", related: ["Diel vertical migration"], article: "a-night-shift-in-the-ocean" },
  { term: "Proxy", topic: "Systems & Signals", definition: "An indirect measure used to infer a quantity that cannot be observed directly.", related: ["Firn", "Albedo"], article: "what-the-ice-keeps" },
  { term: "Redshift", topic: "Space & Time", definition: "A shift of light toward longer wavelengths.", related: ["Lookback time"], article: "the-light-that-took-its-time" },
  { term: "Stratigraphy", topic: "Earth & Geology", definition: "The study of layered deposits, their relationships, and their sequence in time.", related: ["Unconformity", "Eon"], article: "the-memory-of-rock" },
  { term: "Subduction", topic: "Earth & Geology", definition: "The descent of a tectonic plate beneath another plate at a convergent boundary.", related: ["Transform boundary", "Hadal zone"], article: "tectonic-plates-in-motion" },
  { term: "Transform boundary", topic: "Earth & Geology", definition: "A boundary where two tectonic plates slide horizontally past each other.", related: ["Subduction"], article: "tectonic-plates-in-motion" },
  { term: "Unconformity", topic: "Earth & Geology", definition: "A surface separating younger material from older rock across a gap in the local record.", related: ["Stratigraphy"], article: "the-memory-of-rock" },
] as const;

export function termId(term: string) {
  return "term-" + term.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
