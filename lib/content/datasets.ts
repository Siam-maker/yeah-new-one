export const datasets = [
  { id:"population", title:"Population snapshots and age structure", origin:"United Nations World Population Prospects 2024", file:"/data/demographics.json", notes:"/data/DEMOGRAPHICS.md",
    description:"Country estimates and UN medium variants where provided. Density and urban observations use separate Gapminder and World Bank series. Check the methods for coverage, original sources and conditions of reuse.",
    citation:"United Nations, Department of Economic and Social Affairs, Population Division. World Population Prospects 2024. Under the Surface extracts and complements the UN series as documented in its methodology." },
  { id:"sea-level", title:"Historical global mean sea level", origin:"CSIRO reconstruction, distributed by the U.S. Environmental Protection Agency", file:"/data/sea-level.json", notes:"/data/README.md",
    description:"Reconstructed change relative to 1880 with published lower and upper error bounds. The file is a historical series, separate from the Boston gauge and from future projections.",
    citation:"CSIRO. Historical reconstruction of global mean sea level, distributed by the U.S. Environmental Protection Agency, Climate Change Indicators: Sea Level." },
  { id:"boundaries", title:"Global tectonic plate boundaries", origin:"Peter Bird’s PB2002 model", file:"/data/plate-boundaries.json", notes:"/data/README.md",
    description:"Generalized longitude and latitude lines for exploration. Source notes describe boundaries, precision and attribution.",
    citation:"Bird, P. (2003). An updated digital model of plate boundaries. Geochemistry, Geophysics, Geosystems. https://doi.org/10.1029/2001GC000252" },
] as const;
