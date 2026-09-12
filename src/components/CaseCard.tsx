import { ArrowUpRight, Bookmark, Check, Plus } from "lucide-react";
import type { Case } from "../model";
import type { Reading } from "../state";
import { takeawayFor } from "../insights";
import { shortCases } from "./map/mapData";
export function CaseCard({
  item,
  reading,
  compare,
  onCompare,
  featured = false,
}: {
  item: Case;
  reading: Reading;
  compare?: number[];
  onCompare?: (id: number) => void;
  featured?: boolean;
}) {
  const saved = reading.state.saved.includes(item.id);
  const takeaway = takeawayFor(item.id);
  return (
    <article
      className={`case-card ${featured ? "featured" : ""} tone-${item.id % 4}`}
    >
      <div className="card-meta">
        <span>
          报告 NO.{String(item.id).padStart(2, "0")}{" "}
          <span className="meta-divider">/</span> {item.industry}
        </span>
        <button
          className={`icon-button ${saved ? "active" : ""}`}
          onClick={() => reading.toggle("saved", item.id)}
          aria-label={`${saved ? "取消收藏" : "收藏"}${item.name}`}
          aria-pressed={saved}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <a className="card-link" href={`#/case/${item.id}`}>
        <h3>{item.name}</h3>
        <p className="card-takeaway">
          <span>最值得学</span>
          <strong>{takeaway.headline}</strong>
        </p>
        <p className="card-description">{item.summary}</p>
        <div className="card-metric">
          <strong>{item.metric}</strong>
          <span>{item.metricLabel}</span>
        </div>
        <p className="card-boundary">{shortCases[item.id - 1][5]}</p>
        <div className="card-bottom">
          <span>
            {item.status}
            {reading.state.read.includes(item.id) && (
              <span className="read-indicator">
                <Check size={13} /> 已读
              </span>
            )}
          </span>
          <span className="circle-arrow">
            <ArrowUpRight size={19} />
          </span>
        </div>
      </a>
      {onCompare && (
        <button
          className={`compare-add ${compare?.includes(item.id) ? "selected" : ""}`}
          onClick={() => onCompare(item.id)}
          aria-pressed={compare?.includes(item.id)}
        >
          {compare?.includes(item.id) ? (
            <Check size={14} />
          ) : (
            <Plus size={14} />
          )}{" "}
          {compare?.includes(item.id) ? "已加入比较" : "加入比较"}
        </button>
      )}
    </article>
  );
}
