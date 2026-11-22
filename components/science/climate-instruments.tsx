"use client";

import { useState } from "react";

const intervals = [10,20,30];
function pathway(rate: number, years: number) {
  return Array.from({ length:years }, (_,year) => 100 * (1-rate/100) ** year);
}

export function EmissionsPathways() {
  const [first,setFirst] = useState(2);
  const [second,setSecond] = useState(6);
  const [years,setYears] = useState(20);
  const values = [pathway(first,years),pathway(second,years)];
  const format = new Intl.NumberFormat("en",{maximumFractionDigits:1});
  return <section className="pane lab-controls pathway-instrument" aria-label="Emissions pathways model">
    <h2 className="subhead">Compare two assumptions</h2>
    <p>Both pathways begin at an index of 100. In each later year the previous value falls by the selected percentage. Add the annual amounts to compare their cumulative totals.</p>
    <div className="pathway-controls">
      <label>Pathway A annual decline <strong>{first}%</strong><input type="range" min="0" max="15" value={first} onChange={(event)=>setFirst(event.currentTarget.valueAsNumber)} /></label>
      <label>Pathway B annual decline <strong>{second}%</strong><input type="range" min="0" max="15" value={second} onChange={(event)=>setSecond(event.currentTarget.valueAsNumber)} /></label>
      <label>Years included<select className="control-field" value={years} onChange={(event)=>setYears(Number(event.target.value))}>
        {intervals.map((date) => <option key={date}>{date}</option>)}</select></label>
    </div>
    <svg className="data-trend" viewBox="0 0 360 165" role="img" aria-label="Illustrative index of annual emissions for two selected decline rates">
      {[0,25,50,75,100].map((value) => <g key={value}><line x1="40" x2="345" y1={134-value} y2={134-value} stroke="currentColor" opacity=".25" />
        <text x="33" y={138-value} fill="currentColor" fontSize="11" textAnchor="end">{value}</text></g>)}
      {values.map((series,index) => <polyline key={index} fill="none" stroke={index ? "#e3af8d" : "#91bcc4"}
        strokeWidth="2.5" strokeDasharray={index ? "5 4" : undefined} points={series.map((value,i)=>`${40+i/(years-1)*305},${134-value}`).join(" ")} />)}
      <text x="40" y="154" fill="currentColor" fontSize="11">Year 1</text><text x="345" y="154" fill="currentColor" fontSize="11" textAnchor="end">Year {years}</text>
    </svg>
    <table className="atlas-table">
      <caption>Illustrative outputs in index units</caption>
      <thead><tr><th scope="col">Pathway</th><th scope="col">Last-year index</th><th scope="col">Cumulative total</th></tr></thead>
      <tbody>{values.map((series,index) => <tr key={index}><th scope="row">{index ? "B · dashed" : "A · solid"}</th>
        <td>{format.format(series.at(-1) ?? 0)}</td><td>{format.format(series.reduce((total,value)=>total+value,0))}</td></tr>)}</tbody>
    </table>
    <button className="ghost-button" type="button" onClick={()=>{setFirst(2);setSecond(6);setYears(20);}}>Reset pathways</button>
    <p className="lab-key">This is a hypothetical emissions comparison. It calculates no concentrations, temperatures, sea levels, or future national emissions.</p>
  </section>;
}

const stages = [
  {name:"Fresh snow", label:"Atmosphere moves through open pores", text:"Snow crystals accumulate in layers. Air continues to circulate through connected pores, so the gas in these pores is not yet isolated from the atmosphere."},
  {name:"Firn", label:"Compaction narrows pathways", text:"The weight of accumulating snow compacts older layers. In this intermediate material, some pores remain connected while others close. The timing depends on the site’s temperature and accumulation."},
  {name:"Bubble close-off", label:"Gas becomes trapped", text:"Once bubbles close off, their gas is isolated from the overlying air. The surrounding snow fell earlier, so the gas and ice at the same depth can represent different ages."},
  {name:"Laboratory analysis", label:"Different measurements answer different questions", text:"Scientists can measure gases from trapped bubbles and separately analyze the isotopes and chemistry of the ice. Age models associate these measurements with times in the past."},
];
export function IceArchive() {
  const [stage,setStage]=useState(0);
  return <div className="lab-layout archive-lab">
    <figure className="pane">
      <svg viewBox="0 0 330 270" role="img" aria-label={stages[stage].label}>
        {stages.map(({name},index) => <g key={name} opacity={index === stage ? 1 : .38}>
          <rect x="0" y={index * 66} width="330" height="62" fill={["#d6e3db","#9dbabd","#64909b","#466d7b"][index]} />
          {Array.from({length:7}, (_,bubble) => <circle key={bubble} cx={38+bubble*42} cy={index*66+17+(bubble%3)*12} r={6-index}
            fill="#183842" stroke={index >= 2 ? "#e0e8e0" : "transparent"} />)}
        </g>)}
      </svg>
      <figcaption>Process schematic. Layers and bubble spacing are illustrative.</figcaption>
    </figure>
    <section className="pane lab-controls">
      <h2 className="subhead">Follow a sample</h2>
      <label>Archive stage <input type="range" min="0" max="3" step="1" value={stage} aria-valuetext={stages[stage].name}
        onChange={(event)=>setStage(event.currentTarget.valueAsNumber)} /></label>
      <div aria-live="polite"><h3>{stages[stage].name}</h3><p>{stages[stage].text}</p></div>
      <button className="ghost-button" type="button" onClick={()=>setStage(0)}>Reset archive</button>
      <p className="lab-key">This sequence demonstrates how an archive forms. Use the source catalog for published measurements.</p>
    </section>
  </div>;
}
