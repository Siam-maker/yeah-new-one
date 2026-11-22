import { useMemo, useState } from "react";
import { ageLabels, decimal, integer, type Country, type PopulationRecord } from "@/lib/content/demographics";

const trendColors = ["#91bcc4", "#e0b488"];
const x = (index: number) => 56 + index * 5.33;
const y = (value: number, maximum: number) => 178 - (value / maximum) * 155;

export function PopulationTrend({ countries, year }: { countries: Country[]; year: number }) {
  const [inspectedYear, setInspectedYear] = useState<number>();
  const displayedYear = inspectedYear ?? year;
  const { max, lines } = useMemo(() => {
    const max = Math.max(1, ...countries.flatMap((country) => country.trend));
    const plot = (values: number[], start: number) => values.map((value, index) => `${x(index+start)},${y(value,max)}`).join(" ");
    return {
      max,
      lines: countries.map(({ trend }) => ({ estimates:plot(trend.slice(0,74),0), projections:plot(trend.slice(73),73) })),
    };
  }, [countries]);
  const scale = max >= 1e9 ? 1e9 : max >= 1e6 ? 1e6 : 1000;
  const unit = scale === 1e9 ? "billions" : scale === 1e6 ? "millions" : "thousands";
  return <figure className="chart-panel trend-panel">
    <p className="mono section-label">1950–2050 · {unit} of people</p>
    <h2>Population through time</h2>
    <div className="chart-keys">{countries.map((country,index) => <span key={country.id}><i style={{ background:trendColors[index] }} />{country.name}</span>)}<span>Dashed · medium projection</span></div>
    <svg viewBox="0 0 620 207" className="stat-chart" role="img"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const position = (event.clientX - bounds.left) / bounds.width * 620;
        setInspectedYear(Math.max(1950, Math.min(2050, 1950 + Math.round((position - x(0)) / 5.33))));
      }} onPointerLeave={() => setInspectedYear(undefined)} aria-label={`Population through time in ${unit} of people. Solid estimates through 2023 and dashed medium projections from 2024.`}>
      <rect x={x(74)} y="16" width={x(100)-x(74)} height="162" fill="#c8af7a" opacity=".11" />
      {[0, .25, .5, .75, 1].map((part) => <g key={part}>
        <path d={`M56 ${y(part*max,max)}H590`} className="chart-grid" />
        <text x="49" y={y(part*max,max)+4} textAnchor="end">{decimal.format(part*max/scale)}</text>
      </g>)}
      {[1950,1975,2000,2025,2050].map((tick) => <text key={tick} x={x(tick-1950)} y="199" textAnchor="middle">{tick}</text>)}
      <path d={`M${x(displayedYear-1950)} 16V178`} stroke="#eae0c6" strokeOpacity=".5" />
      {countries.map((country,index) => <g key={country.id} fill="none" stroke={trendColors[index]} strokeWidth="2.5">
        <polyline points={lines[index].estimates} />
        <polyline points={lines[index].projections} strokeDasharray="6 6" />
        <circle cx={x(displayedYear-1950)} cy={y(country.trend[displayedYear-1950],max)} r="5" fill={trendColors[index]}><title>{country.name}, {displayedYear}: {integer.format(country.trend[displayedYear-1950])} people</title></circle>
      </g>)}
    </svg>
    <label className="trend-inspection">Inspect trend year <strong className="mono">{displayedYear}</strong>
      <input type="range" min={1950} max={2050} value={displayedYear}
        aria-valuetext={`${displayedYear} • ${displayedYear > 2023 ? "medium projection" : "estimate"}`}
        onChange={(event) => setInspectedYear(event.currentTarget.valueAsNumber)} onBlur={() => setInspectedYear(undefined)} />
    </label>
    <figcaption>{displayedYear} · {countries.map((country) => `${country.name}: ${integer.format(country.trend[displayedYear-1950])}`).join(" · ")}. UN World Population Prospects 2024.</figcaption>
  </figure>;
}

export function PopulationPyramid({ country, record, year, maximum }: { country: Country; record: PopulationRecord; year: number; maximum: number }) {
  const ratio = (value:number) => value / record.population * 100;
  const width = (value:number) => ratio(value) / maximum * 104;
  return <figure className="chart-panel pyramid">
    <p className="mono section-label">{year} · share of total population</p>
    <h2>{country.name}</h2>
    <div className="chart-keys"><span><i style={{ background:"#91bcc4" }} />Male</span><span><i style={{ background:"#d9ab85" }} />Female</span></div>
    <svg viewBox="0 0 320 300" className="stat-chart" role="img" aria-label={`Age distribution in ${country.name}, ${year}. Male share left and female share right.`}>
      {[34,86,138,182,234,286].map((axis) => <path className="chart-grid" key={axis} d={`M${axis} 6V272`} />)}
      {record.ages.map(([male,female],i)=>{
        const y = 7+(20-i)*12.5;
        return <g key={i}>
          <rect className="pyramid-bar" x={138-width(male)} y={y} width={width(male)} height="9" fill="#91bcc4"><title>Age {ageLabels[i]}, male: {integer.format(male)} ({decimal.format(ratio(male))}%)</title></rect>
          <rect className="pyramid-bar" x="182" y={y} width={width(female)} height="9" fill="#d9ab85"><title>Age {ageLabels[i]}, female: {integer.format(female)} ({decimal.format(ratio(female))}%)</title></rect>
          <text x="160" y={y+8} textAnchor="middle">{ageLabels[i]}</text>
        </g>;
      })}
      <text x="34" y="287" textAnchor="middle">{maximum}%</text><text x="138" y="287" textAnchor="middle">0%</text>
      <text x="182" y="287" textAnchor="middle">0%</text><text x="286" y="287" textAnchor="middle">{maximum}%</text>
    </svg>
    <details className="reference-fold"><summary>Age distribution table</summary>
      <table className="atlas-table"><thead><tr><th>Age</th><th>Male</th><th>Female</th></tr></thead><tbody>
        {record.ages.map(([male,female],index) => <tr key={index}><th scope="row">{ageLabels[index]}</th><td>{integer.format(male)}</td><td>{integer.format(female)}</td></tr>)}
      </tbody></table>
    </details>
  </figure>;
}
