import { BufferGeometry, Color, Float32BufferAttribute } from "three";

const profile = [
  [-1.12, .044, .035], [-.92, .065, .05], [-.69, .143, .092], [-.35, .252, .147],
  [.04, .29, .174], [.36, .247, .149], [.63, .177, .112], [.79, .078, .062], [.84, .018, .018],
];

export function pelagicMesh() {
  const mesh = new BufferGeometry();
  const positions: number[] = [], colors: number[] = [], faces: number[] = [];
  const back = new Color("#263d53");
  const flank = new Color("#8aafb6");
  const belly = new Color("#798e94");
  const pigment = new Color();
  const sides = 16;

  for (const [row, [x, height, width]] of profile.entries()) {
    for (let side = 0; side < sides; side++) {
      const angle = side / sides * Math.PI * 2;
      const vertical = Math.cos(angle);
      positions.push(x, height * vertical, width * Math.sin(angle));
      const sheen = Math.max(0, 1 - Math.abs(vertical + .19) * 1.38);
      pigment.copy(vertical > 0 ? back : belly).lerp(flank, sheen * .85);
      colors.push(...pigment.toArray());
      if (row === profile.length - 1) continue;
      const a = row * sides + side;
      const b = row * sides + (side + 1) % sides;
      faces.push(a, b, a + sides, b, b + sides, a + sides);
    }
  }

  mesh.setAttribute("position", new Float32BufferAttribute(positions, 3));
  mesh.setAttribute("color", new Float32BufferAttribute(colors, 3));
  mesh.setIndex(faces);
  mesh.computeVertexNormals();
  return mesh;
}

export function pelagicFins() {
  const fins = [
    [[-1.02,0,0],[-1.43,.41,.025],[-1.42,.21,.045],[-1.31,0,.04],[-1.4,-.19,.035],[-1.44,-.37,0],[-1.04,-.02,0]],
    [[.29,.16,0],[-.13,.48,0],[-.26,.42,.02],[-.59,.15,0]],
    [[.16,-.05,.12],[-.43,-.24,.34],[-.39,-.13,.32],[-.03,-.03,.15]],
    [[.16,-.05,-.12],[-.41,-.23,-.34],[-.39,-.13,-.32],[-.03,-.03,-.15]],
    [[-.26,-.17,0],[-.57,-.27,0],[-.76,-.08,0]],
  ];
  const positions: number[] = [];
  for (const fin of fins) {
    for (let index = 1; index < fin.length - 1; index++) positions.push(...fin[0], ...fin[index], ...fin[index + 1]);
  }
  const mesh = new BufferGeometry();
  mesh.setAttribute("position", new Float32BufferAttribute(positions, 3));
  mesh.computeVertexNormals();
  return mesh;
}
