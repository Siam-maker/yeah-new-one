"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { glossary, termId } from "@/lib/content/publication";

const letters = [...new Set(glossary.map(({ term }) => term[0]))];

export function Glossary() {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("All");
  const [pendingAnchor, setPendingAnchor] = useState<{ id: string }>();
  useEffect(() => {
    if (!pendingAnchor) return;
    document.getElementById(pendingAnchor.id)?.scrollIntoView();
    window.history.replaceState(window.history.state, "", "#" + pendingAnchor.id);
  }, [pendingAnchor]);
  const entries = glossary.filter((item) => (letter === "All" || item.term.startsWith(letter)) &&
    `${item.term} ${item.topic} ${item.definition}`.toLowerCase().includes(query.trim().toLowerCase()));

  return <>
    <label className="control-label" htmlFor="glossary-filter">Find a term</label>
    <input className="control-field" id="glossary-filter" type="search" value={query}
      onChange={(event) => { setQuery(event.target.value); setLetter("All"); }} />
    <div className="pill-row mt-4" aria-label="Filter alphabetically">
      {["All", ...letters].map((item) => <button key={item} type="button" className="ghost-button" aria-pressed={item === letter}
        onClick={() => setLetter(item)}>{item}</button>)}
    </div>
    {entries.length ? <div className="glossary-items">{entries.map(({ term, definition, topic, related, article }) => (
      <article key={term} id={termId(term)}>
        <p className="mono tile-meta">{topic}</p><h2>{term}</h2><p>{definition}</p>
        <div className="glossary-links"><Link href={`/stories/${article}`}>Related story</Link>
          {related.map((name) => <a key={name} href={`#${termId(name)}`} onClick={(event) => {
            if (document.getElementById(termId(name))) return;
            event.preventDefault();
            setQuery("");
            setLetter("All");
            setPendingAnchor({ id: termId(name) });
          }}>{name}</a>)}
        </div>
      </article>
    ))}</div> : <p role="status" className="mt-4">No matching terms. Try a shorter search or select All.</p>}
  </>;
}
