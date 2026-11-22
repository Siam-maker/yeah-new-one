"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { SearchEntry } from "@/lib/content/search";
import { learningTracks, levels } from "@/lib/content/learning-index";
import { messages } from "@/lib/i18n/messages";
import { direction, htmlLanguage, localizedPath, type Locale } from "@/lib/i18n/routing";

const categories = ["Article","Topic","Lab","Glossary","Location","Field note","Journey","Tool","Country","Course","Dataset"] as const;
const filters:Record<Locale,readonly string[]> = {
  en:["Articles","Topics","Labs","Glossary","Locations","Field notes","Journeys","Tools","Countries","Courses","Datasets","Beginner","Intermediate","Advanced"],
  bn:["নিবন্ধ","বিষয়","পরীক্ষাগার","পরিভাষা","স্থান","মাঠের নোট","অভিযান","সরঞ্জাম","দেশ","পাঠক্রম","তথ্যভান্ডার","প্রাথমিক","মধ্যবর্তী","উন্নত"],
  es:["Artículos","Temas","Laboratorios","Glosario","Lugares","Notas de campo","Expediciones","Herramientas","Países","Cursos","Datos","Inicial","Intermedio","Avanzado"],
  fr:["Articles","Thèmes","Laboratoires","Glossaire","Lieux","Notes de terrain","Expéditions","Outils","Pays","Cours","Données","Débutant","Intermédiaire","Avancé"],
  de:["Artikel","Themen","Labore","Glossar","Orte","Feldnotizen","Expeditionen","Werkzeuge","Länder","Kurse","Datensätze","Grundstufe","Mittelstufe","Fortgeschritten"],
  ar:["مقالات","موضوعات","مختبرات","المصطلحات","أماكن","ملاحظات ميدانية","رحلات","أدوات","بلدان","دروس","بيانات","مبتدئ","متوسط","متقدم"],
  hi:["लेख","विषय","प्रयोगशालाएँ","शब्दावली","स्थान","क्षेत्रीय टिप्पणियाँ","यात्राएँ","उपकरण","देश","पाठ्यक्रम","डेटासेट","शुरुआती","मध्यम","उन्नत"],
  "zh-hans":["文章","主题","实验室","术语表","地点","实地笔记","导览","工具","国家","课程","数据集","入门","中级","高级"],
  ja:["記事","テーマ","実験室","用語集","場所","観察ノート","探検","ツール","国","コース","データセット","初級","中級","上級"],
  pt:["Artigos","Temas","Laboratórios","Glossário","Locais","Notas de campo","Expedições","Ferramentas","Países","Cursos","Dados","Iniciante","Intermediário","Avançado"],
};
const normalize = (value: string) => value.toLowerCase().replace(/\p{Script=Latin}\p{M}*/gu, (part) => part.normalize("NFD").replace(/\p{M}/gu,"")).normalize("NFC");
const historyKey = "uts:searches";
function subscribe(callback: () => void) {
  window.addEventListener("storage",callback);
  window.addEventListener(historyKey,callback);
  return () => { window.removeEventListener("storage",callback);window.removeEventListener(historyKey,callback); };
}
function historySnapshot() {
  try { return localStorage.getItem(historyKey) ?? "[]"; } catch { return "[]"; }
}
function parseRecent(value: string): string[] {
  try {
    const rows: unknown = JSON.parse(value);
    if (Array.isArray(rows)) return rows.filter((row): row is string => typeof row === "string").slice(0,6);
  } catch {}
  return [];
}
function saveQuery(value: string) {
  const term = value.trim().slice(0,120);
  if (!term) return;
  try {
    localStorage.setItem(historyKey,JSON.stringify([term,...parseRecent(historySnapshot()).filter((item) => item !== term)].slice(0,6)));
    window.dispatchEvent(new Event(historyKey));
  } catch {}
}

