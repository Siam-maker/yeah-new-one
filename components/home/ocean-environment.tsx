"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";

const habitats = ["sunlight", "twilight", "midnight", "abyssal"] as const;
const particles = Array.from({ length: 18 }, (_, index) => ({
  left: `${(index * 47 + 7) % 100}%`,
  top: `${(index * 31 + 17) % 100}%`,
  "--drift-size": `${1.5 + index % 4 * 0.85}px`,
  "--drift-delay": `${-(index % 6) * 1.4}s`,
}) as CSSProperties);

export function OceanEnvironment({ layer }: { layer: number }) {
  const environment = useRef<HTMLDivElement>(null);
  const visible = useInView(environment);

  return (
    <div className="ocean-environment" aria-hidden="true" ref={environment}
      data-zone={habitats[layer]} data-visible={visible ? "" : undefined}>
      {habitats.map((habitat) => <div key={habitat} className="ocean-light" data-habitat={habitat} />)}
      <div className="ocean-particles">
        {particles.map((style, index) => <span key={index} style={style} />)}
      </div>
    </div>
  );
}
