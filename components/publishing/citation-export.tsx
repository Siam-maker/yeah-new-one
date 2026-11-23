"use client";

import { Download } from "lucide-react";

function bibText(value: string) { return value.replace(/[\\{}%&#_$~^]/g, (symbol)=>"\\" + symbol); }

export function CitationExport({ slug,title,locale="en" }: { slug:string;title:string;locale?:"en"|"bn" }) {
  const bn = locale === "bn";
  function download(format:"bib"|"ris") {
    const date = new Date().toISOString().slice(0,10);
    const url = new URL(`/${bn ? "bn/" : ""}stories/${slug}`,"https://yeah-new-one.vercel.app").href;
    const text = format === "bib"
      ? `@online{under-the-surface-${slug},\n  title = {${bibText(title)}},\n  organization = {Under the Surface},\n  url = {${url}},\n  urldate = {${date}}\n}\n`
      : `TY  - ELEC\nTI  - ${title.replace(/[\r\n]+/g," ")}\nPB  - Under the Surface\nLA  - ${locale}\nUR  - ${url}\nY2  - ${date.replaceAll("-","/")}\nER  - \n`;
    const file = URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"}));
    const link = document.createElement("a");
    link.href=file;link.download=`${slug}.${format}`;link.click();
    window.setTimeout(()=>URL.revokeObjectURL(file),1000);
  }
  return <details className="reference-fold citation-tools"><summary>{bn ? "নিবন্ধের উদ্ধৃতি রপ্তানি করুন" : "Export article citation"}</summary>
    <div className="pill-row">{(["bib","ris"] as const).map((format)=><button key={format} type="button" className="ghost-button" onClick={()=>download(format)}><Download size={15} aria-hidden="true" /> {format === "bib" ? "BibTeX" : "RIS"}</button>)}</div>
  </details>;
}
