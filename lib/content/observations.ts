import raw from "@/public/data/atlas-observations.json";
import { climatePoints, habitatPoints, locations, type AtlasLayer, type AtlasPoint } from "./atlas";

export const temperature = raw.temperature as [number, number][];
export const emissionsYears = [1990, 2000, 2010, 2020, 2023];
const coasts = raw.coasts as [string, number, number, string, number][];
const emissions = raw.emissions as [string, number, number, Record<string, number>][];
const number = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });

export function coastId(name: string) {
  return "coast-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function emissionId(name: string) {
  return "co2-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function atlasPoints(layer: AtlasLayer, year: number): readonly AtlasPoint[] {
  if (layer === "coastal") return coasts.map(([name, lat, lon, region, population]) => ({
    id: coastId(name), name, lat, lon, region, category: "Coastal or delta settlement",
    detail: "Natural Earth POP_MAX estimate. This mixed-date settlement figure does not identify residents or assets within a hazard zone.",
    magnitude: population, value: `${number.format(population)} people (estimated)`,
  }));
  if (layer === "footprint") return emissions.flatMap(([name, lat, lon, values]) => {
    const value = values[year];
    if (value === undefined) return [];
    return [{ id: emissionId(name), name, lat, lon, region: "Territorial total", category: "Fossil and industrial CO₂",
      detail: "Emissions are attributed to the territory where they were produced, excluding land-use change. The marker is a map label position.",
      magnitude: value, value: `${number.format(value)} Mt CO₂ in ${year}` }];
  });
  if (layer === "climate") return climatePoints;
  if (layer === "biodiversity") return habitatPoints;
  if (layer === "geology") return locations.filter((point) => point.category !== "Ocean basin");
  return locations.filter((point) => point.category !== "Geological region" && point.category !== "Fault");
}

export function getEmissionSeries(id: string): [number, number][] {
  const row = emissions.find(([name]) => emissionId(name) === id);
  return row ? Object.entries(row[3]).map(([year, value]) => [Number(year), value]) : [];
}
