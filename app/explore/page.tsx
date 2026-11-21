import type { Metadata } from "next";
import { SectionPreview } from "@/components/layout/section-preview";

export const metadata: Metadata = { title: "Explore" };

export default function ExplorePage() {
  return (
    <SectionPreview
      title="EXPLORE"
      description="The discovery index is in development. Start with three field notes from the first issue."
      href="/#discoveries"
      linkText="See featured discoveries"
    />
  );
}
