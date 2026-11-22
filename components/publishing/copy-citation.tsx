"use client";
import { useState } from "react";

export function CopyCitation({ citation }: { citation: string }) {
  const [message,setMessage] = useState("");
  const [selectable,setSelectable] = useState(false);
  return <div>
    <button type="button" className="ghost-button" onClick={async () => {
      try { await navigator.clipboard.writeText(citation);setMessage("Citation copied."); }
      catch { setSelectable(true);setMessage("Select the citation to copy it."); }
    }}>Copy citation</button>
    <p role="status">{message}</p>
    {selectable && <label>Citation<textarea className="control-field" readOnly value={citation} onFocus={(event)=>event.target.select()} /></label>}
  </div>;
}
