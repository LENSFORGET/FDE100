import { cases } from "../../model";
import { layoutSide } from "./layout.mjs";
export const groups = [
  {
    id: "knowledge",
    name: "知识与培训",
    question: "经验怎么留下来？",
    color: "#228782",
    tint: "#e8f5f2",
    icon: "book",
    ids: [1, 3, 11, 18],
  },
  {
    id: "process",
    name: "流程自动化",
    question: "重复工作怎么减少？",
    color: "#7862c5",
    tint: "#f0edfb",
    icon: "workflow",
    ids: [2, 6, 9, 10, 21],
  },
  {
    id: "data",
    name: "数据与决策",
    question: "数据怎么支持判断？",
    color: "#3478ce",
    tint: "#eaf2ff",
    icon: "chart",
    ids: [4, 8, 16, 20, 22, 24],
  },
  {
    id: "sales",
    name: "销售与内容",
    question: "业务怎么接得住？",
    color: "#b17835",
    tint: "#fbf2e5",
    icon: "spark",
    ids: [5, 12, 15, 17, 23],
  },
  {
    id: "organization",
    name: "组织与协作",
    question: "团队怎么用起来？",
    color: "#aa6686",
    tint: "#f8eef4",
    icon: "people",
    ids: [7, 13, 14, 19],
  },
];
export const shortCases = [
  [
    "制造业经验传承",
    "经验留在老师傅脑中",
    "现场观察→知识地图",
    "整理文档→检索验证",
    "接入培训→持续陪跑",
    "未披露统一提效比例",
  ],
  [
    "车管所材料审核",
    "看、读、填、搬全靠人",
    "拆解任务与工具分工",
    "真实材料→持续迭代",
    "接回系统→异常交人",
    "审核尺度由人决定",
  ],
  [
    "律师案件协作",
    "海量案卷难以快速理清",
    "观察律师实际交付物",
    "模型整理+专业检索",
    "保留律师判断与责任",
    "70%为具体个案反馈",
  ],
  [
    "城市规划研判",
    "跨部门数据与规则割裂",
    "先理解规划业务",
    "缩小区域与业务范围",
    "调度专业工具出文图表",
    "时间限定已跑通试点",
  ],
  [
    "TikTok达人履约",
    "筛达人、跟任务来回切换",
    "梳理合作全链路",
    "达人初筛与商品匹配",
    "提醒履约→人工沟通",
    "重要商务关系留给人",
  ],
  [
    "物流装载规划",
    "装车效率依赖老师傅",
    "测量车辆与作业约束",
    "大模型调度专业算法",
    "方案转成现场装车指导",
    "约2小时为预期效果",
  ],
  [
    "基金研发转型",
    "买了工具但协作没改变",
    "拆开不同角色需求",
    "围绕实际研发开展实操",
    "沉淀Spec文档与方法",
    "未开放完整ROI数据",
  ],
  [
    "工业物料检索",
    "物料找不到导致重复买",
    "从采购现场找真问题",
    "清洗数据+语义检索",
    "用采购行为验证价值",
    "不能把搜索速度当收益",
  ],
  [
    "央国企财务",
    "多系统填表耗费时间",
    "梳理报销规则与关联",
    "AI识别、判断和归类",
    "RPA录入+监督兜底",
    "周期指相关财务流程",
  ],
  [
    "零售门店对账",
    "核对成本高，差异被漏掉",
    "选收益易验证的小场景",
    "识别单据→自动核对",
    "未确认差异→人工处理",
    "差异金额不等于利润",
  ],
  [
    "外贸资料整理",
    "文件分散、权限与网络复杂",
    "先打通现场环境",
    "按客户产品重组资料",
    "数据留在企业内处理",
    "第一阶段尚未全部交付",
  ],
  [
    "鞋服素材生产",
    "单人技巧难变稳定产能",
    "观察设计师真实流程",
    "小范围验证素材生产",
    "还原度与一致性验收",
    "仍在POC与内部试用",
  ],
  [
    "消防维保数字化",
    "新平台可能增加重复填表",
    "走进一线看真实动作",
    "围绕既有监管流程设计",
    "从高频环节积累数据",
    "暂无大规模业务指标",
  ],
  [
    "国企工作流",
    "系统建好了，员工没用",
    "按价值和可行性选场景",
    "萃取业务知识与例外",
    "培训+业务同事共建",
    "组织采用需要持续验证",
  ],
  [
    "短视频文案",
    "产能依赖少数熟练运营",
    "理解门店内容生产",
    "经验拆成明确输入字段",
    "AI生成→人筛选优化",
    "文案质量≠营销效果",
  ],
  [
    "电信网络分析",
    "重复处理数据与编写SQL",
    "定义输入输出与步骤",
    "拆分组件→组合分析",
    "统一部署→人工质量确认",
    "生产要测稳定性与成本",
  ],
  [
    "非标制造报价",
    "图纸、材料与成本难衔接",
    "还原看图到报价全链路",
    "图纸信息抽取并结构化",
    "匹配企业物料与报价规则",
    "工作量减少不等于裁员",
  ],
  [
    "生物科技销售",
    "销售资料散，培训周期长",
    "先诊断信息化与数据",
    "用CRM汇总销售基础",
    "AI陪练、招聘与分析",
    "收益来自多种能力组合",
  ],
  [
    "消费品包装审核",
    "低级错误导致排队返工",
    "观察真实协作与决策",
    "AI提前筛查重复错误",
    "经验沉淀+专业人员确认",
    "最终审核由专业人员负责",
  ],
  [
    "制造经营透明化",
    "ERP有数据却看不清业务",
    "明确老板要看的异常",
    "保留ERP→重组数据",
    "连通库存、订单与回款",
    "尚未证明利润成本改善",
  ],
  [
    "建筑消防图纸",
    "重复绘制与规范检查耗时",
    "专门模型解析CAD空间",
    "按规范生成初步布置",
    "设计师调整并最终确认",
    "30分钟仅为初步生成",
  ],
  [
    "跨境电商联动",
    "物流库存补货数据分散",
    "观察录屏找实际需求",
    "同步数据到飞书",
    "AI处理→人工确认补货",
    "缺少交付后完整收益数据",
  ],
  [
    "工程租赁报价",
    "老板顾不上小额长尾订单",
    "串起获客、询价和报价",
    "按价值与复杂度分层",
    "轻入口承接→关键单转人",
    "早期反馈不等于营收增长",
  ],
  [
    "海外快消动销",
    "总部难看见渠道末端",
    "梳理经销商数据流",
    "AI抽取+规则校验",
    "原始数据可追溯→人决策",
    "指标脱敏，异常由人确认",
  ],
];
export type SectionKey = "problem" | "solution" | "result" | "boundary";
export type GraphNode = {
  id: string;
  kind: "root" | "topic" | "case" | "focus" | "section" | "step";
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  subtitle?: string;
  meta?: string;
  color: string;
  tint: string;
  group?: string;
  caseId?: number;
  section?: SectionKey;
  step?: number;
};
export type GraphEdge = {
  id: string;
  from: string;
  to: string;
  color: string;
  vertical?: boolean;
};
export type Graph = { nodes: GraphNode[]; edges: GraphEdge[] };
export function groupFor(id: number) {
  return groups.find((g) => g.ids.includes(id))!;
}
export function reportGraph(
  collapsed: Set<string>,
  mobile: boolean,
  focusedTopic: string | null,
): Graph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const addEdge = (from: string, to: string, color: string, vertical = false) =>
    edges.push({ id: from + "-" + to, from, to, color, vertical });
  nodes.push({
    id: "root",
    kind: "root",
    x: 0,
    y: mobile ? -224 : 0,
    w: 180,
    h: 104,
    title: "AI 如何真正落地",
    subtitle: "24 个案例 · 5 类问题",
    meta: "Datawhale FDE100",
    color: "#1d1d1f",
    tint: "#fff",
  });
  if (mobile) {
    const shown = focusedTopic
      ? groups.filter((g) => g.id === focusedTopic)
      : groups;
    shown.forEach((g, i) => {
      const x = focusedTopic ? 0 : i === 4 ? 0 : i % 2 === 0 ? -96 : 96;
      const y = focusedTopic ? -98 : -74 + Math.floor(i / 2) * 139;
      nodes.push({
        id: g.id,
        kind: "topic",
        x,
        y,
        w: focusedTopic ? 222 : 174,
        h: 88,
        title: g.name,
        subtitle: g.question,
        meta: `${g.ids.length} 个案例`,
        group: g.id,
        color: g.color,
        tint: g.tint,
      });
      addEdge("root", g.id, g.color, true);
      if (focusedTopic) {
        g.ids.forEach((id, j) => {
          const cy = 40 + Math.floor(j / 2) * 81,
            cx = j % 2 === 0 ? -98 : 98;
          nodes.push({
            id: "case-" + id,
            kind: "case",
            x: cx,
            y: cy,
            w: 178,
            h: 48,
            title: shortCases[id - 1][0],
            meta: String(id).padStart(2, "0"),
            group: g.id,
            caseId: id,
            color: g.color,
            tint: g.tint,
          });
          addEdge(g.id, "case-" + id, g.color, true);
        });
      }
    });
  } else {
    const counts = Object.fromEntries(
      groups.map((g) => [g.id, collapsed.has(g.id) ? 0 : g.ids.length]),
    );
    const placements = [
      ...layoutSide(["data", "sales"], counts).map((g) => ({ ...g, side: -1 })),
      ...layoutSide(["knowledge", "process", "organization"], counts).map(
        (g) => ({ ...g, side: 1 }),
      ),
    ];
    placements.forEach((p) => {
      const g = groups.find((g) => g.id === p.id)!;
      nodes.push({
        id: g.id,
        kind: "topic",
        x: p.side * 246,
        y: p.y,
        w: 164,
        h: 82,
        title: g.name,
        subtitle: g.question,
        meta: `${g.ids.length} 个案例`,
        group: g.id,
        color: g.color,
        tint: g.tint,
      });
      addEdge("root", g.id, g.color);
      if (!collapsed.has(g.id)) {
        g.ids.forEach((id, i) => {
          const y = p.y + (i - (g.ids.length - 1) / 2) * 43;
          nodes.push({
            id: "case-" + id,
            kind: "case",
            x: p.side * 477,
            y,
            w: 186,
            h: 34,
            title: shortCases[id - 1][0],
            meta: String(id).padStart(2, "0"),
            group: g.id,
            caseId: id,
            color: g.color,
            tint: g.tint,
          });
          addEdge(g.id, "case-" + id, g.color);
        });
      }
    });
  }
  return { nodes, edges };
}
export function caseGraph(id: number, mobile: boolean): Graph {
  const c = cases[id - 1],
    g = groupFor(id),
    s = shortCases[id - 1];
  const nodes: GraphNode[] = [
    {
      id: "focus",
      kind: "focus",
      x: mobile ? 0 : -400,
      y: mobile ? -320 : 0,
      w: mobile ? 244 : 218,
      h: 94,
      title: s[0],
      subtitle: g.name,
      meta: `报告 NO.${String(id).padStart(2, "0")}`,
      caseId: id,
      group: g.id,
      color: g.color,
      tint: g.tint,
    },
  ];
  const phases: [SectionKey, string, string][] = [
    ["problem", "业务痛点", s[1]],
    ["solution", "怎么落地", "业务、模型、系统与人协作"],
    ["result", "实际反馈", c.metric],
    ["boundary", "必须一起看", s[5]],
  ];
  const ys = mobile ? [-196, -70, 260, 386] : [-206, -68, 115, 251];
  phases.forEach(([key, title, subtitle], i) =>
    nodes.push({
      id: key,
      kind: "section",
      x: mobile ? 0 : -62,
      y: ys[i],
      w: mobile ? 262 : 258,
      h: 82,
      title,
      subtitle,
      meta: String(i + 1).padStart(2, "0"),
      section: key,
      caseId: id,
      color: key === "boundary" ? "#a8783d" : g.color,
      tint: key === "boundary" ? "#fbf2e5" : g.tint,
    }),
  );
  for (let i = 0; i < 3; i++)
    nodes.push({
      id: "step-" + i,
      kind: "step",
      x: mobile ? 0 : 275,
      y: mobile ? 38 + i * 68 : -157 + i * 89,
      w: mobile ? 248 : 263,
      h: 58,
      title: s[i + 2],
      meta: `${i + 1}`,
      section: "solution",
      step: i,
      caseId: id,
      color: g.color,
      tint: g.tint,
    });
  const edges: GraphEdge[] = phases.map(([key]) => ({
    id: "focus-" + key,
    from: "focus",
    to: key,
    color: g.color,
    vertical: mobile,
  }));
  for (let i = 0; i < 3; i++)
    edges.push({
      id: "solution-step-" + i,
      from: mobile && i > 0 ? "step-" + (i - 1) : "solution",
      to: "step-" + i,
      color: g.color,
      vertical: mobile,
    });
  return { nodes, edges };
}
export const tourSteps = [
  {
    mode: "report" as const,
    topic: null,
    node: "root",
    title: "先看全貌",
    text: "24篇访谈，按业务问题整理成五个分支。每个分支都在回答一个现实问题。",
  },
  {
    mode: "report" as const,
    topic: "process",
    node: "process",
    title: "从一个分支进入",
    text: "流程自动化这五个案例，关注同一件事：怎样减少重复工作，并保留人的判断。",
  },
  {
    mode: "case" as const,
    topic: null,
    node: "problem",
    title: "原来，卡在哪里？",
    text: "以车管所为例：工作人员要逐张看材料，再读信息、填单、搬运数据。",
  },
  {
    mode: "case" as const,
    topic: null,
    node: "step-0",
    title: "先分清任务",
    text: "识别图片、抽取文本、操作系统，是不同的任务，需要不同工具配合。",
  },
  {
    mode: "case" as const,
    topic: null,
    node: "step-1",
    title: "再面对真实数据",
    text: "复印件、小字、不完整照片，都要进入测试。识别能力是在真实样本中磨出来的。",
  },
  {
    mode: "case" as const,
    topic: null,
    node: "step-2",
    title: "让流程真正跑下去",
    text: "识别以后，还要自动填单并流转到原有系统。异常情况留给工作人员。",
  },
  {
    mode: "case" as const,
    topic: null,
    node: "result",
    title: "看结果，也看口径",
    text: "项目反馈每单审核从约15分钟缩短到3—5分钟，指这一项目的全流程审核。",
  },
  {
    mode: "case" as const,
    topic: null,
    node: "boundary",
    title: "最后，划清边界",
    text: "审核规则的宽严由业务负责人决定。一次项目的成果，不等于其他场景的收益承诺。",
  },
];
