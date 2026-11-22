"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function RouteContent({ children }: { children: ReactNode }) {
  const family = usePathname().split("/")[1] || "home";
  return <div className="route-content" data-route={family}>{children}</div>;
}
