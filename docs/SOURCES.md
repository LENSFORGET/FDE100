# 内容来源与核对记录

核对日期：2026-09-12。

主内容源：用户提供的《Datawhale FDE案例100》PDF，序言 2026-09-06。共247个物理页，印刷正文页1–245。内置副本 SHA-256：`39b4a6cd7271739c380d6ca587896cf563f0a5a6c8cc8f9c0945fbb23905b84d`。

官网 https://fde100.datawhale.cn/cases 的列表通过实际浏览器读取；初次网络访问超时后页面加载成功。官网共有24条，但内容集合与PDF不完全相同。PDF的外贸资料整理未找到直接对应条目；官网 CASE-004“跨境电商AI工作流矩阵”未作为此版PDF新增案例。

设计指导：https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md （用户指定，读取全文）；视觉参考 https://www.apple.com/hk/ （浏览器截图参考）。

## 案例映射

| 报告编号 | 标题 | 印刷页 | PDF页 | 对应官网 |
|---|---|---|---|---|
| 1 | 从师徒带教到AI辅助培训：FDE用AI破解制造业经验传承难题 | 6–13 | 7–14 | https://fde100.datawhale.cn/cases/cases-009 |
| 2 | 从人工审材料到自动化办件：FDE用AI提升车管所网办效率 | 14–23 | 15–24 | https://fde100.datawhale.cn/cases/cases-007 |
| 3 | 从案头工作到智能协作：FDE用AI优化诉讼律师的案件处理能力 | 24–32 | 25–33 | https://fde100.datawhale.cn/cases/cases-001 |
| 4 | 从人工研判到智能调度：FDE用AI重构城市规划研判流程 | 33–45 | 34–46 | https://fde100.datawhale.cn/cases/cases-008 |
| 5 | 从大海捞针到全链路提效：FDE用AI重构TikTok达人建联与履约 | 46–55 | 47–56 | https://fde100.datawhale.cn/cases/cases-013 |
| 6 | 从经验装车到智能规划：FDE用AI优化跨境物流装载效率 | 56–67 | 57–68 | https://fde100.datawhale.cn/cases/cases-010 |
| 7 | 从个人提效到组织能力：FDE用AI推动企业研发转型 | 68–76 | 69–77 | https://fde100.datawhale.cn/cases/cases-017 |
| 8 | 从物料难找到精准定位：FDE用AI减少工业企业采购浪费 | 77–86 | 78–87 | https://fde100.datawhale.cn/cases/cases-024 |
| 9 | 从“表哥表姐”到智能执行：FDE用AI重构央国企财务流程效率 | 87–95 | 88–96 | https://fde100.datawhale.cn/cases/cases-018 |
| 10 | 从人工核对到智能对账：FDE用AI让线下零售对账又快又准 | 96–106 | 97–107 | https://fde100.datawhale.cn/cases/cases-015 |
| 11 | 从文件散乱到随取随用：FDE用AI帮外贸企业把资料变成可用资产 | 107–119 | 108–120 | 未找到直接对应条目 |
| 12 | 从人工盯图到公司级生产：FDE用AI重塑鞋服电商素材工作流 | 120–129 | 121–130 | https://fde100.datawhale.cn/cases/cases-021 |
| 13 | 从纸质流程到数据驱动：FDE用AI推动传统消防维保企业数字化转型 | 130–136 | 131–137 | https://fde100.datawhale.cn/cases/cases-011 |
| 14 | 从技术交付到业务自驱：FDE用AI推动国企工作流程真正落地 | 137–146 | 138–147 | https://fde100.datawhale.cn/cases/cases-014 |
| 15 | 从经验写稿到稳定量产：FDE用AI重构本地生活短视频内容生产 | 147–158 | 148–159 | https://fde100.datawhale.cn/cases/cases-003 |
| 16 | 从人工分析到分钟级洞察：FDE用AI重构电信网络数据分析 | 159–167 | 160–168 | https://fde100.datawhale.cn/cases/cases-005 |
| 17 | 从老师傅报价到AI深度协同：FDE用AI重构非标制造售前链路 | 168–179 | 169–180 | https://fde100.datawhale.cn/cases/cases-019 |
| 18 | 从纸质台账到AI经营：一家生物科技上市公司的0帧起手数智化 | 180–187 | 181–188 | https://fde100.datawhale.cn/cases/cases-020 |
| 19 | 从人工排队到审核前置：FDE用AI重构消费品研发协同与包装审核 | 188–198 | 189–199 | https://fde100.datawhale.cn/cases/cases-023 |
| 20 | 从看不清订单到看清经营：FDE用AI让制造企业的经营流程更透明 | 199–208 | 200–209 | https://fde100.datawhale.cn/cases/cases-022 |
| 21 | 从人工绘图到智能协作：FDE用AI重塑建筑图纸交付流程 | 209–217 | 210–218 | https://fde100.datawhale.cn/cases/cases-002 |
| 22 | 从库存割裂到业务联动：FDE用AI打通跨境电商的库存、补货与广告决策 | 218–227 | 219–228 | https://fde100.datawhale.cn/cases/cases-012 |
| 23 | 从老板报价到长尾承接：FDE用AI打通工程租赁获客与报价 | 228–235 | 229–236 | https://fde100.datawhale.cn/cases/cases-006 |
| 24 | 从发货到动销：FDE用AI打通跨境快消的海外数据断层 | 236–245 | 237–246 | https://fde100.datawhale.cn/cases/cases-016 |

## 编辑规则

本轮新增 `src/data/takeaways.json` 与 `src/insights.ts`。逐篇阅读访谈 Q6 落地经验，并结合已有的 Q3 实施、Q4 成效、Q5 挑战导读，提炼24条最值得迁移的方法和六条跨案例判断。选择标准为可迁移、可行动、有来源，不声称是官方评级或读者排名。每条重点保存 Q6 中的确切短语，自动检查其存在；行动建议由本站提出。原文加粗仅包裹确切文本，不改写原文。

2026-09-12 本轮再次核对官网案例列表及律师案例详情，官网展示业务背景、痛点、方案与项目成效，未见该详情页提供独立读者评分；本站继续以用户提供的 PDF 访谈经验作为精华归纳依据。

- PDF文字提取并重排换行；图表、人物封面需看原PDF，不对图片做无依据文字补全。
- 导读、问题分类、阅读路线、讲解建议与访谈原文分开呈现。
- 不把模拟或预期当作已落地收益；不把初步生成时间当作交付时间；不把其他客户指标移植到当前案例。
- 官网与PDF口径冲突时以本版PDF为正文主线，并说明边界。
- 汇总数仅反映内容数量，不汇总跨案例的节约成本、准确率等异质指标。
