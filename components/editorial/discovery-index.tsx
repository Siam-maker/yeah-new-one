"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";

type Entry = { title:string; description:string; href:string; kind:string; topics:string[] };
type Filter = { value:string; label:string };

export function DiscoveryIndex({ entries, filters, heading = "Discovery index", pageSize = 8, showMaterial = true }: { entries:Entry[]; filters:Filter[]; heading?:string; pageSize?:number; showMaterial?:boolean }) {
  const [discipline,setDiscipline] = useState("");
  const [kind,setKind] = useState("");
  const [query,setQuery] = useState("");
  const [expanded,setExpanded] = useState(pageSize);
  const materials = [...new Set(entries.map((entry)=>entry.kind))];
  const normalized = query.trim().toLowerCase();
  const matches = entries.filter((entry) => (!discipline || entry.topics.includes(discipline)) && (!kind || entry.kind === kind) &&
    (!normalized || `${entry.title} ${entry.description}`.toLowerCase().includes(normalized)));

  return <section className="discovery-index" aria-labelledby="discovery-heading">
    <h2 id="discovery-heading" className="subhead">{heading}</h2>
    <div className="discovery-filters" data-material={showMaterial && materials.length > 1}>
      <label>Discipline<select className="control-field" value={discipline} onChange={(event) => { setDiscipline(event.target.value);setExpanded(pageSize); }}>
        <option value="">All disciplines</option>{filters.map((filter) => <option value={filter.value} key={filter.value}>{filter.label}</option>)}
      </select></label>
      {showMaterial && materials.length > 1 && <label>Material<select className="control-field" value={kind} onChange={(event) => { setKind(event.target.value);setExpanded(pageSize); }}>
        <option value="">All materials</option>{materials.map((item)=><option key={item}>{item}</option>)}
      </select></label>}
      <label>Find something<input type="search" className="control-field" value={query} onChange={(event)=>{setQuery(event.target.value);setExpanded(pageSize);}} placeholder="Try ice or earthquakes" /></label>
    </div>
    <p role="status" className="mono section-label discovery-count">{matches.length} {matches.length === 1 ? "result" : "results"}</p>
    <ul className="discovery-results">
      {matches.slice(0,expanded).map((entry) => <li key={entry.href}><Link href={entry.href}><span className="mono">{entry.kind}</span><div><h3>{entry.title}</h3><p>{entry.description}</p></div><ArrowUpRight aria-hidden="true" size={18} /></Link></li>)}
    </ul>
    {!matches.length && <p>Try a different term or change the filters.</p>}
    <div className="pill-row mt-4">
      {matches.length > expanded && <button type="button" className="ghost-button" onClick={()=>setExpanded(expanded+pageSize)}>Show more results</button>}
      <Link href={`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`} className="ghost-button"><Search size={17} aria-hidden="true" />Search the full publication</Link>
    </div>
  </section>;
}
