import { BufferGeometry, Float32BufferAttribute } from "three";

export function buildCaveGeometry() {
  const radial = 112;
  const rings = 102;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let row = 0; row <= rings; row++) {
    const t = row / rings;
    const z = 4.2 - t * 26;
    const radius = 4.15 - 3.06 * Math.pow(t, 0.72);
    const centerX = 1.48 + Math.sin(t * 5.4 + 0.4) * 0.95 + t * 0.7;
    const centerY = Math.sin(t * 9.3) * 0.48 - t * 0.5;

    for (let edge = 0; edge <= radial; edge++) {
      const theta = edge / radial * Math.PI * 2;
      const diagonal = theta * 3.4 + t * 36;
      const folds = Math.sin(theta * 3 + t * 7) * .24 + Math.cos(theta * 7 - t * 11) * .13;
      const strata = Math.pow(Math.max(0, Math.sin(diagonal + Math.sin(t * 23) * 1.6)), 2) * .24;
      const chips = Math.sin(theta * 17 + t * 94) * Math.sin(theta * 23 - t * 67) * .09;
      const wall = radius * (1 + folds + strata + chips);
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
