import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ExhibitImage } from "@/components/editorial/exhibit-image";
import { SearchPanel } from "@/components/search/search-panel";
import { direction, htmlLanguage, isLocale, languageAlternates, localizedPath, locales, type Locale } from "@/lib/i18n/routing";
import { messages } from "@/lib/i18n/messages";
import { introductions } from "@/lib/i18n/introductions";
import { learningTracks } from "@/lib/content/learning-index";
import { articles } from "@/lib/content/articles";
import { labs, topics } from "@/lib/content/publication";
import countries from "@/public/data/country-directory.json";

type Query = Record<string,string | string[] | undefined>;
type Props = { params: Promise<{ locale:string; path?:string[] }>; searchParams:Promise<Query> };
const entryPaths = ["/","/explore","/learn","/search"];

function identify(path: string, locale: Locale) {
  const dictionary = messages[locale];
  if (path === "/") return { title:dictionary.page.headline, localized:true };
  if (path === "/lab/ice-archive") return { title:"Ice-core archive", localized:false };
  if (path === "/lab/climate-pathways") return { title:"Emissions pathways", localized:false };
  if (path === "/lab/observatory") return { title:"The cosmic observatory", localized:false };
  if (Object.hasOwn(dictionary.nav,path)) return { title:dictionary.nav[path as keyof typeof dictionary.nav], localized:entryPaths.includes(path) };
  const [, family, slug, extra] = path.split("/");
  if (extra || !slug) return;
  if (family === "learn") {
    const index = learningTracks.findIndex(({id}) => id === slug);
    if (index >= 0) return { title:dictionary.subjects[index], localized:true, track:index };
  }
  const entry = family === "stories" ? articles.find((item) => item.slug === slug)
    : family === "topics" ? topics.find((item) => item.slug === slug)
      : family === "lab" ? labs.find((item) => item.slug === slug) : undefined;
  if (entry) return { title:entry.title, localized:false };
  const country = family === "demographics" ? countries.find((item) => item.id.toLowerCase() === slug) : undefined;
  if (country) return { title:country.name, localized:false };
}

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").flatMap((locale) =>
    [...entryPaths,...learningTracks.map(({id}) => `/learn/${id}`)].map((path) => ({locale,path:path.split("/").filter(Boolean)})));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale,path:segments=[]} = await params;
  const path = "/" + segments.join("/");
  if (!isLocale(locale) || locale === "en") return {};
  const page = identify(path,locale);
  if (!page) return {};
  const description = page.track !== undefined ? introductions[locale][page.track] : messages[locale].page.intro;
  return page.localized ? {
    title:page.title, description, alternates:languageAlternates(path,locale),
    openGraph:{title:page.title,description,locale:htmlLanguage(locale),siteName:"Under the Surface"},
  } : {title:page.title,robots:{index:false,follow:true},alternates:{canonical:path}};
}

function queryString(query: Query) {
  const output = new URLSearchParams();
  for (const [key,value] of Object.entries(query)) {
    if (typeof value === "string") output.append(key,value);
    else for (const item of value ?? []) output.append(key,item);
  }
  const value = output.toString();
  return value ? `?${value}` : "";
}

export default async function LocalizedPage({params,searchParams}: Props) {
  const {locale,path:segments=[]} = await params;
  if (!isLocale(locale)) notFound();
  const path = "/" + segments.join("/");
  const page = identify(path,locale);
  if (!page) notFound();
  if (locale === "en") redirect(path + queryString(await searchParams));

  const dictionary = messages[locale];
  const lang = htmlLanguage(locale);
  const dir = direction(locale);
  const link = (route: string) => localizedPath(route,locale);
  if (!page.localized) {
    const href = path + queryString(await searchParams);
    return <article className="shell localized-page fallback-edition" lang={lang} dir={dir}>
      <h1 lang={page.title === dictionary.nav[path as keyof typeof dictionary.nav] ? lang : "en"}>{page.title}</h1>
      <p>{dictionary.ui.coverage}</p>
      <Link className="editorial-link" href={href} hrefLang="en">{dictionary.ui.original} <ArrowUpRight size={17} aria-hidden="true" /></Link>
    </article>;
  }

  if (path === "/search") {
    const query = (await searchParams).q;
    const { searchEntries,countrySearchEntries } = await import("@/lib/content/search");
    return <div className="shell localized-page" lang={lang} dir={dir}>
      <header className="locale-heading"><h1>{dictionary.ui.searchTitle}</h1><p>{dictionary.ui.coverage}</p></header>
      <SearchPanel locale={locale} initialQuery={typeof query === "string" ? query.slice(0,120) : ""} entries={[...searchEntries,...countrySearchEntries]} />
    </div>;
  }

  if (page.track !== undefined) {
    const track = learningTracks[page.track];
    return <article className="shell localized-page" lang={lang} dir={dir}>
      <div className="locale-feature">
        <div><Link href={link("/learn")} className="editorial-link">{dictionary.page.courses}</Link>
          <h1>{page.title}</h1><p className="standfirst">{introductions[locale][page.track]}</p>
          <h2 className="subhead">{dictionary.page.orientation}</h2><p>{dictionary.page.method}</p>
          <p className="locale-coverage">{dictionary.ui.coverage}</p>
          <Link href={path} hrefLang="en" className="editorial-link">{dictionary.ui.original} <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="locale-plate"><ExhibitImage src={track.image} fill alt="" sizes="(max-width:760px) 92vw, 45vw" /></div>
      </div>
    </article>;
  }

  return <div className="shell localized-page" lang={lang} dir={dir}>
    <header className="locale-feature">
      <div><p className="mono" lang="en">Under the Surface</p><h1>{page.title}</h1>
        <p className="standfirst">{path === "/learn" ? dictionary.page.resourceIntro : dictionary.page.intro}</p>
        <div className="pill-row"><Link href={path === "/learn" ? "#locale-courses" : link(path === "/" ? "/explore" : "/learn")} className="button button-accent">{path === "/" ? dictionary.nav["/explore"] : dictionary.nav["/learn"]}</Link>
          <Link href={link("/lab")} className="ghost-button">{dictionary.nav["/lab"]}</Link><Link href={link("/world")} className="ghost-button">{dictionary.nav["/world"]}</Link></div>
      </div>
      <div className="locale-plate"><ExhibitImage src="/images/basalt-inlet.webp" fill alt="" preload fetchPriority="high" sizes="(max-width:760px) 92vw, 45vw" /></div>
    </header>
    <section className="locale-lessons" id="locale-courses">
      <div><h2 className="subhead">{dictionary.page.orientation}</h2><p>{dictionary.page.method}</p><p className="locale-coverage">{dictionary.ui.coverage}</p></div>
      <div><h2 className="subhead">{dictionary.page.courses}</h2>
        <ul>{learningTracks.map(({id},index) => <li key={id}><Link href={link(`/learn/${id}`)}>{dictionary.subjects[index]} <ArrowUpRight size={17} aria-hidden="true" /></Link></li>)}</ul>
      </div>
    </section>
  </div>;
}
