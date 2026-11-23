import Link from "next/link";
import { ArticleContents, ArticleControls, ReadableArticle } from "@/components/editorial/article-controls";
import { InfraredAnnotations } from "@/components/editorial/infrared-annotations";
import { ExhibitImage } from "@/components/editorial/exhibit-image";
import { Breadcrumbs, Masthead, ReferenceList, TextLink, Tile } from "@/components/editorial/ui";
import { TrackProgress } from "@/components/learning/progress";
import { OfflineReading } from "@/components/publishing/offline-reading";
import { CitationExport } from "@/components/publishing/citation-export";
import { ReadingControls, ReadingLibrary, ReadingModeButton, RecordVisit } from "@/components/publishing/reading-preferences";
import { experiments } from "@/components/science/lab-experiments";
import { OceanLab } from "@/components/science/ocean-lab";
import { EmissionsPathways, IceArchive } from "@/components/science/climate-instruments";
import { CosmicWorld } from "@/components/science/cosmic-world";
import { articleSectionId,articles, type Article } from "@/lib/content/articles";
import { courses } from "@/lib/content/learning-content";
import { learningTracks } from "@/lib/content/learning-index";
import { labEvidence } from "@/lib/content/lab-evidence";
import { labs,termId,topics } from "@/lib/content/publication";
import { bengaliCourses } from "@/lib/i18n/bengali-courses";
import { bengaliLabs,bengaliTopics } from "@/lib/i18n/bengali-guides";
import { bengaliStories } from "@/lib/i18n/bengali-stories";
import { messages } from "@/lib/i18n/messages";

const dictionary = messages.bn;
const digit = new Intl.NumberFormat("bn");
const storyPath = (slug:string) => `${bengaliStories[slug] ? "/bn" : ""}/stories/${slug}`;
const subjects = [
  {href:"/bn/learn",title:"পাঠক্রমে শিখুন",deck:"প্রথম প্রশ্ন থেকে আলামত পর্যন্ত সাতটি নির্দেশিত পাঠক্রম।"},
  {href:"/bn/lab",title:"পরীক্ষা চালান",deck:"গভীরতা, কক্ষপথ, তাপমাত্রা ও আরও অনেক মাপ বদলে ফল দেখুন।"},
  {href:"/bn/stories",title:"বিজ্ঞানের নিবন্ধ পড়ুন",deck:"গভীর সাগর থেকে দূরের ছায়াপথ পর্যন্ত প্রমাণের গল্প।"},
  {href:"/bn/topics",title:"বিষয় বুঝে শুরু করুন",deck:"প্রধান ধারণা, সূত্র ও পরীক্ষা এক জায়গায়।"},
  {href:"/bn/world",title:"ত্রিমাত্রিক জগৎ দেখুন",deck:"সমুদ্র, পৃথিবীর ভেতর ও গ্রহের মডেল। মূল সরঞ্জাম ইংরেজিতে।"},
  {href:"/bn/atlas",title:"বাস্তব উপাত্তের মানচিত্র",deck:"জলবায়ু, ভূতত্ত্ব ও জনসংখ্যার স্তর। মূল সরঞ্জাম ইংরেজিতে।"},
];

function StoryTile({story}:{story:Article}) {
  const translated=bengaliStories[story.slug];
  return <Tile title={translated?.title ?? story.title} description={translated?.deck ?? story.deck} lang={translated ? "bn" : "en"}
    image={story.image} href={storyPath(story.slug)} meta={translated ? "নিবন্ধ" : "English article"} />;
}

