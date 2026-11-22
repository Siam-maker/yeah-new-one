import type { Metadata } from "next";
import { Masthead, ReferenceList, TextLink } from "@/components/editorial/ui";

export const metadata: Metadata = { title: "About", description: "The editorial purpose, evidence standards, and accessibility of Under the Surface." };

export default function AboutPage() {
  return <div className="shell">
    <Masthead title="About the publication" category="Under the Surface" description="An independent digital magazine about what’s hidden in plain sight, and how we come to know it." />
    <div className="layout-flow">
      <div className="editorial-manifesto editorial-paper">
        <h2 className="subhead">Follow the evidence.</h2>
        <p>We collect stories, maps and experiments around the same question: how do we know what lies beyond direct observation?</p>
        <TextLink href="/journeys">Take a guided expedition</TextLink>
      </div>
      <div className="two-panel editorial-charter">
        <section className="pane"><h2 className="subhead">What we cover</h2><p className="editorial-text">Issue 001 follows familiar things into unfamiliar conditions: life on the far side of daylight, the landscapes recorded in rock, air trapped in ice, and light travelling across space. Each story starts from a concrete observation and traces the evidence outward.</p><div className="mt-4"><TextLink href="/stories">Read the journal</TextLink></div></section>
        <section className="pane"><h2 className="subhead">Evidence & illustration</h2><p className="editorial-text">Articles cite scientific agencies and published research. Editorial illustrations depict processes without serving as empirical observations. Lab scenes are simplified teaching models. Mapped data retain their original attribution and approximate geographic precision.</p><div className="mt-4"><TextLink href="/atlas">See Atlas data credits</TextLink></div></section>
      </div>
      <div className="two-panel">
        <section><h2 className="subhead">Read at your pace</h2><p className="editorial-text">The publication supports keyboard navigation and the device’s reduced-motion preference. Lab controls remain available alongside illustrated fallbacks. Article bookmarks are saved on your device.</p><div className="mt-4"><TextLink href="/glossary">Browse the glossary</TextLink></div></section>
        <section><h2 className="subhead">Start with the sources</h2><ReferenceList keys={["plates", "time", "iceData", "webb", "pressure"]} /></section>
      </div>
      <TextLink href="/connections">See how the publication links to its sources</TextLink>
    </div>
  </div>;
}
