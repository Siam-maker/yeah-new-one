"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

const key = "uts-atlas-bookmarks";
const empty = "[]";

function subscribe(notify: () => void) {
  window.addEventListener(key, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(key, notify);
    window.removeEventListener("storage", notify);
  };
}

function snapshot() {
  try { return localStorage.getItem(key) ?? empty; } catch { return empty; }
}

export function AtlasBookmarks({ href, label }: { href: string; label: string }) {
  const saved = useSyncExternalStore(subscribe, snapshot, () => empty);
  const [status, setStatus] = useState("");
  const [manual, setManual] = useState("");
  let entries: { href: string; label: string }[] = [];
  try {
    const parsed: unknown = JSON.parse(saved);
    if (Array.isArray(parsed)) entries = parsed.filter((item) => item && typeof item.href === "string" && item.href.startsWith("/atlas?") && typeof item.label === "string");
  } catch { /* An invalid local value is treated as empty. */ }
  const active = entries.some((item) => item.href === href);

  function save() {
    try {
      const next = active ? entries.filter((item) => item.href !== href) : [{ href, label }, ...entries].slice(0,25);
      localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new Event(key));
      setStatus(active ? "Removed from saved views." : "View saved on this device.");
    } catch { setStatus("This browser could not save the view."); }
  }

  async function share() {
    const url = new URL(href, location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied.");
      setManual("");
    } catch {
      setManual(url);
      setStatus("Select and copy the link.");
    }
  }

  return <div className="atlas-bookmarks">
    <button className="ghost-button" type="button" onClick={save} aria-pressed={active}>{active ? "View saved" : "Save view"}</button>
    <button className="ghost-button" type="button" onClick={share}>Copy view link</button>
    {entries.length > 0 && <details><summary>Saved views ({entries.length})</summary><ul>{entries.map((entry) => <li key={entry.href}><Link href={entry.href}>{entry.label}</Link></li>)}</ul></details>}
    <span role="status">{status}</span>
    {manual && <label>View link<input readOnly value={manual} onFocus={(event) => event.currentTarget.select()} className="control-field" /></label>}
  </div>;
}
