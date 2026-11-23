import { articles } from "@/lib/content/articles";
import { sources } from "@/lib/content/publication";
import { bengaliStories } from "@/lib/i18n/bengali-stories";

function html(value:string) {
  return value.replace(/[&<>"']/g,(character)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character] ?? character));
}

export async function GET(_request:Request,{params}:{params:Promise<{edition:string;slug:string}>}) {
  const { edition,slug }=await params;
  const original=articles.find((item)=>item.slug===slug);
  const bn=edition==="bn";
  const translated=bn ? bengaliStories[slug] : undefined;
  if (!original || (bn ? !translated : edition!=="en")) return new Response("Reading edition not found",{status:404});
  const title=translated?.title ?? original.title;
  const deck=translated?.deck ?? original.deck;
  const sections=translated?.sections ?? original.sections.map(({title,paragraphs})=>[title,...paragraphs]);
  const references=original.sources.map((key)=>sources[key]);
  return new Response(`<!doctype html><html lang="${edition}" dir="ltr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${html(title)} | Under the Surface</title>
  <style>html{color-scheme:light dark;font:19px/1.7 system-ui,sans-serif}body{max-width:40rem;margin:auto;padding:1.3rem 1.2rem 4rem}h1,h2{line-height:1.22}a{color:inherit;text-underline-offset:3px}header{border-bottom:1px solid;padding-bottom:1rem}section{margin-top:2rem}ul{overflow-wrap:anywhere}</style>
  <body><nav><a href="/offline-reader.html">${bn ? "অফলাইনে পড়ার তালিকা" : "Offline reading shelf"}</a></nav>
  <main><article><header><h1>${html(title)}</h1><p>${html(deck)}</p><a href="${bn ? "/bn" : ""}/stories/${html(slug)}">${bn ? "অনলাইন সংস্করণ" : "Online edition"}</a></header>
  ${sections.map(([heading,...paragraphs],index)=>`<section id="section-${index+1}"><h2>${html(heading)}</h2>${paragraphs.map((paragraph)=>`<p>${html(paragraph)}</p>`).join("")}</section>`).join("")}
  <section><h2>${bn ? "সূত্র" : "References"}</h2><ul lang="en">${references.map(({title,name,url})=>`<li><a href="${html(url)}">${html(title)}</a> · ${html(name)}</li>`).join("")}</ul></section></article></main></body></html>`,{
    headers:{"Content-Type":"text/html; charset=utf-8","X-Robots-Tag":"noindex","Content-Security-Policy":"default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'","Referrer-Policy":"no-referrer"},
  });
}
