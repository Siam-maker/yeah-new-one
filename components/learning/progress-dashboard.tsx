import Link from "next/link";
import { learningTracks } from "@/lib/content/learning-index";
import { courses } from "@/lib/content/learning-content";
import { bengaliCourses } from "@/lib/i18n/bengali-courses";
import { localizedPath } from "@/lib/i18n/routing";
import { Masthead, TextLink } from "@/components/editorial/ui";
import { TrackProgress } from "./progress";

export function ProgressDashboard({locale="en"}:{locale?:"en"|"bn"}) {
  const bn = locale === "bn";
  const title=bn ? "পাঠের অগ্রগতি" : "Learning progress";
  const center=bn ? "পাঠকেন্দ্র" : "Learning Center";
  const learn=localizedPath("/learn",locale);
  return <div className="shell learning-page">
    <Masthead locale={locale} title={title} description={bn ? "এই যন্ত্রে সম্পন্ন পাঠ দেখুন এবং যেখান থেকে থেমেছেন সেখান থেকে শুরু করুন।" : "See the lessons you’ve marked complete on this device and pick up where you left off."} crumbs={[{label:center,href:learn},{label:title}]} />
    <div className="progress-dashboard">{learningTracks.map(({id,title})=><section className="pane" key={id}>
      <h2 className="subhead"><Link href={localizedPath(`/learn/${id}`,locale)}>{bn ? bengaliCourses[id].title : title}</Link></h2>
      <TrackProgress locale={locale} track={id} lessons={courses[id].sections.map(({id:lesson})=>lesson)} />
      <TextLink href={localizedPath(`/learn/${id}`,locale)}>{bn ? "পাঠক্রম খুলুন" : "Open course"}</TextLink>
    </section>)}</div>
  </div>;
}
