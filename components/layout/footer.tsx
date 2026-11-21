import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { navigation } from "@/lib/content/publication";
import { Brand } from "./brand";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-main">
          <div>
            <Brand />
            <p>An independent digital magazine about the worlds beneath the one we see.</p>
          </div>
          <Link href="/explore" className="footer-cta">Go deeper <ArrowUpRight aria-hidden="true" /></Link>
        </div>
        <div className="footer-bottom">
          <small>© {new Date().getFullYear()} Under the Surface</small>
          <nav aria-label="Footer navigation">
            {[...navigation, { label: "Glossary", href: "/glossary" }, { label: "Search", href: "/search" }, { label: "About", href: "/about" }].map(({ label, href }) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
        </div>
      </div>
    </footer>
  );
}
