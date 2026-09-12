import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  Check,
  ChevronLeft,
  ChevronRight,
  Focus,
  Layers,
  Link as LinkIcon,
  Maximize2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { cases } from "../../model";
import type { Reading } from "../../state";
import { boundsOf, fitCamera, zoomAt } from "./layout.mjs";
import { caseGraph, groupFor, groups, reportGraph, tourSteps } from "./mapData";
import type { GraphNode } from "./mapData";
import { useCamera } from "./useCamera";
import { MapInspector } from "./MapInspector";
import { GraphEdges, MiniMap } from "./MapVisuals";
import "./mindmap.css";
function initialCase() {
  const value = Number(
    new URLSearchParams(location.hash.split("?")[1]).get("case"),
  );
  return Number.isInteger(value) && value >= 1 && value <= 24 ? value : null;
}
const iconMap = {
  book: BookOpen,
  workflow: Workflow,
  chart: ChartNoAxesCombined,
  spark: Sparkles,
  people: Users,
};
export default function MindMap({ reading }: { reading: Reading }) {
  const surface = useRef<HTMLDivElement>(null);
  const { camera, live, size, move, zoom, animated, dragging, handlers } =
    useCamera(surface);
  const [caseId, setCaseId] = useState<number | null>(initialCase);
  const [focusedTopic, setFocusedTopic] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(new Set<string>());
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchIndex, setSearchIndex] = useState(0);
  const [tour, setTour] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [toast, setToast] = useState("");
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const mobile = size.width < 680;
  const graph = useMemo(
    () =>
      caseId
        ? caseGraph(caseId, mobile)
        : reportGraph(collapsed, mobile, focusedTopic),
    [caseId, mobile, collapsed, focusedTopic],
  );
  const selectedNode = graph.nodes.find((n) => n.id === selected);
  const inspector = Boolean(
    selectedNode && tour === null && selectedNode.kind !== "root",
  );
  const currentGroup = caseId
    ? groupFor(caseId)
    : groups.find((g) => g.id === focusedTopic);
  const visibleBounds = useMemo(() => boundsOf(graph.nodes), [graph]);
  const focusedNodes = useMemo(() => {
    if (!caseId && focusedTopic)
      return graph.nodes.filter(
        (n) => n.id === "root" || n.group === focusedTopic,
      );
    if (caseId && mobile && selected && tour === null)
      return graph.nodes.filter(
        (n) =>
          n.id === selected ||
          (selected.startsWith("step-") && n.id === "solution"),
      );
    if (caseId && mobile && tour !== null) {
      const key = tourSteps[tour].node;
      const stepIndex = key.startsWith("step-") ? Number(key.slice(5)) : null;
      const previous =
        stepIndex === null
          ? null
          : stepIndex === 0
            ? "solution"
            : `step-${stepIndex - 1}`;
      return graph.nodes.filter((n) => n.id === key || n.id === previous);
    }
    return graph.nodes;
  }, [graph, caseId, focusedTopic, mobile, tour, selected]);
  const frame = useCallback(
    (nodes = focusedNodes, smooth = true) => {
      const width = size.width - (inspector && !mobile ? 330 : 0);
      const height =
        size.height -
        (tour !== null ? (mobile ? 245 : 200) : 50) -
        (inspector && mobile ? 225 : 0);
      const next = fitCamera(
        boundsOf(nodes),
        width,
        Math.max(180, height),
        mobile ? 25 : 47,
        caseId ? 1.15 : 1.18,
      );
      move({ ...next, y: next.y + 10 }, smooth && !reduceMotion);
    },
    [focusedNodes, size, inspector, mobile, tour, caseId, move, reduceMotion],
  );
  useLayoutEffect(() => {
    frame();
  }, [frame]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduceMotion(preference.matches);
    preference.addEventListener("change", change);
    return () => preference.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const syncRoute = () => {
      if (location.hash.split("?")[0] !== "#/map") return;
      setCaseId(initialCase());
      setFocusedTopic(null);
      setSelected(null);
      setTour(null);
      setPlaying(false);
      setSearchOpen(false);
      setQuery("");
    };
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);
  useEffect(() => {
    const params = caseId ? "?case=" + caseId : "";
    history.replaceState(
      null,
      "",
      location.pathname + location.search + "#/map" + params,
    );
    document.title = caseId
      ? `${cases[caseId - 1].name} · 结构地图 — FDE100`
      : "全景知识地图 — FDE100";
  }, [caseId]);
  useEffect(() => {
    if (tour === null) return;
    const step = tourSteps[tour];
    setCaseId(step.mode === "case" ? 2 : null);
    setFocusedTopic(step.topic);
    setCollapsed(
      step.mode === "report"
        ? new Set(
            groups
              .filter((g) => step.node === "root" || g.id !== step.topic)
              .map((g) => g.id),
          )
        : new Set(),
    );
    setSelected(step.node);
  }, [tour]);
  useEffect(() => {
    if (!playing || tour === null) return;
    const timer = setTimeout(() => {
      if (tour === tourSteps.length - 1) {
        setPlaying(false);
        setToast("导览完成。现在可以自由探索。");
      } else setTour(tour + 1);
    }, 6500);
    return () => clearTimeout(timer);
  }, [playing, tour]);
  useEffect(() => {
    if (!searchOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!(event.target as Element).closest(".map-search"))
        setSearchOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [searchOpen]);
  const stopTour = useCallback(() => {
    setPlaying(false);
    setTour(null);
    setSelected(null);
  }, []);
  function overview() {
    stopTour();
    setCaseId(null);
    setFocusedTopic(null);
    setSelected(null);
    setQuery("");
  }
  function openCase(id: number) {
    stopTour();
    setCaseId(id);
    setFocusedTopic(null);
    setSelected(null);
    setSearchOpen(false);
    setQuery("");
    reading.visit(id);
  }
  function openGroup(id: string) {
    stopTour();
    setCaseId(null);
    const nextTopic = focusedTopic === id && !caseId ? null : id;
    setFocusedTopic(nextTopic);
    setSelected(mobile ? null : nextTopic);
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setQuery("");
    setSearchOpen(false);
  }
  function choose(node: GraphNode) {
    if (node.kind === "root") {
      overview();
      return;
    }
    if (node.kind === "topic") {
      openGroup(node.id);
      return;
    }
    if (node.kind === "case") {
      openCase(node.caseId!);
      return;
    }
    const nextSelected = selected === node.id ? null : node.id;
    stopTour();
    setSelected(nextSelected);
  }
  function collapse(id: string) {
    stopTour();
    setSelected(null);
    setFocusedTopic(null);
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function startTour() {
    setSelected(null);
    setSearchOpen(false);
    setTour(0);
    setPlaying(true);
  }
  function previousTour() {
    if (tour === null) return;
    setPlaying(false);
    setTour(Math.max(0, tour - 1));
  }
  function nextTour() {
    if (tour === null) return;
    setPlaying(false);
    setTour(Math.min(tourSteps.length - 1, tour + 1));
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(location.href);
      setToast("此结构的链接已复制");
    } catch {
      setToast("请复制地址栏中的链接");
    }
  }
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases
      .filter(
        (c) =>
          !q ||
          [c.name, c.industry, c.topic, c.problem, c.summary, ...c.steps]
            .join(" ")
            .toLowerCase()
            .includes(q),
      )
      .slice(0, 7);
  }, [query]);
  useEffect(() => setSearchIndex(0), [query]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as Element).closest("input,textarea,select")) return;
      if (event.key === "Escape") {
        if (searchOpen) {
          setSearchOpen(false);
          return;
        }
        if (tour !== null) {
          stopTour();
          return;
        }
        if (selected) {
          setSelected(null);
          return;
        }
        if (caseId || focusedTopic) {
          overview();
          return;
        }
      }
      if (event.key === " " && tour !== null) {
        event.preventDefault();
        setPlaying((p) => !p);
      }
      if (tour !== null && event.key === "ArrowRight") {
        event.preventDefault();
        nextTour();
      }
      if (tour !== null && event.key === "ArrowLeft") {
        event.preventDefault();
        previousTour();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tour, searchOpen, selected, caseId, focusedTopic, stopTour]);
  const highlight = selected || (!caseId ? focusedTopic : null);
  const isDim = (node: GraphNode) => {
    if (tour !== null && tourSteps[tour].mode === "case")
      return !["focus", "solution", selected].includes(node.id);
    if (!caseId && focusedTopic)
      return node.id !== "root" && node.group !== focusedTopic;
    return false;
  };
  return (
    <section
      className={`map-app ${caseId ? "is-case-view" : ""} ${inspector ? "has-inspector" : ""} ${tour !== null ? "is-guided" : ""} ${reduceMotion ? "reduce-motion" : ""}`}
    >
      <div className="map-topbar">
        <div className="map-title-block">
          <div className="map-breadcrumb">
            <button onClick={overview} aria-label="返回报告全景">
              报告全景
            </button>
            {currentGroup && (
              <>
                <ChevronRight size={12} />
                <button onClick={() => openGroup(currentGroup.id)}>
                  {currentGroup.name}
                </button>
              </>
            )}
            {caseId && (
              <>
                <ChevronRight size={12} />
                <span>NO.{String(caseId).padStart(2, "0")}</span>
              </>
            )}
          </div>
          <h1>
            {caseId
              ? cases[caseId - 1].name
              : focusedTopic
                ? currentGroup?.question
                : "24 个现场，一眼看见结构。"}
          </h1>
        </div>
        <div className="map-top-actions">
          <div className="map-search" data-map-ui="true">
            <Search size={16} />
            <input
              aria-label="搜索结构中的案例"
              role="combobox"
              aria-expanded={searchOpen}
              aria-controls="map-search-results"
              aria-autocomplete="list"
              aria-activedescendant={
                searchOpen && searchResults.length
                  ? "map-result-" + searchIndex
                  : undefined
              }
              value={query}
              placeholder="搜索案例或问题"
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSearchIndex((i) =>
                    Math.min(searchResults.length - 1, i + 1),
                  );
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSearchIndex((i) => Math.max(0, i - 1));
                }
                if (e.key === "Enter" && searchResults[searchIndex]) {
                  e.preventDefault();
                  openCase(searchResults[searchIndex].id);
                }
                if (e.key === "Escape") {
                  setSearchOpen(false);
                  e.currentTarget.blur();
                }
              }}
            />
            {searchOpen && (
              <button
                className="map-icon"
                aria-label="关闭搜索"
                onClick={() => setSearchOpen(false)}
              >
                <X size={14} />
              </button>
            )}
            {searchOpen && (
              <div
                className="map-search-results"
                id="map-search-results"
                role="listbox"
                aria-label="案例搜索结果"
              >
                <div className="map-search-caption">
                  {query ? "相关案例" : "从一个案例开始探索"}
                </div>
                {searchResults.length ? (
                  searchResults.map((c, i) => (
                    <button
                      key={c.id}
                      id={"map-result-" + i}
                      role="option"
                      aria-selected={searchIndex === i}
                      onMouseEnter={() => setSearchIndex(i)}
                      onClick={() => openCase(c.id)}
                    >
                      <span
                        style={{
                          background: groupFor(c.id).tint,
                          color: groupFor(c.id).color,
                        }}
                      >
                        {String(c.id).padStart(2, "0")}
                      </span>
                      <div>
                        <strong>{c.name}</strong>
                        <small>{c.topic}</small>
                      </div>
                      <ArrowDownLeft size={14} />
                    </button>
                  ))
                ) : (
                  <p>没有找到。试试“培训”或“对账”。</p>
                )}
              </div>
            )}
          </div>
          <button className="map-primary" onClick={startTour}>
            <Play size={14} fill="currentColor" />
            播放导览
          </button>
          <button
            className="map-icon map-share"
            aria-label="复制当前结构链接"
            onClick={share}
          >
            <LinkIcon size={17} />
          </button>
        </div>
      </div>
      <div
        className={`map-surface ${dragging ? "is-dragging" : ""}`}
        ref={surface}
        {...handlers}
        tabIndex={0}
        role="region"
        aria-label="交互知识地图，可拖动，滚轮缩放；加减键缩放，Home键适应画布"
        onKeyDown={(e) => {
          if ((e.target as Element).closest("input,button,a")) return;
          if (e.key === "+" || e.key === "=") {
            e.preventDefault();
            zoom(1.2);
          }
          if (e.key === "-") {
            e.preventDefault();
            zoom(1 / 1.2);
          }
          if (e.key === "Home") {
            e.preventDefault();
            frame();
          }
          if (
            tour === null &&
            ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
          ) {
            e.preventDefault();
            const delta = {
              ArrowLeft: [70, 0],
              ArrowRight: [-70, 0],
              ArrowUp: [0, 70],
              ArrowDown: [0, -70],
            }[e.key]!;
            move({
              ...live.current,
              x: live.current.x + delta[0],
              y: live.current.y + delta[1],
            });
          }
        }}
        onDoubleClick={(e) => {
          if (!(e.target as Element).closest("button,a,[data-map-ui]")) {
            const r = e.currentTarget.getBoundingClientRect();
            move(
              zoomAt(
                live.current,
                { x: e.clientX - r.left, y: e.clientY - r.top },
                1.35,
              ),
              !reduceMotion,
            );
          }
        }}
      >
        <div
          className="map-dotfield"
          aria-hidden="true"
          style={{
            backgroundPosition: `${camera.x}px ${camera.y}px`,
            backgroundSize: `${Math.max(14, 25 * camera.k)}px ${Math.max(14, 25 * camera.k)}px`,
          }}
        />
        <div
          className={`map-world ${animated && !dragging ? "camera-animated" : ""}`}
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.k})`,
          }}
        >
          <GraphEdges
            graph={graph}
            focusedTopic={focusedTopic}
            selected={highlight}
            isCase={Boolean(caseId)}
            playing={playing}
            mobile={mobile}
          />
          {graph.nodes.map((node) => {
            const group = groups.find((g) => g.id === node.group);
            const Icon =
              node.kind === "topic" && group
                ? iconMap[group.icon as keyof typeof iconMap]
                : null;
            const active = selected === node.id;
            return (
              <div
                key={node.id}
                className={`map-node-wrap kind-${node.kind} ${isDim(node) ? "is-dim" : ""} ${active ? "is-active" : ""}`}
                style={
                  {
                    transform: `translate(${node.x - node.w / 2}px,${node.y - node.h / 2}px)`,
                    width: node.w,
                    height: node.h,
                    "--node-color": node.color,
                    "--node-tint": node.tint,
                  } as CSSProperties
                }
              >
                <button
                  className="map-node"
                  data-node-id={node.id}
                  onClick={() => choose(node)}
                  onFocus={(event) => {
                    if (!event.currentTarget.matches(":focus-visible")) return;
                    const rect = event.currentTarget.getBoundingClientRect(),
                      area = surface.current!.getBoundingClientRect();
                    if (
                      rect.left < area.left + 10 ||
                      rect.right > area.right - 10 ||
                      rect.top < area.top + 35 ||
                      rect.bottom > area.bottom - 65
                    ) {
                      move(
                        {
                          ...live.current,
                          x:
                            (size.width - (inspector && !mobile ? 330 : 0)) /
                              2 -
                            node.x * live.current.k,
                          y: size.height / 2 - node.y * live.current.k,
                        },
                        !reduceMotion,
                      );
                    }
                  }}
                  aria-label={
                    node.kind === "case"
                      ? `展开案例${node.meta}：${node.title}`
                      : node.kind === "topic"
                        ? `聚焦${node.title}，${group?.ids.length}个案例`
                        : node.kind === "root"
                          ? "报告全景，24个案例，5类问题"
                          : `${node.title}${node.subtitle ? "：" + node.subtitle : ""}`
                  }
                  aria-pressed={active}
                >
                  {node.kind === "root" ? (
                    <>
                      <span className="root-orbit">
                        <Layers size={22} strokeWidth={1.4} />
                      </span>
                      <strong>{node.title}</strong>
                      <small>{node.subtitle}</small>
                      <span className="root-credit">报告结构导览</span>
                    </>
                  ) : node.kind === "topic" ? (
                    <>
                      <div className="topic-title">
                        {Icon && <Icon size={19} strokeWidth={1.7} />}
                        <strong>{node.title}</strong>
                      </div>
                      <small>{node.subtitle}</small>
                      <span className="topic-count">
                        {node.meta}
                        <ChevronRight size={12} />
                      </span>
                    </>
                  ) : node.kind === "case" ? (
                    <>
                      <span className="case-node-number">{node.meta}</span>
                      <strong>{node.title}</strong>
                      {reading.state.read.includes(node.caseId!) ? (
                        <Check size={12} className="node-read" />
                      ) : (
                        <span className="case-node-dot" />
                      )}
                    </>
                  ) : node.kind === "focus" ? (
                    <>
                      <small>{node.meta}</small>
                      <strong>{node.title}</strong>
                      <span>{node.subtitle}</span>
                    </>
                  ) : node.kind === "section" ? (
                    <>
                      <div className="section-node-label">
                        <span>{node.meta}</span>
                        {node.title}
                      </div>
                      <strong>{node.subtitle}</strong>
                      <span className="node-detail-indicator">
                        <Plus size={12} />
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="step-node-number">{node.meta}</span>
                      <strong>{node.title}</strong>
                      <span className="node-detail-indicator">
                        <Plus size={12} />
                      </span>
                    </>
                  )}
                </button>
                {node.kind === "topic" && !mobile && (
                  <button
                    className="node-collapse"
                    onClick={() => collapse(node.id)}
                    aria-label={`${collapsed.has(node.id) ? "展开" : "收起"}${node.title}案例`}
                    aria-expanded={!collapsed.has(node.id)}
                  >
                    {collapsed.has(node.id) ? (
                      <Plus size={10} />
                    ) : (
                      <Minus size={10} />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="map-canvas-top" data-map-ui="true">
          {caseId || focusedTopic ? (
            <button className="map-soft-button" onClick={overview}>
              <ArrowLeft size={14} />
              返回全景
            </button>
          ) : (
            <div className="map-legend">
              <span className="legend-dot" />
              五类问题连接 24 个案例
            </div>
          )}
          {!caseId && !mobile && (
            <button
              className="map-soft-button"
              onClick={() => {
                stopTour();
                setSelected(null);
                setFocusedTopic(null);
                setCollapsed(
                  collapsed.size === 5
                    ? new Set()
                    : new Set(groups.map((g) => g.id)),
                );
              }}
            >
              <Layers size={14} />
              {collapsed.size === 5 ? "展开所有案例" : "收起所有案例"}
            </button>
          )}
        </div>
        {inspector && selectedNode && (
          <MapInspector
            node={selectedNode}
            caseId={caseId}
            reading={reading}
            onClose={() => setSelected(null)}
            onCase={openCase}
          />
        )}
        <div className="map-navigation" data-map-ui="true">
          <MiniMap
            graph={graph}
            bounds={visibleBounds}
            camera={camera}
            width={size.width - (inspector && !mobile ? 330 : 0)}
            height={size.height}
            onMove={(x, y) =>
              move(
                {
                  ...live.current,
                  x: size.width / 2 - x * live.current.k,
                  y: size.height / 2 - y * live.current.k,
                },
                !reduceMotion,
              )
            }
            onFit={() => frame()}
          />
          <span className="map-attribution">
            基于 Datawhale 报告 · 本站结构整理
          </span>
        </div>
        <div className="map-zoom-controls" data-map-ui="true">
          <button
            className="map-icon"
            aria-label="缩小地图"
            onClick={() => zoom(1 / 1.2)}
          >
            <Minus size={17} />
          </button>
          <button
            className="zoom-percent"
            onClick={() => zoom(1 / camera.k)}
            aria-label="恢复百分之百缩放"
          >
            {Math.round(camera.k * 100)}%
          </button>
          <button
            className="map-icon"
            aria-label="放大地图"
            onClick={() => zoom(1.2)}
          >
            <Plus size={17} />
          </button>
          <span />
          <button
            className="map-icon"
            aria-label="适应画布"
            onClick={() => frame()}
          >
            <Maximize2 size={16} />
          </button>
        </div>
        {tour !== null ? (
          <div className="map-tour" data-map-ui="true" aria-label="结构导览">
            <div className="tour-progress-track">
              {tourSteps.map((s, i) => (
                <button
                  key={s.title}
                  className={i <= tour ? "completed" : ""}
                  aria-label={`跳到第${i + 1}步：${s.title}`}
                  aria-current={i === tour ? "step" : undefined}
                  onClick={() => {
                    setPlaying(false);
                    setTour(i);
                  }}
                />
              ))}
            </div>
            <div className="tour-content" aria-live="polite">
              <span className="tour-counter">
                {String(tour + 1).padStart(2, "0")} /{" "}
                {String(tourSteps.length).padStart(2, "0")}
              </span>
              <div>
                <h2>{tourSteps[tour].title}</h2>
                <p>{tourSteps[tour].text}</p>
              </div>
              <button
                className="map-icon tour-close"
                onClick={stopTour}
                aria-label="退出导览"
              >
                <X size={17} />
              </button>
            </div>
            <div className="tour-controls">
              <span>跟着结构，一步步理解</span>
              <button
                className="map-icon"
                disabled={tour === 0}
                onClick={previousTour}
                aria-label="上一步讲解"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="tour-play"
                onClick={() => {
                  if (tour === tourSteps.length - 1 && !playing) {
                    setTour(0);
                  }
                  setPlaying(!playing);
                }}
                aria-label={
                  playing
                    ? "暂停导览"
                    : tour === tourSteps.length - 1
                      ? "重播导览"
                      : "继续导览"
                }
              >
                {playing ? (
                  <Pause size={15} fill="currentColor" />
                ) : tour === tourSteps.length - 1 ? (
                  <RotateCcw size={15} />
                ) : (
                  <Play size={15} fill="currentColor" />
                )}
              </button>
              <button
                className="map-icon"
                disabled={tour === tourSteps.length - 1}
                onClick={nextTour}
                aria-label="下一步讲解"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          !inspector && (
            <div className="map-context-hint" data-map-ui="true">
              {caseId ? (
                <>
                  <Focus size={15} />
                  <span>点击节点看解释，沿分支读懂前因后果。</span>
                </>
              ) : (
                <>
                  <span className="hint-mouse" />
                  <span>
                    {mobile
                      ? "点开一个分支，再进入具体案例。"
                      : "点击案例展开结构 · 拖动画布 · 滚轮缩放"}
                  </span>
                </>
              )}
            </div>
          )
        )}
        {toast && (
          <div className="map-toast" role="status">
            {toast}
          </div>
        )}
      </div>
    </section>
  );
}
