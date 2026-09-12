import {
  ChevronRight,
  BookOpen,
  Layers,
  MessagesSquare,
  ArrowUpRight,
} from "lucide-react";
import { cases, routes, pdfUrl } from "../model";
import { CaseCard } from "./CaseCard";
import type { Reading } from "../state";
export function Home({ reading }: { reading: Reading }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1>
            读懂 AI，
            <br />
            如何真正落地。
          </h1>
          <p>
            24 个企业现场，把一份报告读成自己的经验。
            <br className="desktop-break" />
            从业务难题到实施方法，再到值得借鉴的下一步。
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#/guide">
              开始读报告
            </a>
            <a className="text-link" href="#/cases">
              探索全部案例 <ChevronRight size={18} />
            </a>
          </div>
        </div>
        <div className="report-stage">
          <a
            className="report-book"
            href={pdfUrl()}
            target="_blank"
            rel="noreferrer"
            aria-label="打开 Datawhale FDE案例100 原报告"
          >
            <img
              src={`${import.meta.env.BASE_URL}report-cover.jpg`}
              alt="Datawhale FDE案例100 原报告封面"
              fetchPriority="high"
            />
            <span className="book-spine" />
          </a>
          <div className="report-preview">
            <span className="preview-line">翻开报告，你会发现</span>
            <h2>
              落地的关键，
              <br />
              往往在模型之外。
            </h2>
            <p>
              走进现场。拆清问题。验证价值。
              <br />
              让一次交付，留下持续改变的能力。
            </p>
            <a href="#/guide" className="text-link">
              了解报告主线 <ChevronRight size={16} />
            </a>
            <div className="report-edition">
              Datawhale 原报告 · 2026 年 9 月 6 日<br />
              本版收录 24 篇案例，“100”为项目名称
            </div>
          </div>
        </div>
      </section>
      <section className="section paths-section">
        <div className="section-heading">
          <h2>从你的目的开始。</h2>
          <p>不必从第一页读到最后一页。</p>
        </div>
        <div className="paths">
          {routes.map((r, i) => (
            <a href={`#/path/${r.id}`} className="path-card" key={r.id}>
              <div className="path-icon">
                {i === 0 ? (
                  <BookOpen />
                ) : i === 1 ? (
                  <Layers />
                ) : (
                  <MessagesSquare />
                )}
              </div>
              <h3>{r.title}</h3>
              <p>{r.description}</p>
              <div className="path-bottom">
                <span>3 个案例 · {r.time}</span>
                <ChevronRight size={18} />
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="section featured-section">
        <div className="section-heading">
          <h2>先看三个真实改变。</h2>
          <a className="text-link" href="#/cases">
            浏览案例库 <ChevronRight size={17} />
          </a>
        </div>
        <div className="case-grid">
          {[1, 2, 17].map((id) => (
            <CaseCard
              key={id}
              item={cases[id - 1]}
              reading={reading}
              featured
            />
          ))}
        </div>
        <p className="section-note">
          案例效果来自报告中的项目反馈。查看详情，了解适用范围与尚未验证的部分。
        </p>
      </section>
      <section className="source-band">
        <div>
          <BookOpen size={28} />
          <h2>读解读，也能回到原文。</h2>
          <p>
            每篇案例保留六组访谈问答、PDF 页码与原始出处。
            <br />
            讲解建议单独呈现，重要数字连同边界一起阅读。
          </p>
          <a className="text-link" href="#/about">
            内容与来源说明 <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
    </>
  );
}