export function BengaliHome({explore=false}:{explore?:boolean}) {
  return <div className="shell localized-page bengali-home">
    <header className="locale-feature">
      <div><p className="mono" lang="en">Under the Surface</p>
        <h1>{explore ? "বিজ্ঞানের প্রমাণ অনুসরণ করুন" : "পৃথিবী ও মহাবিশ্বকে জানুন"}</h1><p className="standfirst">{dictionary.page.intro}</p>
        <div className="pill-row"><Link href={explore ? "#pathways" : "/bn/explore"} className="button button-accent">{dictionary.nav["/explore"]}</Link><Link href="/bn/lab" className="ghost-button">পরীক্ষাগারে যান</Link></div>
      </div>
      <div className="locale-plate"><ExhibitImage src="/images/basalt-inlet.webp" fill alt="" preload fetchPriority="high" sizes="(max-width:760px) 92vw, 45vw" /></div>
    </header>
    <section className="layout-flow" id="pathways"><h2 className="subhead">কোথা থেকে শুরু করবেন?</h2><div className="progress-dashboard">
      {subjects.map(({href,title,deck})=><Link className="pane" key={href} href={href}><h3>{title}</h3><p>{deck}</p></Link>)}
    </div></section>
    <section className="layout-flow" id="discoveries"><h2 className="subhead">বাছাই করা আবিষ্কার</h2><div className="editorial-tiles">
      {articles.filter(({slug})=>["life-below-the-light","the-memory-of-rock","the-light-that-took-its-time"].includes(slug)).map((story)=><StoryTile key={story.slug} story={story} />)}
    </div><TextLink href="/bn/stories">সব নিবন্ধ দেখুন</TextLink></section>
    <section className="locale-lessons" id="introduction"><div><h2 className="subhead">{dictionary.page.orientation}</h2><p>{dictionary.page.method}</p></div>
      <div><h2 className="subhead">{dictionary.page.courses}</h2><ul>{learningTracks.map(({id})=><li key={id}><TextLink href={`/bn/learn/${id}`}>{bengaliCourses[id].title}</TextLink></li>)}</ul></div>
    </section>
  </div>;
}

export function BengaliLearning() {
  return <div className="shell learning-page"><header className="learning-masthead"><div><Breadcrumbs locale="bn" items={[{label:"পাঠকেন্দ্র"}]} />
    <h1>অনুসন্ধান করে শিখুন</h1><p className="standfirst">{dictionary.page.resourceIntro}</p><TextLink href="/bn/learn/progress">পাঠের অগ্রগতি</TextLink><a className="editorial-link" href="/offline-reader.html">অফলাইনে পড়ুন</a></div>
    <div className="learning-cover"><ExhibitImage src="/images/weathered-section.webp" fill alt="" sizes="(max-width:800px) 92vw, 42vw" /></div></header>
    <section className="learning-index" id="courses" aria-label="বিজ্ঞান পাঠক্রম"><h2 className="subhead">সাতটি পাঠক্রম</h2><ol>{learningTracks.map(({id,image})=><li key={id}>
      <div className="course-index-media"><ExhibitImage src={image} alt="" fill sizes="(max-width:660px) 28vw, 220px" /></div><div className="course-index-body">
        <h3><Link href={`/bn/learn/${id}`}>{bengaliCourses[id].title}</Link></h3><p>{bengaliCourses[id].question}</p>
        <TrackProgress locale="bn" track={id} lessons={courses[id].sections.map(({id})=>id)} />
      </div></li>)}</ol></section>
  </div>;
}

export function BengaliJournal() {
  const translated = articles.filter(({slug})=>bengaliStories[slug]);
  const original = articles.filter(({slug})=>!bengaliStories[slug]);
  return <div className="shell"><Masthead locale="bn" title="বিজ্ঞানের জার্নাল" description="গবেষকেরা কী দেখেন, কীভাবে মাপেন এবং কোন সিদ্ধান্তে পৌঁছান তা নিয়ে নিবন্ধ।" crumbs={[{label:"জার্নাল"}]} />
    <div className="layout-flow"><section><h2 className="subhead">বাংলা নিবন্ধ</h2><div className="editorial-tiles">{translated.map((story)=><StoryTile key={story.slug} story={story} />)}</div></section>
      <section><h2 className="subhead">ইংরেজি নিবন্ধ</h2><div className="editorial-tiles">{original.map((story)=><StoryTile key={story.slug} story={story} />)}</div></section></div>
  </div>;
}

