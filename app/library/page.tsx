import type { Metadata } from "next";
import { articles } from "@/lib/content/articles";
import { Masthead, TextLink } from "@/components/editorial/ui";
import { ReadingLibrary, ReadingModeButton, ReadingControls } from "@/components/publishing/reading-preferences";

export const metadata: Metadata = { title: "Your reading desk", description: "Saved stories, reading preferences, and recent explorations." };

export default function LibraryPage() {
  return <div className="shell"><Masthead title="Your reading desk" description="Bookmarks and recent explorations are stored on this device." />
    <div className="layout-flow"><div className="reading-shelf-tools"><ReadingModeButton /><ReadingControls /><TextLink href="/journeys">Return to your expeditions</TextLink></div><div className="reading-library"><ReadingLibrary stories={articles.map(({ slug, title }) => ({ slug, title, href: `/stories/${slug}` }))} /></div></div>
  </div>;
}
