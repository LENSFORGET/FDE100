import { useState } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { cases, pdfUrl } from "../model";
import { insights } from "../insights";
import { Emphasis } from "./Emphasis";

export function InsightExplorer({
  compact = false,
  initial = "value",
}: {
  compact?: boolean;
  initial?: string;
}) {
  const [active, setActive] = useState(
    insights.findIndex((i) => i.id === initial) < 0
      ? 0
      : insights.findIndex((i) => i.id === initial),
  );
  const selected = insights[active];
  const options = compact
    ? insights.filter((i) => ["value", "workflow", "evidence"].includes(i.id))
    : insights;
  return (
    <div className={`insight-explorer ${compact ? "is-compact" : ""}`}>
      <div
        className="insight-tabs"
        role="tablist"
        aria-label="选择一条落地经验"
      >
        {options.map((item, index) => (
          <button
            key={item.id}
            id={`insight-tab-${item.id}`}
            role="tab"
            aria-selected={selected.id === item.id}
            aria-controls="insight-panel"
            tabIndex={selected.id === item.id ? 0 : -1}
            onClick={() => setActive(insights.indexOf(item))}
            onKeyDown={(e) => {
              let next = index;
              if (e.key === "ArrowRight") next = (index + 1) % options.length;
              else if (e.key === "ArrowLeft")
                next = (index - 1 + options.length) % options.length;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = options.length - 1;
              else return;
              e.preventDefault();
              setActive(insights.indexOf(options[next]));
              document
                .getElementById(`insight-tab-${options[next].id}`)
                ?.focus();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        id="insight-panel"
        className="insight-panel"
        role="tabpanel"
        aria-labelledby={`insight-tab-${selected.id}`}
        tabIndex={0}
      >
        <div className="insight-point" key={selected.id}>
          <h3>{selected.title}</h3>
          <p>
            <Emphasis text={selected.text} terms={selected.emphasis} />
          </p>
          <div className="insight-action">
            <strong>你可以这样开始</strong>
            <p>{selected.action}</p>
          </div>
        </div>
        <div className="insight-evidence">
          <h4>从这些案例中读到</h4>
          {selected.evidence.map((item) => {
            const c = cases[item.id - 1];
            return (
              <article key={item.id}>
                <a className="evidence-case" href={`#/case/${c.id}`}>
                  <span>{c.name}</span>
                  <ChevronRight size={16} />
                </a>
                <p>{item.note}</p>
                <a
                  className="evidence-source"
                  href={pdfUrl(c.qa[5].pdfPage)}
                  target="_blank"
                  rel="noreferrer"
                >
                  经验原文 · PDF 第 {c.qa[5].pdfPage} 页起{" "}
                  <ExternalLink size={11} />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
