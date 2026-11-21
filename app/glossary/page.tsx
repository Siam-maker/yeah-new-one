import type { Metadata } from "next";
import { Masthead } from "@/components/editorial/ui";
import { Glossary } from "@/components/search/glossary";

export const metadata: Metadata = { title: "Glossary", description: "An alphabetical glossary of terms from the journal, labs, and Atlas." };

export default function GlossaryPage() {
  return <div className="shell">
    <Masthead title="Scientific glossary" category="Reference" description="Find plain-language definitions, related concepts, and the stories that put them to work." />
    <div className="layout-flow"><Glossary /></div>
  </div>;
}
