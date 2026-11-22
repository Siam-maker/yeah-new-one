export const languages = {
  en:"English", bn:"বাংলা", es:"Español", fr:"Français", de:"Deutsch", ar:"العربية",
  hi:"हिन्दी", "zh-hans":"简体中文", ja:"日本語", pt:"Português",
} as const;

export type Locale = keyof typeof languages;
export const locales = Object.keys(languages) as Locale[];
export const htmlLanguage = (locale: Locale) => locale === "zh-hans" ? "zh-Hans" : locale;
export const direction = (locale: Locale) => locale === "ar" ? "rtl" : "ltr";

export function isLocale(value: string): value is Locale {
  return Object.hasOwn(languages,value);
}

export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const first = pathname.split("/")[1];
  if (!first || !isLocale(first)) return { locale:"en",path:pathname };
  return { locale:first,path:pathname.slice(first.length+1) || "/" };
}

export function localizedPath(path: string, locale: Locale) {
  if (locale === "en") return path;
  return `/${locale}${path === "/" ? "" : path}`;
}

export function languageAlternates(path: string, locale: Locale) {
  return {
    canonical:localizedPath(path,locale),
    languages:{ ...Object.fromEntries(locales.map((code) => [htmlLanguage(code),localizedPath(path,code)])), "x-default":path },
  };
}
