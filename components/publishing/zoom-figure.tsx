"use client";

import Image from "next/image";
import { ExhibitImage } from "@/components/editorial/exhibit-image";
import { useId, useRef, useState } from "react";
import { Maximize2, Minus, Plus, X } from "lucide-react";

export function ZoomFigure({ source, caption }: { source: string; caption: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [scale, setScale] = useState(1);

  return <figure>
    <div className="article-image">
      <ExhibitImage src={source} alt={caption} fill preload sizes="(max-width:800px) 92vw, 48vw" />
      <button className="ghost-button figure-trigger" ref={trigger} type="button" onClick={() => { setScale(1); dialog.current?.showModal(); }}>
        <Maximize2 size={17} aria-hidden="true" /> Enlarge figure
      </button>
    </div>
    <figcaption className="article-caption">{caption}</figcaption>
    <dialog className="search-dialog figure-dialog" ref={dialog} aria-labelledby={titleId} onClose={() => trigger.current?.focus()}
      onKeyDown={(event) => {
        if (event.key !== "+" && event.key !== "-" && event.key !== "=") return;
        event.preventDefault();
        setScale((value) => Math.max(1,Math.min(3,value+(event.key === "-" ? -.5 : .5))));
      }}>
      <div className="dialog-heading"><h2 id={titleId}>Figure viewer</h2><button className="ghost-button" type="button" aria-label="Close figure" onClick={() => dialog.current?.close()}><X size={20} /></button></div>
      <div className="pill-row mb-3">
        <button className="ghost-button" type="button" aria-label="Zoom figure out" aria-disabled={scale === 1} onClick={() => setScale(Math.max(1, scale - .5))}><Minus size={17} /></button>
        <output aria-live="polite">{Math.round(scale * 100)}%</output>
        <button className="ghost-button" type="button" aria-label="Zoom figure in" aria-disabled={scale === 3} onClick={() => setScale(Math.min(3, scale + .5))}><Plus size={17} /></button>
        <button className="ghost-button" type="button" onClick={() => setScale(1)} disabled={scale === 1}>Reset view</button>
      </div>
      <div className="figure-viewport" tabIndex={0} aria-label="Scrollable figure"><div style={{ width: `${scale * 100}%` }}>
        <Image src={source} alt={caption} width={1400} height={930} sizes="85vw" />
      </div></div>
    </dialog>
  </figure>;
}
