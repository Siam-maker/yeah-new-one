export type PopulationRecord = {
  population: number; male: number; female: number; median: number; young: number; older: number;
  growth: number | null; density: number | null; urban: number | null; urbanGrowth: number | null; ages: [number, number][];
};
export type Country = {
  id: string; name: string; region: string; records: Record<string, PopulationRecord>; trend: number[]; cities: [string, number][];
};
export type PopulationSnapshot = { years: number[]; countries: Country[]; world: number[] };

export const populationIndicators = {
  population: { name: "Population", unit: "people", breaks: [1_000_000,10_000_000,50_000_000,150_000_000], labels: ["<1m","1–10m","10–50m","50–150m","≥150m"] },
  density: { name: "Population density", unit: "people/km²", breaks: [25,75,150,350], labels: ["<25","25–75","75–150","150–350","≥350"] },
  urban: { name: "Urban share", unit: "%", breaks: [25,50,70,90], labels: ["<25","25–50","50–70","70–90","≥90"] },
  median: { name: "Median age", unit: "years", breaks: [20,28,36,44], labels: ["<20","20–28","28–36","36–44","≥44"] },
  growth: { name: "Annual growth", unit: "%", breaks: [0,.75,1.5,2.5], labels: ["<0","0–0.75","0.75–1.5","1.5–2.5","≥2.5"] },
} as const;
export type PopulationIndicator = keyof typeof populationIndicators;
export const populationNoValue = "#283942";
export const indicatorColors = ["#31505b","#527680","#88a4a1","#c7baa1","#f1d2a0"] as const;
export const ageLabels = Array.from({ length: 21 }, (_, index) => index === 20 ? "100+" : `${index * 5}–${index * 5 + 4}`);
export const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
export const decimal = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
