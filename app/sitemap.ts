import type { MetadataRoute } from "next";
import { articles } from "@/lib/content/articles";
import { labs,topics } from "@/lib/content/publication";
import { contentAlternates,editionsFor,entryPaths,bengaliPaths } from "@/lib/i18n/coverage";
import { localizedPath } from "@/lib/i18n/routing";
import directory from "@/public/data/country-directory.json";

const origin = "https://yeah-new-one.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set([...entryPaths,...bengaliPaths,
    "/world","/atlas","/demographics","/field-notes","/learn/teaching","/journeys","/connections","/glossary","/about",
    ...labs.map(({slug})=>`/lab/${slug}`),...topics.map(({slug})=>`/topics/${slug}`),
    ...articles.map(({slug})=>`/stories/${slug}`),...directory.map(({id})=>`/demographics/${id.toLowerCase()}`),
  ]);
  return [...paths].flatMap((path)=>editionsFor(path).map((code)=>{
    const {languages}=contentAlternates(path,code);
    return {url:origin+localizedPath(path,code),...(languages ? {alternates:{languages:Object.fromEntries(Object.entries(languages).map(([key,value])=>[key,origin+value]))}} : {})};
  }));
}
