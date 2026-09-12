import {
  ChevronRight,
  ArrowLeft,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { cases, routes, pdfUrl } from "../model";
import type { Reading } from "../state";
import { CaseCard } from "./CaseCard";
export function Guide() {
  const items = [
    [
      "从业务出发",
      "企业说“想用 AI”，还不是一个可以实施的需求。先看一个人每天做什么、在哪儿停下、哪里反复出错。",
      "案例 01：跟着员工走流程，把新人高频问题变成知识地图。",
      1,
    ],
    [
      "把任务分给合适的角色",
      "大模型处理语言和非结构化信息；计算、规则与执行交给适合的系统；关键判断和责任留给人。",
      "案例 06：大模型负责调度，专业算法负责三维装载计算。",
      6,
    ],
    [
      "把交付放回原有流程",
      "能演示不代表有人用。入口、权限、系统衔接和一线工作习惯，决定工具能否进入日常。",
      "案例 02：从识别材料一直连到填单与跨系统流转。",
      2,
    ],
    [
      "让验证和能力留下来",
      "用真实业务样本验证，也要让企业能持续维护、判断效果、解决下一个问题。",
      "案例 14：业务同事开始自己发现需求并构建小工具。",
      14,
    ],
  ];
  return (
    <main className="guide-page">
      <header className="guide-hero">
        <h1>
          一份报告，
          <br />
          读懂落地的全过程。
        </h1>
        <p>
          FDE 站在技术与业务之间，和企业一起发现问题、
          <br className="desktop-break" />
          构建方案、验证价值，并把能力留在组织里。
        </p>
        <a className="button primary" href="#/path/start">
          从三个案例开始 <ChevronRight size={17} />
        </a>
      </header>
      <div className="guide-content">
        <section>
          <h2>这份报告，记录了什么？</h2>
          <p>
            Datawhale 在 2026 年 9 月 6 日的序言中，把这本案例集定位为企业 AI
            落地探索的阶段性记录。本版有 24 个案例，按照 FDE
            姓名首字母排序。“100”是项目名称，不代表这份报告已经收录 100 篇。
          </p>
          <p>
            每篇访谈围绕六个问题展开：场景是什么、以前怎么做、后来怎么解决、效果如何、遇到什么挑战、有哪些经验。案例既包含落地反馈，也包含仍在验证或交付中的探索。
          </p>
          <a
            className="source-link"
            href={pdfUrl(2)}
            target="_blank"
            rel="noreferrer"
          >
            阅读报告序言与目录 <ExternalLink size={13} />
          </a>
        </section>
        <section>
          <h2>可以沿着这条主线读。</h2>
          <p className="muted">
            以下是本站从案例中整理的阅读框架，不是报告提出的统一标准。
          </p>
          <div className="guide-principles">
            {items.map(([title, text, example, id], i) => (
              <article key={id}>
                <span className="principle-index">{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <a href={`#/case/${id}`}>
                    {example}
                    <ChevronRight size={15} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="guide-caution">
          <h2>读到数字时，多问一句。</h2>
          <p>
            比较的对象一样吗？是模拟测试、局部试点还是生产反馈？“生成结果”是否还需要人工审核？有没有把节省工时误写成利润提升？
          </p>
          <div className="status-examples">
            <div>
              <strong>原型与预期</strong>
              <p>物流装载的测试容积与预计装车时间，是两种不同层级的证据。</p>
              <a href="#/case/6">
                读案例 06 <ChevronRight size={14} />
              </a>
            </div>
            <div>
              <strong>初步产出</strong>
              <p>建筑图纸的约30分钟，指初步生成，后面仍有专业调整与确认。</p>
              <a href="#/case/21">
                读案例 21 <ChevronRight size={14} />
              </a>
            </div>
            <div>
              <strong>尚未验证</strong>
              <p>经营数据更透明，不意味着已经证明利润、成本发生量化改善。</p>
              <a href="#/case/20">
                读案例 20 <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </section>
        <section>
          <h2>遇到术语，先用一句话理解。</h2>
          <div className="original-list">
            {[
              [
                "FDE",
                "深入客户现场，把业务需求转成可实施方案，并参与验证和持续采用的工程角色。报告尤其强调与企业共建能力。",
              ],
              [
                "RAG",
                "检索增强生成：先从指定资料中找相关内容，再让模型基于这些内容回答。资料质量、检索和引用都需要检查。",
              ],
              [
                "OCR",
                "文字识别：把照片或扫描件里的字转成可以处理的数据。识别结果仍可能出错，不能省略校验。",
              ],
              [
                "RPA",
                "流程机器人：按规则执行界面点击、填单和系统间搬数据等重复动作。页面或业务规则改变时需要维护。",
              ],
              [
                "Agent",
                "能根据任务调用工具、执行多个步骤的 AI 系统。是否可靠，要看数据、工具权限、评测和异常处理。",
              ],
              [
                "POC",
                "概念验证：用较小的范围验证方案是否可行。通过验证不代表已经规模化上线或证明全部收益。",
              ],
              [
                "Spec",
                "规格说明：明确要解决什么问题、做出什么结果、如何验收，让人与 AI 研发有共同依据。",
              ],
              [
                "ROI",
                "投入产出评价。衡量时要把建设、运行、维护与人的投入一起考虑，不能仅用模型响应速度推断。",
              ],
            ].map(([term, definition]) => (
              <details key={term}>
                <summary>
                  <strong>{term}</strong>
                  <ChevronRight size={17} />
                </summary>
                <div className="original-body">
                  <p>{definition}</p>
                </div>
              </details>
            ))}
          </div>
          <p className="section-note">
            以上为本站帮助阅读的简要解释，具体含义以每个案例的上下文为准。
          </p>
        </section>
        <section>
          <h2>把阅读，变成一次分享。</h2>
          <p>
            选一个与你听众相关的问题，讲清“原来怎样 → 改了什么 → 效果怎样 →
            还不能证明什么”。每篇案例都有讲解提纲和可下载文件，你可以补上自己的行业经验再分享。
          </p>
          <a className="button primary" href="#/path/share">
            准备一场分享 <ArrowRight size={17} />
          </a>
        </section>
      </div>
    </main>
  );
}
export function LearningPath({
  pathId,
  reading,
}: {
  pathId: string;
  reading: Reading;
}) {
  const path = routes.find((r) => r.id === pathId);
  if (!path) return <NotFound />;
  return (
    <main className="section path-page">
      <a href="#/" className="back-link">
        <ArrowLeft size={16} />
        返回首页
      </a>
      <div className="page-heading">
        <h1>{path.title}</h1>
        <p>{path.description} 阅读时间为本站估计，可按自己的节奏展开原文。</p>
      </div>
      <div className="path-progress">
        <BookOpen size={20} />
        <span>
          已完成{" "}
          {path.ids.filter((id) => reading.state.read.includes(id)).length} / 3
          篇
        </span>
        <a
          className="text-link"
          href={`#/case/${path.ids.find((id) => !reading.state.read.includes(id)) || path.ids[0]}`}
        >
          继续阅读 <ChevronRight size={16} />
        </a>
      </div>
      <div className="case-grid">
        {path.ids.map((id) => (
          <CaseCard key={id} item={cases[id - 1]} reading={reading} />
        ))}
      </div>
      <div className="path-question">
        <h2>读完后，试着回答。</h2>
        <p>
          {pathId === "start"
            ? "这些案例改变了哪些人的日常工作？哪些任务留给了人？"
            : pathId === "build"
              ? "你的最小试点是什么？用什么样本验收？谁负责上线后继续维护？"
              : "你能否用一个已反馈的结果、一个预期结果和一个初步产出，讲清它们的差别？"}
        </p>
      </div>
    </main>
  );
}
export function About() {
  return (
    <main className="section about-page">
      <div className="page-heading">
        <h1>让每一份解读，都有出处。</h1>
        <p>这是基于 Datawhale 报告整理的独立导读项目。</p>
      </div>
      <div className="prose">
        <h2>内容来源</h2>
        <p>
          本网站以用户提供的《Datawhale FDE案例100》PDF 为内容基准。序言日期为
          2026 年 9 月 6 日，文件共 247 个物理页面。本版目录收录 24
          篇案例，印刷页码与 PDF 物理页码相差一页。
        </p>
        <p>
          报告、封面及访谈原文的权利归 Datawhale 与相应作者或权利人所有。本站非
          Datawhale
          官方网站；导读摘要、分类、阅读路线与讲解建议由本项目整理，不代表报告作者的统一结论。
        </p>
        <div className="source-links">
          <a href={pdfUrl()} target="_blank" rel="noreferrer">
            本版报告 PDF <ExternalLink size={14} />
          </a>
          <a
            href="https://assets.datawhale.cn/Datawhale%20FDE%E6%A1%88%E4%BE%8B100.pdf"
            target="_blank"
            rel="noreferrer"
          >
            官方 PDF 来源 <ExternalLink size={14} />
          </a>
          <a
            href="https://fde100.datawhale.cn/cases"
            target="_blank"
            rel="noreferrer"
          >
            Datawhale 案例官网 <ExternalLink size={14} />
          </a>
        </div>
        <h2>为什么与官网不同？</h2>
        <p>
          2026 年 9 月 12 日核对时，官网和这份 PDF
          都有24篇，但顺序、个别条目及部分成果口径不同。本站保留 PDF 的 NO.
          编号，并将确认匹配的官网条目单独链接，不把官网编号当成报告编号。
        </p>
        <p>
          PDF
          案例11“外贸企业资料整理”在官网列表中未找到直接对应条目；官网则列有“跨境电商AI工作流矩阵”，本版
          PDF 目录没有同名条目。因此，本站没有补写第25个报告案例。
        </p>
        <h2>如何区分事实与解读？</h2>
        <p>
          “报告原文”展示提取的访谈正文，图表、人物信息与排版请查看
          PDF。“导读整理”用更短的语言解释业务问题、实施步骤与结果。“可以借鉴什么”和讲解提纲属于本站解读及建议。
        </p>
        <p>
          指标保留适用范围和原型、试点、预期、脱敏等限定。案例中的效果来自受访者陈述，本站未做独立审计，也不会将不同项目的数字相加为总收益。
        </p>
        <h2>阅读记录存在哪里？</h2>
        <p>
          收藏、已读与笔记仅存储在此浏览器，不需要账号，也不会上传到服务器。更换设备、使用隐私模式或清除浏览器数据后，记录可能无法保留。你可以在“我的阅读”导出记录，或在案例页单独导出笔记。
        </p>
        <h2>纠错与共建</h2>
        <p>
          欢迎通过 GitHub 提交修正。请提供案例编号、PDF
          页码、原文依据和建议修改，不要只提交一个没有来源的结果数字。
        </p>
        <a
          className="button subtle"
          href="https://github.com/LENSFORGET/FDE100/issues"
          target="_blank"
          rel="noreferrer"
        >
          在 GitHub 提交反馈 <ExternalLink size={15} />
        </a>
      </div>
    </main>
  );
}
export function NotFound() {
  return (
    <main className="section empty">
      <h1>没有找到这个页面。</h1>
      <p>案例编号应在 1–24 之间。你可以从案例库重新开始。</p>
      <a href="#/cases" className="button primary">
        打开案例库
      </a>
    </main>
  );
}
