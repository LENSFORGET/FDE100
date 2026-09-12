import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, Menu, X } from "lucide-react";
import { cases, pdfUrl } from "./model";
import { useReading } from "./state";
import { Home } from "./components/Home";
import { Library } from "./components/Library";
import { Reader } from "./components/Reader";
import { Guide, LearningPath, About, NotFound } from "./components/Guide";
import { Compare } from "./components/Compare";
export default function App() {
  const [route, setRoute] = useState(location.hash.slice(1) || "/");
  const [menu, setMenu] = useState(false);
  const [compare, setCompare] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const reading = useReading();
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
    const id = Number(route.split("/")[2]);
    document.title =
      route.startsWith("/case/") && cases[id - 1]
        ? `${cases[id - 1].name} — FDE100 导读`
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
  const id = Number(route.split("/")[2]);
  let content;
  if (route === "/" || route === "") content = <Home reading={reading} />;
  else if (route === "/cases" || route === "/reading")
    content = (
      <Library
        key={route}
        reading={reading}
        mine={route === "/reading"}
        compare={compare}
        onCompare={onCompare}
      />
    );
  else if (route === "/guide") content = <Guide />;
  else if (route === "/about") content = <About />;
  else if (route.startsWith("/case/") && Number.isInteger(id) && cases[id - 1])
    content = <Reader key={id} item={cases[id - 1]} reading={reading} />;
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
              ["/guide", "报告导读"],
              ["/cases", "案例库"],
              ["/reading", "我的阅读"],
            ].map(([path, label]) => (
              <a
                key={path}
                aria-current={route === path ? "page" : undefined}
                href={"#" + path}
              >
                {label}
              </a>
            ))}
            <a
              href={pdfUrl()}
              className="nav-report"
              target="_blank"
              rel="noreferrer"
            >
              原报告 <ExternalLink size={12} />
            </a>
          </nav>
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label={menu ? "关闭导航" : "打开导航"}
          >
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
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
      <footer className="site-footer">
        <div className="footer-inner">
          <p>
            基于
            Datawhale《FDE案例100》整理的独立导读。原报告与案例内容归相应权利人所有。
          </p>
          <div>
            <span>让经验更容易被理解，也更容易被使用。</span>
            <nav aria-label="页脚导航">
              <a href="#/about">来源与说明</a>
              <a
                href="https://github.com/LENSFORGET/FDE100"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <ExternalLink size={12} />
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
    </>
  );
}
