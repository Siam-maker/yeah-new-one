import type { Metadata } from "next";
import { Masthead, TextLink } from "@/components/editorial/ui";
import { PrintButton } from "@/components/publishing/print-button";

export const metadata: Metadata = {title:"Teaching resources",description:"Printable science investigations using the depth lab, Field Atlas, and Population Observatory."};

const activities = [
  {title:"Compare two ways water changes with depth", time:"25–35 min", link:"/lab/ocean-depth",
    steps:["Record depth and modeled pressure at three depths. Keep units with the readings.","At the same depth, change the water clarity in the light instrument and record what changes.","Explain why light and pressure respond differently. Identify one assumption of each model."],
    evidence:"A strong explanation distinguishes the weight of water above from the amount of light that travels through it."},
  {title:"Read land movement from a map",time:"30–40 min",link:"/atlas?layer=geology&plates=1",
    steps:["Locate one ridge, a trench, and a transform fault. Mark the directions of relative plate motion.","Reproduce these motions in the plate lab and compare the diagram with the map.","Explain which information comes from the map and which comes from a teaching model."],
    evidence:"Look for motion based on boundary type and an explicit distinction between modeled and measured information."},
  {title:"Compare two populations on common axes",time:"25–35 min",link:"/demographics?country=BGD&compare=JPN",
    steps:["Select the same historical year for two countries. Compare each set of bars as a share of total population.","Record a difference in one younger and one older age band. Propose an explanation and evidence you would need to test it.","Repeat at 2050. State the result as conditional on the UN medium assumptions."],
    evidence:"Check the denominator, ensure the comparison uses the same year, and keep estimates distinct from projections."},
];

export default function TeachingPage() {
  return <div className="shell teaching-page">
    <Masthead title="Teach with the evidence" description="Three printable investigations for a class or study group. Each pairs an interactive tool with an observation students can defend."
      crumbs={[{label:"Learning Center",href:"/learn"},{label:"Teaching resources"}]} />
    <div className="layout-flow">
      <PrintButton label="Print teaching guide" />
      {activities.map((activity) => <section className="course-lesson" key={activity.title}>
        <p className="mono section-label">{activity.time}</p><h2 className="subhead">{activity.title}</h2>
        <TextLink href={activity.link}>Open the investigation</TextLink>
        <ol>{activity.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <p><strong>What to look for</strong> {activity.evidence}</p>
      </section>)}
    </div>
  </div>;
}
