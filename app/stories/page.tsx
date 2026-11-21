import type { Metadata } from "next";
import { SectionPreview } from "@/components/layout/section-preview";

export const metadata: Metadata = { title: "Stories" };

export default function StoriesPage() {
  return (
    <SectionPreview
      title="STORIES"
      description="The journal will host longer features. Read the opening story briefs on the homepage."
      href="/#stories-title"
      linkText="Read the story briefs"
    />
  );
}
