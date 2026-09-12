import { ArrowLeft, Download } from "lucide-react";
import { cases, talkText, download } from "../model";
import { NotFound } from "./Guide";
export function Compare({ ids }: { ids: number[] }) {
  const items = ids.map((id) => cases.find((c) => c.id === id));
  if (ids.length !== 2 || ids[0] === ids[1] || items.some((c) => !c))
    return <NotFound />;
  const [a, b] = items as [(typeof cases)[number], (typeof cases)[number]];
  const rows = [
    ["业务问题", a.problem, b.problem],
    ["实施步骤", a.steps.join("\n"), b.steps.join("\n")],
    ["项目阶段", a.status, b.status],
    ["报告反馈", a.outcome, b.outcome],
    ["结果边界", a.boundary, b.boundary],
    ["借鉴经验", a.lesson, b.lesson],
    ["讨论问题", a.question, b.question],
    [
      "报告出处",
      `NO.${a.id} / PDF 第 ${a.pdfStart}–${a.pdfEnd} 页`,
      `NO.${b.id} / PDF 第 ${b.pdfStart}–${b.pdfEnd} 页`,
    ],
  ];
  return (
    <main className="section compare-page">
      <a className="back-link" href="#/cases">
        <ArrowLeft size={16} />
        返回案例库
      </a>
      <div className="page-heading">
        <h1>放在一起，看得更清楚。</h1>
        <p>比较方法和边界。不同行业、阶段和任务的效率数字，不宜直接排名。</p>
      </div>
      <div
        className="compare-scroll"
        tabIndex={0}
        aria-label="案例比较表，可横向滚动"
      >
        <table>
          <thead>
            <tr>
              <th>比较维度</th>
              {[a, b].map((c) => (
                <th key={c.id}>
                  <small>报告 NO.{c.id}</small>
                  <a href={`#/case/${c.id}`}>{c.name}</a>
                  <span>{c.industry}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, x, y]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{x}</td>
                <td>{y}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="button subtle"
        onClick={() =>
          download(
            "FDE100-案例比较.md",
            `# 案例比较\n\n${rows.map(([label, x, y]) => `## ${label}\n\n### ${a.name}\n${x}\n\n### ${b.name}\n${y}\n`).join("\n")}\n---\n\n${talkText(a)}\n---\n\n${talkText(b)}`,
          )
        }
      >
        <Download size={16} />
        下载比较与讲解提纲
      </button>
    </main>
  );
}
