/*
 * Mutable per-frame state shared between the Canvas world and the DOM HUD.
 * Written by ProgressDriver (inside the Canvas) at 60fps; read by anything
 * that animates — deliberately NOT React state so nothing re-renders.
 */
export const prog = {
  p: 0, // raw scroll progress 0..1
  s: 0, // smoothed progress (what the world runs on)
  dist: 0, // knight arc-length distance along the road
  vel: 0, // d(dist)/dt units/sec
  walk: 0, // 0..1 walk-cycle intensity
  phase: 0, // ever-increasing stride phase
  introT: 0, // seconds since boot (spawn choreography)
  pointer: { x: 0, y: 0 }, // NDC pointer, for the cursor firefly
}
