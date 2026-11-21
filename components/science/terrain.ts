import { BufferGeometry, Color, Float32BufferAttribute } from "three";

export function terrainSurface() {
  const geometry = new BufferGeometry();
  const p: number[] = [], c: number[] = [], faces: number[] = [];
  const columns=65, rows=47;
  const ridge = new Color("#5a6467"), basin = new Color("#172832");
  for(let row=0;row<rows;row++) for(let col=0;col<columns;col++) {
    const x = col/(columns-1)*40-20, z = -(row/(rows-1)*40)-.6;
    const trench = Math.exp(-((x+Math.sin(z*.24)*2.7)**2)*.065);
    const rough = Math.sin(x*1.57 + z*.22)*Math.cos(z*.71-x*.19)*.62 + Math.sin(x*.51-z*.62)*.83;
    const ledge = Math.pow(Math.max(0, Math.sin(-z*.35+x*.17)),3)*1.45;
    const y = -3.2 + rough + ledge - trench*2.2;
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

/** Stacked beds share the same continuous boundary surface. */
export function strataBed(level: number) {
  const geometry = new BufferGeometry();
  const p:number[] = [], c:number[] = [], faces:number[] = [];
  const columns=31, rows=19, n=columns*rows;
  const colors=["#80564d","#a37054","#b78a61","#c8a779","#d6bf8e","#818c7e"];
  for(const surface of [0,1]) for(let row=0;row<rows;row++) for(let col=0;col<columns;col++) {
    const u=col/(columns-1), v=row/(rows-1), x=(u-.5)*5.6, z=(v-.5)*2.6;
    const l=level+surface;
    const fault=u<.57 ? 0 : .25;
    const y=(l-3)*.43 + .13*Math.sin(x*1.2+z*.5)+fault+z*.11;
    p.push(x+(v-.5)*.13*Math.sin(u*19),y,z);
    const pigment = new Color(colors[level]).multiplyScalar(.79+.24*(.5+.5*Math.sin(col*1.43+row*2.7+level)));
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
