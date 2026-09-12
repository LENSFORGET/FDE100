export type Camera = { x: number; y: number; k: number };
export type Bounds = { x: number; y: number; width: number; height: number };
export type RectNode = { x: number; y: number; w: number; h: number };
export function clamp(value: number, min: number, max: number): number;
export function boundsOf(nodes: RectNode[]): Bounds;
export function fitCamera(
  bounds: Bounds,
  width: number,
  height: number,
  padding?: number,
  maxZoom?: number,
): Camera;
export function zoomAt(
  camera: Camera,
  point: { x: number; y: number },
  factor: number,
): Camera;
export function layoutSide(
  groups: string[],
  counts: Record<string, number>,
): { id: string; y: number; height: number }[];
export function edgePath(a: RectNode, b: RectNode, vertical?: boolean): string;
