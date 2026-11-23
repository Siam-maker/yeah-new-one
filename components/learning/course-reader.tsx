import Link from "next/link";
import { ExhibitImage } from "@/components/editorial/exhibit-image";
import { Breadcrumbs, ReferenceList, TextLink } from "@/components/editorial/ui";
import { KnowledgeCheck, LessonCompletion, TrackProgress } from "@/components/learning/progress";
import { courseNotes,courses } from "@/lib/content/learning-content";
import { learningTracks, levels, type TrackId } from "@/lib/content/learning-index";

import { bengaliCourses } from "@/lib/i18n/bengali-courses";
import { localizedPath } from "@/lib/i18n/routing";

export function CourseReader({id,locale="en"}:{id:TrackId;locale?:"en"|"bn"}) {
  const track = learningTracks.find((item) => item.id === id)!;
  const original = courses[id];
  const translated = locale === "bn" ? bengaliCourses[id] : undefined;
  const bn = Boolean(translated);
  const labels = bn ? {
    center:"পাঠকেন্দ্র", outline:"পাঠসূচি", readings:"পড়া ও পরীক্ষা", check:"জ্ঞান যাচাই", investigate:"নিজে অনুসন্ধান করুন",
    sources:"এই পাঠের সূত্র", take:"মূল কথা", topic:"সম্পর্কিত বিষয়", all:"সব পাঠক্রম",
  } : {center:"Learning Center",outline:"Course outline",readings:"Readings and experiments",check:"Knowledge check",investigate:"Investigate",sources:"Sources for this lesson",take:"Key takeaway",topic:"Related discipline guide",all:"All courses"};
  const name = translated?.title ?? track.title;
  const note = courseNotes[track.id];
  const notes = translated?.notes ?? [note.key,note.question,note.answer];
  const course = translated ? {
    ...original, question:translated.question,
    sections:original.sections.map((section)=>{
      const localized = translated.lessons[section.id];
      return localized ? {...section,title:localized[0],text:localized[1],task:localized[2]} : {...section, language:"en"};
    }),
    resources:original.resources.map((resource,index)=>{
      const localized = translated.resources[index];
      return localized ? {...resource,title:localized[0],task:localized[1]} : {...resource,language:"en"};
    }),
    quiz:original.quiz.map((question,index)=>{
      const labels = translated.quiz[index];
      if (!labels) return {...question,language:"en" as const};
      const [prompt,answers,explanation] = labels;
      return {...question,prompt,answers,explanation};
    }),
  } : original;
  const target = (path:string) => localizedPath(path,locale);
  const levelLabel = (level:string) => bn ? ({Beginner:"প্রাথমিক",Intermediate:"মধ্যবর্তী",Advanced:"উন্নত"}[level] ?? level) : level;
  const next = learningTracks[(learningTracks.indexOf(track)+1) % learningTracks.length];
  return <div className="shell learning-page course-page">
    <header className="learning-masthead">
      <div><Breadcrumbs locale={locale} items={[{label:labels.center,href:target("/learn")},{label:name}]} />
        <p className="mono section-label">{bn ? "পাঠক্রম" : track.subject} · {levelLabel(track.level)}</p>
        <h1>{name}</h1>{!bn && <p className="standfirst">{track.deck}</p>}<p>{course.question}</p>
      </div>
      <div className="learning-cover"><ExhibitImage src={track.image} alt="" fill sizes="(max-width:800px) 92vw, 42vw" /></div>
    </header>
    <div className="course-layout">
      <nav className="course-contents" aria-label={labels.outline}>
        <h2>{bn ? labels.outline : "In this course"}</h2>
        <TrackProgress locale={locale} track={track.id} lessons={course.sections.map(({id}) => id)} />
        <ol>{course.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol>
        <a href="#investigate">{labels.readings}</a><br /><a href="#knowledge-check-heading">{labels.check}</a>
      </nav>
      <article className="course-body">
        {course.sections.map((section) => <section id={section.id} className="course-lesson" key={section.id} lang={"language" in section ? "en" : undefined}>
          <h2 className="subhead">{section.title}</h2>
          <p>{section.text}</p>
          <aside><strong>{labels.investigate}</strong><p>{section.task}</p></aside>
          <details className="reference-fold"><summary>{labels.sources}</summary><ReferenceList keys={section.sources} /></details>
          <LessonCompletion locale={locale} track={track.id} lesson={section.id} />
        </section>)}
        <section id="investigate" className="course-lesson">
          <h2 className="subhead">{labels.readings}</h2>
          {levels.map((level) => {
            const resources = course.resources.filter((entry) => entry.level === level);
            return resources.length > 0 && <section key={level} className="course-resource-block"><h3>{levelLabel(level)}</h3>
              <ul>{resources.map((resource) => { const {href,title,task} = resource; return <li key={href} lang={"language" in resource ? "en" : undefined}>{href.startsWith("/") ? <Link href={bn && /^\/(stories|topics|lab)\//.test(href) ? target(href) : href}>{title}</Link> : <a href={href}>{title}</a>}<p>{task}</p></li>; })}</ul>
            </section>;
          })}
        </section>
        <section className="course-key-points">
          <h2 className="subhead">{labels.take}</h2><p>{notes[0]}</p>
          <details className="reference-fold"><summary>{notes[1]}</summary><p>{notes[2]}</p></details>
        </section>
        <KnowledgeCheck locale={locale} questions={course.quiz} />
        <div className="pill-row course-next"><TextLink href={target(`/topics/${track.topic}`)}>{labels.topic}</TextLink>
          <TextLink href={target(`/learn/${next.id}`)}>{bn ? bengaliCourses[next.id].title : next.title}</TextLink><TextLink href={target("/learn")}>{labels.all}</TextLink>{bn && <Link className="editorial-link" href={`/learn/${id}`} hrefLang="en">মূল ইংরেজি সংস্করণ খুলুন</Link>}</div>
      </article>
    </div>
  </div>;
}
