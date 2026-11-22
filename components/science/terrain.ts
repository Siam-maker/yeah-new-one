import { BufferGeometry, Color, Float32BufferAttribute } from "three";

export function terrainSurface(zone: string) {
  const geometry = new BufferGeometry();
  const p: number[] = [], c: number[] = [], faces: number[] = [];
  const columns=65, rows=47;
  const ridge = new Color(zone === "sunlight" ? "#829484" : zone === "hadal" ? "#535061" : "#4d5f65");
  const basin = new Color(zone === "hadal" ? "#202437" : "#172832");
  for(let row=0;row<rows;row++) for(let col=0;col<columns;col++) {
    const x = col/(columns-1)*40-20, z = -(row/(rows-1)*40)-.6;
    const trench = Math.exp(-((x+Math.sin(z*.24)*2.7)**2)*.065);
    const rough = Math.sin(x*1.57 + z*.22)*Math.cos(z*.71-x*.19)*.62 + Math.sin(x*.51-z*.62)*.83;
    const ledge = Math.pow(Math.max(0, Math.sin(-z*.35+x*.17)),3)*1.45;
    const y = -2.2 + rough*(zone === "abyssal" ? .27 : .92) + ledge*(zone === "abyssal" ? .17 : .91) - trench*(zone === "hadal" ? 5.4 : zone === "abyssal" ? .15 : 1.1);
    p.push(x,y,z);
    c.push(...basin.clone().lerp(ridge,Math.max(0,Math.min(1,(y+6)/5))).toArray());
    if(row<rows-1&&col<columns-1){
      const i=row*columns+col;
      faces.push(i,i+1,i+columns,i+1,i+columns+1,i+columns);
    }
  }
  geometry.setAttribute("position",new Float32BufferAttribute(p,3));
  geometry.setAttribute("color",new Float32BufferAttribute(c,3));
  geometry.setIndex(faces); geometry.computeVertexNormals();
  return geometry;
}

/** Leave a small rendering clearance where neighboring beds share a boundary. */
export function strataBed(level: number) {
  const geometry = new BufferGeometry();
  const p:number[] = [], c:number[] = [], faces:number[] = [];
  const columns=31, rows=19, n=columns*rows;
  const colors=["#77564c","#a47458","#b4805c","#bea77c","#d6c7a6","#9b9d7d"];
  const bedColor = new Color(colors[level]);
  const pigment = new Color();
  const vein = new Color("#dcc5a2");
  for(const surface of [0,1]) for(let row=0;row<rows;row++) for(let col=0;col<columns;col++) {
    const u=col/(columns-1), v=row/(rows-1), x=(u-.5)*5.6, z=(v-.5)*2.6;
    const l=level+surface;
    const fault=u<.57 ? 0 : .25;
    const cleft = .045 * Math.exp(-Math.abs(u-.57)*53) * Math.cos(z*7);
    const erosion = .024 * Math.sin(x*13+z*9) * Math.sin(z*3.6);
    const clearance = surface === 0 ? .006 : -.006;
    const y=(l-3)*.43 + .13*Math.sin(x*1.2+z*.5)+.035*Math.cos(x*8+z*6)+fault+z*.11+cleft+erosion+clearance;
    p.push(x+(v-.5)*.13*Math.sin(u*19),y,z);
    const grain = Math.sin(col*1.43+row*2.7+level)*Math.cos(row*.83 + x*1.6);
    const bedMark = Math.sin(z*7.1+x*.94+Math.sin(x*2.9)*.7);
    const mineral = Math.pow(Math.max(0, Math.sin(z * 4.1 + x * 2.8 + Math.cos(x * 5.2) * .37)), 12);
    pigment.copy(bedColor).multiplyScalar(.82+.16*grain+.095*bedMark).lerp(vein, mineral * .13);
    c.push(...pigment.toArray());
    if(col<columns-1 && row<rows-1){
      const i=surface*n+row*columns+col;
      if(surface) faces.push(i,i+columns,i+1,i+1,i+columns,i+columns+1);
      else faces.push(i,i+1,i+columns,i+1,i+columns+1,i+columns);
    }
  }
  const edges=[
    Array.from({length:columns},(_,i)=>i),
    Array.from({length:rows},(_,i)=>i*columns+columns-1),
    Array.from({length:columns},(_,i)=>(rows-1)*columns+columns-1-i),
    Array.from({length:rows},(_,i)=>(rows-1-i)*columns),
  ];
  for (const edge of edges) for(let i=1;i<edge.length;i++){
    const a=edge[i-1],b=edge[i];faces.push(a,b,a+n,b,b+n,a+n);
  }
  geometry.setAttribute("position",new Float32BufferAttribute(p,3));
  geometry.setAttribute("color",new Float32BufferAttribute(c,3));
  geometry.setIndex(faces);geometry.computeVertexNormals();
  return geometry;
}

export function plateRelief(land: boolean, uplift = false) {
  const geometry = new BufferGeometry();
  const positions: number[] = [], colors: number[] = [], faces: number[] = [];
  const columns = 29, rows = 25;
  const base = new Color(land ? "#58483b" : "#2d4c58");
  const highlight = new Color(land ? "#b18b61" : "#6d9ba2");
  const pigment = new Color();
  for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
    const u = column / (columns - 1), v = row / (rows - 1);
    const x = (u - .5) * (uplift ? 1.66 : 2.8), z = (v - .5) * (uplift ? 2.5 : 2.9);
    const rock = .48 * Math.sin(x * 7 + z * 2) * Math.cos(z * 5.6 - x) + .28 * Math.cos(z * 15 + x * 12);
    const edge = Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
    const fold = Math.pow(Math.max(0,Math.cos(x * 4.8 + Math.sin(z * 4) * .58)), 2.6);
    const elevation = uplift ? Math.pow(edge, 1.5) * (.16 + fold * .69 + rock * .17) : edge * (.047 + rock * .052 + fold * .07);
    positions.push(x, elevation, z);
    colors.push(...pigment.copy(base).lerp(highlight, .38 + rock * .27 + fold * .18).toArray());
    if (row < rows - 1 && column < columns - 1) {
      const i = row * columns + column;
      faces.push(i, i+columns, i+1, i+1, i+columns, i+columns+1);
    }
  }
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  geometry.setIndex(faces);
  geometry.computeVertexNormals();
  return geometry;
}
