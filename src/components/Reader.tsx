import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Download,
  Link as LinkIcon,
  ExternalLink,
  ChevronDown,
  BookOpen,
  MessagesSquare,
  Layers,
  ChevronRight,
} from "lucide-react";
import { cases, pdfUrl, talkText, download } from "../model";
import type { Case } from "../model";
import type { Reading } from "../state";
import { takeawayFor } from "../insights";
import { shortCases } from "./map/mapData";
import { Emphasis } from "./Emphasis";
const sections = [
  ["overview", "一句话读懂"],
  ["problem", "原来卡在哪里"],
  ["solution", "方案怎么落地"],
  ["outcome", "效果与边界"],
  ["lesson", "可以借鉴什么"],
  ["talk", "讲给别人听"],
  ["original", "对照访谈原文"],
  ["notes", "我的笔记"],
];
type ReadView = "quick" | "full" | "talk" | "original";
export function Reader({
  item: c,
  reading,
  initialSection = "",
}: {
  item: Case;
  reading: Reading;
  initialSection?: string;
}) {
  const [copied, setCopied] = useState("");
  const [mode, setMode] = useState("guide");
  const [view, setView] = useState<ReadView>(
    initialSection === "talk"
      ? "talk"
      : initialSection === "original"
        ? "original"
        : "quick",
  );
  const [pending, setPending] = useState(initialSection);
  const takeaway = takeawayFor(c.id);
  const glance = shortCases[c.id - 1];
  function show(next: ReadView, target = "reader-mode-panel") {
    setView(next);
    setPending(target);
  }
  useEffect(() => {
    if (!pending) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(pending);
      const details = target?.closest("details");
      if (details) details.open = true;
      target?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
      setPending("");
    });
    return () => cancelAnimationFrame(frame);
  }, [pending, view]);
  useEffect(() => {
    reading.visit(c.id);
  }, [c.id]);
  const saved = reading.state.saved.includes(c.id);
  const read = reading.state.read.includes(c.id);
  async function share() {
    try {
      await navigator.clipboard.writeText(location.href);
      setCopied("链接已复制");
    } catch {
      setCopied("请复制浏览器地址栏中的链接");
    }
  }
  return (
    <main className="reader-shell">
      <aside className="reader-sidebar">
        <a className="back-link" href="#/cases">
          <ArrowLeft size={16} />
          全部案例
        </a>
        <a className="sidebar-map" href={`#/map?case=${c.id}`}>
          <Layers size={16} /> 用地图看这篇 <ChevronRight size={14} />
        </a>
        <span className="sidebar-label">按你需要的深度读</span>
        <button
          className={`sidebar-quick ${view === "quick" ? "selected" : ""}`}
          onClick={() => show("quick")}
        >
          先看重点
        </button>
        <nav>
          {sections.map(([id, label]) => (
            <a
              key={id}
              href={`#/case/${c.id}`}
              onClick={(e) => {
                e.preventDefault();
                if (id === "overview") show("quick", "overview");
                else if (id === "notes") setPending("notes");
                else
                  show(
                    id === "original"
                      ? "original"
                      : id === "talk"
                        ? "talk"
                        : "full",
                    id,
                  );
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          className="sidebar-pdf"
          href={pdfUrl(c.pdfStart)}
          target="_blank"
          rel="noreferrer"
        >
          <BookOpen size={18} />
          <span>
            阅读报告原页
            <small>
              PDF 第 {c.pdfStart}–{c.pdfEnd} 页
            </small>
          </span>
          <ExternalLink size={13} />
        </a>
      </aside>
      <article className="reader">
        <header id="overview" className="reader-header">
          <div className="reader-meta">
            {c.name} <span>/</span> {c.industry} <span>/</span> {c.status}
          </div>
          <h1>{c.title}</h1>
          <p className="reader-deck">
            <Emphasis text={c.summary} terms={takeaway.emphasis} />
          </p>
          <div className="reader-tools">
            <a href={`#/map?case=${c.id}`} className="button subtle">
              <Layers size={16} /> 看案例结构
            </a>
            <button
              className={`button ${saved ? "selected" : "subtle"}`}
              onClick={() => reading.toggle("saved", c.id)}
              aria-pressed={saved}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              {saved ? "已收藏" : "收藏案例"}
            </button>
            <button
              className={`button ${read ? "selected" : "subtle"}`}
              onClick={() => reading.toggle("read", c.id)}
              aria-pressed={read}
            >
              <Check size={16} />
              {read ? "已读" : "标记已读"}
            </button>
            <button
              className="icon-button"
              aria-label="复制案例链接"
              onClick={share}
            >
              <LinkIcon size={19} />
            </button>
            {copied && (
              <span className="tool-feedback" role="status">
                {copied}
              </span>
            )}
          </div>
          <div className="reader-source">
            本站导读 · 原报告 NO.{String(c.id).padStart(2, "0")} ·{" "}
            <a href={pdfUrl(c.pdfStart)} target="_blank" rel="noreferrer">
              PDF 第 {c.pdfStart}–{c.pdfEnd} 页 <ExternalLink size={11} />
            </a>
          </div>
        </header>
        <div className="reader-mode-nav" role="group" aria-label="选择阅读方式">
          {(
            [
              ["quick", "重点速读"],
              ["full", "完整解读"],
              ["talk", "讲解提纲"],
              ["original", "访谈原文"],
            ] as [ReadView, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              aria-pressed={view === value}
              onClick={() => show(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div id="reader-mode-panel">
          {view === "quick" && (
            <div className="quick-reading">
              <section className="quick-value">
                <span className="quick-label">这个案例，最值得学什么</span>
                <h2>{takeaway.headline}</h2>
                <p>{takeaway.why}</p>
                <button
                  className="text-link"
                  onClick={() => show("original", "q6")}
                >
                  看受访者的经验原文 <ChevronRight size={15} />
                </button>
              </section>
              <section className="quick-structure" aria-label="案例要点">
                <div>
                  <span>原来的问题</span>
                  <strong>{glance[1]}</strong>
                </div>
                <div>
                  <span>怎么落地</span>
                  <ol>
                    {glance.slice(2, 5).map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                </div>
                <div className="quick-result">
                  <span>{c.status}</span>
                  <strong>{c.metric}</strong>
                  <p>{c.metricLabel}</p>
                </div>
              </section>
              <div className="quick-boundary">
                <strong>和结果一起读</strong>
                <p>
                  <Emphasis text={c.boundary} terms={takeaway.emphasis} />
                </p>
              </div>
              <section className="quick-action">
                <span>迁移到你的工作</span>
                <h3>可以先试这一步。</h3>
                <p>{takeaway.action}</p>
                <small>本站基于案例整理的行动建议</small>
              </section>
              <div className="quick-next">
                <button
                  className="button primary"
                  onClick={() => show("full", "problem")}
                >
                  展开完整过程 <ChevronRight size={16} />
                </button>
                <button className="text-link" onClick={() => show("talk")}>
                  准备讲给别人听 <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
          {view === "full" && (
            <>
              <section id="problem" className="reading-section">
                <span className="section-number">业务问题</span>
                <h2>原来，卡在哪里？</h2>
                <p>
                  <Emphasis text={c.problem} terms={takeaway.emphasis} />
                </p>
                <SourceLink c={c} q={1} />
              </section>
              <section id="solution" className="reading-section">
                <span className="section-number">实施路径</span>
                <h2>从发现问题，到进入流程。</h2>
                <ol className="steps">
                  {c.steps.map((s, i) => (
                    <li key={s}>
                      <span>{i + 1}</span>
                      <p>
                        <Emphasis text={s} terms={takeaway.emphasis} />
                      </p>
                    </li>
                  ))}
                </ol>
                <SourceLink c={c} q={3} />
              </section>
              <section id="outcome" className="reading-section">
                <span className="section-number">效果与边界</span>
                <h2>发生了什么改变？</h2>
                <div className="result-callout">
                  <strong>{c.metric}</strong>
                  <span>{c.metricLabel}</span>
                </div>
                <p>
                  <Emphasis text={c.outcome} terms={takeaway.emphasis} />
                </p>
                <div className="boundary">
                  <h3>读这个结果时，要一起看。</h3>
                  <p>
                    <Emphasis text={c.boundary} terms={takeaway.emphasis} />
                  </p>
                </div>
                <SourceLink c={c} q={4} />
              </section>
              <section id="lesson" className="reading-section">
                <span className="section-number">导读解读</span>
                <h2>可以带走的经验。</h2>
                <blockquote>{takeaway.headline}</blockquote>
                <p>{takeaway.why}</p>
                <div className="lesson-action">
                  <strong>可以尝试</strong>
                  <p>{takeaway.action}</p>
                </div>
                <p className="muted">把它迁移到自己的工作前，先回答：</p>
                <p>{c.question}</p>
                <SourceLink c={c} q={6} />
              </section>
            </>
          )}
          {view === "talk" && (
            <section id="talk" className="reading-section talk-section">
              <div className="section-title-row">
                <h2>讲给别人听。</h2>
                <MessagesSquare size={25} />
              </div>
              <p className="muted">
                把这篇案例讲成一个约 3 分钟的故事。以下是本站讲解建议。
              </p>
              <div className="talk-takeaway">
                <strong>这一篇的讲解主线</strong>
                <p>{takeaway.headline}</p>
              </div>
              <div className="segmented">
                <button
                  className={mode === "guide" ? "selected" : ""}
                  onClick={() => setMode("guide")}
                >
                  讲解提纲
                </button>
                <button
                  className={mode === "full" ? "selected" : ""}
                  onClick={() => setMode("full")}
                >
                  完整讲稿
                </button>
              </div>
              {mode === "guide" ? (
                <ol className="talk-outline">
                  <li>
                    <strong>先讲问题</strong>
                    <span>
                      <Emphasis text={c.problem} terms={takeaway.emphasis} />
                    </span>
                  </li>
                  <li>
                    <strong>再讲关键变化</strong>
                    <span>
                      <Emphasis text={c.steps[1]} terms={takeaway.emphasis} />
                    </span>
                  </li>
                  <li>
                    <strong>用结果说明价值</strong>
                    <span>
                      <Emphasis text={c.outcome} terms={takeaway.emphasis} />
                    </span>
                  </li>
                  <li>
                    <strong>最后讲清边界</strong>
                    <span>
                      <Emphasis text={c.boundary} terms={takeaway.emphasis} />
                    </span>
                  </li>
                </ol>
              ) : (
                <div className="talk-full">
                  <p>
                    今天分享的案例是“{c.name}”。先看它原来的问题：{c.problem}
                  </p>
                  <p>项目是怎样推进的？{c.steps.join("")}</p>
                  <p>
                    结果如何？{c.outcome} 不过，需要同时说明：{c.boundary}
                  </p>
                  <p>
                    这个案例带给我们的启发是：{c.lesson}{" "}
                    如果放到我们自己的工作里，可以先讨论：{c.question}
                  </p>
                </div>
              )}
              <button
                className="button subtle"
                onClick={() =>
                  download(
                    `FDE100-${String(c.id).padStart(2, "0")}-讲解提纲.md`,
                    talkText(c),
                  )
                }
              >
                <Download size={16} />
                下载讲解提纲
              </button>
            </section>
          )}
          {view === "original" && (
            <section id="original" className="reading-section">
              <span className="section-number">报告原文</span>
              <h2>回到访谈，读完整过程。</h2>
              <p className="muted">
                按报告的六个问题阅读。文字从 PDF
                提取，已整理换行；图表、人物介绍与原始排版请查看 PDF。
              </p>
              <p className="original-emphasis-note">
                加粗处是本站标出的经验重点，原文措辞保留。
              </p>
              <div className="original-list">
                {c.qa.map((q) => (
                  <details key={q.number} id={`q${q.number}`}>
                    <summary>
                      <span>Q{q.number}</span>
                      <strong>{q.title}</strong>
                      <ChevronDown size={19} />
                    </summary>
                    <div className="original-body">
                      <a
                        className="source-link"
                        href={pdfUrl(q.pdfPage)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        原文起始于 PDF 第 {q.pdfPage} 页{" "}
                        <ExternalLink size={13} />
                      </a>
                      {q.paragraphs.map((p, i) => (
                        <p key={i}>
                          <Emphasis
                            text={p}
                            terms={
                              q.number === takeaway.sourceQ
                                ? [takeaway.sourcePhrase]
                                : []
                            }
                          />
                        </p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
              <div className="source-links">
                <a href={pdfUrl(c.pdfStart)} target="_blank" rel="noreferrer">
                  打开 PDF 原页 <ExternalLink size={14} />
                </a>
                {c.official ? (
                  <a
                    href={`https://fde100.datawhale.cn/cases/cases-${String(c.official).padStart(3, "0")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    对应官网案例 <ExternalLink size={14} />
                  </a>
                ) : (
                  <span>当前官网列表无直接对应条目</span>
                )}
              </div>
            </section>
          )}
        </div>
        <details className="reader-notes">
          <summary>
            <Bookmark size={17} />
            <strong>我的笔记</strong>
            <span>
              {reading.state.notes[c.id]?.trim()
                ? "已有记录，展开继续写"
                : "记录一个想法"}
            </span>
            <ChevronDown size={16} />
          </summary>
          <section id="notes" className="reading-section">
            <h2>留下一点自己的想法。</h2>
            <label htmlFor="case-note" className="muted">
              这篇案例与你的工作有什么关系？笔记仅保存在当前浏览器。
            </label>
            <textarea
              id="case-note"
              rows={5}
              placeholder="记录一个启发、一个疑问，或者准备尝试的下一步……"
              value={reading.state.notes[c.id] || ""}
              onChange={(e) => reading.note(c.id, e.target.value)}
            />
            <div className="note-status">
              {reading.storageError
                ? "浏览器存储不可用，请先导出笔记。"
                : "输入后自动保存到此浏览器"}
              <button
                className="text-link"
                onClick={() =>
                  download(
                    `FDE100-${c.id}-笔记.md`,
                    `# ${c.name}\n\n${reading.state.notes[c.id] || "（暂无笔记）"}\n`,
                  )
                }
              >
                导出笔记 <Download size={14} />
              </button>
            </div>
          </section>
        </details>
        <div className="reader-end">
          <button
            className={`button ${read ? "subtle" : "primary"}`}
            onClick={() => reading.toggle("read", c.id)}
          >
            <Check size={17} />
            {read ? "已完成阅读" : "这篇读完了"}
          </button>
          <div className="reader-pagination">
            {c.id > 1 && (
              <a href={`#/case/${c.id - 1}`}>
                <ArrowLeft size={16} />
                上一篇
              </a>
            )}
            {c.id < 24 && (
              <a href={`#/case/${c.id + 1}`}>
                下一篇：{cases[c.id].name}
                <ArrowRight size={16} />
              </a>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
function SourceLink({ c, q }: { c: Case; q: number }) {
  return (
    <a
      className="source-link"
      href={pdfUrl(c.qa[q - 1].pdfPage)}
      target="_blank"
      rel="noreferrer"
    >
      依据报告 Q{q} · PDF 第 {c.qa[q - 1].pdfPage} 页起{" "}
      <ExternalLink size={12} />
    </a>
  );
}
