"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/layout/brand";
import type { ReactNode } from "react";
import { useReducedMotionPreference } from "./preferences";

export function RouteEntrance({ children }: { children: ReactNode }) {
  const family = usePathname().split("/")[1] || "home";
  const reduced = useReducedMotionPreference();
  return <div className="route-content" data-route={family}>
    {!reduced && <motion.div className="route-entrance" aria-hidden="true"
      initial={{ opacity: .85, scaleX:.08 }} animate={{ opacity:0, scaleX:1 }}
      transition={{ duration:.52, ease:[.19,1,.22,1] }}><BrandMark /></motion.div>}
    {children}
  </div>;
}
