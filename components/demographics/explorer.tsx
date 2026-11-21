"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Link2 } from "lucide-react";
import { decimal, integer, populationIndicators, type Country, type PopulationIndicator, type PopulationRecord } from "@/lib/content/demographics";
import { usePopulation } from "./use-population";
import { PopulationMap } from "./population-map";
import { PopulationPyramid, PopulationTrend } from "./population-charts";

function Format({ value, unit }: { value: number | null | undefined; unit?: string }) {
  return value == null ? <>Unavailable</> : <>{decimal.format(value)}{unit ? ` ${unit}` : ""}</>;
}

function CountryLedger({ country, record, year }: { country: Country; record: PopulationRecord; year:number }) {
  return <section className="country-ledger">
    <div><p className="mono section-label">{country.region} · {year > 2023 ? "UN medium projection" : "UN estimate"}</p><h2>{country.name}</h2></div>
    <dl className="country-metrics">
      <div><dt>Total population</dt><dd>{integer.format(record.population)}</dd></div>
      <div><dt>Median age</dt><dd><Format value={record.median} unit="years" /></dd></div>
      <div><dt>Under 15</dt><dd><Format value={record.young} unit="%" /></dd></div>
      <div><dt>65 and older</dt><dd><Format value={record.older} unit="%" /></dd></div>
      <div><dt>Male population</dt><dd>{integer.format(record.male)}</dd></div>
      <div><dt>Female population</dt><dd>{integer.format(record.female)}</dd></div>
      <div><dt>Males per 100 females</dt><dd><Format value={record.female ? Math.round(record.male / record.female * 1000)/10 : null} /></dd></div>
      <div><dt>Annual population growth</dt><dd><Format value={record.growth} unit="%" /></dd></div>
      <div><dt>Population density</dt><dd><Format value={record.density} unit="people/km²" /></dd></div>
      <div><dt>Urban / rural</dt><dd>{record.urban == null ? "Unavailable" : `${decimal.format(record.urban)}% / ${decimal.format(100-record.urban)}%`}</dd></div>
      <div><dt>Annual urban growth</dt><dd><Format value={record.urbanGrowth} unit="%" /></dd></div>
    </dl>
    {record.urban != null && <div className="urban-split" aria-hidden="true"><span style={{ width:`${record.urban}%` }} /></div>}
    {country.cities.length > 0 && <details className="reference-fold"><summary>Major settlement estimates</summary>
      <ul className="settlement-list">{country.cities.map(([name,pop]) => <li key={name}><span>{name}</span><strong>{integer.format(pop)}</strong></li>)}</ul>
      <p>Natural Earth POP_MAX estimates, mixed dates and definitions. The settlement figures are independent of the selected population year.</p>
    </details>}
  </section>;
}

