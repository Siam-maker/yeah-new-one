"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print article" }: { label?: string }) {
  return <button className="ghost-button print-button" type="button" onClick={() => window.print()}><Printer size={17} aria-hidden="true" />{label}</button>;
}
