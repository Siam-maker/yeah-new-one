import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function SectionPreview({ title, description, href, linkText }: {
  title: string;
  description: string;
  href: string;
  linkText: string;
}) {
  return (
    <section className="section-preview shell" aria-labelledby="section-preview-title">
      <p className="section-label mono"><span className="status-dot" /> Section preview</p>
      <h1 id="section-preview-title" className="section-title">{title}<span className="title-dot">.</span></h1>
      <p>{description}</p>
      <Link href={href} className="button button-accent">{linkText} <ArrowUpRight size={17} aria-hidden="true" /></Link>
    </section>
  );
}
