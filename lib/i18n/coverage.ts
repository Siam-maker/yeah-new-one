import { bengaliLabs,bengaliTopics } from "./bengali-guides";
import { bengaliStories } from "./bengali-stories";
import { learningTracks } from "../content/learning-index";
import { locales,localizedPath,htmlLanguage,type Locale } from "./routing";

export const entryPaths = ["/","/explore","/learn","/search",...learningTracks.map(({id})=>`/learn/${id}`)];
export const bengaliPaths = ["/stories","/topics","/lab","/learn/progress","/library",
  ...Object.keys(bengaliStories).map((slug)=>`/stories/${slug}`),
  ...Object.keys(bengaliTopics).map((slug)=>`/topics/${slug}`),
  ...Object.keys(bengaliLabs).map((slug)=>`/lab/${slug}`),
];

export function editionsFor(path:string): readonly Locale[] {
  if (entryPaths.includes(path)) return locales;
  return bengaliPaths.includes(path) ? ["en","bn"] : ["en"];
}

export function contentAlternates(path:string,locale:Locale) {
  const editions = editionsFor(path);
  return {
    canonical:localizedPath(path,locale),
    ...(editions.length > 1 && {languages:{...Object.fromEntries(editions.map((code)=>[htmlLanguage(code),localizedPath(path,code)])),"x-default":path}}),
  };
}
