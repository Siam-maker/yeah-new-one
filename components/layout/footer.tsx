"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { direction, htmlLanguage, localizedPath, splitLocale } from "@/lib/i18n/routing";
import { messages } from "@/lib/i18n/messages";
import { Brand } from "./brand";
import { LanguageSwitch } from "./language-switch";

const groups = [
  { title:"Read", label:"/stories", links:["/stories","/topics","/field-notes","/about"] },
  { title:"Investigate", label:"/explore", links:["/lab","/world","/atlas","/demographics","/journeys","/connections"] },
  { title:"Find", label:"/search", links:["/learn","/learn/teaching","/glossary","/search","/library"] },
] as const;

export function Footer() {
  const {locale} = splitLocale(usePathname());
  const dictionary = messages[locale];
  const target = (href: string) => localizedPath(href,locale);
  return <footer className="site-footer publication-footer" lang={htmlLanguage(locale)} dir={direction(locale)}>
    <div className="shell">
      <div className="footer-main">
        <div className="footer-intro"><Brand href={target("/")} />
          <p>{locale === "en" ? "Independent science stories, data, and interactive experiments." : dictionary.page.intro}</p>
          <Link href={target("/explore")} className="editorial-link">{locale === "en" ? "Explore the publication" : dictionary.nav["/explore"]}</Link>
        </div>
        <nav aria-label={locale === "en" ? "Footer navigation" : dictionary.ui.index} className="footer-directory">
          {groups.map(({title,label,links}) => <div key={title}><h2 className="mono">{locale === "en" ? title : dictionary.nav[label]}</h2>
            <ul>{links.map((href) => <li key={href}><Link href={target(href)}>{dictionary.nav[href]}</Link></li>)}</ul>
          </div>)}
        </nav>
      </div>
      <div className="footer-bottom"><small>© {new Intl.NumberFormat(htmlLanguage(locale),{useGrouping:false}).format(new Date().getUTCFullYear())} <span lang="en">Under the Surface</span></small><LanguageSwitch showPreference /></div>
    </div>
  </footer>;
}
