import type { Metadata } from "next";
import { notFound } from "next/navigation";
import directory from "@/public/data/country-directory.json";
import { PopulationExplorer } from "@/components/demographics/explorer";
import { Masthead, TextLink } from "@/components/editorial/ui";

type Props = { params: Promise<{ code: string }>; searchParams: Promise<{ year?: string; compare?: string }> };
function find(code:string) { return directory.find((country) => country.id.toLowerCase() === code.toLowerCase()); }
export async function generateMetadata({ params }:Props):Promise<Metadata> {
  const country = find((await params).code);
  return country ? { title: `${country.name} population profile`, description: `Population history, age structure and urbanization in ${country.name}.` } : {};
}
export default async function CountryPage({ params, searchParams }:Props) {
  const country=find((await params).code);
  if (!country) notFound();
  const query = await searchParams;
  return <div className="shell population-page">
    <Masthead title={country.name} category={`Country profile / ${country.region}`} description="Inspect the age distribution, compare a second country, and follow population change from 1950 to 2050."
      crumbs={[{ label:"Atlas", href:"/atlas" },{ label:"Demographics", href:"/demographics" },{ label:country.name }]} />
    <PopulationExplorer profile initialCountry={country.id} initialYear={Number(query.year ?? 2023)} initialCompare={typeof query.compare === "string" ? query.compare.toUpperCase() : undefined} />
    <section className="population-method"><h2 className="subhead">Sources and context</h2>
      <p>UN World Population Prospects 2024 supplies population estimates and medium projections. Gapminder distributes the UN density series and World Bank urban indicators for available reporting years. <a href="/data/DEMOGRAPHICS.md">View the data preparation and limitations</a>.</p>
      <div className="mt-4"><TextLink href={`/demographics?country=${country.id}`}>View on the demographic map</TextLink></div>
    </section>
  </div>;
}
