import { CanvasTexture, SRGBColorSpace } from "three";

export function planetSurface(id: string, tint: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.fillStyle = tint;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const original = image.data.slice(0, 3);
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const latitude = y / canvas.height;
      const longitude = x / canvas.width * Math.PI * 2;
      const variation = Math.sin(longitude*5 + y*.31)*Math.cos(longitude*7-y*.3);
      const turbulence = Math.sin(longitude*3 + Math.sin(latitude*15)*1.2 + latitude*9) + .7*Math.sin(longitude*9-latitude*21);
      const bands = .85 + .13*Math.cos(latitude*58+.6*Math.sin(longitude*2)) + .075*Math.sin(latitude*112+variation*.5);
      const gasGiant = id === "jupiter" || id === "saturn";
      const paint = gasGiant ? bands : .91 + variation*.08 + turbulence*.045;
      const continent = id === "earth" && turbulence > .57 && latitude > .15 && latitude < .88;
      const polar = id === "earth" && (latitude < .09 || latitude > .94);
      const rgb = polar ? [226,238,234] : continent ? [133,156,111] : original;
      const point = (y*canvas.width+x)*4;
      for (let channel=0; channel<3; channel++) image.data[point+channel]=rgb[channel]*paint;
    }
  }
  context.putImageData(image,0,0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
