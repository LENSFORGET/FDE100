import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  ChevronRight,
  ExternalLink,
  Github,
  Layers,
  Lightbulb,
  MessagesSquare,
  Play,
  Search,
  Workflow,
} from "lucide-react";
import { cases, pdfUrl } from "../model";
import { sources } from "../sources";
import { groups } from "./map/mapData";
import { InsightExplorer } from "./InsightExplorer";
import type { Reading } from "../state";

const entrances = [
  {
    href: "#/map?tour=1",
    title: "看懂全貌",
    description: "1 分钟动态导览",
    icon: Layers,
  },
  {
    href: "#/insights",
    title: "只看精华",
    description: "六条最值得学的经验",
    icon: Lightbulb,
  },
  {
    href: "#/cases",
    title: "找我的场景",
    description: "按问题找 24 个案例",
    icon: Search,
  },
  {
    href: "#/path/share",
    title: "讲给别人听",
    description: "案例路线与讲解提纲",
    icon: MessagesSquare,
  },
];
const demoSteps = [
  {
    title: "原来卡在哪",
    value: "看、读、填、搬，靠人完成。",
    detail: "材料不统一，工作人员还要在多个系统间反复操作。",
    label: "业务问题",
  },
  {
    title: "怎么改流程",
    value: "识别之后，让流程继续走。",
    detail: "识别、抽取、填单各司其职。正常件自动推进，异常件交给人。",
    label: "实施方法",
  },
  {
    title: "得到什么结果",
    value: "15 分钟 → 3–5 分钟",
    detail: "受访者反馈的单件全流程审核时间，来自这一具体项目。",
    label: "项目反馈",
  },
  {
    title: "还要注意什么",
    value: "审核的尺度，仍然由人决定。",
    detail: "业务负责人决定规则宽严，其他场景的效果需要重新验证。",
    label: "适用边界",
  },
];