function Highlight({ value, tokens }: { value:string; tokens:string[] }) {
  const escaped = tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));
  if (!escaped.length) return value;
  const expression = new RegExp(`(${escaped.join("|")})`,"giu");
  return value.split(expression).map((part,index) => index % 2 ? <mark key={index}>{part}</mark> : part);
}

export function SearchPanel({ entries, initialQuery = "", onNavigate, compact = false, status = "ready", locale = "en" }: {
  entries: SearchEntry[]; initialQuery?: string; onNavigate?: () => void; compact?: boolean; status?: "loading" | "error" | "ready"; locale?:Locale;
}) {
  const dictionary = messages[locale];
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const [level,setLevel] = useState("All");
  const [limit, setLimit] = useState(compact ? 5 : 8);
  const recent = parseRecent(useSyncExternalStore(subscribe,historySnapshot,() => "[]"));
  const inputId = useId();
  const term = normalize(query.trim());
  const tokens = term.split(/\s+/).filter(Boolean);
  const labels = filters[locale];
  const indexed = useMemo(() => {
    const archive = entries.map((entry) => ({ ...entry,lang:"en" as Locale }));
    const translated = locale === "en" ? [] : learningTracks.map((track,index) => ({
      title:dictionary.subjects[index],href:localizedPath(`/learn/${track.id}`,locale),description:dictionary.page.resourceIntro,
      kind:"Course" as const,level:track.level,keywords:"",lang:locale,
    }));
    return [...translated,...archive].map((entry) => ({
      entry, title:normalize(entry.title), description:normalize(entry.description), keywords:normalize(entry.keywords),
    }));
  },[dictionary,entries,locale]);
  const matches = indexed.flatMap(({entry,title,description,keywords}) => {
    if ((category !== "All" && entry.kind !== category) || (level !== "All" && entry.level !== level)) return [];
    let score = term && title === term ? 32 : term && title.startsWith(term) ? 12 : 0;
    for (const token of tokens) {
      if (title.includes(token)) score += 5;
      else if (keywords.includes(token)) score += 3;
      else if (description.includes(token)) score++;
      else return [];
    }
    return [{entry,score}];
  }).sort((a,b) => b.score - a.score);
  const visible = matches.slice(0, limit);
  function update(value:string) { setQuery(value);setLimit(compact ? 5 : 8); }
  const suggestions = locale === "en" ? ["trench","ice","coastal","evolution"] : dictionary.subjects.slice(0,3);

  return <>
    <form className="search-controls searchable-controls" onSubmit={(event) => { event.preventDefault();saveQuery(query); }}>
      <label htmlFor={inputId}><span className="control-label">{locale === "en" ? "Search the publication" : dictionary.nav["/search"]}</span>
        <input id={inputId} type="search" className="control-field" placeholder={dictionary.ui.searchPlaceholder} value={query} maxLength={120}
          onChange={(event) => update(event.target.value)} />
      </label>
      <label><span className="control-label">{dictionary.ui.type}</span>
        <select className="control-field" value={category} onChange={(event) => { setCategory(event.target.value);setLimit(compact ? 5 : 8); }}>
          <option value="All">{dictionary.ui.all}</option>
          {categories.map((item,index) => <option key={item} value={item}>{labels[index]}</option>)}
        </select>
      </label>
      <label><span className="control-label">{dictionary.ui.difficulty}</span>
        <select className="control-field" value={level} onChange={(event) => { setLevel(event.target.value);setLimit(compact ? 5 : 8); }}>
          <option value="All">{dictionary.ui.anyLevel}</option>
          {levels.map((item,index) => <option key={item} value={item}>{labels[categories.length+index]}</option>)}
        </select>
      </label>
      <button type="submit" className="sr-only">{dictionary.nav["/search"]}</button>
    </form>
    {!query && recent.length > 0 && <div className="search-suggestions"><span>{dictionary.ui.recent}</span>{recent.map((suggestion) =>
      <button dir="auto" key={suggestion} type="button" className="ghost-button" onClick={() => { update(suggestion);setCategory("All");setLevel("All"); }}>{suggestion}</button>)}</div>}
    {(!query || (status === "ready" && !matches.length)) && <div className="search-suggestions">{suggestions.map((suggestion) =>
      <button key={suggestion} type="button" className="ghost-button" onClick={() => { update(suggestion);setCategory("All");setLevel("All"); }}>{suggestion}</button>)}</div>}
    <p className="mt-4 text-[var(--muted)]" role="status">{status === "loading" ? dictionary.ui.loading : status === "error" ? dictionary.ui.searchError : matches.length === 0 ? dictionary.ui.empty :
      `${new Intl.NumberFormat(htmlLanguage(locale)).format(matches.length)} ${locale === "en" && matches.length === 1 ? "result" : dictionary.ui.results}`}</p>
    {visible.length > 0 && <ul className="result-list">{visible.map(({entry}) => <li key={entry.href}>
      <p className="mono tile-meta">{labels[categories.indexOf(entry.kind)]}{entry.level && ` · ${labels[categories.length+levels.indexOf(entry.level)]}`}{locale !== entry.lang && <span lang="en"> · English</span>}</p>
      <Link href={entry.href} hrefLang={htmlLanguage(entry.lang)} lang={htmlLanguage(entry.lang)} dir={direction(entry.lang)} onClick={() => { saveQuery(query);onNavigate?.(); }}>
        <span><Highlight value={entry.title} tokens={query.trim().split(/\s+/).filter(Boolean)} /></span><ArrowUpRight size={15} aria-hidden="true" /></Link>
      <p lang={htmlLanguage(entry.lang)} dir={direction(entry.lang)}><Highlight value={entry.description} tokens={query.trim().split(/\s+/).filter(Boolean)} /></p>
    </li>)}</ul>}
    {matches.length > limit && <button className="ghost-button mt-4" type="button" onClick={() => setLimit(limit + 8)}>{dictionary.ui.more}</button>}
    {compact && <div className="mt-5"><Link className="editorial-link" href={localizedPath(`/search?q=${encodeURIComponent(query)}`,locale)} onClick={() => { saveQuery(query);onNavigate?.(); }}>{dictionary.ui.searchPage}</Link></div>}
  </>;
}