export function BengaliStory({slug}:{slug:string}) {
  const article = articles.find((item)=>item.slug===slug);
  const story = bengaliStories[slug];
  if (!article || !story) return null;
  const readings = articles.filter((item)=>item.topic===article.topic && item.slug!==article.slug && bengaliStories[item.slug]);
  const relatedLab = article.experiment ? bengaliLabs[article.experiment] : undefined;
  const sections = story.sections.map(([title],index)=>({id:articleSectionId(index),title}));
  return <div className="shell">
    <ReadableArticle><RecordVisit type="stories" title={story.title} href={storyPath(slug)} />
      <div className="story-spread"><header className="article-hero editorial-paper">
        <Breadcrumbs locale="bn" items={[{label:"জার্নাল",href:"/bn/stories"},{label:story.title}]} />
        <p className="mono section-label mt-5">{bengaliTopics[article.topic]?.title}</p><h1>{story.title}</h1><p className="standfirst">{story.deck}</p>
        <ArticleControls locale="bn" slug={slug} title={story.title} /><CitationExport locale="bn" slug={slug} title={story.title} /><OfflineReading locale="bn" slug={slug} />
        <div className="mt-3"><ReadingModeButton locale="bn" /><ReadingControls article locale="bn" /></div>
      </header><figure><div className="article-image"><ExhibitImage src={article.image} alt={story.caption} fill preload sizes="(max-width:800px) 92vw, 48vw" /></div><figcaption className="article-caption">{story.caption}</figcaption></figure></div>
      <div className="article-grid layout-flow"><ArticleContents locale="bn" slug={slug} title={story.title} sections={[...sections,{id:"sources",title:"সূত্র"}]} />
        <div className="article-body">{story.sections.map(([title,...paragraphs],index)=><section id={sections[index].id} key={title}><h2>{title}</h2>{paragraphs.map((part)=><p key={part}>{part}</p>)}{slug==="the-light-that-took-its-time" && index===1 && <InfraredAnnotations locale="bn" />}</section>)}
          {relatedLab && <aside className="pane mt-6"><h2 className="subhead">নিজে পরীক্ষা করুন</h2><p>{relatedLab[1]}</p><TextLink href={`/bn/lab/${article.experiment}`}>{relatedLab[0]}</TextLink></aside>}
          <section id="sources"><h2>সূত্র</h2><ReferenceList keys={article.sources} /><Link href={`/stories/${slug}`} hrefLang="en" className="editorial-link">{dictionary.ui.original}</Link></section>
        </div></div>
    </ReadableArticle>
    {readings.length > 0 && <section className="layout-flow related-stories"><h2 className="subhead">সম্পর্কিত নিবন্ধ</h2><div className="editorial-tiles">{readings.map((item)=><StoryTile key={item.slug} story={item} />)}</div></section>}
  </div>;
}

export function BengaliTopics() {
  return <div className="shell"><Masthead locale="bn" title="বিজ্ঞানের বিষয়সমূহ" description="বিষয়ের মূল ধারণা, প্রমাণ, পরিভাষা ও পরীক্ষার নির্দেশিকা।" crumbs={[{label:"বিষয়সমূহ"}]} />
    <ol className="field-index">{topics.map(({slug},index)=>{const guide=bengaliTopics[slug];return guide && <li key={slug}><Link href={`/bn/topics/${slug}`}>
      <span className="mono field-count">{digit.format(index+1)}</span><h3>{guide.title}</h3><span>{guide.intro}</span></Link></li>;})}</ol>
  </div>;
}

export function BengaliTopic({slug}:{slug:string}) {
  const topic=topics.find((item)=>item.slug===slug);
  const guide=bengaliTopics[slug];
  if (!guide || !topic) return null;
  return <div className="shell topic-dispatch" data-discipline={topic.theme}>
    <RecordVisit type="topics" title={guide.title} href={`/bn/topics/${slug}`} />
    <div className="topic-hero"><Masthead locale="bn" title={guide.title} description={guide.intro} category="বিষয়ের নির্দেশিকা" crumbs={[{label:"বিষয়সমূহ",href:"/bn/topics"},{label:guide.title}]} />
      <div className="topic-hero-image"><ExhibitImage src={topic.image} alt="" fill sizes="(max-width:760px) 92vw, 50vw" /></div></div>
    <div className="layout-flow"><div className="two-panel"><section><h2 className="subhead">বিজ্ঞানের ব্যাখ্যা</h2><p className="editorial-text">{guide.background}</p>
      <h2 className="subhead mt-8">যে আবিষ্কার ধারণা বদলেছে</h2><p className="editorial-text">{guide.discovery}</p></section>
      <section className="pane"><h2 className="subhead">প্রধান পরিভাষা</h2><dl className="concept-list">{guide.terms.map(([name,meaning],index)=><div key={name} id={`concept-${termId(topic.concepts[index].title)}`}><dt>{name}</dt><dd>{meaning}</dd></div>)}</dl></section></div>
      <section className="pane"><h2 className="subhead">মনে রাখুন</h2><ul className="list-disc space-y-3 ps-5">{guide.facts.map((fact)=><li key={fact}>{fact}</li>)}</ul>
      <h3 className="subhead mt-8">সম্পর্কিত পরীক্ষা</h3><div className="link-list">{topic.experiments.map((lab)=><TextLink key={lab} href={`/bn/lab/${lab}`}>{bengaliLabs[lab]?.[0]}</TextLink>)}</div></section>
      <section><h2 className="subhead">আরও পড়ুন</h2><div className="editorial-tiles">{articles.filter((item)=>item.topic===slug).map((story)=><StoryTile key={story.slug} story={story} />)}</div></section>
      <section><h2 className="subhead">সূত্র</h2><ReferenceList keys={topic.sources} /><TextLink href={`/topics/${slug}`}>{dictionary.ui.original}</TextLink></section>
    </div>
  </div>;
}

