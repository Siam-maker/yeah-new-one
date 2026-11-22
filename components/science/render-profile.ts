export type RenderProfile = {
  name: "low" | "balanced" | "high";
  dpr: number;
  floor: number;
  frameMs: number;
  segments: number;
};

const low: RenderProfile = { name:"low", dpr:.8, floor:.65, frameMs:56, segments:40 };
const balanced: RenderProfile = { name:"balanced", dpr:1, floor:.8, frameMs:38, segments:56 };
const high: RenderProfile = { name:"high", dpr:1.5, floor:1, frameMs:28, segments:72 };

let detected: RenderProfile | null | undefined;

export function renderProfile(): RenderProfile | null {
  if (detected !== undefined) return detected;
  const device = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  try {
    if (device.connection?.saveData) return null;
    const context = document.createElement("canvas").getContext("webgl2", { antialias:false, powerPreference:"low-power" });
    if (!context) return (detected = null);
    try {
      const debug = context.getExtension("WEBGL_debug_renderer_info");
      const adapter = debug ? String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : "";
      const memory = device.deviceMemory ?? 4;
      const maxTexture = Number(context.getParameter(context.MAX_TEXTURE_SIZE));
      const software = /swiftshader|llvmpipe|software/i.test(adapter);
      if (software || memory < 4 || maxTexture < 4096) return (detected = low);
      return (detected = memory >= 8 && device.hardwareConcurrency >= 8 && maxTexture >= 8192 ? high : balanced);
    } finally {
      context.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    return (detected = null);
  }
}
