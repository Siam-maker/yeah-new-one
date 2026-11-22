import { BufferGeometry, Float32BufferAttribute } from "three";

export function buildCaveGeometry(detail:number) {
  const radial = detail * 2;
  const rings = Math.round(detail * 1.7);
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let row = 0; row <= rings; row++) {
    const t = row / rings;
    const z = 4.2 - t * 26;
    const radius = 4.35 - 3.22 * Math.pow(t, 0.72) + .36 * Math.sin(t*5.4)*Math.sin(Math.PI*t);
    const centerX = 1.32 + Math.sin(t * 4.7 + 0.4) * 1.22 + t*.39;
    const centerY = Math.sin(t * 9.3) * 0.48 - t * 0.5;

    for (let edge = 0; edge <= radial; edge++) {
      const theta = edge / radial * Math.PI * 2;
      const diagonal = theta * 3.4 + t * 36;
      const folds = Math.sin(theta * 3 + t * 7) * .24 + Math.cos(theta * 7 - t * 11) * .13;
      const strata = Math.pow(Math.max(0, Math.sin(diagonal + Math.sin(t * 23) * 1.6)), 2) * .24;
      const chips = Math.sin(theta * 17 + t * 94) * Math.sin(theta * 23 - t * 67) * .09;
      const fissure = Math.pow(Math.max(0, Math.cos(theta * 2 + t * 16)), 12) * .14;
      const terrace = Math.pow(Math.max(0, Math.cos(t * 92 + theta * 4 + Math.sin(theta * 6))), 6) * .076;
      const floor = Math.pow(Math.max(0, -Math.sin(theta)), 7);
      const talus = floor * (.09 * Math.sin(t*26 + theta*5) + .065 * Math.cos(t*58 - theta*7.1));
      const ledge = .064 * Math.pow(Math.max(0, Math.cos(theta*5.4 + t*66)), 5) * Math.sin(Math.PI*t);
      const overhang = Math.pow(Math.max(0,Math.sin(theta*.99)),6)*(.08*Math.cos(t*26));
      const wall = radius * (1 + folds + strata + chips - fissure + terrace + talus + ledge + overhang);
      positions.push(centerX + Math.cos(theta) * wall * 1.16, centerY + Math.sin(theta) * wall * .83, z);
      uvs.push(edge / radial, t);
      if (row === rings || edge === radial) continue;
      const a = row * (radial + 1) + edge;
      const b = a + radial + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
