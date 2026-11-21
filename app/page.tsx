import { DepthLab } from "@/components/home/depth-lab";
import { Discoveries, Stories, Topics } from "@/components/home/editorial-sections";
import { EditorialMotion } from "@/components/home/editorial-motion";
import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <EditorialMotion>
        <Discoveries />
        <Topics />
        <Stories />
        <div className="shell lab-section" id="depth" data-reveal="section"><DepthLab /></div>
      </EditorialMotion>
    </>
  );
}
