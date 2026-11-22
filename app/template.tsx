import type { ReactNode } from "react";
import { RouteEntrance } from "@/components/motion/route-entrance";

export default function Template({ children }: { children: ReactNode }) {
  return <RouteEntrance>{children}</RouteEntrance>;
}
