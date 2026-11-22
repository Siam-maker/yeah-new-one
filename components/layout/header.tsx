"use client";

import { ArrowUpRight, PanelsTopLeft, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { topics } from "@/lib/content/publication";
import { learningTracks } from "@/lib/content/learning-index";
import { direction, htmlLanguage, localizedPath, splitLocale } from "@/lib/i18n/routing";
import { messages } from "@/lib/i18n/messages";
import { SearchOverlay } from "@/components/search/search-panel";
import { ReadingModeButton } from "@/components/publishing/reading-preferences";
import { Brand } from "./brand";
import { LanguageSwitch } from "./language-switch";

const channels = [["/explore","/learn","/topics","/stories"],["/lab","/atlas","/journeys"]] as const;
const index = ["/explore","/learn","/topics","/stories","/field-notes","/lab","/world","/atlas","/journeys"] as const;
const references = ["/connections","/demographics","/glossary","/library","/learn/teaching","/about"] as const;

export function Header() {
  const pathname = usePathname();
  const {locale,path} = splitLocale(pathname);
  const dictionary = messages[locale];
  const [menu,setMenu] = useState<string | null>(null);
  const open = menu === pathname;
  const close = () => setMenu(null);
  const target = (href: string) => localizedPath(href,locale);
  const current = (href: string) => path === href ? "page" : path.startsWith(href + "/") ? "location" : undefined;

  return <header className="site-header edition-header" lang={htmlLanguage(locale)} dir={direction(locale)} onKeyDown={(event) => {
    if (event.key === "Escape" && open) {
      close();
      document.getElementById("menu-toggle")?.focus();
    }
  }}>
    <div className="shell edition-header-row">
      <Brand href={target("/")} />
      <nav className="edition-navigation" aria-label={locale === "en" ? "Main navigation" : dictionary.ui.index}>
        {channels.map((links,group) => <div className="nav-channel" key={group}>
          {links.map((href) => <Link key={href} href={target(href)} prefetch={false} aria-current={current(href)} onClick={close}>{dictionary.nav[href]}</Link>)}
        </div>)}
      </nav>
      <div className="edition-header-actions">
        <SearchOverlay locale={locale} />
        <LanguageSwitch />
        <button className="edition-menu-toggle" id="menu-toggle" type="button" aria-expanded={open} aria-controls="edition-menu"
          aria-label={open ? dictionary.ui.close : dictionary.ui.open} onClick={() => setMenu(open ? null : pathname)}>
          {open ? <X size={20} aria-hidden="true" /> : <PanelsTopLeft size={19} aria-hidden="true" />}<span>{dictionary.ui.index}</span>
        </button>
      </div>
    </div>
    <div id="edition-menu" className="edition-menu" hidden={!open}>
      <div className="shell edition-menu-inner">
        <nav aria-label={locale === "en" ? "Publication index" : dictionary.ui.index}><p className="mono section-label">{locale === "en" ? "The publication" : dictionary.ui.index}</p>
          {index.map((href) => <Link key={href} href={target(href)} aria-current={current(href)} onClick={close}>{dictionary.nav[href]}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
        </nav>
        <nav aria-label={locale === "en" ? "Disciplines" : dictionary.nav["/topics"]}><p className="mono section-label">{locale === "en" ? "Disciplines" : dictionary.nav["/topics"]}</p>
          {locale === "en" ? topics.map((topic) => <Link key={topic.slug} href={`/topics/${topic.slug}`} onClick={close}>{topic.title}<ArrowUpRight size={16} aria-hidden="true" /></Link>)
            : learningTracks.map(({id}, i) => <Link key={id} href={target(`/learn/${id}`)} onClick={close}>{dictionary.subjects[i]}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
        </nav>
        <nav aria-label={locale === "en" ? "Reading tools" : dictionary.nav["/library"]}><p className="mono section-label">{locale === "en" ? "Reading tools" : dictionary.nav["/library"]}</p>
          {references.map((href) => <Link key={href} href={target(href)} aria-current={current(href)} onClick={close}>{dictionary.nav[href]}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
          {locale === "en" && <ReadingModeButton />}
        </nav>
      </div>
    </div>
  </header>;
}
