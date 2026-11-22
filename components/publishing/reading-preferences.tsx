"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { PrintButton } from "./print-button";

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

const preferenceKey = {
  size:"uts:reading-size", contrast:"uts:reading-contrast", focus:"uts:reading-focus",
};
function useReadingPreference(key: string, fallback: string) {
  return useSyncExternalStore(subscribe, () => read(key,fallback), () => fallback);
}

export function ReadingModeSync() {
  const paper = useReadingMode();
  const size = useReadingPreference(preferenceKey.size,"standard");
  const contrast = useReadingPreference(preferenceKey.contrast,"off");
  const focus = useReadingPreference(preferenceKey.focus,"off");
  useEffect(() => {
    const settings = document.documentElement.dataset;
    settings.readingMode = paper ? "paper" : "dark";
    settings.readingSize = size === "large" || size === "small" ? size : "standard";
    settings.readingContrast = contrast === "on" ? "on" : "off";
    settings.readingFocus = focus === "on" ? "on" : "off";
  }, [paper,size,contrast,focus]);
  return null;
}
export function ReadingModeButton() {
  const paper = useReadingMode();
  return <button className="ghost-button" type="button" aria-pressed={paper}
    onClick={() => write("uts:reading-mode", paper ? "dark" : "paper")}><BookOpen size={17} aria-hidden="true" /> Paper reading mode</button>;
}

const resumeKey = "uts:reading-position";
export function rememberReading(item: TrailItem) {
  if (read(resumeKey,"") !== JSON.stringify(item)) write(resumeKey,JSON.stringify(item));
}
function parsePosition(value: string): TrailItem | undefined {
  try {
    const item = JSON.parse(value);
    if (item && typeof item.title === "string" && typeof item.href === "string" &&
      /^\/stories\/[a-z0-9-]+#(?:section-[1-9][0-9]*|sources)$/.test(item.href)) return item;
  } catch {}
}
const noSubscribe = () => () => {};
export function ReadingControls({ article = false }: { article?:boolean }) {
  const size = useReadingPreference(preferenceKey.size,"standard");
  const contrast = useReadingPreference(preferenceKey.contrast,"off") === "on";
  const focus = useReadingPreference(preferenceKey.focus,"off") === "on";
  const [speaking,setSpeaking] = useState(false);
  const [speechNotice,setSpeechNotice] = useState("");
  const speechSession = useRef({ version:0 });
  const supported = useSyncExternalStore(noSubscribe,
    () => "speechSynthesis" in window && "SpeechSynthesisUtterance" in window, () => false);

  useEffect(() => {
    if (!article || !supported) return;
    const session = speechSession.current;
    return () => { session.version++;window.speechSynthesis.cancel(); };
  },[article,supported]);

  function toggleSpeech() {
    const session = speechSession.current;
    const version = ++session.version;
    const speech = window.speechSynthesis;
    setSpeechNotice("");
    if (speaking) { speech.cancel();setSpeaking(false);return; }
    const passages = Array.from(document.querySelectorAll<HTMLElement>(".article-body > section[id^='section-'] > :is(h2,p)"))
      .flatMap((element) => element.textContent?.trim().match(/[^.!?。]+[.!?。]*/g) ?? []);
    if (!passages.length) return;
    setSpeaking(true);
    function speak(index: number) {
      if (version !== session.version) return;
      if (index >= passages.length) { setSpeaking(false);return; }
      const utterance = new SpeechSynthesisUtterance(passages[index]);
      utterance.lang = "en";
      utterance.onend = () => speak(index+1);
      utterance.onerror = () => {
        if (version !== session.version) return;
        setSpeaking(false);
        setSpeechNotice("Read aloud is unavailable in this browser.");
      };
      speech.speak(utterance);
    }
    speak(0);
  }

  return <details className="reading-controls reference-fold">
    <summary>Reading settings</summary>
    <div className="reading-controls-body">
      <label>Text size<select className="control-field" value={size} onChange={(event) => write(preferenceKey.size,event.target.value)}>
        <option value="small">Small</option><option value="standard">Standard</option><option value="large">Large</option>
      </select></label>
      <button className="ghost-button" type="button" aria-pressed={contrast} onClick={() => write(preferenceKey.contrast,contrast ? "off" : "on")}>High contrast</button>
      <button className="ghost-button" type="button" aria-pressed={focus} onClick={() => write(preferenceKey.focus,focus ? "off" : "on")}>Focus mode</button>
      {article && supported && <button className="ghost-button" type="button" aria-pressed={speaking} onClick={toggleSpeech}>{speaking ? "Stop reading aloud" : "Read aloud"}</button>}
      {article && <PrintButton />}
      {speechNotice && <p role="status">{speechNotice}</p>}
    </div>
  </details>;
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
  const resume = parsePosition(useSyncExternalStore(subscribe, () => read(resumeKey,""), () => ""));
  const bookmarks = stories.filter(({ slug }) => saved.split(",").includes(slug));
  return <>
    <section className="library-block">
      <h2 className="subhead">Saved stories</h2>
      {resume && <p className="reading-resume"><Link className="editorial-link" href={resume.href}>Continue reading {resume.title}</Link></p>}
      {bookmarks.length ? <ul className="result-list">{bookmarks.map((item) => <li key={item.href}><Link href={item.href}>{item.title}</Link></li>)}</ul>
        : <p>Use Bookmark on any article to keep it here.</p>}
    </section>
    <Trail type="stories" heading="Recently read" /><Trail type="topics" heading="Recently explored" />
  </>;
}
