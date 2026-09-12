import { lazy, Suspense, useEffect, useState } from "react";
import {
  BookOpen,
  Bookmark,
  ExternalLink,
  Github,
  Menu,
  X,
} from "lucide-react";
import { cases } from "./model";
import { useReading } from "./state";
import { Home } from "./components/Home";
import { Library } from "./components/Library";
import { Reader } from "./components/Reader";
import { Guide, LearningPath, About, NotFound } from "./components/Guide";
import { Compare } from "./components/Compare";
import { Insights } from "./components/Insights";
import { sources } from "./sources";
const MindMap = lazy(() => import("./components/map/MindMap"));
export default function App() {
  const [route, setRoute] = useState(location.hash.slice(1) || "/");
  const [menu, setMenu] = useState(false);
  const [compare, setCompare] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const reading = useReading();
  const pathname = route.split("?")[0];
  const params = new URLSearchParams(route.split("?")[1]);
  useEffect(() => {
    const changed = () => {
      setRoute(location.hash.slice(1) || "/");
      setMenu(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);
  useEffect(() => {
    const id = Number(pathname.split("/")[2]);
    document.title =
      route.startsWith("/case/") && cases[id - 1]
        ? `${cases[id - 1].name} — FDE100 导读`
        : pathname === "/insights"
          ? "精华速读 — FDE100 导读"
          : "FDE100 导读 — 读懂 AI 如何落地";
    document
      .querySelector<HTMLElement>("#main-content")
      ?.focus({ preventScroll: true });
  }, [route]);
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [notice]);
  function onCompare(id: number) {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length === 2) {
        setNotice("一次比较两个案例，请先移除一个已选案例。");
        return prev;
      }
      return [...prev, id];
    });
  }
  const id = Number(pathname.split("/")[2]);
  const isMap = route === "/map" || route.startsWith("/map?");
  let content;
  if (isMap)
    content = (
      <Suspense fallback={<div className="empty">正在展开报告结构…</div>}>
        <MindMap reading={reading} />
      </Suspense>
    );
  else if (route === "/" || route === "") content = <Home reading={reading} />;
  else if (pathname === "/cases" || pathname === "/reading")
    content = (
      <Library
        key={route}
        reading={reading}
        mine={pathname === "/reading"}
        initialTopic={params.get("topic") || "全部"}
        initialQuery={params.get("q") || ""}
        compare={compare}
        onCompare={onCompare}
      />
    );
  else if (pathname === "/insights")
    content = <Insights key={route} initial={params.get("idea") || "value"} />;
  else if (route === "/guide") content = <Guide />;
  else if (route === "/about") content = <About />;
  else if (route.startsWith("/case/") && Number.isInteger(id) && cases[id - 1])
    content = (
      <Reader
        key={route}
        item={cases[id - 1]}
        reading={reading}
        initialSection={params.get("section") || ""}
      />
    );
  else if (route.startsWith("/path/"))
    content = <LearningPath pathId={route.split("/")[2]} reading={reading} />;
  else if (route.startsWith("/compare/"))
    content = <Compare ids={route.split("/")[2].split(",").map(Number)} />;
  else content = <NotFound />;
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        跳到正文
      </a>
      <header className="site-header">
        <div className="nav-inner">
          <a href="#/" className="brand">
            <BookOpen size={20} strokeWidth={1.8} />
            <span>
              FDE100 <span className="brand-caption">导读</span>
            </span>
          </a>
          <nav className={`main-nav ${menu ? "open" : ""}`} aria-label="主导航">
            {[
              ["/map", "全景地图"],
              ["/insights", "精华速读"],
              ["/cases", "案例库"],
              ["/path/share", "分享准备"],
            ].map(([path, label]) => (
              <a
                key={path}
                aria-current={pathname === path ? "page" : undefined}
                href={"#" + path}
              >
                {label}
              </a>
            ))}
            <a
              href="#/reading"
              className="nav-reading"
              aria-current={pathname === "/reading" ? "page" : undefined}
            >
              <Bookmark size={14} /> 我的阅读
            </a>
          </nav>
          <div className="nav-end">
            <a
              className="nav-github"
              href={sources.repository}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub 仓库：LENSFORGET/FDE100"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
            <button
              className="icon-button mobile-menu"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label={menu ? "关闭导航" : "打开导航"}
            >
              {menu ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>
      {reading.storageError && (
        <div className="storage-warning" role="alert">
          浏览器无法保存阅读记录。当前内容仍可使用，请及时导出笔记。
        </div>
      )}
      <div id="main-content" tabIndex={-1}>
        {content}
      </div>
      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
      {!isMap && (
        <footer className="site-footer">
          <div className="footer-inner">
            <p>
              基于
              Datawhale《FDE案例100》整理的独立导读。原报告与案例内容归相应权利人所有。
            </p>
            <div>
              <span>24 篇案例，144 组访谈问答。本站整理重点与阅读路径。</span>
              <nav aria-label="页脚导航">
                <a href="#/guide">认识 FDE</a>
                <a href="#/about">来源与说明</a>
                <a
                  href="https://github.com/LENSFORGET/FDE100"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={14} /> GitHub 仓库 <ExternalLink size={12} />
                </a>
                <a
                  href="https://fde100.datawhale.cn/cases"
                  target="_blank"
                  rel="noreferrer"
                >
                  Datawhale 官网 <ExternalLink size={12} />
                </a>
              </nav>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
