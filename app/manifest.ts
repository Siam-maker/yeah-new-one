import type { MetadataRoute } from "next";

export default function manifest():MetadataRoute.Manifest {
  return {
    id:"/",name:"Under the Surface",short_name:"Under the Surface",lang:"en",start_url:"/",scope:"/",display:"standalone",
    background_color:"#111413",theme_color:"#111413",
    description:"Science stories, data, and interactive worlds. Save English or Bengali articles for offline reading.",
    icons:[{src:"/icons/uts-192.png",sizes:"192x192",type:"image/png"},{src:"/icons/uts-512.png",sizes:"512x512",type:"image/png"}],
  };
}
