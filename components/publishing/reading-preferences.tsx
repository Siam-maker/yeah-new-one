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
      /^\/(?:bn\/)?(stories|topics)\/[a-z0-9-]+$/.test(item.href)).slice(0, 7) : [];
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
export function ReadingModeButton({ locale="en" }: { locale?:"en"|"bn" } = {}) {
  const paper = useReadingMode();
  return <button className="ghost-button" type="button" aria-pressed={paper}
    onClick={() => write("uts:reading-mode", paper ? "dark" : "paper")}><BookOpen size={17} aria-hidden="true" /> {locale === "bn" ? "কাগজের মতো পড়ুন" : "Paper reading mode"}</button>;
}

const resumeKey = "uts:reading-position";
export function rememberReading(item: TrailItem) {
  if (read(resumeKey,"") !== JSON.stringify(item)) write(resumeKey,JSON.stringify(item));
}
function parsePosition(value: string): TrailItem | undefined {
  try {
    const item = JSON.parse(value);
    if (item && typeof item.title === "string" && typeof item.href === "string" &&
      /^\/(?:bn\/)?stories\/[a-z0-9-]+#(?:section-[1-9][0-9]*|sources)$/.test(item.href)) return item;
  } catch {}
}
const noSubscribe = () => () => {};
export function ReadingControls({ article = false, locale="en" }: { article?:boolean; locale?:"en"|"bn" }) {
  const bn = locale === "bn";
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
      .flatMap((element) => element.textContent?.trim().match(/[^.!?।。]+[.!?।。]*/g) ?? []);
    if (!passages.length) return;
    const voices = speech.getVoices();
    const voice = voices.find((candidate) => candidate.lang.toLowerCase().split("-")[0] === locale);
    if (voices.length > 0 && !voice) {
      setSpeechNotice(bn ? "এই যন্ত্রে বাংলায় পড়ার কণ্ঠ নেই।" : "An English speech voice is unavailable on this device.");
      return;
    }
    setSpeaking(true);
    function speak(index: number) {
      if (version !== session.version) return;
      if (index >= passages.length) { setSpeaking(false);return; }
      const utterance = new SpeechSynthesisUtterance(passages[index]);
      utterance.lang = voice?.lang ?? (bn ? "bn-BD" : "en");
      if (voice) utterance.voice = voice;
      utterance.onend = () => speak(index+1);
      utterance.onerror = () => {
        if (version !== session.version) return;
        setSpeaking(false);
        setSpeechNotice(bn ? "এই ব্রাউজারে শোনানো যাচ্ছে না।" : "Read aloud is unavailable in this browser.");
      };
      speech.speak(utterance);
    }
    speak(0);
  }

  return <details className="reading-controls reference-fold">
    <summary>{bn ? "পড়ার সেটিংস" : "Reading settings"}</summary>
    <div className="reading-controls-body">
      <label>{bn ? "লেখার আকার" : "Text size"}<select className="control-field" value={size} onChange={(event) => write(preferenceKey.size,event.target.value)}>
        <option value="small">{bn ? "ছোট" : "Small"}</option><option value="standard">{bn ? "সাধারণ" : "Standard"}</option><option value="large">{bn ? "বড়" : "Large"}</option>
      </select></label>
      <button className="ghost-button" type="button" aria-pressed={contrast} onClick={() => write(preferenceKey.contrast,contrast ? "off" : "on")}>{bn ? "উচ্চ বৈপরীত্য" : "High contrast"}</button>
      <button className="ghost-button" type="button" aria-pressed={focus} onClick={() => write(preferenceKey.focus,focus ? "off" : "on")}>{bn ? "মনোযোগ দিয়ে পড়ুন" : "Focus mode"}</button>
      {article && supported && <button className="ghost-button" type="button" aria-pressed={speaking} onClick={toggleSpeech}>{speaking ? bn ? "পড়া বন্ধ করুন" : "Stop reading aloud" : bn ? "শুনুন" : "Read aloud"}</button>}
      {article && <PrintButton label={bn ? "নিবন্ধ ছাপুন" : "Print article"} />}
      {speechNotice && <p role="status">{speechNotice}</p>}
    </div>
  </details>;
}

function Trail({ type, heading, bn }: { type: "stories" | "topics"; heading: string; bn:boolean }) {
  const items = parseTrail(useSyncExternalStore(subscribe, () => read("uts:recent:" + type, empty), () => empty));
  return <section className="library-block">
    <h2 className="subhead">{heading}</h2>
    {items.length ? <ul className="result-list">{items.map((item) => <li key={item.href}><Link href={item.href} lang={item.href.startsWith("/bn/") ? "bn" : "en"}>{item.title}</Link></li>)}</ul>
      : <p>{bn ? "পড়া ও অন্বেষণের সঙ্গে এখানে তালিকা তৈরি হবে।" : "Items appear here as you explore."}</p>}
  </section>;
}

type Collection = {name:string; slugs:string[]};
const collectionsKey = "uts:reading-collections";
function parseCollections(value:string):Collection[] {
  try {
    const parsed:unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.flatMap((item):Collection[]=>item && typeof item.name==="string" && Array.isArray(item.slugs)
      ? [{name:item.name.slice(0,48),slugs:item.slugs.filter((slug:unknown):slug is string=>typeof slug==="string")}] : []).slice(0,12);
  } catch {}
  return [];
}

