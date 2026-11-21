import type { SourceKey } from "./publication";

type Note = { id: string; discipline: string; title: string; image: string; summary: string; observations: readonly string[]; link: string; linkTitle: string; refs: readonly SourceKey[] };

export const fieldNotes: readonly Note[] = [
  {
    id: "temperature-reference", discipline: "Climate", title: "Where the zero line comes from", image: "/images/ice-margin.webp",
    summary: "The zero line on a temperature anomaly chart comes from a defined reference interval. Two researchers can plot the same observations against different references and get different values for the same year.",
    observations: ["Start by reading the units and reference period. Our Atlas uses annual GISTEMP values relative to 1951–1980.", "A slight shift from one year to the next may reflect variability. Compare decades and independent datasets when assessing long-term change."],
    link: "/atlas?layer=climate", linkTitle: "Explore the climate record", refs: ["gistemp"],
  },
  {
    id: "map-silence", discipline: "Biodiversity", title: "What an empty square can tell you", image: "/images/fossil.webp",
    summary: "A map of known occurrences shows where records were made. Places with little field access, little funding or difficult terrain may appear quiet even when life is plentiful.",
    observations: ["A site can establish that an organism occurred there at a particular time. An empty map cell can also indicate a gap in survey coverage.", "The Atlas habitat pins illustrate selected marine systems. Pin count carries no information about species richness or abundance."],
    link: "/topics/evolution-biodiversity", linkTitle: "Read the biodiversity guide", refs: ["occurrence", "fossil"],
  },
  {
    id: "two-shorelines", discipline: "Human footprint", title: "Two ways to draw a shoreline", image: "/images/harbor.webp",
    summary: "A global map shows where land meets the ocean at its chosen scale. A flood assessment needs an elevation surface, a water level, and information about who and what would be in its path.",
    observations: ["Natural Earth’s settlement figures put selected coastal cities in context. They do not show which residents live within a flood zone.", "A tide gauge measures relative sea level at one site. Land movement can contribute to that trend along with changes in water level."],
    link: "/atlas?layer=coastal", linkTitle: "Compare coastal settlements", refs: ["coasts", "seaLevel"],
  },
  {
    id: "counting-urban", discipline: "Demography", title: "A city changes at the boundary", image: "/images/harbor.webp",
    summary: "The share of people classified as urban depends on where they live and how a country defines an urban area.",
    observations: ["Urban definitions can use administrative boundaries, population thresholds, settlement density, or a combination.", "Compare urban shares alongside their source definitions. An increase can reflect migration, births and deaths, or a reclassification of settlements."],
    link: "/demographics?indicator=urban", linkTitle: "Explore national urban shares", refs: ["unPopulation", "urban"],
  },
];
