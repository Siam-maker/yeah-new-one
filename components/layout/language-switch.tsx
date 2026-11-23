"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2 } from "lucide-react";
import { useSyncExternalStore } from "react";
import { htmlLanguage, isLocale, languages, localizedPath, locales, splitLocale, type Locale } from "@/lib/i18n/routing";
import { messages } from "@/lib/i18n/messages";

const preference = "uts:language";
const eventName = "uts:language-change";
function observeLanguage(callback: () => void) {
  window.addEventListener("storage",callback);
  window.addEventListener(eventName,callback);
  return () => {
    window.removeEventListener("storage",callback);
    window.removeEventListener(eventName,callback);
  };
}
function savedLanguage() {
  try {
    const stored = localStorage.getItem(preference) ?? "en";
    return isLocale(stored) ? stored : "en";
  } catch { return "en" as const; }
}

export function LanguageSwitch({ showPreference = false }: { showPreference?: boolean }) {
  const {locale,path} = splitLocale(usePathname());
  const saved = useSyncExternalStore(observeLanguage,savedLanguage,() => "en" as const);
  return <div className="language-switch">
    <label><Globe2 size={17} aria-hidden="true" /><span className="sr-only">{messages[locale].ui.language}</span>
      <select aria-label={messages[locale].ui.language} value={locale} onChange={(event) => {
        const code = event.currentTarget.value;
        if (!isLocale(code)) return;
        try {
          localStorage.setItem(preference,code);
          window.dispatchEvent(new Event(eventName));
        } catch {}
        window.location.assign(localizedPath(path,code) + window.location.search + window.location.hash);
      }}>
        {locales.map((code) => <option key={code} value={code} lang={htmlLanguage(code)}>{languages[code]}</option>)}
      </select>
    </label>
    {showPreference && saved !== locale && <Link className="preferred-language" lang={htmlLanguage(saved)} href={localizedPath(path,saved)}>{languages[saved]}</Link>}
  </div>;
}

export function SkipLink({ locale }: { locale: Locale }) {
  return <a lang={htmlLanguage(locale)} href="#content" className="skip-link">{messages[locale].ui.skip}</a>;
}
