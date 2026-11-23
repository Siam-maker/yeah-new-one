import type { ReactNode } from "react";
import { RouteContent } from "@/components/motion/route-content";

export default function Template({ children }: { children: ReactNode }) {
  return <RouteContent>{children}</RouteContent>;
}
