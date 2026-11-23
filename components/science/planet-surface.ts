import { CanvasTexture, SRGBColorSpace } from "three";

const vortexTint = [32,-27,-38];
const craters = [
  [.12,.28,.053], [.32,.36,.092], [.56,.16,.042], [.72,.37,.051], [.91,.54,.066],
  [.06,.67,.040], [.49,.69,.081], [.73,.72,.034],
];

export function planetSurface(id: string, tint: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.fillStyle = tint;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const original = image.data.slice(0, 3);
  const gasGiant = id === "jupiter" || id === "saturn";
  const rocky = id === "mercury" || id === "mars";
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const latitude = y / canvas.height;
      const u = x / canvas.width;
      const longitude = u * Math.PI * 2;
      const variation = Math.sin(longitude*5 + latitude*39)*Math.cos(longitude*7-latitude*38);
      const turbulence = Math.sin(longitude*3 + Math.sin(latitude*15)*1.2 + latitude*9) + .7*Math.sin(longitude*9-latitude*21);
      const bands = .87 + .11*Math.cos(latitude*57+.75*Math.sin(longitude*2))
        + .065*Math.sin(latitude*108+variation*.53) + .033*turbulence;
      let paint = gasGiant ? bands : .92 + variation*.063 + turbulence*.036;
      if (rocky) {
        for (const [cx, cy, radius] of craters) {
          const xDist = Math.min(Math.abs(u-cx), 1-Math.abs(u-cx)) * 1.9;
          const yDist = latitude - cy;
          const d = Math.hypot(xDist,yDist) / radius;
          if (d < 1.1) paint += Math.max(0,1-d) * -.13 + Math.max(0,1-Math.abs(d-.86)*4) * (.06-yDist/radius*.075);
        }
      }
      const eye = id === "jupiter" ? Math.max(0,1-Math.hypot((u-.48)*9,(latitude-.617)*22)) : 0;
      const ice = id === "mars" ? Math.max(0,1-Math.min(latitude,1-latitude)*9.5) : 0;
      const point = (y*canvas.width+x)*4;
      for (let channel=0; channel<3; channel++) {
        const base = original[channel]*paint;
        image.data[point+channel] = base+(235-base)*ice*.58+eye*vortexTint[channel];
      }
    }
  }
  context.putImageData(image,0,0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
