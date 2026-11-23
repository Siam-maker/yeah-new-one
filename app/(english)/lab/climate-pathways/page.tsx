import { contentAlternates } from "@/lib/i18n/coverage";
import type { Metadata } from "next";
import { Masthead,ReferenceList,TextLink } from "@/components/editorial/ui";
import { EmissionsPathways } from "@/components/science/climate-instruments";

export const metadata:Metadata = {title:"Emissions pathways",description:"Compare cumulative emissions under two hypothetical rates of decline.", alternates:contentAlternates("/lab/climate-pathways","en") };

export default function Page() {
  return <div className="shell laboratory-page" data-discipline="climate">
    <Masthead title="Emissions pathways" category="Climate science · Illustrative model" description="Compare two hypothetical rates of decline and see how the cumulative totals diverge." crumbs={[{label:"Lab",href:"/lab"},{label:"Emissions pathways"}]} />
    <div className="layout-flow"><EmissionsPathways /><div><h2 className="subhead">Context and sources</h2><ReferenceList keys={["carbon","climateSynthesis"]} /><TextLink href="/learn/climate#futures">Read about conditional futures</TextLink><br /><TextLink href="/world?scene=climate#live-world">Explore Earth’s energy budget in 3D</TextLink></div></div>
  </div>;
}
