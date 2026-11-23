import { SiteDocument, siteMetadata } from "../site-document";

export const metadata = siteMetadata;

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <SiteDocument locale="en">{children}</SiteDocument>;
}
