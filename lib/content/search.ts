import { atlasLayers, type AtlasLayer } from "./atlas";
import { atlasPoints } from "./observations";
import { fieldNotes } from "./field-notes";
import { articles } from "./articles";
import { glossary, labs, termId, topics } from "./publication";

export type SearchKind = "Article" | "Topic" | "Lab" | "Glossary" | "Location" | "Field note";
export type SearchEntry = { title: string; href: string; description: string; kind: SearchKind; keywords: string };

export const searchEntries: SearchEntry[] = [
  ...articles.map((item): SearchEntry => ({
    title: item.title, href: `/stories/${item.slug}`, description: item.deck, kind: "Article",
    keywords: [topics.find(({ slug }) => slug === item.topic)?.title, ...item.sections.map(({ title }) => title)].join(" "),
  })),
  ...topics.map((item): SearchEntry => ({ title: item.title, href: `/topics/${item.slug}`, description: item.intro, kind: "Topic", keywords: item.concepts.map(({ title }) => title).join(" ") })),
  ...labs.map((item): SearchEntry => ({ title: item.title, href: `/lab/${item.slug}`, description: item.description, kind: "Lab", keywords: item.discipline })),
  ...glossary.map((item): SearchEntry => ({ title: item.term, href: `/glossary#${termId(item.term)}`, description: item.definition, kind: "Glossary", keywords: item.topic })),
  ...fieldNotes.map((note): SearchEntry => ({ title: note.title, href: `/field-notes#${note.id}`, description: note.summary, kind: "Field note", keywords: note.discipline })),
  ...(Object.keys(atlasLayers) as AtlasLayer[]).filter((layer) => layer !== "footprint").flatMap((layer) =>
    atlasPoints(layer, 2023).filter((point) => layer !== "geology" || ["Geological region", "Fault"].includes(point.category))
      .map((point): SearchEntry => ({
        title: point.name, href: `/atlas?layer=${layer}&location=${point.id}`, description: point.detail,
        kind: "Location", keywords: `${point.category} ${point.region} ${atlasLayers[layer].title}`,
      }))),
];
