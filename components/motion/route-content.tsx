"use client";

import { splitLocale } from "@/lib/i18n/routing";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function RouteContent({ children }: { children: ReactNode }) {
  const family = splitLocale(usePathname()).path.split("/")[1] || "home";
  return <div className="route-content" data-route={family}>{children}</div>;
}
