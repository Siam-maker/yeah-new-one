import type { MetadataRoute } from "next";
import { articles } from "@/lib/content/articles";
import { labs,topics } from "@/lib/content/publication";
import { learningTracks } from "@/lib/content/learning-index";
import { languageAlternates,locales,localizedPath } from "@/lib/i18n/routing";
import directory from "@/public/data/country-directory.json";

const origin = "https://yeah-new-one.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const translated = ["/","/explore","/learn","/search",...learningTracks.map(({id})=>`/learn/${id}`)];
  return [
    ...translated.flatMap((path)=>locales.map((code)=>({
      url:origin+localizedPath(path,code),
      alternates:{languages:Object.fromEntries(Object.entries(languageAlternates(path,code).languages).map(([key,value])=>[key,origin+value]))},
    }))),
    ...["/world","/atlas","/demographics","/stories","/topics","/field-notes","/lab","/lab/ice-archive","/lab/climate-pathways","/lab/observatory",
      "/learn/teaching","/journeys","/connections","/glossary","/library","/about",
      ...labs.map(({slug})=>`/lab/${slug}`),...topics.map(({slug})=>`/topics/${slug}`),
      ...articles.map(({slug})=>`/stories/${slug}`),...directory.map(({id})=>`/demographics/${id.toLowerCase()}`),
    ].map((path)=>({url:origin+path})),
  ];
}
