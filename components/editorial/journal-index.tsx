"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Group = { value: string; card: ReactNode };

export function JournalIndex({ groups, categories }: { groups: Group[]; categories: { label: string; value: string }[] }) {
  const [filter, setFilter] = useState("all");
  const [limit, setLimit] = useState(3);
  const visible = groups.filter((entry) => filter === "all" || entry.value === filter);
  return <>
    <div className="pill-row" aria-label="Filter stories by topic">
      {[{ label: "All stories", value: "all" }, ...categories].map(({ label, value }) =>
        <button className="ghost-button" key={value} type="button" aria-pressed={value === filter} onClick={() => { setFilter(value); setLimit(3); }}>{label}</button>)}
    </div>
    <div className="editorial-tiles mt-6">{visible.slice(0, limit).map(({ card }, index) => <div key={index}>{card}</div>)}</div>
    {visible.length > limit && <button className="button button-accent mt-6" type="button" onClick={() => setLimit(limit + 3)}>Load more stories</button>}
  </>;
}