function HomeDemo() {
  const [step, setStep] = useState(1);
  const current = demoSteps[step];
  return (
    <div className="home-demo" aria-label="交互演示：怎样读懂一个案例">
      <div className="demo-top">
        <span>
          <Workflow size={17} /> 车管所材料审核
        </span>
        <a href="#/map?case=2">
          展开结构 <ArrowUpRight size={14} />
        </a>
      </div>
      <div className="demo-map">
        <svg
          viewBox="0 0 460 190"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M230 56 V87 M56 87 H404 M56 87 V117 M172 87 V117 M288 87 V117 M404 87 V117" />
          <path
            className="demo-path-active"
            d={`M230 56 V87 H${[56, 172, 288, 404][step]} V117`}
          />
        </svg>
        <a href="#/case/2" className="demo-root">
          <BookOpen size={17} />
          <strong>一个案例，四个问题</strong>
        </a>
        <div className="demo-node-row">
          {demoSteps.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setStep(i)}
              aria-pressed={step === i}
              className={step === i ? "selected" : ""}
            >
              <span>{["痛点", "做法", "结果", "边界"][i]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="demo-explanation" aria-live="polite" key={step}>
        <span>{current.title}</span>
        <h2>{current.value}</h2>
        <p>{current.detail}</p>
      </div>
      <div className="demo-bottom">
        <span>点击上方节点，试着读一次。</span>
        <a href="#/case/2">
          看这个案例的重点 <ChevronRight size={14} />
        </a>
      </div>
    </div>
  );
}

export function Home({ reading }: { reading: Reading }) {
  return (
    <main className="home-page">
      <div className="home-source-line">
        <span>独立导读 · 引用自 Datawhale《FDE案例100》</span>
        <a href={sources.website} target="_blank" rel="noreferrer">
          fde100.datawhale.cn/cases <ExternalLink size={11} />
        </a>
        <a href={sources.report} target="_blank" rel="noreferrer">
          官方 PDF <ExternalLink size={11} />
        </a>
      </div>
      <section className="welcome">
        <div className="welcome-inner">
          <div className="welcome-copy">
            <p className="welcome-purpose">
              把一份 AI 落地报告，变成你用得上的经验。
            </p>
            <h1>
              先看懂结构，
              <br />
              再把经验用起来。
            </h1>
            <p className="welcome-description">
              这里是 <strong>24 个真实案例的互动导读</strong>。<br />
              看地图、读重点、找方法，也能准备一次分享。
            </p>
            <div className="welcome-actions">
              <a href="#/map?tour=1" className="button primary">
                <Play size={15} fill="currentColor" /> 播放 1 分钟导览
              </a>
              <a href="#/insights" className="text-link">
                直接读精华 <ChevronRight size={17} />
              </a>
            </div>
            <a className="fde-definition" href="#/guide">
              FDE 是什么？了解报告背景 <ChevronRight size={13} />
            </a>
          </div>
          <HomeDemo />
          <nav className="entrance-nav" aria-label="从你的目的开始">
            {entrances.map(({ href, title, description, icon: Icon }) => (
              <a href={href} key={title}>
                <Icon size={23} strokeWidth={1.5} />
                <div>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>
                <ChevronRight size={16} />
              </a>
            ))}
          </nav>
        </div>
      </section>
      {reading.state.last && (
        <div className="home-resume">
          <Bookmark size={15} />
          <span>接着上次的思考：{cases[reading.state.last - 1].name}</span>
          <a href={`#/case/${reading.state.last}`}>
            继续阅读 <ChevronRight size={14} />
          </a>
          <a href="#/reading" className="resume-shelf">
            我的收藏与笔记
          </a>
        </div>
      )}
      <section className="section home-insights">
        <div className="section-heading">
          <div>
            <h2>先带走几个有用的判断。</h2>
            <p>从受访者的复盘里，找下一次能用上的方法。</p>
          </div>
          <a href="#/insights" className="text-link">
            读全部六条经验 <ChevronRight size={17} />
          </a>
        </div>
        <InsightExplorer compact />
      </section>
      <section className="home-discover">
        <div className="section">
          <div className="section-heading">
            <div>
              <h2>从你正在遇到的问题进入。</h2>
              <p>每篇都先给重点，再按需要展开完整解读。</p>
            </div>
            <a href="#/cases" className="text-link">
              全部案例 <ChevronRight size={17} />
            </a>
          </div>
          <div className="discovery-groups">
            {groups.map((g) => (
              <a
                href={`#/cases?topic=${encodeURIComponent(g.name)}`}
                key={g.id}
                style={{ "--group-color": g.color } as React.CSSProperties}
              >
                <span className="discovery-dot" />
                <div>
                  <h3>{g.question}</h3>
                  <p>
                    {g.name} · {g.ids.length} 个案例
                  </p>
                </div>
                <ChevronRight size={20} />
              </a>
            ))}
          </div>
          <div className="home-tools">
            <a href="#/compare/2,6">
              <Layers size={20} />
              <div>
                <strong>两个案例，放在一起看</strong>
                <p>对照做法、结果与适用边界。</p>
              </div>
              <ChevronRight size={18} />
            </a>
            <a href="#/path/share">
              <MessagesSquare size={20} />
              <div>
                <strong>把理解，变成一次分享</strong>
                <p>选案例、读讲稿、下载提纲。</p>
              </div>
              <ChevronRight size={18} />
            </a>
            <a href="#/reading">
              <Bookmark size={20} />
              <div>
                <strong>留下自己的收藏和笔记</strong>
                <p>下次回来，接着想。</p>
              </div>
              <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </section>
      <section
        className="section home-provenance"
        aria-labelledby="provenance-title"
      >
        <a
          href={pdfUrl()}
          target="_blank"
          rel="noreferrer"
          className="source-cover"
        >
          <img
            src={`${import.meta.env.BASE_URL}report-cover.jpg`}
            alt="Datawhale FDE案例100 原报告封面"
            loading="lazy"
          />
        </a>
        <div className="provenance-copy">
          <h2 id="provenance-title">读到的每一点，都能回到出处。</h2>
          <p>
            本站是基于 <strong>Datawhale《FDE案例100》</strong> 的独立导读。本版
            PDF 收录 24
            篇访谈；“100”是项目名称。原文与效果来自报告，重点、分类和行动建议由本站整理。
          </p>
          <div className="provenance-links">
            <a href={sources.website} target="_blank" rel="noreferrer">
              <span>案例官网</span>
              <strong>fde100.datawhale.cn/cases</strong>
              <ExternalLink size={14} />
            </a>
            <a href={sources.report} target="_blank" rel="noreferrer">
              <span>原始报告</span>
              <strong>assets.datawhale.cn / Datawhale FDE案例100.pdf</strong>
              <ExternalLink size={14} />
            </a>
            <a href={sources.repository} target="_blank" rel="noreferrer">
              <Github size={20} />
              <strong>LENSFORGET / FDE100</strong>
              <span>GitHub 仓库</span>
              <ExternalLink size={14} />
            </a>
          </div>
          <a className="text-link" href="#/about">
            查看引用、版本与内容说明 <ChevronRight size={16} />
          </a>
        </div>
      </section>
    </main>
  );
}
