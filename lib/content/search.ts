import { articles } from "./articles";
import { glossary, labs, termId, topics } from "./publication";

export type SearchKind = "Article" | "Topic" | "Lab" | "Glossary";
export type SearchEntry = { title: string; href: string; description: string; kind: SearchKind; keywords: string };

export const searchEntries: SearchEntry[] = [
  ...articles.map((item): SearchEntry => ({
    title: item.title, href: `/stories/${item.slug}`, description: item.deck, kind: "Article",
    keywords: [topics.find(({ slug }) => slug === item.topic)?.title, ...item.sections.map(({ title }) => title)].join(" "),
  })),
  ...topics.map((item): SearchEntry => ({ title: item.title, href: `/topics/${item.slug}`, description: item.intro, kind: "Topic", keywords: item.concepts.map(({ title }) => title).join(" ") })),
  ...labs.map((item): SearchEntry => ({ title: item.title, href: `/lab/${item.slug}`, description: item.description, kind: "Lab", keywords: item.discipline })),
  ...glossary.map((item): SearchEntry => ({ title: item.term, href: `/glossary#${termId(item.term)}`, description: item.definition, kind: "Glossary", keywords: item.topic })),
];
