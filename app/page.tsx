import { DepthLab } from "@/components/home/depth-lab";
import { Discoveries, Stories, Topics } from "@/components/home/editorial-sections";
import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Discoveries />
      <Topics />
      <Stories />
      <div className="shell lab-section" id="depth"><DepthLab /></div>
    </>
  );
}
