import { useSyncExternalStore } from "react";

const reducedMotion = "(prefers-reduced-motion: reduce)";
export const allowMotion = "(prefers-reduced-motion: no-preference)";
export const finePointer = "(hover: hover) and (pointer: fine) and (min-width: 701px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(reducedMotion);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(reducedMotion).matches;
}

export function useReducedMotionPreference() {
  return useSyncExternalStore(subscribe, getReducedMotion, () => true);
}
