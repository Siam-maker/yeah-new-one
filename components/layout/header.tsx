"use client";

import { ArrowUpRight, PanelsTopLeft, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation, topics } from "@/lib/content/publication";
import { SearchOverlay } from "@/components/search/search-panel";
import { ReadingModeButton } from "@/components/publishing/reading-preferences";
import { Brand } from "./brand";

const journeys = { label: "Journeys", href: "/journeys" };
const primary = navigation.map((link) => link.href === "/field-notes" ? journeys : link);
const channels = [primary.slice(0,3),primary.slice(3)];
const references = [{ label: "Knowledge graph", href: "/connections" }, { label: "Demographics observatory", href: "/demographics" }, { label: "Scientific glossary", href: "/glossary" }, { label: "Your reading desk", href: "/library" }, { label: "About the publication", href: "/about" }];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const current = (href: string) => pathname === href ? "page" : pathname.startsWith(href + "/") ? "location" : undefined;

  return <header className="site-header edition-header" onKeyDown={(event) => {
    if (event.key === "Escape" && open) {
      close();
      document.getElementById("menu-toggle")?.focus();
    }
  }}>
    <div className="shell edition-header-row">
      <Brand />
      <nav className="edition-navigation" aria-label="Main navigation">{channels.map((links,index) => <div className="nav-channel" key={index}>
        {links.map(({ label, href }) => <Link key={href} href={href} prefetch={false} aria-current={current(href)} onClick={close}>{label}</Link>)}
      </div>)}</nav>
      <div className="edition-header-actions">
        <SearchOverlay />
        <button className="edition-menu-toggle" id="menu-toggle" type="button" aria-expanded={open} aria-controls="edition-menu"
          aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>
          {open ? <X size={20} aria-hidden="true" /> : <PanelsTopLeft size={19} aria-hidden="true" />}<span>Index</span>
        </button>
      </div>
    </div>
    <div id="edition-menu" className="edition-menu" hidden={!open}>
      <div className="shell edition-menu-inner">
        <nav aria-label="Publication index"><p className="mono section-label">The publication</p>
          {[...navigation, journeys].map(({ label, href }) => <Link key={href} href={href} aria-current={current(href)} onClick={close}>{label}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
        </nav>
        <nav aria-label="Disciplines"><p className="mono section-label">Disciplines</p>
          {topics.map((topic) => <Link key={topic.slug} href={`/topics/${topic.slug}`} onClick={close}>{topic.title}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
        </nav>
        <nav aria-label="Reading tools"><p className="mono section-label">Reading tools</p>
          {references.map(({ label, href }) => <Link key={href} href={href} aria-current={current(href)} onClick={close}>{label}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
          <ReadingModeButton />
        </nav>
      </div>
    </div>
  </header>;
}
