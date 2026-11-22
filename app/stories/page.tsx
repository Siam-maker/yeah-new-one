import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { JournalIndex } from "@/components/editorial/journal-index";
import { Masthead, Tile } from "@/components/editorial/ui";
import { articles, readingMinutes } from "@/lib/content/articles";
import { topics } from "@/lib/content/publication";

export const metadata: Metadata = { title: "Journal", description: "Long-form science stories about life, rock, ice, astronomy, and tectonics." };

export default function StoriesPage() {
  const cover = articles.find((story) => story.slug === "two-records-of-a-changing-ocean")!;
  const categories = topics.map((topic) => ({ label: topic.title, value: topic.slug }));
  const groups = articles.map((article) => ({ value: article.topic,
    card: <Tile title={article.title} image={article.image} href={`/stories/${article.slug}`}
      meta={`${topics.find(({ slug }) => slug === article.topic)?.title} · ${readingMinutes(article)} min read`} description={article.deck} />,
  }));
  return <div className="shell">
    <Masthead title="The journal" description="Long-form stories about what the surface hides and how scientists know it." category="Issue 001 / Features" />
    <div className="layout-flow">
      <article className="journal-cover">
        <div><p className="mono section-label">Cover story · {readingMinutes(cover)} min read</p><h2 className="subhead">{cover.title}</h2><p className="standfirst">{cover.deck}</p><Link className="editorial-link mt-4" href={`/stories/${cover.slug}`}>Read the cover story</Link></div>
        <div className="journal-cover-image"><Image src={cover.image} alt={cover.imageDescription} fill sizes="(max-width:760px) 90vw, 46vw" /></div>
      </article>
      <JournalIndex groups={groups} categories={categories} />
    </div>
  </div>;
}
