import type { Metadata } from "next";
import { SectionPreview } from "@/components/layout/section-preview";

export const metadata: Metadata = { title: "Topics" };

export default function TopicsPage() {
  return (
    <SectionPreview
      title="TOPICS"
      description="The topic library will connect field notes and stories across disciplines. Browse the opening subjects on the homepage."
      href="/#topics-title"
      linkText="Browse opening topics"
    />
  );
}
