import { contentAlternates } from "@/lib/i18n/coverage";
import type { Metadata } from "next";
import { Masthead, ReferenceList, TextLink } from "@/components/editorial/ui";
import { CosmicWorld } from "@/components/science/cosmic-world";

export const metadata: Metadata = { title:"Cosmic observatory", description:"Explore orbital periods and the travel time of sunlight in a schematic solar system.", alternates:contentAlternates("/lab/observatory","en") };
export default function Observatory() {
  return <div className="shell world-page" data-discipline="space">
    <Masthead title="The cosmic observatory" category="World 03 / Astronomy" description="Choose a planet and advance time. Their motion and the sunlight travel times reveal two independent scales in the solar system."
      crumbs={[{label:"Lab",href:"/lab"},{label:"Cosmic observatory"}]} />
    <div className="layout-flow">
      <CosmicWorld />
      <section className="two-panel"><div><h2 className="subhead">Why the scales differ</h2><p>Light crosses one astronomical unit in about 499 seconds. The orbital period grows with distance from the Sun. In the circular approximation, the period varies as the orbital radius raised to the power of three halves.</p></div>
      <div><h2 className="subhead">Sources</h2><div className="link-list"><a href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/">NASA planetary fact sheet</a></div><ReferenceList keys={["lightSpeed"]}/><TextLink href="/stories/the-light-that-took-its-time">Read about light and lookback time</TextLink></div></section>
    </div>
  </div>;
}
