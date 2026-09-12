import { useMemo, useState } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowRight,
  Bookmark,
  Download,
} from "lucide-react";
import { cases, topics, download } from "../model";
import type { Reading } from "../state";
import { CaseCard } from "./CaseCard";
export function Library({
  reading,
  mine = false,
  compare,
  onCompare,
  initialTopic = "全部",
  initialQuery = "",
}: {
  reading: Reading;
  mine?: boolean;
  compare: number[];
  onCompare: (id: number) => void;
  initialTopic?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [topic, setTopic] = useState(
    topics.includes(initialTopic) ? initialTopic : "全部",
  );
  const [industry, setIndustry] = useState("全部行业");
  const [status, setStatus] = useState("全部阶段");
  const [shelf, setShelf] = useState("收藏");
  const filtered = useMemo(
    () =>
      cases.filter(
        (c) =>
          (!mine ||
            (shelf === "收藏"
              ? reading.state.saved
              : shelf === "已读"
                ? reading.state.read
                : Object.keys(reading.state.notes)
                    .filter((k) => reading.state.notes[k].trim())
                    .map(Number)
            ).includes(c.id)) &&
          (topic === "全部" || c.topic === topic) &&
          (industry === "全部行业" || industry === c.industry) &&
          (status === "全部阶段" || status === c.status) &&
          (!query.trim() ||
            JSON.stringify(c)
              .toLocaleLowerCase()
              .includes(query.trim().toLocaleLowerCase())),
      ),
    [query, topic, industry, status, mine, shelf, reading.state],
  );
  function reset() {
    setQuery("");
    setTopic("全部");
    setIndustry("全部行业");
    setStatus("全部阶段");
  }
  return (
    <main className="section library">
      <div className="page-heading">
        <h1>{mine ? "每一次阅读，都留得下来。" : "找到与你有关的经验。"}</h1>
        <p>
          {mine
            ? `已读 ${reading.state.read.length} / 24 篇。收藏、笔记和进度保存在当前浏览器。`
            : "先看每篇最值得学的部分，再展开方法、结果与原文。也可以选两个案例，一起比较。"}
        </p>
      </div>
      {!mine && (
        <div className="library-orientation">
          <a href="#/map">
            用地图看全貌 <ArrowRight size={14} />
          </a>
          <a href="#/insights">
            先读六条精华 <ArrowRight size={14} />
          </a>
          <span>卡片先看方法 · 打开读重点 · 选择两个可比较</span>
        </div>
      )}
      {mine && reading.state.last && (
        <div className="path-progress">
          <span>上次读到：{cases[reading.state.last - 1].name}</span>
          <a className="text-link" href={`#/case/${reading.state.last}`}>
            继续阅读 <ArrowRight size={15} />
          </a>
        </div>
      )}
      {mine && (
        <div className="shelf-bar">
          <div className="segmented">
            {["收藏", "已读", "笔记"].map((s) => (
              <button
                key={s}
                className={s === shelf ? "selected" : ""}
                onClick={() => setShelf(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            className="button subtle"
            onClick={() =>
              download(
                "FDE100-阅读备份.json",
                JSON.stringify(reading.state, null, 2),
                "application/json",
              )
            }
          >
            <Download size={16} />
            导出阅读记录
          </button>
        </div>
      )}
      <div className="filter-panel">
        <label className="search-field">
          <Search size={21} />
          <input
            type="search"
            placeholder="搜索案例、业务问题或原文关键词"
            aria-label="搜索案例、业务问题或原文关键词"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="icon-button"
              onClick={() => setQuery("")}
              aria-label="清空搜索"
            >
              <X size={16} />
            </button>
          )}
        </label>
        <div className="filter-row">
          <div className="topic-filter" aria-label="按业务问题筛选">
            {topics.map((t) => (
              <button
                key={t}
                aria-pressed={t === topic}
                className={t === topic ? "selected" : ""}
                onClick={() => setTopic(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="select-filters">
            <SlidersHorizontal size={15} />
            <select
              aria-label="筛选行业"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              {["全部行业", ...new Set(cases.map((c) => c.industry))].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </select>
            <select
              aria-label="筛选项目阶段"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {["全部阶段", ...new Set(cases.map((c) => c.status))].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="results-line" aria-live="polite">
        <span>
          {filtered.length} 个案例{query && `，包含“${query}”`}
        </span>
        <span>按报告顺序排列</span>
      </div>
      {filtered.length ? (
        <div className="case-grid">
          {filtered.map((c) => (
            <CaseCard
              key={c.id}
              item={c}
              reading={reading}
              compare={compare}
              onCompare={onCompare}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <Bookmark size={32} />
          <h2>{mine ? "这里还没有案例" : "没有找到匹配案例"}</h2>
          <p>
            {mine
              ? "打开喜欢的案例，收藏、标记已读或写下笔记。"
              : "试试其他关键词，或清除筛选条件。"}
          </p>
          {mine ? (
            <a className="button primary" href="#/cases">
              浏览案例库
            </a>
          ) : (
            <button className="button primary" onClick={reset}>
              清除筛选
            </button>
          )}
        </div>
      )}
      {compare.length > 0 && (
        <div className="compare-dock">
          <div>
            <strong>比较案例</strong>
            <span>{compare.map((id) => cases[id - 1].name).join(" / ")}</span>
          </div>
          <div className="dock-actions">
            <button
              className="text-link"
              onClick={() => compare.forEach(onCompare)}
            >
              清空
            </button>
            <a
              className={`button primary ${compare.length < 2 ? "disabled" : ""}`}
              aria-disabled={compare.length < 2}
              tabIndex={compare.length < 2 ? -1 : 0}
              href={
                compare.length === 2
                  ? `#/compare/${compare.join(",")}`
                  : undefined
              }
            >
              比较 {compare.length}/2 <ArrowRight size={16} />
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
