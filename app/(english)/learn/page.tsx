import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Presentation } from "lucide-react";
import { ExhibitImage } from "@/components/editorial/exhibit-image";
import { Breadcrumbs, TextLink } from "@/components/editorial/ui";
import { TrackProgress } from "@/components/learning/progress";
import { courses } from "@/lib/content/learning-content";
import { learningTracks } from "@/lib/content/learning-index";
import { languageAlternates } from "@/lib/i18n/routing";

export const metadata: Metadata = {
  title:"Learning Center",
  description:"Seven guided science courses with source-linked lessons, investigations, and knowledge checks.",
  alternates:languageAlternates("/learn","en"),
};

export default function LearningCenter() {
  return <div className="shell learning-page">
    <header className="learning-masthead">
      <div>
        <Breadcrumbs items={[{label:"Learning Center"}]} />
        <h1>Learn by <em>investigating.</em></h1>
        <p className="standfirst">Follow seven guided courses from the first question to the evidence. Read a lesson, use the data or run an experiment, then check what you understood.</p>
        <div className="pill-row"><TextLink href="#courses">Choose a course</TextLink><TextLink href="/learn/progress">Learning progress</TextLink><TextLink href="/learn/teaching">Teaching resources</TextLink></div>
      </div>
      <div className="learning-cover"><ExhibitImage src="/images/weathered-section.webp" alt="" fill sizes="(max-width:800px) 92vw, 42vw" /></div>
    </header>
    <section className="learning-index" id="courses" aria-labelledby="course-heading">
      <h2 className="subhead" id="course-heading">Science courses</h2>
      <ol>{learningTracks.map((track) => <li key={track.id}>
        <div className="course-index-media"><ExhibitImage src={track.image} alt="" fill sizes="(max-width:660px) 28vw, 220px" /></div>
        <div className="course-index-body">
          <p className="mono section-label">{track.subject} · {track.level}</p>
          <h3><Link href={`/learn/${track.id}`}>{track.title} <ArrowUpRight aria-hidden="true" size={21} /></Link></h3>
          <p>{track.deck}</p>
          <TrackProgress track={track.id} lessons={courses[track.id].sections.map(({id}) => id)} />
        </div>
      </li>)}</ol>
    </section>
    <div className="learning-audience">
      <Link href="/learn/teaching" className="pane"><Presentation aria-hidden="true" /><h2 className="subhead">Teach with the evidence</h2><p>Print three classroom investigations and use the suggested discussion prompts.</p></Link>
      <Link href="/glossary" className="pane"><BookOpen aria-hidden="true" /><h2 className="subhead">Look up a term</h2><p>Use the glossary to decode unfamiliar vocabulary as you read.</p></Link>
    </div>
  </div>;
}
