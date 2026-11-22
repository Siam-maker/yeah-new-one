import type { Metadata } from "next";
import Image from "next/image";
import { fieldNotes } from "@/lib/content/field-notes";
import { Masthead, ReferenceList, TextLink } from "@/components/editorial/ui";

export const metadata: Metadata = { title: "Field notes", description: "Observations on how scientists make and interpret measurements beneath the surface." };

export default function FieldNotes() {
  return <div className="shell">
    <Masthead title="Field notes" category="Methods & observations" description="Short investigations into what a measurement shows, what it leaves out, and how to read it." />
    <div className="layout-flow"><nav aria-label="Field note index" className="field-index">{fieldNotes.map((note)=><a href={`#${note.id}`} key={note.id}><span className="mono">{note.discipline}</span>{note.title}</a>)}</nav>{fieldNotes.map((note, index) => <article key={note.id} id={note.id} className="field-report">
      <div className="field-report-image"><Image src={note.image} alt="" fill sizes="(max-width: 760px) 95vw, 42vw" /></div>
      <div><p className="mono section-label">0{index + 1} / {note.discipline}</p><h2 className="subhead">{note.title}</h2>
        <p className="standfirst">{note.summary}</p>
        <ul className="space-y-3 pl-5 list-disc my-5">{note.observations.map((item) => <li key={item}>{item}</li>)}</ul>
        <TextLink href={note.link}>{note.linkTitle}</TextLink>
        <details className="reference-fold"><summary>Sources and methods</summary><ReferenceList keys={note.refs} /></details>
      </div>
    </article>)}</div>
  </div>;
}
