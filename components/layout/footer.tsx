import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { navigation } from "@/lib/content/publication";
import { Brand } from "./brand";

const groups = [
  { title: "Read", links: [...navigation.filter(({ href }) => ["/stories","/topics","/field-notes"].includes(href)), { label:"About",href:"/about" }] },
  { title: "Investigate", links: [
    ...navigation.filter(({ href }) => ["/lab","/atlas"].includes(href)),
    { label:"Demographics",href:"/demographics" }, { label:"Journeys",href:"/journeys" }, { label:"Connections",href:"/connections" },
  ] },
  { title: "Find", links: [
    { label:"Glossary",href:"/glossary" }, { label:"Search",href:"/search" }, { label:"Reading desk",href:"/library" },
  ] },
];

export function Footer() {
  return <footer className="site-footer publication-footer">
    <div className="shell">
      <div className="footer-main">
        <div className="footer-intro"><Brand /><p>An independent digital magazine about the worlds beneath the one we see.</p>
          <Link href="/explore" className="editorial-link">Explore the publication <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
        <nav aria-label="Footer navigation" className="footer-directory">
          {groups.map(({ title, links }) => <div key={title}><h2 className="mono">{title}</h2>
            <ul>{links.map(({ label,href }) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
          </div>)}
        </nav>
      </div>
      <div className="footer-bottom"><small>© {new Date().getFullYear()} Under the Surface</small></div>
    </div>
  </footer>;
}