export function ReadingLibrary({ stories, locale="en" }: { stories: (TrailItem & { slug: string })[]; locale?:"en"|"bn" }) {
  const bn=locale==="bn";
  const [name,setName] = useState("");
  const [selected,setSelected] = useState("");
  const [notice,setNotice] = useState("");
  const collections = parseCollections(useSyncExternalStore(subscribe,()=>read(collectionsKey,empty),()=>empty));
  const open = collections.find((item)=>item.name===selected);
  const words = bn ? {saved:"সংরক্ষিত নিবন্ধ",title:"পাঠের সংগ্রহ",new:"নতুন সংগ্রহের নাম",create:"সংগ্রহ তৈরি করুন",all:"সব বুকমার্ক",select:"দেখার সংগ্রহ",add:"যোগ করুন",remove:"সরান",removeCollection:"এই সংগ্রহ মুছুন",duplicate:"অন্য একটি নাম ব্যবহার করুন।",empty:"নিবন্ধে বুকমার্ক চাপলে তা এখানে থাকবে।",emptyGroup:"এই সংগ্রহে এখনও নিবন্ধ নেই।",read:"সম্প্রতি পড়া",explored:"সম্প্রতি দেখা"}
    : {saved:"Saved stories",title:"Reading collections",new:"New collection name",create:"Create collection",all:"All bookmarks",select:"Show collection",add:"Add",remove:"Remove",removeCollection:"Delete this collection",duplicate:"Choose a different collection name.",empty:"Use Bookmark on any article to keep it here.",emptyGroup:"This collection has no stories yet.",read:"Recently read",explored:"Recently explored"};
  const saved = useSyncExternalStore(subscribe,
    () => stories.filter(({ slug }) => read("uts:bookmark:" + slug, "") === "1").map(({ slug }) => slug).join(","), () => "");
  const resume = parsePosition(useSyncExternalStore(subscribe, () => read(resumeKey,""), () => ""));
  const bookmarks = stories.filter(({ slug }) => saved.split(",").includes(slug));
  const visible=open ? bookmarks.filter(({slug})=>open.slugs.includes(slug)) : bookmarks;
  function toggleStory(slug:string) {
    if (!open) return;
    write(collectionsKey,JSON.stringify(collections.map((item)=>item.name===open.name ? {...item,slugs:item.slugs.includes(slug) ? item.slugs.filter((id)=>id!==slug) : [...item.slugs,slug]} : item)));
  }
  return <>
    <section className="library-block">
      <h2 className="subhead">{words.saved}</h2>
      {resume && <p className="reading-resume"><Link className="editorial-link" href={resume.href}>{bn ? "পড়া চালিয়ে যান" : "Continue reading"} <span lang={resume.href.startsWith("/bn/") ? "bn" : "en"}>{resume.title}</span></Link></p>}
      <details className="reference-fold reading-collections"><summary>{words.title}</summary>
        <form className="pill-row" onSubmit={(event)=>{
          event.preventDefault();
          const trimmed=name.trim();
          if (!trimmed || collections.length>=12) return;
          if (collections.some((item)=>item.name.toLocaleLowerCase(locale)===trimmed.toLocaleLowerCase(locale))) {setNotice(words.duplicate);return;}
          write(collectionsKey,JSON.stringify([...collections,{name:trimmed,slugs:[]}]));
          setSelected(trimmed);setName("");setNotice("");
        }}>
          <label>{words.new}<input className="control-field" value={name} maxLength={48} onChange={(event)=>setName(event.target.value)} required /></label>
          <button type="submit" className="ghost-button" disabled={collections.length>=12}>{words.create}</button>
        </form>
        {notice && <p role="status">{notice}</p>}
        {collections.length>0 && <label>{words.select}<select className="control-field" value={selected} onChange={(event)=>setSelected(event.target.value)}>
          <option value="">{words.all}</option>{collections.map(({name})=><option key={name}>{name}</option>)}
        </select></label>}
        {open && <><ul className="collection-members">{bookmarks.map(({slug,title,href})=><li key={slug}>
          <span lang={href.startsWith("/bn/") ? "bn" : "en"}>{title}</span><button type="button" className="ghost-button" aria-label={`${open.slugs.includes(slug) ? words.remove : words.add} ${title}`} aria-pressed={open.slugs.includes(slug)} onClick={()=>toggleStory(slug)}>{open.slugs.includes(slug) ? words.remove : words.add}</button>
        </li>)}</ul><button type="button" className="ghost-button" onClick={()=>{
          if (!window.confirm(bn ? "এই সংগ্রহ মুছবেন? বুকমার্কগুলো থাকবে।" : "Delete this collection? Your bookmarks will be kept.")) return;
          write(collectionsKey,JSON.stringify(collections.filter((item)=>item.name!==open.name)));setSelected("");
        }}>{words.removeCollection}</button></>}
      </details>
      {visible.length ? <ul className="result-list">{visible.map((item) => <li key={item.href}><Link href={item.href} lang={item.href.startsWith("/bn/") ? "bn" : "en"}>{item.title}</Link></li>)}</ul>
        : <p>{open ? words.emptyGroup : words.empty}</p>}
    </section>
    <Trail type="stories" heading={words.read} bn={bn} /><Trail type="topics" heading={words.explored} bn={bn} />
  </>;
}
