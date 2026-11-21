export const planets = [
  { id:"mercury", name:"Mercury", au:0.387, years:.24085, diameter:4879, color:"#b29a83", reading:"Its short orbit drives a quick circuit around the Sun. Its surface still records large impacts." },
  { id:"venus", name:"Venus", au:0.723, years:.6152, diameter:12104, color:"#e6b983", reading:"A thick atmosphere and high clouds reflect much of the sunlight that reaches Venus." },
  { id:"earth", name:"Earth", au:1, years:1, diameter:12742, color:"#63bed8", reading:"Earth’s orbital semimajor axis is close to the astronomical unit used here. Its atmosphere and oceans shape its surface and climate." },
  { id:"mars", name:"Mars", au:1.524, years:1.881, diameter:6779, color:"#df7954", reading:"Mars takes nearly two Earth years to orbit the Sun. Iron oxides help give its surface a rust-colored appearance." },
  { id:"jupiter", name:"Jupiter", au:5.203, years:11.86, diameter:139820, color:"#d5ab7e", reading:"The solar system’s largest planet takes nearly twelve Earth years to orbit. Its visible bands trace flows in its atmosphere." },
  { id:"saturn", name:"Saturn", au:9.537, years:29.45, diameter:116460, color:"#ebcb89", reading:"The bright ring system contains many particles, largely water ice. Saturn travels much more slowly around the Sun than Earth." },
  { id:"uranus", name:"Uranus", au:19.19, years:84.02, diameter:50724, color:"#83ceca", reading:"Uranus has a strongly tilted spin axis. Its seasons unfold over a long orbit." },
  { id:"neptune", name:"Neptune", au:30.07, years:164.8, diameter:49244, color:"#5479dc", reading:"The outermost planet takes roughly 165 Earth years to orbit. Even light takes hours to reach its mean orbital distance." },
] as const;

export const lightMinutesPerAu = 149597870700 / 299792458 / 60;
export function displayOrbit(au: number) { return 1.05 + Math.log1p(au) * 1.35; }
