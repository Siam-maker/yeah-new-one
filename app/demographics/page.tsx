import type { Metadata } from "next";
import { PopulationExplorer } from "@/components/demographics/explorer";
import { Breadcrumbs, TextLink } from "@/components/editorial/ui";
import { populationIndicators, type PopulationIndicator } from "@/lib/content/demographics";

export const metadata: Metadata = { title:"Demographics", description:"Compare population, age structure, density and urbanization with UN and World Bank data." };

type Query = { country?: string; compare?: string; year?: string; indicator?: string; view?:string };

export default async function DemographicsPage({ searchParams }: { searchParams:Promise<Query> }) {
  const query = await searchParams;
  const indicator = typeof query.indicator === "string" && Object.hasOwn(populationIndicators,query.indicator) ? query.indicator as PopulationIndicator : "population";
  return <div className="shell population-page">
    <header className="population-intro">
      <Breadcrumbs items={[{ label:"Atlas", href:"/atlas" }, { label:"Demographics" }]} />
      <div className="population-title-grid"><div><p className="mono section-label">Field Atlas / 1950–2050</p><h1>Population <em>Observatory</em></h1></div>
        <p>Compare countries and age structures across historical estimates and UN medium projections.</p></div>
    </header>
    <PopulationExplorer initialCountry={typeof query.country === "string" ? query.country.toUpperCase() : undefined} initialYear={Number(query.year ?? 2023)}
      initialIndicator={indicator} initialGlobe={query.view === "globe"} initialCompare={typeof query.compare === "string" ? query.compare.toUpperCase() : undefined} />
    <section className="population-method">
      <h2 className="subhead">About the data</h2>
      <p>Population, age and sex come from UN World Population Prospects 2024. Estimates extend through 2023. The displayed future years use the UN medium variant. Median age is derived from single-year age counts, with interpolation inside the median age interval. Five-year bands use common percentage axes.</p>
      <p>Gapminder’s density series cites UN World Population Prospects. Its urban indicators come from World Bank World Development Indicators. Urban definitions follow each reporting country. Country colors show national aggregates and boundaries are generalized. Small territories outside the Natural Earth 1:110m geometry are outside this map’s coverage.</p>
      <div className="link-list mt-5"><a href="https://population.un.org/wpp/">UN World Population Prospects 2024</a>
        <a href="https://github.com/open-numbers/ddf--gapminder--systema_globalis">Gapminder density series</a><a href="https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS">World Bank urban share</a>
        <a href="/data/DEMOGRAPHICS.md">Data preparation and limitations</a><TextLink href="/atlas">Return to the Field Atlas</TextLink></div>
    </section>
  </div>;
}
