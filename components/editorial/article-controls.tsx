"use client";

import { useEffect, useState, useRef, useSyncExternalStore, type ReactNode } from "react";
import { Bookmark, Link2, Share2 } from "lucide-react";
import { rememberReading } from "@/components/publishing/reading-preferences";
import { localizedPath } from "@/lib/i18n/routing";
import { motion, useScroll } from "motion/react";

const changed = "uts:bookmark";
function subscribe(callback: () => void) {
  window.addEventListener(changed, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(changed, callback);
    window.removeEventListener("storage", callback);
  };
}

export function ArticleControls({ slug, title, locale="en" }: { slug: string; title: string; locale?:"en"|"bn" }) {
  const bn = locale === "bn";
  const key = "uts:bookmark:" + slug;
  const saved = useSyncExternalStore(subscribe, () => {
    try { return localStorage.getItem(key) === "1"; } catch { return false; }
  }, () => false);
  const [notice, setNotice] = useState("");
  const [copy, setCopy] = useState("");

  function toggleBookmark() {
    try {
      if (saved) localStorage.removeItem(key); else localStorage.setItem(key, "1");
      dispatchEvent(new Event(changed));
      setNotice(saved ? bn ? "বুকমার্ক সরানো হয়েছে।" : "Bookmark removed." : bn ? "এই যন্ত্রে নিবন্ধটি সংরক্ষিত হয়েছে।" : "Story bookmarked on this device.");
    } catch { setNotice(bn ? "এই ব্রাউজারে বুকমার্ক সংরক্ষণ সম্ভব হয়নি।" : "This browser did not allow local bookmarks."); }
  }

  async function share(copyOnly = false) {
    const url = location.href.split("#")[0];
    try {
      if (!copyOnly && navigator.share) { await navigator.share({ title, url }); return; }
      await navigator.clipboard.writeText(url);
      setNotice(bn ? "নিবন্ধের লিংক কপি হয়েছে।" : "Story link copied.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setCopy(url);
      setNotice(bn ? "কপি করতে নিচের লিংক নির্বাচন করুন।" : "Select the story link below to copy it.");
    }
  }

  return <>
    <div className="article-actions">
      <button className="ghost-button" type="button" aria-pressed={saved} onClick={toggleBookmark}><Bookmark size={18} aria-hidden="true" />{saved ? bn ? "সংরক্ষিত" : "Bookmarked" : bn ? "বুকমার্ক করুন" : "Bookmark"}</button>
      <button className="ghost-button" type="button" onClick={() => void share()}><Share2 size={18} aria-hidden="true" />{bn ? "নিবন্ধ শেয়ার করুন" : "Share story"}</button>
      <button className="ghost-button" type="button" onClick={() => void share(true)}><Link2 size={18} aria-hidden="true" />{bn ? "লিংক কপি করুন" : "Copy link"}</button>
    </div>
    {notice && <p className="mt-2" role="status">{notice}</p>}
    {copy && <label className="mt-2 block">{bn ? "নিবন্ধের লিংক" : "Story link"}<input className="control-field" value={copy} readOnly onFocus={(event) => event.target.select()} /></label>}
  </>;
}

export function ReadableArticle({ children }: { children: ReactNode }) {
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  return <article ref={target} className="reading-surface"><motion.div className="article-progress" aria-hidden="true" style={{ scaleX: scrollYProgress }} />{children}</article>;
}

export function ArticleContents({ sections, slug, title, locale="en" }: { sections: { id:string; title:string }[]; slug:string; title:string; locale?:"en"|"bn" }) {
  const bn = locale === "bn";
  const [current,setCurrent] = useState("");
  useEffect(() => {
    let frame = 0;
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const active = sections.findLast(({ id }) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= 144);
        setCurrent(active?.id ?? "");
        if (active) rememberReading({ title,href:localizedPath(`/stories/${slug}`,locale)+`#${active.id}` });
      });
    }
    update();
    window.addEventListener("scroll",update,{ passive:true });
    window.addEventListener("resize",update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll",update);
      window.removeEventListener("resize",update);
    };
  },[sections,slug,title,locale]);
  return <nav aria-label={bn ? "সূচিপত্র" : "Table of contents"} className="article-toc"><h2>{bn ? "নিবন্ধের সূচি" : "In this story"}</h2>
    {sections.map(({ id,title })=><a href={`#${id}`} key={id} aria-current={current===id ? "location" : undefined}>{title}</a>)}
  </nav>;
}
