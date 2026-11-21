import type { Metadata } from "next";
import { SectionPreview } from "@/components/layout/section-preview";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <SectionPreview
      title="ABOUT"
      description="Under the Surface is an independent digital magazine about hidden worlds. Our first issue explores dark oceans, deep time, and changing landscapes."
      href="/#discoveries"
      linkText="Explore the first issue"
    />
  );
}
