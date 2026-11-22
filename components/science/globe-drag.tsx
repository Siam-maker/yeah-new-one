"use client";

import { useRef, type ReactNode } from "react";

export function GlobeDrag({ children, enabled, rotate }: {
  children: ReactNode; enabled: boolean; rotate: (degrees: number) => void;
}) {
  const gesture = useRef<{ id: number; x: number; y: number; rotating: boolean } | null>(null);

  function finish(pointerId: number) {
    if (gesture.current?.id === pointerId) gesture.current = null;
  }

  return <div className={enabled ? "atlas-drag" : undefined}
    onPointerDown={(event) => {
      if (!enabled || !event.isPrimary || event.button !== 0) return;
      gesture.current = { id:event.pointerId, x:event.clientX, y:event.clientY, rotating:false };
    }}
    onPointerMove={(event) => {
      const motion = gesture.current;
      if (!enabled || !motion || motion.id !== event.pointerId) return;
      const dx = event.clientX - motion.x;
      if (!motion.rotating) {
        const dy = event.clientY - motion.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 7) return;
        if (Math.abs(dy) >= Math.abs(dx)) { finish(event.pointerId); return; }
        event.currentTarget.setPointerCapture(event.pointerId);
        motion.rotating = true;
      }

      motion.x = event.clientX;
      rotate(dx * .32);
    }}
    onPointerLeave={(event) => { if (!gesture.current?.rotating) finish(event.pointerId); }}
    onPointerUp={(event) => finish(event.pointerId)}
    onPointerCancel={(event) => finish(event.pointerId)}
    onLostPointerCapture={(event) => {
      if (event.target === event.currentTarget) finish(event.pointerId);
    }}
  >{children}</div>;
}
