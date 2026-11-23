"use client";

import { useState } from "react";

const intervals = [10,20,30];
function pathway(rate: number, years: number) {
  return Array.from({ length:years }, (_,year) => 100 * (1-rate/100) ** year);
}

export function EmissionsPathways({locale="en"}:{locale?:"en"|"bn"} = {}) {
  const bn=locale==="bn";
  const [first,setFirst] = useState(2);
  const [second,setSecond] = useState(6);
  const [years,setYears] = useState(20);
  const values = [pathway(first,years),pathway(second,years)];
  const format = new Intl.NumberFormat(locale,{maximumFractionDigits:1});
  return <section className="pane lab-controls pathway-instrument" aria-label={bn ? "নির্গমনের পথের মডেল" : "Emissions pathways model"}>
    <h2 className="subhead">{bn ? "দুটি অনুমান তুলনা করুন" : "Compare two assumptions"}</h2>
    <p>{bn ? "দুই পথ ১০০ সূচক থেকে শুরু। পরে প্রতি বছরে আগের মান বেছে নেওয়া শতাংশে কমে। মোট পার্থক্য জানতে প্রতিটি বছরের মান যোগ করুন।" : "Both pathways begin at an index of 100. In each later year the previous value falls by the selected percentage. Add the annual amounts to compare their cumulative totals."}</p>
    <div className="pathway-controls">
      <label>{bn ? "প্রথম পথের বার্ষিক হ্রাস" : "Pathway A annual decline"} <strong>{format.format(first)}%</strong><input type="range" min="0" max="15" value={first} onChange={(event)=>setFirst(event.currentTarget.valueAsNumber)} /></label>
      <label>{bn ? "দ্বিতীয় পথের বার্ষিক হ্রাস" : "Pathway B annual decline"} <strong>{format.format(second)}%</strong><input type="range" min="0" max="15" value={second} onChange={(event)=>setSecond(event.currentTarget.valueAsNumber)} /></label>
      <label>{bn ? "কত বছর" : "Years included"}<select className="control-field" value={years} onChange={(event)=>setYears(Number(event.target.value))}>
        {intervals.map((date) => <option key={date} value={date}>{format.format(date)}</option>)}</select></label>
    </div>
    <svg className="data-trend" viewBox="0 0 360 165" role="img" aria-label={bn ? "দুই হারে বার্ষিক নির্গমনের উদাহরণ সূচক" : "Illustrative index of annual emissions for two selected decline rates"}>
      {[0,25,50,75,100].map((value) => <g key={value}><line x1="40" x2="345" y1={134-value} y2={134-value} stroke="currentColor" opacity=".25" />
        <text x="33" y={138-value} fill="currentColor" fontSize="11" textAnchor="end">{format.format(value)}</text></g>)}
      {values.map((series,index) => <polyline key={index} fill="none" stroke={index ? "#e3af8d" : "#91bcc4"}
        strokeWidth="2.5" strokeDasharray={index ? "5 4" : undefined} points={series.map((value,i)=>`${40+i/(years-1)*305},${134-value}`).join(" ")} />)}
      <text x="40" y="154" fill="currentColor" fontSize="11">{bn ? "১ম বছর" : "Year 1"}</text><text x="345" y="154" fill="currentColor" fontSize="11" textAnchor="end">{bn ? `${format.format(years)} বছর` : `Year ${years}`}</text>
    </svg>
    <table className="atlas-table">
      <caption>{bn ? "উদাহরণের ফল সূচক এককে" : "Illustrative outputs in index units"}</caption>
      <thead><tr><th scope="col">{bn ? "পথ" : "Pathway"}</th><th scope="col">{bn ? "শেষ বছরের সূচক" : "Last-year index"}</th><th scope="col">{bn ? "সব বছরের যোগফল" : "Cumulative total"}</th></tr></thead>
      <tbody>{values.map((series,index) => <tr key={index}><th scope="row">{index ? bn ? "দ্বিতীয় · ভাঙা রেখা" : "B · dashed" : bn ? "প্রথম · টানা রেখা" : "A · solid"}</th>
        <td>{format.format(series.at(-1) ?? 0)}</td><td>{format.format(series.reduce((total,value)=>total+value,0))}</td></tr>)}</tbody>
    </table>
    <button className="ghost-button" type="button" onClick={()=>{setFirst(2);setSecond(6);setYears(20);}}>{bn ? "আগের অবস্থায় ফেরান" : "Reset pathways"}</button>
    <p className="lab-key">{bn ? "নির্গমনের এই তুলনা কাল্পনিক। তা দিয়ে ঘনত্ব, তাপমাত্রা, সমুদ্রপৃষ্ঠ বা দেশের ভবিষ্যৎ নির্গমন হিসাব করা হয় না।" : "This is a hypothetical emissions comparison. It calculates no concentrations, temperatures, sea levels, or future national emissions."}</p>
  </section>;
}

