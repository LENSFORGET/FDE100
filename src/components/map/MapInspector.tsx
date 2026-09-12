import {
  ArrowUpRight,
  Bookmark,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import { cases, pdfUrl } from "../../model";
import type { Reading } from "../../state";
import { groupFor, groups } from "./mapData";
import type { GraphNode } from "./mapData";
export function MapInspector({
  node,
  caseId,
  reading,
  onClose,
  onCase,
}: {
  node: GraphNode;
  caseId: number | null;
  reading: Reading;
  onClose: () => void;
  onCase: (id: number) => void;
}) {
  const c = caseId ? cases[caseId - 1] : null;
  const group = node.group
    ? groups.find((g) => g.id === node.group)
    : c
      ? groupFor(c.id)
      : null;
  const phase = node.section || "problem";
  const q =
    phase === "problem"
      ? 1
      : phase === "solution"
        ? 3
        : phase === "result"
          ? 4
          : 5;
  const text = c
    ? node.step !== undefined
      ? c.steps[node.step]
      : phase === "problem"
        ? c.problem
        : phase === "solution"
          ? c.summary
          : phase === "result"
            ? c.outcome
            : c.boundary
    : "";
  const saved = c ? reading.state.saved.includes(c.id) : false;
  return (
    <aside className="map-inspector" data-map-ui="true" aria-label="节点说明">
      <div className="inspector-heading">
        <span>
          {c ? "报告 NO." + String(c.id).padStart(2, "0") : "分支概览"}
        </span>
        <button
          className="map-icon"
          aria-label="关闭节点说明"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      {c ? (
        <>
          <div className="inspector-kicker" style={{ color: group?.color }}>
            {node.kind === "step"
              ? "实施步骤 " + (node.step! + 1)
              : node.kind === "focus"
                ? c.status
                : node.title}
          </div>
          <h2>
            {node.kind === "focus"
              ? c.name
              : node.kind === "step"
                ? node.title
                : node.subtitle || c.name}
          </h2>
          <p>{text}</p>
          {phase === "result" && (
            <div className="inspector-boundary">
              <span>理解结果的前提</span>
              {c.boundary}
            </div>
          )}
          <div className="inspector-source">
            <a
              href={pdfUrl(
                phase === "boundary" ? c.pdfStart : c.qa[q - 1].pdfPage,
              )}
              target="_blank"
              rel="noreferrer"
            >
              {phase === "boundary"
                ? `核对原文 · PDF 第 ${c.pdfStart}–${c.pdfEnd} 页`
                : `报告 Q${q} · PDF 第 ${c.qa[q - 1].pdfPage} 页起`}{" "}
              <ExternalLink size={12} />
            </a>
            <small>节点为本站导读，结果来自受访者反馈。</small>
          </div>
          <div className="inspector-actions">
            <a href={`#/case/${c.id}`} className="map-text-action">
              读完整案例 <ArrowUpRight size={16} />
            </a>
            <button
              className={`map-icon ${saved ? "is-saved" : ""}`}
              onClick={() => reading.toggle("saved", c.id)}
              aria-label={saved ? "取消收藏此案例" : "收藏此案例"}
              aria-pressed={saved}
            >
              <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
        </>
      ) : group ? (
        <>
          <div className="inspector-kicker" style={{ color: group.color }}>
            {group.ids.length} 个案例
          </div>
          <h2>{group.question}</h2>
          <p className="inspector-intro">
            选择一个现场，展开它的问题、方法和结果。
          </p>
          <div className="inspector-cases">
            {group.ids.map((id) => (
              <button key={id} onClick={() => onCase(id)}>
                <span>{String(id).padStart(2, "0")}</span>
                <strong>{cases[id - 1].name}</strong>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
          <div className="inspector-source">
            <small>
              这五类问题为本站阅读分类。报告原目录按 FDE 姓名首字母排序。
            </small>
          </div>
        </>
      ) : null}
    </aside>
  );
}
