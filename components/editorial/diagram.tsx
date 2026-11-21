import type { DiagramKind } from "@/lib/content/articles";

const diagrams = {
  depth: { title: "Five zones of the water column", caption: "Zone limits are approximate. The water column darkens with depth, while pressure increases. Layer heights here are schematic." },
  migration: { title: "A daily migration", caption: "A typical upward migration at dusk and return at dawn. The curve is schematic and does not show measured timing or depth." },
  strata: { title: "Reading a rock outcrop", caption: "An erosional surface separates tilted older beds from younger deposits. Events at the contact are inferred from the order of the layers." },
  ice: { title: "From snow to enclosed air", caption: "Air can move between firn grains before pores close deeper down. The surrounding ice is generally older than the enclosed gas." },
  light: { title: "Light carries an earlier moment", caption: "A light signal arrives after it was emitted. Distances and timings in this schematic are illustrative." },
  age: { title: "Age groups in Bangladesh and Japan, 2023", caption: "Share of the population age 0–14 and 65+. UN World Population Prospects 2024 estimates, rounded to one decimal place." },
  sea: { title: "Global and local sea level", caption: "A tide gauge compares water height with the surface of the land at one point. The same station can move as the land changes height." },
  plates: { title: "Three ways for plates to meet", caption: "Arrows indicate relative plate motion. Convergence can cause subduction, divergence opens a spreading ridge, and transform motion is lateral." },
} as const;

const oceanBands = [
  ["Sunlight", "0–200 m", "#226878"], ["Twilight", "200–1,000 m", "#314f82"], ["Midnight", "1,000–4,000 m", "#292f62"],
  ["Abyssal", "4,000–6,000 m", "#232648"], ["Hadal", "6,000 m and deeper", "#1b203c"],
] as const;

function DiagramGraphic({ kind }: { kind: DiagramKind }) {
  switch (kind) {
    case "depth":
      return <>{oceanBands.map(([label, range, color], index) => (
        <g key={label} transform={`translate(0 ${index * 39 + 1})`}>
          <rect width="480" height="37" fill={color} />
          <text x="12" y="24">{label}</text><text x="467" y="24" textAnchor="end">{range}</text>
        </g>
      ))}</>;
    case "migration":
      return <>
        <rect x="43" y="17" width="413" height="47" fill="#214958" />
        <rect x="43" y="65" width="413" height="84" fill="#1c2642" />
        <path d="M45 124 H130 Q154 124 172 93 L192 61 Q207 38 223 38 H306 Q330 38 349 75 L369 112 Q377 124 400 124 H452" fill="none" stroke="#ff916f" strokeWidth="4" />
        <text x="48" y="35">Shallow</text><text x="48" y="85">Deep</text>
        <text x="150" y="179">Dusk</text><text x="241" y="179">Night</text><text x="346" y="179">Dawn</text>
      </>;
    case "strata":
      return <>
        <path d="M0 79 86 63 173 70 265 62 365 71 480 65 V192 H0Z" fill="#5d352e" />
        <path d="M0 91 480 153 M0 123 480 181 M0 153 294 192" stroke="#c07248" strokeWidth="13" />
        <path d="M0 22H480V65L365 71 265 62 173 70 86 63 0 79Z" fill="#835844" />
        <path d="M0 45H480" stroke="#bf915f" strokeWidth="9" />
        <path d="m0 79 86-16 87 7 92-8 100 9 115-6" fill="none" stroke="#ffba8c" strokeWidth="3" strokeDasharray="5 4" />
        <text x="16" y="18">Younger horizontal beds</text><text x="21" y="185">Older tilted beds</text>
        <text x="340" y="98">Unconformity</text>
      </>;
    case "ice":
      return <>
        {["Snow", "Firn", "Glacial ice"].map((name, index) => <g key={name} transform={`translate(${index * 163} 20)`}>
          <rect width="143" height="121" fill={["#294358", "#304863", "#3b5779"][index]} />
          {Array.from({ length: 12 }, (_, point) => <circle key={point} cx={20 + point % 4 * 33} cy={21 + Math.floor(point / 4) * 32}
            r={12 - index * 3} fill="none" stroke="#d2e4e9" strokeWidth={index === 2 ? 2 : 1} />)}
          <text x="72" y="149" textAnchor="middle">{name}</text>
        </g>)}
        <text x="240" y="194" textAnchor="middle">Increasing compaction and pore closure →</text>
      </>;
    case "light":
      return <>
        <circle cx="53" cy="86" r="19" fill="#fff1c7" /><circle cx="426" cy="86" r="12" fill="#64b8ce" />
        <path d="M75 86 H408" stroke="#ff956d" strokeWidth="3" strokeDasharray="8 9" /><path d="m394 77 14 9-14 9" fill="none" stroke="#ff956d" strokeWidth="3" />
        <text x="52" y="132" textAnchor="middle">Emitter</text><text x="426" y="132" textAnchor="middle">Observer</text>
        <text x="240" y="52" textAnchor="middle">Light in transit</text><text x="240" y="181" textAnchor="middle">Arrival follows emission</text>
      </>;
    case "age":
      return <>{[["Bangladesh · age 0–14",28.2],["Japan · age 0–14",11.5],["Bangladesh · age 65+",6.4],["Japan · age 65+",29.7]].map(([label,value], index) => <g key={label} transform={`translate(0 ${index * 45})`}>
        <text x="14" y="28">{label}</text><rect x="215" y="13" height="18" width={Number(value)*7} fill={index%2 === 0 ? "#55dce8" : "#dbb479"} />
        <text x={224+Number(value)*7} y="29">{value}%</text>
      </g>)}</>;
    case "sea":
      return <>
        <path d="M0 97H480V198H0Z" fill="#25516a" /><path d="M0 128H220L308 78H480V198H0Z" fill="#806149" />
        <path d="M0 97H480" stroke="#99d3df" strokeDasharray="8 5" /><path d="M246 57V132M238 93H254M238 110H254M238 126H254" stroke="#f6e9cd" strokeWidth="3"/>
        <text x="246" y="44" textAnchor="middle">Tide gauge</text><text x="18" y="81">Water surface</text><text x="392" y="129">Land</text>
      </>;
    case "plates":
      return <>
        {["Convergent", "Divergent", "Transform"].map((label, index) => <g key={label} transform={`translate(${index * 162} 26)`}>
          <rect width="150" height="119" fill="#252938" />
          <path d={["M5 69H63L104 106H139 M75 66H146","M5 63H64 M86 63H145 M75 108V69","M5 56H144 M5 72H144"][index]} fill="none" stroke={["#eb9c6e","#9ab9ed","#83cebc"][index]} strokeWidth="7" />
          <text x="75" y="43" textAnchor="middle">{["→   ←","←   →","→   ←"][index]}</text>
          <text x="75" y="150" textAnchor="middle">{label}</text>
        </g>)}
      </>;
  }
}

export function ScienceDiagram({ kind }: { kind: DiagramKind }) {
  const { title, caption } = diagrams[kind];
  return <figure className="science-figure">
    <svg viewBox="0 0 480 198" role="img" aria-label={title} fill="#f7f1e6" fontFamily="var(--font-sans)" fontSize="17">
      <title>{title}</title><DiagramGraphic kind={kind} />
    </svg>
    <figcaption>{caption}</figcaption>
  </figure>;
}