export function PopulationExplorer({ initialCountry = "JPN", initialIndicator = "population", initialYear = 2023,
  initialCompare = "", profile = false }: {
  initialCountry?: string; initialIndicator?: PopulationIndicator; initialYear?: number; initialCompare?: string; profile?: boolean;
}) {
  const { data, error, retry } = usePopulation();
  const [selected, setSelected] = useState(initialCountry);
  const [compare, setCompare] = useState(initialCompare);
  const [year, setYear] = useState(initialYear);
  const [indicator, setIndicator] = useState(initialIndicator);
  const [region, setRegion] = useState("");
  const [message, setMessage] = useState("");
  const [share, setShare] = useState("");
  if (error) return <div className="pane"><p>The population snapshot could not be loaded.</p><button className="ghost-button mt-3" onClick={retry} type="button">Retry loading</button></div>;
  if (!data) return <div className="pane" role="status">Reading the UN population snapshot…</div>;

  const currentYear = data.years.includes(year) ? year : 2023;
  const countries = data.countries;
  const areas = countries.filter((country) => !region || country.region === region);
  const country = countries.find((country) => selected === country.id) ?? countries[0];
  const second = countries.find((country) => compare === country.id);
  const comparison = second && second.id !== country.id ? [country, second] : [country];
  const record = country.records[currentYear];
  const maximum = Math.max(2, Math.ceil(Math.max(...comparison.flatMap((item) => {
    const entry = item.records[currentYear];
    return entry ? entry.ages.flat().map((value) => value/entry.population*100) : [0];
  }))));
  const ordered = areas.filter((area) => area.records[currentYear]?.[indicator] != null).sort((a,b)=>
    (b.records[currentYear][indicator] ?? 0) - (a.records[currentYear][indicator] ?? 0));
  const title = populationIndicators[indicator];
  const continentNames = Array.from(new Set(countries.map((area) => area.region))).sort();

  async function copyLink() {
    const url = new URL(window.location.href);
    url.search = new URLSearchParams({ country:country.id, year:String(currentYear), indicator, ...(compare ? { compare } : {}) }).toString();
    try { await navigator.clipboard.writeText(url.href); setMessage("Exploration link copied."); }
    catch { setShare(url.href); setMessage("Select the link to copy it."); }
  }

  return <div className="population-dashboard">
    <div className="population-tools">
      <label>Snapshot year<select className="control-field" value={currentYear} onChange={(event)=>setYear(Number(event.target.value))}>
        {data.years.map((date)=><option key={date} value={date}>{date}{date>2023 ? " · projection" : ""}</option>)}</select></label>
      {!profile && <label>Map indicator<select className="control-field" value={indicator} onChange={(event)=>setIndicator(event.target.value as PopulationIndicator)}>
        {(Object.keys(populationIndicators) as PopulationIndicator[]).map((key)=><option key={key} value={key}>{populationIndicators[key].name}</option>)}</select></label>}
      {!profile && <label>Region<select className="control-field" value={region} onChange={(event)=>{
        const value = event.target.value;
        setRegion(value);
        if(value && country.region!==value) setSelected(countries.find((item)=>item.region===value)?.id ?? country.id);
      }}><option value="">All regions</option>{continentNames.map((name)=><option key={name}>{name}</option>)}</select></label>}
      {!profile && <label>Country<select className="control-field" value={country.id} onChange={(event)=>setSelected(event.target.value)}>
        {areas.map((item)=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
      <label>Compare with<select className="control-field" value={second?.id===country.id ? "" : second?.id ?? ""} onChange={(event)=>setCompare(event.target.value)}>
        <option value="">Choose a country</option>{countries.filter((item)=>item.id!==country.id).map((item)=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    </div>
    <div className="population-status">
      <p className="mono">{currentYear > 2023 ? "Medium projection · UN WPP 2024" : "Historical estimates · UN WPP 2024"}</p>
      <button className="ghost-button" type="button" onClick={() => void copyLink()}><Link2 size={17} aria-hidden="true" /> Copy exploration link</button>
    </div>
    {message && <p role="status">{message}</p>}
    {share && <input className="control-field" aria-label="Exploration link" readOnly value={share} onFocus={(event)=>event.target.select()} />}
    {currentYear > 2023 && <p className="population-note">Medium projections use UN assumptions about fertility, mortality and migration. The separate density and urban series end with the historical snapshots.</p>}

    <div className={profile ? "population-chart-grid" : "population-top"}>
      {!profile && <PopulationMap countries={areas} year={currentYear} indicator={indicator} selected={country.id} onSelect={setSelected} />}
      {record ? <CountryLedger country={country} record={record} year={currentYear} /> : <p className="pane">This country has no record for the selected year.</p>}
      {profile && comparison[1]?.records[currentYear] && <CountryLedger country={comparison[1]} record={comparison[1].records[currentYear]} year={currentYear} />}
    </div>
    {!profile && <div className="population-status">
      <p className="population-note">United Nations world total for {currentYear} · {integer.format(data.world[currentYear-1950])} people.</p>
      <Link className="editorial-link" href={`/demographics/${country.id.toLowerCase()}?year=${currentYear}`}>Open {country.name} profile <ArrowUpRight size={18} aria-hidden="true" /></Link>
    </div>}
    <div className="population-chart-grid">
      {comparison.flatMap((item) => {
        const entry = item.records[currentYear];
        return entry ? [<PopulationPyramid key={item.id} country={item} record={entry} year={currentYear} maximum={maximum} />] : [];
      })}
    </div>
    <PopulationTrend countries={comparison} year={currentYear} />
    {!profile && <section className="chart-panel">
      <p className="mono section-label">{region || "All mapped regions"} · {currentYear}</p><h2>{title.name} ranking</h2>
      {ordered.length ? <table className="atlas-table population-ranking">
        <thead><tr><th scope="col">Rank</th><th scope="col">Country</th><th scope="col">{title.unit}</th></tr></thead>
        <tbody>{ordered.slice(0, 12).map((item,index)=><tr key={item.id}><td>{index+1}</td>
          <th scope="row"><button type="button" onClick={()=>setSelected(item.id)} aria-pressed={country.id===item.id}>{item.name}</button></th>
          <td>{decimal.format(item.records[currentYear][indicator] ?? 0)}</td></tr>)}</tbody>
      </table> : <p>No reported values match the region, indicator and year.</p>}
    </section>}
  </div>;
}
