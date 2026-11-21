import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function createScrollMotion(scope: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  return gsap.matchMedia(scope);
}
