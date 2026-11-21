import { Aperture } from "lucide-react";
import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Under the Surface home">
      <Aperture size={27} strokeWidth={1.6} aria-hidden="true" />
      <span>UNDER THE<br />SURFACE<span className="brand-dot">.</span></span>
    </Link>
  );
}