export function BengaliLabs() {
  return <div className="shell"><Masthead locale="bn" title="বিজ্ঞানের পরীক্ষাগার" description="একবারে একটি মান বদলে ফলের পার্থক্য দেখুন। ঢোকার আগে পরীক্ষার মাপ ও সীমা পড়ুন।" crumbs={[{label:"পরীক্ষাগার"}]} />
    <div className="editorial-tiles">{Object.entries(bengaliLabs).map(([slug,lab])=>lab && <Tile key={slug} lang="bn" href={`/bn/lab/${slug}`} title={lab[0]} description={lab[1]}
      meta="পরীক্ষার নির্দেশিকা" image={labs.find((item)=>item.slug===slug)?.image ?? (slug==="observatory" ? "/images/observatory.webp" : "/images/ice-margin.webp")} />)}</div>
  </div>;
}

export function BengaliLab({slug}:{slug:string}) {
  const guide=bengaliLabs[slug];
  if (!guide) return null;
  const experiment = labs.find((item)=>item.slug===slug);
  const evidence = experiment ? labEvidence[experiment.slug].sources : slug === "observatory" ? ["solar","lightSpeed"] as const : slug === "ice-archive" ? ["ice","iceData"] as const : ["carbon","climateSynthesis"] as const;
  const instrument=slug==="ocean-depth" ? <OceanLab locale="bn" /> : slug==="observatory" ? <CosmicWorld locale="bn" /> : slug==="climate-pathways" ? <EmissionsPathways locale="bn" /> : slug==="ice-archive" ? <IceArchive locale="bn" /> : null;
  const Existing = experiment ? experiments[experiment.slug] : undefined;
  return <div className="shell laboratory-page"><Masthead locale="bn" title={guide[0]} description={guide[1]} crumbs={[{label:"পরীক্ষাগার",href:"/bn/lab"},{label:guide[0]}]} />
    <div className="layout-flow"><section className="pane"><h2 className="subhead">কীভাবে পরীক্ষা করবেন</h2><p>{guide[2]}</p>
      {!instrument && <p>পরীক্ষার নিয়ন্ত্রণ ও ফল ইংরেজিতে দেখা যাবে।</p>}<Link className="editorial-link" href={`/lab/${slug}`} hrefLang="en">{dictionary.ui.original}</Link></section>
      {instrument ?? (Existing && <section lang="en" aria-label="Interactive experiment" className="grid gap-5"><Existing /></section>)}<section><h2 className="subhead">সূত্র ও পদ্ধতি</h2><ReferenceList keys={evidence} /></section>
    </div>
  </div>;
}

export function BengaliLibrary() {
  return <div className="shell"><Masthead locale="bn" title="আপনার পাঠের তালিকা" description="বুকমার্ক ও সাম্প্রতিক পাঠ এই যন্ত্রে সংরক্ষিত থাকে।" crumbs={[{label:"পাঠের তালিকা"}]} />
    <div className="layout-flow"><div className="reading-shelf-tools"><ReadingModeButton locale="bn" /><ReadingControls locale="bn" /><TextLink href="/bn/learn/progress">পাঠের অগ্রগতি</TextLink><a className="editorial-link" href="/offline-reader.html">অফলাইনে পড়ুন</a></div>
      <div className="reading-library"><ReadingLibrary locale="bn" stories={articles.map(({slug,title})=>({slug,title:bengaliStories[slug]?.title ?? title,href:storyPath(slug)}))} /></div></div>
  </div>;
}
