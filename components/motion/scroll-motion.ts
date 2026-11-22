import type gsap from "gsap";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import { allowMotion } from "./preferences";

type Engines = { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger; media: gsap.MatchMedia };

export function afterFirstScroll(scope: HTMLElement, configure: (engines: Engines) => void) {
  const preference = matchMedia(allowMotion);
  let disposed = false;
  let media: gsap.MatchMedia | undefined;

  function activate() {
    if (!preference.matches) return;
    window.removeEventListener("scroll", activate);
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: animation }, { ScrollTrigger: trigger }]) => {
      if (disposed) return;
      animation.registerPlugin(trigger);
      media = animation.matchMedia(scope);
      configure({ gsap: animation, ScrollTrigger: trigger, media });
    }).catch(() => { media?.revert(); });
  }

  window.addEventListener("scroll", activate, { passive:true });
  if (window.scrollY > 0) activate();
  return () => {
    disposed = true;
    window.removeEventListener("scroll", activate);
    media?.revert();
  };
}
