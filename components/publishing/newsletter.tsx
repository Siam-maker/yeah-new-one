"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Newsletter({ enabled }: { enabled: boolean }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return <section className="newsletter-panel" aria-labelledby="newsletter-title">
    <div><p className="mono section-label">The field dispatch</p><h2 id="newsletter-title">A letter from below.</h2></div>
    {enabled ? <form onSubmit={async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const address = new FormData(form).get("email");
      setBusy(true);
      setMessage("");
      try {
        const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: address }) });
        const { message } = await response.json() as { message: string };
        setMessage(message);
        if (response.ok) form.reset();
      } catch { setMessage("The mailing service is unavailable. Try again later."); }
      finally { setBusy(false); }
    }}>
      <label className="control-label" htmlFor="dispatch-email">Email address</label>
      <div className="newsletter-input"><input className="control-field" type="email" id="dispatch-email" name="email" required maxLength={254} autoComplete="email" />
        <button className="button button-accent" type="submit" disabled={busy}>{busy ? "Sending…" : "Subscribe"}</button></div>
      <p role="status">{message}</p>
    </form> : <div><p>Email subscriptions are currently closed.</p><Link className="editorial-link" href="/field-notes">Read the field notes <ArrowUpRight size={18} aria-hidden="true" /></Link></div>}
  </section>;
}
