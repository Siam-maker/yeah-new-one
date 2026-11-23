import { contentAlternates } from "@/lib/i18n/coverage";
import type { Metadata } from "next";
import { Masthead,ReferenceList,TextLink } from "@/components/editorial/ui";
import { IceArchive } from "@/components/science/climate-instruments";

export const metadata:Metadata = {title:"Ice-core archive",description:"Follow a sample from fresh snow to trapped gas and laboratory analysis.", alternates:contentAlternates("/lab/ice-archive","en") };

export default function Page() {
  return <div className="shell laboratory-page" data-discipline="climate">
    <Masthead title="Ice-core archive" category="Climate science · Process model" description="Follow snow as it compacts, traps air, and becomes a record scientists can investigate." crumbs={[{label:"Lab",href:"/lab"},{label:"Ice-core archive"}]} />
    <div className="layout-flow"><IceArchive /><div><h2 className="subhead">Measurements and methods</h2><ReferenceList keys={["ice","iceData"]} /><TextLink href="/learn/climate#ice">Read the ice lesson</TextLink></div></div>
  </div>;
}
