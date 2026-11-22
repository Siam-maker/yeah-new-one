import directory from "@/public/data/country-directory.json";
import { atlasLayers, type AtlasLayer } from "./atlas";
import { atlasPoints } from "./observations";
import { fieldNotes } from "./field-notes";
import { journeys } from "./journeys";
import { articles } from "./articles";
import { glossary, labs, termId, topics } from "./publication";

export type SearchKind = "Article" | "Topic" | "Lab" | "Glossary" | "Location" | "Field note" | "Country" | "Journey" | "Tool";
export type SearchEntry = { title: string; href: string; description: string; kind: SearchKind; keywords: string };

export const searchEntries: SearchEntry[] = [
  { title:"Knowledge graph", href:"/connections", description:"Trace connections between disciplines, stories, glossary concepts, experiments, and the sources they cite.", kind:"Tool", keywords:"connections network graph research citations" },
  ...journeys.map((journey):SearchEntry => ({ title:journey.title,href:`/journeys?route=${journey.id}`,description:journey.introduction,kind:"Journey",keywords:"journeys expeditions guided " + journey.stops.map(({kind,title})=>`${kind} ${title}`).join(" ") })),
  { title:"Demographics observatory", href:"/demographics", description:"Compare country populations, age pyramids, density and urban shares.", kind:"Topic", keywords:"population demography UN projections urbanization" },
  { title:"Cosmic observatory", href:"/lab/observatory", description:"Investigate planetary orbits and the travel time of sunlight.", kind:"Lab", keywords:"space planet solar system" },
  ...articles.map((item): SearchEntry => ({
    title: item.title, href: `/stories/${item.slug}`, description: item.deck, kind: "Article",
    keywords: [topics.find(({ slug }) => slug === item.topic)?.title, ...item.sections.map(({ title }) => title)].join(" "),
  })),
  ...topics.map((item): SearchEntry => ({ title: item.title, href: `/topics/${item.slug}`, description: item.intro, kind: "Topic", keywords: item.concepts.map(({ title }) => title).join(" ") })),
  ...labs.map((item): SearchEntry => ({ title: item.title, href: `/lab/${item.slug}`, description: item.description, kind: "Lab", keywords: item.discipline })),
  ...glossary.map((item): SearchEntry => ({ title: item.term, href: `/glossary#${termId(item.term)}`, description: item.definition, kind: "Glossary", keywords: item.topic })),
  ...fieldNotes.map((note): SearchEntry => ({ title: note.title, href: `/field-notes#${note.id}`, description: note.summary, kind: "Field note", keywords: note.discipline })),
  ...(Object.keys(atlasLayers) as AtlasLayer[]).filter((layer) => !["footprint","tectonics","environment"].includes(layer)).flatMap((layer) =>
    atlasPoints(layer, 2023).filter((point) => layer !== "geology" || ["Geological region", "Fault"].includes(point.category))
      .map((point): SearchEntry => ({
        title: point.name, href: `/atlas?layer=${layer}&location=${point.id}`, description: point.detail,
        kind: "Location", keywords: `${point.category} ${point.region} ${atlasLayers[layer].title}`,
      }))),
];

export const countrySearchEntries: SearchEntry[] = directory.map(({ id, name, region }) => ({
  title:name, href:`/demographics/${id.toLowerCase()}`, description:`Population profile in ${region}. Compare age structure, density and urban share.`,
  kind:"Country", keywords:id,
}));
