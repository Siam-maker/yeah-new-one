"use client";

import { useEffect, useSyncExternalStore } from "react";
import { BookOpen } from "lucide-react";
import Link from "next/link";

const changed = "uts:reading-change";
const empty = "[]";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changed, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changed, onChange);
  };
}

function read(key: string, fallback: string) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
    window.dispatchEvent(new Event(changed));
  } catch {}
}

export type TrailItem = { title: string; href: string };

function parseTrail(value: string): TrailItem[] {
  try {
    const list: unknown = JSON.parse(value);
    return Array.isArray(list) ? list.filter((item): item is TrailItem =>
      item && typeof item.title === "string" && typeof item.href === "string" &&
      /^\/(stories|topics)\/[a-z0-9-]+$/.test(item.href)).slice(0, 7) : [];
  } catch { return []; }
}

export function RecordVisit({ title, href, type }: TrailItem & { type: "stories" | "topics" }) {
  useEffect(() => {
    const key = "uts:recent:" + type;
    const previous = parseTrail(read(key, empty));
    if (previous[0]?.href === href) return;
    write(key, JSON.stringify([{ title, href }, ...previous.filter((item) => item.href !== href)].slice(0, 7)));
  }, [title, href, type]);
  return null;
}

function useReadingMode() {
  return useSyncExternalStore(subscribe, () => read("uts:reading-mode", "dark") === "paper", () => false);
}

export function ReadingModeSync() {
  const paper = useReadingMode();
  useEffect(() => { document.documentElement.dataset.readingMode = paper ? "paper" : "dark"; }, [paper]);
  return null;
}

export function ReadingModeButton() {
  const paper = useReadingMode();
  return <button className="ghost-button" type="button" aria-pressed={paper}
    onClick={() => write("uts:reading-mode", paper ? "dark" : "paper")}><BookOpen size={17} aria-hidden="true" /> Paper reading mode</button>;
}

function Trail({ type, heading }: { type: "stories" | "topics"; heading: string }) {
  const items = parseTrail(useSyncExternalStore(subscribe, () => read("uts:recent:" + type, empty), () => empty));
  return <section className="library-block">
    <h2 className="subhead">{heading}</h2>
    {items.length ? <ul className="result-list">{items.map((item) => <li key={item.href}><Link href={item.href}>{item.title}</Link></li>)}</ul>
      : <p>Items appear here as you explore.</p>}
  </section>;
}

export function ReadingLibrary({ stories }: { stories: (TrailItem & { slug: string })[] }) {
  const saved = useSyncExternalStore(subscribe,
    () => stories.filter(({ slug }) => read("uts:bookmark:" + slug, "") === "1").map(({ slug }) => slug).join(","), () => "");
  const bookmarks = stories.filter(({ slug }) => saved.split(",").includes(slug));
  return <>
    <section className="library-block">
      <h2 className="subhead">Saved stories</h2>
      {bookmarks.length ? <ul className="result-list">{bookmarks.map((item) => <li key={item.href}><Link href={item.href}>{item.title}</Link></li>)}</ul>
        : <p>Use Bookmark on any article to keep it here.</p>}
    </section>
    <Trail type="stories" heading="Recently read" /><Trail type="topics" heading="Recently explored" />
  </>;
}
