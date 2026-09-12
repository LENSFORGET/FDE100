# FDE100 导读

让 Datawhale《FDE案例100》更容易理解、讲解和使用的独立互动导读网站。

**在线阅读：[lensforget.github.io/FDE100](https://lensforget.github.io/FDE100/)**

从首页直接选择：[看全景地图](https://lensforget.github.io/FDE100/#/map)、[读六条精华](https://lensforget.github.io/FDE100/#/insights)、[找案例](https://lensforget.github.io/FDE100/#/cases)或[准备分享](https://lensforget.github.io/FDE100/#/path/share)。引用来源与 GitHub 仓库在首页直接展示。

## 内容与功能

- 本版 PDF 全部 **24 个案例**，每篇有问题、实施步骤、结果、边界与讨论问题。
- 每篇默认展示**重点速读**：最值得学的方法、短结构、结果边界和行动建议；可切换完整解读、讲解提纲、访谈原文。关键短语加粗，原文措辞保留。
- 六条跨案例精华，可切换阅读并核对案例与 PDF 来源；提供24篇重点索引和搜索。
- 全景知识地图：拖动与指针定位缩放、双指缩放、分支折叠、案例结构、搜索定位、缩略图和可暂停导览。手机从五个分支逐层进入；支持 `#/map?case=6` 分享单个案例。
- 一分钟语音导览：默认简体中文女声，可在导览内切换英文女声与字幕。画面跟随音频推进，支持暂停、继续、跳步与重播，退出即停。
- **144 组访谈问答**，附对应 PDF 页码，内置本版报告。
- 按业务问题、行业、项目阶段和原文关键词查找。
- 初学、项目实践、分享准备三条阅读路线。
- 两个案例并排比较，导出比较与讲解提纲。
- 每篇提供讲解提纲、连贯讲稿和 Markdown 下载。
- 分享路线支持下载整组三案例提纲，并直接打开各篇讲稿。
- 收藏、已读、笔记与阅读记录导出，仅保存在当前浏览器。
- 桌面与手机自适应，键盘焦点、减少动效支持。

## 本地开发

Node.js 22：

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

## GitHub Pages

使用 React + TypeScript + Vite 构建纯静态网站，不需要后端、API key 或账户登录。Vite 使用相对资源路径，页面采用 hash 路由，支持 `https://用户名.github.io/仓库名/#/case/6` 直接打开、分享和刷新。

仓库 Settings → Pages → Build and deployment → Source 设为 **GitHub Actions**。推送到 `main` 后，`.github/workflows/pages.yml` 自动安装依赖、核对内容、构建与部署。

本项目不提供账号或跨设备同步。导出的阅读 JSON 是数据备份，目前没有页面内导入功能。

## 数据维护

- `src/data/editorial.json`：24 篇人工整理式导读数据；解读与原文分别存储。
- `src/data/cases.json`：已提交的完整阅读数据，包括访谈和问答起始页码。
- `src/data/takeaways.json`：24篇重点、行动建议、原文短语定位与加粗词组。`npm test` 会核对每条定位与加粗文本确实存在于原资料。
- `src/insights.ts`：六条跨案例经验及关联案例；这些是本站归纳，不是官方评分。
- `scripts/import-report.py`：从本版 PDF 重新提取内容，需要 `pypdf`。
- `public/report.pdf`：本版源报告；`public/report-cover.jpg`：从原报告第一页渲染的封面。
- `docs/SOURCES.md`：来源、官网映射与范围差异。
- `docs/DESIGN.md`：设计方向与样式约束。
- `src/components/map/mapData.ts`：地图的短语节点、阅读分类和导览脚本；来自本版案例的导读整理。
- `docs/MAP-PROTOTYPE.md`：交互地图样品的构图和操作说明。
- `src/data/tour-script.json`、`tour-audio.json`：中英文导览文案与音频时间点。`public/audio/` 是预生成的 MP3，网站播放不调用语音服务。
- `scripts/generate-tour-audio.py`：文案修改后重新生成音频。使用 `edge-tts==7.2.7` 与 `imageio-ffmpeg==0.6.0`，通用合成女声为 `zh-CN-XiaoxiaoNeural` / `en-US-JennyNeural`；普通构建无需这些工具。详见[语音工具文档](https://github.com/rany2/edge-tts)。

重新提取：

```sh
python scripts/import-report.py /path/to/report.pdf
npm test
```

导入脚本使用本版目录的页码与结构。更换报告版本时，须更新页码、核对标题及官网映射，不能直接沿用当前假设。

## 来源与权利

原报告：Datawhale《FDE案例100》，序言日期 2026-09-06，247 个 PDF 物理页，目录包含24篇。官网：[fde100.datawhale.cn/cases](https://fde100.datawhale.cn/cases)。[官方 PDF](https://assets.datawhale.cn/Datawhale%20FDE%E6%A1%88%E4%BE%8B100.pdf)。

本项目非 Datawhale 官方网站。原报告、封面和访谈原文权利归 Datawhale 与相应作者/权利人所有，不包含在本项目代码的 MIT 许可范围内。导读分类、阅读框架和讲解建议不代表原作者的统一结论。案例结果为受访者陈述，非本项目独立审计。

代码采用 MIT。提交内容修正请附案例编号、PDF 页码与原文依据。
