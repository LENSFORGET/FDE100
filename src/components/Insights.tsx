import { useState } from "react";
import { ChevronRight, Layers, Search } from "lucide-react";
import { cases } from "../model";
import { takeaways } from "../insights";
import { InsightExplorer } from "./InsightExplorer";

export function Insights({ initial = "value" }: { initial?: string }) {
  const [query, setQuery] = useState("");
  const found = takeaways.filter((t) =>
    `${cases[t.id - 1].name} ${t.headline} ${t.why}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <main className="insights-page">
      <header className="section insights-heading">
        <div>
          <h1>
            先读精华，
            <br />
            带走六个判断。
          </h1>
          <p>
            从 24 篇访谈的反馈与经验中，挑出<strong>可迁移、能行动</strong>
            的方法。
            <br className="desktop-break" />
            先读重点，再点案例看它是怎么发生的。
          </p>
        </div>
        <a href="#/map" className="button subtle">
          <Layers size={16} /> 用地图看全貌
        </a>
      </header>
      <section className="section insight-main" aria-label="六条可迁移经验">
        <InsightExplorer initial={initial} />
        <p className="editorial-note">
          这些是本站的导读归纳，依据受访者的项目反馈与经验；案例链接和 PDF
          页码供你核对。
        </p>
      </section>
      <section className="section takeaway-index">
        <div className="section-heading">
          <div>
            <h2>每个案例，一个值得学的方法。</h2>
            <p>先找到与你有关的那一条。</p>
          </div>
          <label className="takeaway-search">
            <Search size={17} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索经验或案例"
              aria-label="搜索精华要点"
            />
          </label>
        </div>
        <div className="takeaway-list" aria-live="polite">
          {found.map((t) => (
            <a href={`#/case/${t.id}`} key={t.id}>
              <span className="takeaway-case">{cases[t.id - 1].name}</span>
              <strong>{t.headline}</strong>
              <ChevronRight size={19} />
            </a>
          ))}
          {!found.length && (
            <div className="empty">
              <p>没有匹配的经验。试试“数据”“流程”或清空关键词。</p>
              <button className="text-link" onClick={() => setQuery("")}>
                显示全部要点
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
