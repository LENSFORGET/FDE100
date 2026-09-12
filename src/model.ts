import rawCases from "./data/cases.json";
import { takeawayFor } from "./insights";
export const cases = rawCases;
export type Case = (typeof cases)[number];
export const pdfUrl = (page?: number) =>
  `${import.meta.env.BASE_URL}report.pdf${page ? "#page=" + page : ""}`;
export const topics = [
  "全部",
  "知识与培训",
  "流程自动化",
  "数据与决策",
  "销售与内容",
  "组织与协作",
];
export const routes = [
  {
    id: "start",
    title: "第一次了解 FDE",
    description: "从培训、审核和对账，看懂 AI 怎样进入真实工作。",
    ids: [1, 2, 10],
    time: "约 15 分钟",
    icon: "book",
  },
  {
    id: "build",
    title: "准备做自己的项目",
    description: "读懂场景选择、数据基础和上线之后的工作。",
    ids: [8, 18, 16],
    time: "约 20 分钟",
    icon: "layers",
  },
  {
    id: "share",
    title: "准备一次分享",
    description: "用三个不同阶段的案例，讲清价值与边界。",
    ids: [2, 6, 21],
    time: "约 15 分钟",
    icon: "talk",
  },
];
export function talkText(c: Case) {
  const takeaway = takeawayFor(c.id);
  return `# ${c.name}｜讲解提纲\n\n建议讲解约 3 分钟；以下为本站基于报告整理的讲解建议。\n\n## 最值得学\n**${takeaway.headline}**\n\n${takeaway.why}\n\n## 开场：原来的问题\n${c.problem}\n\n## 展开：怎么做\n${c.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n## 结果：发生了什么\n${c.outcome}\n\n## 边界：不能过度解读什么\n${c.boundary}\n\n## 结尾：可以迁移的经验\n${c.lesson}\n\n## 行动建议\n${takeaway.action}\n\n## 讨论\n${c.question}\n\n来源：Datawhale《FDE案例100》，2026年9月6日，NO.${c.id}，印刷页 ${c.printedStart}–${c.printedEnd}，PDF 第 ${c.pdfStart}–${c.pdfEnd} 页。重点总结依据 Q${takeaway.sourceQ}，PDF 第 ${c.qa[takeaway.sourceQ - 1].pdfPage} 页起。\n${c.official ? `对应官网：https://fde100.datawhale.cn/cases/cases-${String(c.official).padStart(3, "0")}\n` : ""}\n案例数据为报告受访者陈述，非本站独立审计。\n`;
}
export function download(
  name: string,
  text: string,
  type = "text/markdown;charset=utf-8",
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
