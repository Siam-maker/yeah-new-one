import type { Metadata } from "next";
import { JournalIndex } from "@/components/editorial/journal-index";
import { Masthead, Tile } from "@/components/editorial/ui";
import { articles, readingMinutes } from "@/lib/content/articles";
import { topics } from "@/lib/content/publication";

export const metadata: Metadata = { title: "Journal", description: "Long-form science stories about life, rock, ice, astronomy, and tectonics." };

export default function StoriesPage() {
  const categories = topics.map((topic) => ({ label: topic.title, value: topic.slug }));
  const groups = articles.map((article) => ({ value: article.topic,
    card: <Tile title={article.title} image={article.image} href={`/stories/${article.slug}`}
      meta={`${topics.find(({ slug }) => slug === article.topic)?.title} · ${readingMinutes(article)} min read`} description={article.deck} />,
  }));
  return <div className="shell">
    <Masthead title="The journal" description="Long-form stories about what the surface hides and how scientists know it." category="Issue 001 / Features" />
    <div className="layout-flow"><JournalIndex groups={groups} categories={categories} /></div>
  </div>;
}
