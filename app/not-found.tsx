import { Masthead, TextLink } from "@/components/editorial/ui";

export default function NotFound() {
  return <div className="shell">
    <Masthead title="Page not found" description="This address doesn’t point to a page in the publication." />
    <section className="layout-flow flex gap-4" aria-label="Continue exploring"><TextLink href="/explore">Explore the index</TextLink><TextLink href="/search">Search the archive</TextLink></section>
  </div>;
}