export function SearchOverlay({ locale = "en" }: { locale?:Locale }) {
  const [entries,setEntries] = useState<SearchEntry[]>();
  const [failed,setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const dictionary = messages[locale];

  function openSearch() {
    const panel = dialog.current;
    if (!panel || panel.open) return;
    panel.showModal();
    panel.querySelector("input")?.focus();
    setFailed(false);
    void import("@/lib/content/search").then(({ searchEntries,countrySearchEntries }) => setEntries([...searchEntries,...countrySearchEntries]), () => setFailed(true));
  }

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        openSearch();
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);

  return <>
    <button ref={trigger} className="header-action header-search" type="button" aria-haspopup="dialog" aria-label={dictionary.nav["/search"]} onClick={openSearch}>
      <Search size={19} aria-hidden="true" /><span>{dictionary.nav["/search"]}</span>
    </button>
    <dialog className="search-dialog archive-dialog" ref={dialog} aria-labelledby="search-dialog-title" onClose={() => trigger.current?.focus()}
      onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault();event.stopPropagation();dialog.current?.close(); } }}>
      <div className="dialog-heading"><h2 id="search-dialog-title">{dictionary.ui.searchTitle}</h2>
        <button className="ghost-button" type="button" aria-label={locale === "en" ? "Close search" : dictionary.ui.close} onClick={() => dialog.current?.close()}><X size={20} aria-hidden="true" /></button>
      </div>
      <SearchPanel entries={entries ?? []} locale={locale} compact status={entries ? "ready" : failed ? "error" : "loading"} onNavigate={() => dialog.current?.close()} />
    </dialog>
  </>;
}
