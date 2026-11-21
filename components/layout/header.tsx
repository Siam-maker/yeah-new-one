"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation } from "@/lib/editorial";
import { Brand } from "./brand";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    }}>
      <div className="shell header-inner">
        <Brand />
        <button id="menu-toggle" className="menu-toggle" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav id="site-navigation" aria-label="Main navigation" className={open ? "site-navigation is-open" : "site-navigation"}>
          {navigation.map(({ label, href }) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>
          ))}
        </nav>
        <Link href="/explore" className="header-action" data-pointer="magnetic">
          <span className="button-content">Start exploring <ArrowUpRight size={15} aria-hidden="true" /></span>
        </Link>
      </div>
    </header>
  );
}
