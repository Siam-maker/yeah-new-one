"use client";

import { useEffect, useId, useState, useRef } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { SearchEntry } from "@/lib/content/search";

const categories = ["All", "Article", "Topic", "Lab", "Glossary", "Location", "Field note"];
const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export function SearchPanel({ entries, initialQuery = "", onNavigate, compact = false }: {
  entries: SearchEntry[]; initialQuery?: string; onNavigate?: () => void; compact?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const [limit, setLimit] = useState(compact ? 5 : 8);
  const inputId = useId();
  const tokens = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const matches = entries.filter((entry) => (category === "All" || entry.kind === category) &&
    tokens.every((token) => normalize(`${entry.title} ${entry.description} ${entry.keywords}`).includes(token)));
  const visible = matches.slice(0, limit);

  return <>
    <div className="search-controls">
      <label htmlFor={inputId}><span className="control-label">Search the publication</span>
        <input id={inputId} type="search" className="control-field" placeholder="Try bioluminescence, ice, or trenches" value={query}
          onChange={(event) => { setQuery(event.target.value); setLimit(compact ? 5 : 8); }} />
      </label>
      <label><span className="control-label">Content type</span>
        <select className="control-field" value={category} onChange={(event) => { setCategory(event.target.value); setLimit(compact ? 5 : 8); }}>
          {categories.map((item) => <option key={item} value={item}>{item === "All" ? "All content" : item === "Glossary" ? "Glossary" : item + "s"}</option>)}
        </select>
      </label>
    </div>
    {!query && <div className="search-suggestions"><span>Try</span>{["trench", "ice", "coastal", "evolution"].map((suggestion) =>
      <button type="button" key={suggestion} className="ghost-button" onClick={() => { setQuery(suggestion); setCategory("All"); }}>{suggestion}</button>)}</div>}
    <p className="mt-4 text-[var(--muted)]" role="status">{matches.length === 0 ? "No matching results. Try a broader term or change the content type." : `${matches.length} ${matches.length === 1 ? "result" : "results"}`}</p>
    {visible.length > 0 && <ul className="result-list">{visible.map((entry) => <li key={entry.href}>
      <p className="mono tile-meta">{entry.kind}</p><Link href={entry.href} onClick={onNavigate}>{entry.title}</Link><p>{entry.description}</p>
    </li>)}</ul>}
    {matches.length > limit && <button className="ghost-button mt-4" type="button" onClick={() => setLimit(limit + 8)}>Load more results</button>}
    {compact && <div className="mt-5"><Link className="editorial-link" href={`/search?q=${encodeURIComponent(query)}`} onClick={onNavigate}>Open the search page</Link></div>}
  </>;
}

export function SearchOverlay({ entries }: { entries: SearchEntry[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  function openSearch() {
    const panel = dialog.current;
    if (!panel || panel.open) return;
    panel.showModal();
    panel.querySelector("input")?.focus();
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
    <button ref={trigger} className="header-action header-search" type="button" aria-haspopup="dialog" onClick={openSearch}>
      <Search size={19} aria-hidden="true" /><span>Search</span>
    </button>
    <dialog className="search-dialog" ref={dialog} aria-labelledby="search-dialog-title" onClose={() => trigger.current?.focus()}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        event.stopPropagation();
        dialog.current?.close();
      }}>
      <div className="dialog-heading"><h2 id="search-dialog-title">Search Under the Surface</h2>
        <button className="ghost-button" type="button" aria-label="Close search" onClick={() => dialog.current?.close()}><X size={20} aria-hidden="true" /></button>
      </div>
      <SearchPanel entries={entries} compact onNavigate={() => dialog.current?.close()} />
    </dialog>
  </>;
}
