import type { Metadata } from "next";
import { Masthead, ReferenceList, TextLink } from "@/components/editorial/ui";
import { ScienceDiagram } from "@/components/editorial/diagram";
import { EarthInterior } from "@/components/science/earth-interior";
import { Atlas } from "@/components/science/atlas";
import { atlasLayers, type AtlasLayer } from "@/lib/content/atlas";
import { type PopulationIndicator } from "@/lib/content/demographics";
import { eons } from "@/lib/content/geologic-time";

export const metadata: Metadata = { title: "Scientific Atlas", description: "Explore a map and globe of ocean basins, trenches, and tectonic boundaries." };

function EonOverview() {
  const colors = ["#785651", "#a16154", "#8a785f", "#597e89"];
  return <figure className="science-figure mt-5">
    <svg viewBox="0 0 460 58" role="img" aria-label="Earth’s four eons shown in proportion to their duration">
      {eons.map(({ name, from, to }, index) =>
        <rect key={name} y="10" height="24" x={460 * (4567 - from) / 4567} width={460 * (from - to) / 4567} fill={colors[index]} />)}
      <g fill="#f7f1e6" fontSize="16"><text y="54">4,567 Ma</text><text x="460" y="54" textAnchor="end">Present</text></g>
    </svg>
    <figcaption>Hadean, Archean, Proterozoic, and Phanerozoic, from left to right. Bar lengths show approximate durations.</figcaption>
  </figure>;
}

export default async function AtlasPage({ searchParams }: { searchParams: Promise<{ layer?: string; location?: string; zoom?: string; view?: string; year?: string; heading?: string; plates?: string; bathy?: string }> }) {
  const query = await searchParams;
  const layer = typeof query.layer === "string" && Object.hasOwn(atlasLayers, query.layer) ? query.layer as AtlasLayer : "ocean";
  const location = typeof query.location === "string" ? query.location.slice(0, 96) : "";
  const indicator = typeof query.layer === "string" && ["population", "density", "urban"].includes(query.layer) ? query.layer as PopulationIndicator : undefined;
  const zoom = typeof query.zoom === "string" ? Number(query.zoom) : 1;
  const year = typeof query.year === "string" && /^\d{4}$/.test(query.year) ? Number(query.year) : undefined;
  const heading = typeof query.heading === "string" ? Number(query.heading) : 0;
  const toggle = (value?: string) => value === "1" ? true : value === "0" ? false : undefined;
  const view = query.view === "globe" ? "globe" : "map";
  return <div className="shell">
    <Masthead title="Field atlas" category="Global observations" description="Read one planet through eleven layers, from the ocean floor and tectonic plates to climate records and the distribution of people." />
    <div className="layout-flow">
      <div className="atlas-entry"><p>Choose a layer, search a place, and carry your selection between map and globe.</p><TextLink href="/demographics">Open the Demographics observatory</TextLink></div>
      <Atlas key={JSON.stringify(query)} initialLayer={layer} initialLocation={location} initialIndicator={indicator} initialView={view}
        initialZoom={Number.isFinite(zoom) ? Math.max(1,Math.min(3,zoom)) : 1} initialYear={year} initialHeading={Number.isFinite(heading) ? heading % 360 : 0} initialBoundaries={toggle(query.plates)} initialBathymetry={toggle(query.bathy)} />
      <section id="earth-interior"><h2 className="subhead">Beneath the map</h2><EarthInterior /></section>
      <section><h2 className="subhead">The water above it</h2><ScienceDiagram kind="depth" /></section>
      <div className="two-panel"><section className="pane"><h2 className="subhead">Planetary scale</h2>
        <table className="atlas-table"><caption className="text-left mb-3">Approximate mean radii</caption>
          <thead><tr><th>Planet</th><th>Radius</th></tr></thead><tbody>
            <tr><td>Earth</td><td>6,371 km</td></tr><tr><td>Venus</td><td>6,052 km</td></tr><tr><td>Mars</td><td>3,390 km</td></tr>
          </tbody>
        </table><a href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/" className="editorial-link mt-4">NASA planetary fact sheets</a>
      </section><section className="pane"><h2 className="subhead">A changing Earth</h2>
        <p className="editorial-text">The map is a present-day view of a long history. Zoom from eons to periods to put the rocks and environments on a timeline.</p>
        <EonOverview /><div className="mt-5"><TextLink href="/lab/geologic-time">Open the geological timeline</TextLink></div>
      </section></div>
      <section><h2 className="subhead">Data & references</h2>
        <ReferenceList keys={["boundaries", "bathymetry", "plates"]} />
        <div className="link-list mt-3"><a href="https://www.naturalearthdata.com/">Natural Earth · 1:110m land polygons</a>
          <a href="https://github.com/fraxen/tectonicplates">PB2002 plate boundary digitization</a>
          <a href="https://github.com/mrdoob/three.js/blob/dev/examples/textures/planets/earth_atmos_2048.jpg">Earth globe texture · Three.js example asset</a></div>
      </section>
    </div>
  </div>;
}
