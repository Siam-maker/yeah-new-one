import gsap from "gsap";

const glyphs = "0123456789/·";

export function scrambleSignal(element: HTMLElement, duration = .46) {
  const text = element.textContent ?? "";
  const step = { amount: 0 };
  const reset = () => { element.textContent = text; };
  const animation = gsap.to(step, {
    amount: 1, duration, ease: "none",
    onUpdate: () => {
      const frame = Math.floor(step.amount * 22);
      const resolved = Math.floor(step.amount * text.length);
      element.textContent = Array.from(text, (letter, index) => {
        if (index < resolved || letter.trim() === "") return letter;
        return glyphs[(frame * 7 + index * 3) % glyphs.length];
      }).join("");
    },
    onComplete: reset,
  });
  return () => { animation.kill(); reset(); };
}
