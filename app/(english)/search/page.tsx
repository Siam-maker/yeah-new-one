import { languageAlternates } from "@/lib/i18n/routing";
import type { Metadata } from "next";
import { Masthead, TextLink } from "@/components/editorial/ui";
import { SearchPanel } from "@/components/search/search-panel";
import { countrySearchEntries, searchEntries } from "@/lib/content/search";

export const metadata: Metadata = { alternates:languageAlternates("/search","en"), title: "Search", description: "Search articles, topics, glossary definitions, and interactive labs." };

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.slice(0, 120) : "";
  return <div className="shell">
    <Masthead title="Search the archive" description="Find a term, a long-form story, or an interactive experiment." />
    <div className="layout-flow"><div className="reference-intro"><TextLink href="/explore">Browse by discipline</TextLink><TextLink href="/connections">Browse by connections</TextLink></div><SearchPanel key={query} entries={[...searchEntries, ...countrySearchEntries]} initialQuery={query} /></div>
  </div>;
}
