import type { Metadata } from "next";
import { SectionPreview } from "@/components/layout/section-preview";

export const metadata: Metadata = { title: "Lab" };

export default function LabPage() {
  return (
    <SectionPreview
      title="LAB"
      description="The Lab is where we test ways to make invisible processes visible. The first experiment takes you below the ocean’s surface."
      href="/#depth"
      linkText="Try the depth lab"
    />
  );
}
