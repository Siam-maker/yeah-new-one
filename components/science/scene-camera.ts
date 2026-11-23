import { MathUtils, Vector3 } from "three";
import type { CameraView } from "./camera-controls";

export function cameraOffset(x: number, y: number, z: number, view: CameraView, target: Vector3) {
  const yaw = Math.atan2(x,z) + MathUtils.degToRad(view.yaw);
  const pitch = Math.atan2(y,Math.hypot(x,z)) + MathUtils.degToRad(view.pitch);
  const distance = Math.hypot(x,y,z) / view.zoom;
  return target.set(Math.sin(yaw)*Math.cos(pitch)*distance,Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance);
}

export function transitionAmount(active: boolean, delta: number, speed = 6) {
  return active ? 1-Math.exp(-speed*Math.min(delta,.09)) : 1;
}
