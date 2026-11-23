import type { Metadata } from "next";
import { ProgressDashboard } from "@/components/learning/progress-dashboard";
import { contentAlternates } from "@/lib/i18n/coverage";

export const metadata:Metadata={title:"Learning progress",alternates:contentAlternates("/learn/progress","en")};
export default function Page() { return <ProgressDashboard />; }
