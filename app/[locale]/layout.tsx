import { notFound } from "next/navigation";
import "@fontsource-variable/noto-sans-arabic";
import "@fontsource-variable/noto-sans-bengali";
import "@fontsource-variable/noto-sans-devanagari";
import "@fontsource-variable/noto-sans-sc";
import "@fontsource-variable/noto-sans-jp";
import { isLocale } from "@/lib/i18n/routing";
import { SiteDocument, siteMetadata } from "../site-document";

export const metadata = siteMetadata;

export default async function LanguageLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SiteDocument locale={locale}>{children}</SiteDocument>;
}