const stages = [
  {name:"Fresh snow", label:"Atmosphere moves through open pores", text:"Snow crystals accumulate in layers. Air continues to circulate through connected pores, so the gas in these pores is not yet isolated from the atmosphere."},
  {name:"Firn", label:"Compaction narrows pathways", text:"The weight of accumulating snow compacts older layers. In this intermediate material, some pores remain connected while others close. The timing depends on the site’s temperature and accumulation."},
  {name:"Bubble close-off", label:"Gas becomes trapped", text:"Once bubbles close off, their gas is isolated from the overlying air. The surrounding snow fell earlier, so the gas and ice at the same depth can represent different ages."},
  {name:"Laboratory analysis", label:"Different measurements answer different questions", text:"Scientists can measure gases from trapped bubbles and separately analyze the isotopes and chemistry of the ice. Age models associate these measurements with times in the past."},
];
const stagesBn = [
  {name:"নতুন তুষার",label:"খোলা ছিদ্র দিয়ে বাতাস যায়",text:"বরফের স্ফটিক স্তরে জমে। সংযুক্ত ছিদ্রে বাতাস চলে, তাই গ্যাস তখনও বায়ুমণ্ডল থেকে বিচ্ছিন্ন নয়।"},
  {name:"দানাদার ফার্ন",label:"চাপে ছিদ্র সরু হয়",text:"ওপরের তুষারের ওজনে পুরোনো স্তর ঘন হয়। কিছু ছিদ্র সংযুক্ত থাকে আর কিছু বন্ধ হতে থাকে। সময় স্থানীয় তাপমাত্রা ও তুষার জমার ওপর নির্ভর করে।"},
  {name:"বুদবুদ বন্ধ হওয়া",label:"গ্যাস আটকে যায়",text:"বুদবুদ পুরো বন্ধ হলে গ্যাসের সঙ্গে ওপরের বাতাসের আদানপ্রদান থামে। তুষার আগে পড়েছিল বলে একই গভীরতায় বরফ ও গ্যাসের বয়স আলাদা হতে পারে।"},
  {name:"পরীক্ষাগারের বিশ্লেষণ",label:"ভিন্ন মাপ ভিন্ন প্রশ্নের উত্তর দেয়",text:"আটকে থাকা গ্যাস এবং বরফের আইসোটোপ ও রসায়ন আলাদা করে মাপা হয়। বয়সের মডেল এই মাপকে অতীতের সময়ের সঙ্গে যুক্ত করে।"},
];
export function IceArchive({locale="en"}:{locale?:"en"|"bn"} = {}) {
  const bn=locale==="bn";
  const steps=bn ? stagesBn : stages;
  const [stage,setStage]=useState(0);
  return <div className="lab-layout archive-lab">
    <figure className="pane">
      <svg viewBox="0 0 330 270" role="img" aria-label={steps[stage].label}>
        {steps.map(({name},index) => <g key={name} opacity={index === stage ? 1 : .38}>
          <rect x="0" y={index * 66} width="330" height="62" fill={["#d6e3db","#9dbabd","#64909b","#466d7b"][index]} />
          {Array.from({length:7}, (_,bubble) => <circle key={bubble} cx={38+bubble*42} cy={index*66+17+(bubble%3)*12} r={6-index}
            fill="#183842" stroke={index >= 2 ? "#e0e8e0" : "transparent"} />)}
        </g>)}
      </svg>
      <figcaption>{bn ? "প্রক্রিয়ার ছক। স্তর ও বুদবুদের ব্যবধান উদাহরণ।" : "Process schematic. Layers and bubble spacing are illustrative."}</figcaption>
    </figure>
    <section className="pane lab-controls">
      <h2 className="subhead">{bn ? "একটি নমুনা অনুসরণ করুন" : "Follow a sample"}</h2>
      <label>{bn ? "নথির ধাপ" : "Archive stage"} <input type="range" min="0" max="3" step="1" value={stage} aria-valuetext={steps[stage].name}
        onChange={(event)=>setStage(event.currentTarget.valueAsNumber)} /></label>
      <div aria-live="polite"><h3>{steps[stage].name}</h3><p>{steps[stage].text}</p></div>
      <button className="ghost-button" type="button" onClick={()=>setStage(0)}>{bn ? "আগের অবস্থায় ফেরান" : "Reset archive"}</button>
      <p className="lab-key">{bn ? "এই ধাপগুলো দেখায় বরফের নথি কীভাবে হয়। প্রকাশিত পরিমাপ দেখার জন্য নিচের সূত্র খুলুন।" : "This sequence demonstrates how an archive forms. Use the source catalog for published measurements."}</p>
    </section>
  </div>;
}
