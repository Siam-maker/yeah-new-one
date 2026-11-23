"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export function OfflineRegistration() {
  useEffect(()=>{
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const start = () => void navigator.serviceWorker.register("/uts-sw.js").catch(()=>{});
    if (document.readyState === "complete") start();
    else window.addEventListener("load",start,{once:true});
    return ()=>window.removeEventListener("load",start);
  },[]);
  return null;
}

export function OfflineReading({slug,locale="en"}:{slug:string;locale?:"en"|"bn"}) {
  const bn=locale==="bn";
  const [status,setStatus] = useState<"idle"|"saving"|"saved"|"unavailable">("idle");
  const path=`/api/reading/${locale}/${slug}`;
  return <div className="offline-tools">
    <button className="ghost-button" type="button" disabled={status==="saving"} onClick={async()=>{
      setStatus("saving");
      try {
        if (!("serviceWorker" in navigator) || !("caches" in window)) throw new Error("Offline storage unavailable");
        await navigator.serviceWorker.register("/uts-sw.js");
        const cache=await caches.open("uts-offline-articles-v1");
        await cache.add(path);
        setStatus("saved");
      } catch { setStatus("unavailable"); }
    }}><Download size={16} aria-hidden="true" /> {bn ? "অফলাইনের জন্য সংরক্ষণ করুন" : "Save for offline reading"}</button>
    {status==="saved" && <p role="status">{bn ? "সংরক্ষিত।" : "Saved on this device."} <a href="/offline-reader.html">{bn ? "অফলাইন তালিকা খুলুন" : "Open offline shelf"}</a></p>}
    {status==="unavailable" && <p role="status">{bn ? "অফলাইন সংরক্ষণ সম্ভব হয়নি।" : "Offline storage could not save this article."}</p>}
  </div>;
}
