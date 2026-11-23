"use client";

import { useId,useState } from "react";
import Image from "next/image";

const points = [
  {x:37,y:55, title:"Extended emission", bn:"ছড়ানো বিকিরণ", text:"The bright arc covers many image pixels. Its shape is visible at 21.34 μm. Identifying the material that emits it requires other wavelengths or spectra.", translation:"উজ্জ্বল বাঁকটি অনেক পিক্সেল জুড়ে। ২১.৩৪ μm তরঙ্গদৈর্ঘ্যে এর আকৃতি দেখা যায়। কোন উপাদান বিকিরণ করছে জানতে অন্য তরঙ্গদৈর্ঘ্য বা বর্ণালি দরকার।"},
  {x:55,y:55, title:"Compact bright feature", bn:"ছোট উজ্জ্বল বৈশিষ্ট্য", text:"The compact bright spot stands out from surrounding emission. The display does not establish whether it resolves one source or several closely spaced sources.",translation:"পাশের বিকিরণ থেকে ছোট উজ্জ্বল বিন্দুটি আলাদা দেখা যায়। সেটি একটি উৎস নাকি কাছাকাছি কয়েকটি উৎস তা এই ছবি থেকে নিশ্চিত হয় না।"},
  {x:22,y:25, title:"Faint background", bn:"ম্লান পটভূমি", text:"Dark display pixels represent relatively faint signal in this band after the contrast stretch. They are not proof that the line of sight contains no material.",translation:"বৈপরীত্য বদলানোর পর গাঢ় পিক্সেল এই তরঙ্গদৈর্ঘ্যে অপেক্ষাকৃত ক্ষীণ সংকেত বোঝায়। দৃষ্টির রেখায় কোনো পদার্থই নেই, এমন প্রমাণ নয়।"},
] as const;

export function InfraredAnnotations({locale="en"}:{locale?:"en"|"bn"}={}) {
  const bn=locale==="bn";
  const [active,setActive]=useState(0);
  const caption=useId();
  const selected=points[active];
  return <figure className="science-figure observation-figure annotated-figure" aria-describedby={caption}>
    <div className="annotation-image"><Image src="/images/milky-way-msx.webp" width={500} height={500} alt={bn ? "আকাশগঙ্গার কেন্দ্রে উজ্জ্বল ও গাঢ় অবলোহিত অঞ্চল।" : "Infrared observations showing bright and dark features in the centre of the Milky Way."} />
      {points.map(({x,y,title,bn:label},index)=><button type="button" key={title} className="figure-hotspot" style={{left:`${x}%`,top:`${y}%`}} aria-label={bn ? label : title} aria-pressed={active===index} onClick={()=>setActive(index)}>{new Intl.NumberFormat(locale).format(index+1)}</button>)}
    </div>
    <div className="pill-row annotation-index" aria-label={bn ? "ছবির বৈশিষ্ট্য" : "Image features"}>{points.map(({title,bn:label},index)=><button type="button" className="ghost-button" key={title} aria-pressed={active===index} onClick={()=>setActive(index)}>{bn ? label : title}</button>)}</div>
    <p className="annotation-readout" aria-live="polite"><strong>{bn ? selected.bn : selected.title}</strong> {bn ? selected.translation : selected.text}</p>
    <figcaption id={caption}>{bn ? "আকাশগঙ্গার কেন্দ্র ২১.৩৪ μm-এ। AFRL-এর MSX / SPIRIT III অবলোহিত মাপ, Astropy-র উদাহরণ তথ্য থেকে। ধূসর ছবিতে asinh পদ্ধতিতে বৈপরীত্য বদলানো হয়েছে।" : "Milky Way centre at 21.34 μm. Grayscale display of MSX / SPIRIT III infrared measurements from AFRL, distributed with Astropy’s sample data. Display uses an asinh contrast stretch."} <a href="https://github.com/astropy/astropy-data/blob/gh-pages/galactic_center/gc_msx_e.fits">{bn ? "FITS সূত্র" : "FITS source"}</a>.</figcaption>
  </figure>;
}
