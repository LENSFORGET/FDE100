import { edgePath } from "./layout.mjs";
import type { Bounds, Camera } from "./layout.mjs";
import type { Graph } from "./mapData";
export function GraphEdges({
  graph,
  focusedTopic,
  selected,
  isCase,
  playing,
  mobile,
}: {
  graph: Graph;
  focusedTopic: string | null;
  selected: string | null;
  isCase: boolean;
  playing: boolean;
  mobile: boolean;
}) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  return (
    <svg className="map-lines" width="1" height="1" aria-hidden="true">
      {graph.edges.map((edge) => {
        const a = byId.get(edge.from)!,
          b = byId.get(edge.to)!;
        const active = isCase
          ? Boolean(
              selected &&
              (edge.to === selected ||
                (selected.startsWith("step-") && edge.to === "solution")),
            )
          : Boolean(
              focusedTopic &&
              (edge.to === focusedTopic || a.group === focusedTopic),
            );
        const dim = !isCase && focusedTopic && !active;
        let d = edgePath(a, b, edge.vertical);
        if (mobile && isCase && edge.from === "focus" && edge.to !== "problem")
          d = `M ${a.x - a.w / 2} ${a.y} C -169 ${a.y}, -169 ${b.y}, ${b.x - b.w / 2} ${b.y}`;
        return (
          <g
            key={edge.id}
            className={`map-edge ${active ? "edge-active" : ""} ${dim ? "edge-dim" : ""}`}
            style={{ color: edge.color }}
          >
            <path
              d={d}
              className="edge-line"
              vectorEffect="non-scaling-stroke"
            />
            {active && playing && (
              <>
                <path
                  d={d}
                  className="edge-flow"
                  vectorEffect="non-scaling-stroke"
                />
                <circle className="edge-signal" r="3.7" fill="currentColor">
                  <animateMotion dur="2.1s" repeatCount="indefinite" path={d} />
                </circle>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
export function MiniMap({
  graph,
  bounds,
  camera,
  width,
  height,
  onMove,
  onFit,
}: {
  graph: Graph;
  bounds: Bounds;
  camera: Camera;
  width: number;
  height: number;
  onMove: (x: number, y: number) => void;
  onFit: () => void;
}) {
  const pad = 40;
  const box = {
    x: bounds.x - pad,
    y: bounds.y - pad,
    width: bounds.width + pad * 2,
    height: bounds.height + pad * 2,
  };
  return (
    <div
      className="map-minimap"
      role="button"
      tabIndex={0}
      aria-label="缩略图，点击定位；按回车适应画布"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFit();
        }
      }}
    >
      <svg
        viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
        preserveAspectRatio="none"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onMove(
            box.x + ((e.clientX - r.left) / r.width) * box.width,
            box.y + ((e.clientY - r.top) / r.height) * box.height,
          );
        }}
        aria-hidden="true"
      >
        <rect
          x={box.x}
          y={box.y}
          width={box.width}
          height={box.height}
          fill="#ffffff"
        />
        {graph.edges.map((e) => {
          const a = graph.nodes.find((n) => n.id === e.from)!,
            b = graph.nodes.find((n) => n.id === e.to)!;
          return (
            <path
              key={e.id}
              d={edgePath(a, b, e.vertical)}
              fill="none"
              stroke="#d8dce2"
              strokeWidth={4}
            />
          );
        })}
        {graph.nodes.map((n) => (
          <rect
            key={n.id}
            x={n.x - n.w / 2}
            y={n.y - n.h / 2}
            width={n.w}
            height={n.h}
            rx={7}
            fill={n.color}
            opacity={n.kind === "case" ? 0.55 : 0.85}
          />
        ))}
        <rect
          className="minimap-viewport"
          x={-camera.x / camera.k}
          y={-camera.y / camera.k}
          width={width / camera.k}
          height={height / camera.k}
          rx={8}
          strokeWidth={9}
          fill="rgba(52,120,206,.035)"
          stroke="#8a9bad"
        />
      </svg>
    </div>
  );
}
