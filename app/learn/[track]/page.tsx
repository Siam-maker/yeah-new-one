import { languageAlternates } from "@/lib/i18n/routing";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExhibitImage } from "@/components/editorial/exhibit-image";
import { Breadcrumbs, ReferenceList, TextLink } from "@/components/editorial/ui";
import { KnowledgeCheck, LessonCompletion, TrackProgress } from "@/components/learning/progress";
import { courseNotes,courses } from "@/lib/content/learning-content";
import { learningTracks, levels } from "@/lib/content/learning-index";

type Props = { params: Promise<{track: string}> };
export function generateStaticParams() { return learningTracks.map(({id}) => ({track:id})); }
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const { track:id } = await params;
  const track = learningTracks.find((item) => item.id === id);
  return track ? {title:track.title, description:track.deck, alternates:languageAlternates(`/learn/${track.id}`,"en")} : {};
}

export default async function CoursePage({params}: Props) {
  const {track:id} = await params;
  const track = learningTracks.find((item) => item.id === id);
  if (!track) notFound();
  const course = courses[track.id];
  const notes = courseNotes[track.id];
  const next = learningTracks[(learningTracks.indexOf(track)+1) % learningTracks.length];
  return <div className="shell learning-page course-page">
    <header className="learning-masthead">
      <div><Breadcrumbs items={[{label:"Learning Center",href:"/learn"},{label:track.title}]} />
        <p className="mono section-label">{track.subject} · {track.level}</p>
        <h1>{track.title}</h1><p className="standfirst">{track.deck}</p><p>{course.question}</p>
      </div>
      <div className="learning-cover"><ExhibitImage src={track.image} alt="" fill sizes="(max-width:800px) 92vw, 42vw" /></div>
    </header>
    <div className="course-layout">
      <nav className="course-contents" aria-label="Course outline">
        <h2>In this course</h2>
        <TrackProgress track={track.id} lessons={course.sections.map(({id}) => id)} />
        <ol>{course.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol>
        <a href="#investigate">Readings and experiments</a><br /><a href="#knowledge-check-heading">Knowledge check</a>
      </nav>
      <article className="course-body">
        {course.sections.map((section) => <section id={section.id} className="course-lesson" key={section.id}>
          <h2 className="subhead">{section.title}</h2>
          <p>{section.text}</p>
          <aside><strong>Investigate</strong><p>{section.task}</p></aside>
          <details className="reference-fold"><summary>Sources for this lesson</summary><ReferenceList keys={section.sources} /></details>
          <LessonCompletion track={track.id} lesson={section.id} />
        </section>)}
        <section id="investigate" className="course-lesson">
          <h2 className="subhead">Readings and experiments</h2>
          {levels.map((level) => {
            const resources = course.resources.filter((entry) => entry.level === level);
            return resources.length > 0 && <section key={level} className="course-resource-block"><h3>{level}</h3>
              <ul>{resources.map(({href,title,task}) => <li key={href}>{href.startsWith("/") ? <Link href={href}>{title}</Link> : <a href={href}>{title}</a>}<p>{task}</p></li>)}</ul>
            </section>;
          })}
        </section>
        <section className="course-key-points">
          <h2 className="subhead">Key takeaway</h2><p>{notes.key}</p>
          <details className="reference-fold"><summary>{notes.question}</summary><p>{notes.answer}</p></details>
        </section>
        <KnowledgeCheck questions={course.quiz} />
        <div className="pill-row course-next"><TextLink href={`/topics/${track.topic}`}>Related discipline guide</TextLink>
          <TextLink href={`/learn/${next.id}`}>{next.title}</TextLink><TextLink href="/learn">All courses</TextLink></div>
      </article>
    </div>
  </div>;
}
