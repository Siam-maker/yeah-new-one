import Link from "next/link";

export function BrandMark() {
  return <svg className="brand-mark" width="33" height="33" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M5 30 14 12l8 4 6-7 7 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m6 29 8-4 7 1 7-5 6 8M8 33l8-4 6 1 7-4 3 5M14 35l5-3 5 1 5-3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

export function Brand() {
  return <Link className="brand" href="/" aria-label="Under the Surface home">
    <BrandMark /><span>Under the <em>Surface</em></span>
  </Link>;
}
