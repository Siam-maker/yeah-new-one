import { labEvidence } from "./lab-evidence";
import { articles } from "./articles";
import { glossary, labs, sources, termId, topics } from "./publication";

export type NodeKind = "Discipline" | "Article" | "Concept" | "Experiment" | "Source";
export type KnowledgeNode = { id:string; label:string; kind:NodeKind; detail:string; href:string };
export type KnowledgeLink = { a:string; b:string; reason:string };

export function connectionData() {
  const nodes: KnowledgeNode[] = [
    ...topics.map((item):KnowledgeNode => ({ id:`topic-${item.slug}`, label:item.title, kind:"Discipline", detail:item.intro, href:`/topics/${item.slug}` })),
    ...articles.map((item):KnowledgeNode => ({ id:`story-${item.slug}`, label:item.title, kind:"Article", detail:item.deck, href:`/stories/${item.slug}` })),
    ...glossary.map((item):KnowledgeNode => ({ id:`term-${termId(item.term)}`, label:item.term, kind:"Concept", detail:item.definition, href:`/glossary#${termId(item.term)}` })),
    ...labs.map((item):KnowledgeNode => ({ id:`lab-${item.slug}`, label:item.title, kind:"Experiment", detail:item.description, href:`/lab/${item.slug}` })),
    ...Object.entries(sources).map(([id,item]):KnowledgeNode => ({ id:`source-${id}`, label:item.title, kind:"Source", detail:item.name, href:item.url })),
  ];
  const ids = new Set(nodes.map(({ id })=>id));
  for (const topic of topics) {
    for (const concept of topic.concepts) {
      const hash = termId(concept.title);
      const id = `term-${hash}`;
      if (ids.has(id)) continue;
      ids.add(id);
      nodes.push({ id,label:concept.title,kind:"Concept",detail:concept.text,href:`/topics/${topic.slug}#concept-${hash}` });
    }
  }
  const links = new Map<string,KnowledgeLink>();
  function connect(a:string,b:string,reason:string) {
    const key = [a,b].sort().join("/");
    if (a === b || !ids.has(a) || !ids.has(b) || links.has(key)) return;
    links.set(key,{ a,b,reason });
  }
  for (const topic of topics) {
    const id = `topic-${topic.slug}`;
    for (const story of topic.articles) connect(id,`story-${story}`,"Listed in the discipline guide");
    for (const lab of topic.experiments) connect(id,`lab-${lab}`,"Experiment in the discipline guide");
    for (const key of topic.sources) connect(id,`source-${key}`,"Cited by the discipline guide");
    for (const concept of topic.concepts) connect(id,`term-${termId(concept.title)}`,"Defined in the discipline guide");
  }
  for (const article of articles) {
    const id = `story-${article.slug}`;
    connect(id,`topic-${article.topic}`,"Article’s primary discipline");
    if (article.experiment) connect(id,`lab-${article.experiment}`,"Companion experiment");
    for (const key of article.sources) connect(id,`source-${key}`,"Cited in the article");
  }
  for (const lab of labs) {
    const id = `lab-${lab.slug}`;
    const evidence = labEvidence[lab.slug];
    connect(id,`story-${evidence.reading}`,"Companion reading in the lab");
    for (const key of evidence.sources) connect(id,`source-${key}`,"Cited by the experiment");
  }
  for (const concept of glossary) {
    const id = `term-${termId(concept.term)}`;
    connect(id,`story-${concept.article}`,"Glossary’s companion reading");
    for (const related of concept.related) connect(id,`term-${termId(related)}`,"Related term in the glossary");
  }
  return { nodes, links:[...links.values()] };
}
