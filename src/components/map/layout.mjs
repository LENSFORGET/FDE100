export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export function boundsOf(nodes) {
  if (!nodes.length) return { x: -100, y: -100, width: 200, height: 200 };
  const x = Math.min(...nodes.map((n) => n.x - n.w / 2));
  const y = Math.min(...nodes.map((n) => n.y - n.h / 2));
  return {
    x,
    y,
    width: Math.max(...nodes.map((n) => n.x + n.w / 2)) - x,
    height: Math.max(...nodes.map((n) => n.y + n.h / 2)) - y,
  };
}
export function fitCamera(bounds, width, height, padding = 48, maxZoom = 1.25) {
  const k = clamp(
    Math.min(
      Math.max(1, width - padding * 2) / bounds.width,
      Math.max(1, height - padding * 2) / bounds.height,
    ),
    0.18,
    maxZoom,
  );
  return {
    k,
    x: width / 2 - (bounds.x + bounds.width / 2) * k,
    y: height / 2 - (bounds.y + bounds.height / 2) * k,
  };
}
export function zoomAt(camera, point, factor) {
  const k = clamp(camera.k * factor, 0.18, 2.4);
  return {
    k,
    x: point.x - ((point.x - camera.x) / camera.k) * k,
    y: point.y - ((point.y - camera.y) / camera.k) * k,
  };
}
export function layoutSide(groups, counts) {
  const sizes = groups.map((id) => Math.max(76, counts[id] * 43 - 9));
  const total = sizes.reduce((a, b) => a + b, 0) + (groups.length - 1) * 34;
  let cursor = -total / 2;
  return groups.map((id, i) => {
    const result = { id, y: cursor + sizes[i] / 2, height: sizes[i] };
    cursor += sizes[i] + 34;
    return result;
  });
}
export function edgePath(a, b, vertical = false) {
  if (vertical) {
    const sy = a.y + a.h / 2,
      ty = b.y - b.h / 2,
      mid = (sy + ty) / 2;
    return `M ${a.x} ${sy} C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${ty}`;
  }
  const dir = b.x >= a.x ? 1 : -1,
    sx = a.x + (dir * a.w) / 2,
    tx = b.x - (dir * b.w) / 2,
    mid = (sx + tx) / 2;
  return `M ${sx} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${tx} ${b.y}`;
}
