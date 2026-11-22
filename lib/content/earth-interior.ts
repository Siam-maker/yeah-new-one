export const earthLayers = [
  { name:"Crust", color:"#b99062", radius:1.62, depth:"Surface to about 5–70 km", state:"Solid", detail:"Oceanic crust is typically thinner than continental crust. The base of the crust is called the Moho. It is recognized by a change in seismic-wave speed." },
  { name:"Mantle", color:"#9b5942", radius:1.49, depth:"Base of the crust to about 2,890 km", state:"Mostly solid", detail:"Mantle rock can deform over long times. Most of the mantle is solid, even though partial melting can occur in some regions." },
  { name:"Outer core", color:"#ca824e", radius:.88, depth:"About 2,890–5,150 km", state:"Liquid", detail:"This iron-rich layer is liquid. Shear waves do not travel through it, which helps reveal its boundary." },
  { name:"Inner core", color:"#efc68a", radius:.31, depth:"About 5,150–6,371 km", state:"Solid", detail:"Iron-rich material in the inner core remains solid under immense pressure, even at high temperatures." },
] as const;
