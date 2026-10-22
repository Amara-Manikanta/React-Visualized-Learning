import React, { useEffect, useState, lazy, Suspense } from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, Check, BookOpen, Hash, Code2, Sparkles } from "lucide-react";
import GlobalHeader from "./GlobalHeader";
import Footer from "./Footer";
import { neighbours, sectionFor } from "../lib/pageOrder";
import { useReadPages, setRead } from "../lib/progress";
import UserTopicNotes from "./UserTopicNotes";
import { getSavedDraft } from "../lib/pageSourceMap";

const TopicSourceEditor = lazy(() => import("./TopicSourceEditor"));

function useActiveSection(ids) {
  const [active, setActive] = useState("");
  const key = ids.join("|");

  useEffect(() => {
    if (!ids.length) return undefined;
    let frame = 0;
    const measure = () => {
      frame = 0;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) {
        const last = [...ids].reverse().find((id) => document.getElementById(id));
        if (last) current = last;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
}

export default function GuideLayout({
  title,
  intro,
  badge = "Mental Model & Internals",
  toc = [],
  children,
  onTocClick,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("view"); // "view" | "source"
  const location = useLocation();
  const read = useReadPages();
  const isRead = read.has(location.pathname);
  const { prev, next } = neighbours(location.pathname);
  const sec = sectionFor(location.pathname);
  const hasDraft = Boolean(getSavedDraft(location.pathname));

  useEffect(() => {
    setViewMode("view");
  }, [location.pathname]);

  const ids = toc.map((item) => item.hash.replace(/^#/, ""));
  const activeId = useActiveSection(ids);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return undefined;
    }
    const id = decodeURIComponent(location.hash.slice(1));
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    }, 150);
    return () => clearTimeout(t);
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0c10] text-gray-200 font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      <GlobalHeader />

      <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6 max-w-[1400px] mx-auto px-4 sm:px-6 pb-20 w-full">
        {/* Sidebar Navigation */}
        <aside className="lg:w-[280px] shrink-0 lg:sticky lg:top-[88px] h-fit bg-[#111116] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Mobile Accordion Toggle */}
          <button
            className="lg:hidden w-full flex items-center justify-between p-4 bg-[#16161f]/50 cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-expanded={sidebarOpen}
            aria-controls="guide-sidebar"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-xs uppercase tracking-wider text-white">
                {sec?.group || "Curriculum Navigation"}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Desktop Module Header */}
          <div className="hidden lg:block p-5 pb-3 border-b border-white/10 bg-[#16161f]/40">
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block mb-1">
              Current Module
            </span>
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
              {sec?.title || title}
            </h3>
          </div>

          {/* Navigation Items */}
          <nav
            id="guide-sidebar"
            aria-label="Table of contents"
            className={`${
              sidebarOpen ? "block" : "hidden"
            } lg:block overflow-y-auto max-h-[60vh] lg:max-h-[calc(100vh-170px)] custom-scrollbar`}
          >
            {/* Module Topics */}
            {sec && sec.items.length > 0 && (
              <div className="p-4 border-b border-white/10">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Lessons in this Module
                </h4>
                <div className="flex flex-col gap-1">
                  {sec.items.map((item, i) => {
                    const isCurrent = location.pathname === item.path;
                    return (
                      <Link
                        key={i}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg text-xs transition-all ${
                          isCurrent
                            ? "bg-cyan-500/15 text-cyan-300 font-semibold border-l-2 border-cyan-400 shadow-sm"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className="truncate">{item.name}</span>
                        {read.has(item.path) && (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* On this page TOC */}
            {toc.length > 0 && (
              <div className="p-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Hash className="w-3 h-3 text-cyan-400" />
                  <span>On This Page</span>
                </h4>
                <div className="flex flex-col gap-1">
                  {toc.map((item, i) => {
                    const id = ids[i];
                    const active = activeId === id;
                    return (
                      <a
                        key={i}
                        href={`#${id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setSidebarOpen(false);
                          onTocClick?.(id);
                          requestAnimationFrame(() => {
                            const el = document.getElementById(id);
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                          });
                        }}
                        className={`block py-1.5 text-xs transition-all rounded-md px-2 ${
                          item.indent ? "ml-3 text-[11px]" : ""
                        } ${
                          active
                            ? "text-cyan-300 bg-cyan-500/10 font-medium"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Guide Content */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb & Header */}
          <div className="mb-8 lg:mb-12">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-gray-400 mb-3">
              <Link to="/" className="hover:text-cyan-400 transition-colors">
                Home
              </Link>
              <span>/</span>
              {sec && <span className="text-gray-400 truncate">{sec.group}</span>}
              <span>/</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {badge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light max-w-4xl">
              {intro}
            </p>
          </div>

          {/* Mobile & Desktop Mode Switcher */}
          <div className="mb-6 p-2 rounded-2xl border border-white/10 bg-[#12121a] flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5">
              <button
                type="button"
                onClick={() => setViewMode("view")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "view"
                    ? "bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>View Lesson & Visualizers</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("source")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "source"
                    ? "bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Source Code & AI Editor</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              {hasDraft && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>Draft Active on Phone</span>
                </span>
              )}
              <span className="text-gray-500 hidden sm:inline text-[11px]">
                Travel mode: Ask AI to edit → Test live → Push to GitHub
              </span>
            </div>
          </div>

          {viewMode === "source" ? (
            <Suspense
              fallback={
                <div className="p-12 rounded-2xl border border-white/10 bg-[#0d0d14] text-center font-mono text-xs text-gray-400 flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                  <span>Loading Source Code & Live Editor...</span>
                </div>
              }
            >
              <TopicSourceEditor
                pathname={location.pathname}
                onCloseViewMode={() => setViewMode("view")}
              />
            </Suspense>
          ) : (
            <>
              {/* Lesson Body Content */}
              <div className="space-y-10 lg:space-y-14">
                {children}
              </div>

              {/* User Offline Notes */}
              <UserTopicNotes pagePath={location.pathname} toc={toc} />
            </>
          )}

          {/* Footer Navigation & Progress */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h4 className="text-sm font-semibold text-white">Lesson Completion</h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  {isRead
                    ? "You have marked this lesson as completed."
                    : "Finished mastering these internal concepts? Mark it to update your progress."}
                </p>
              </div>
              <button
                onClick={() => setRead(location.pathname, !isRead)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isRead
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 shadow-lg shadow-emerald-500/10"
                    : "border-white/15 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isRead ? "Completed" : "Mark as Completed"}</span>
              </button>
            </div>

            {(prev || next) && (
              <nav aria-label="Previous and next lessons" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev ? (
                  <Link
                    to={prev.path}
                    className="group flex items-center gap-3.5 p-4 rounded-2xl border border-white/10 bg-[#111116] hover:border-cyan-500/40 hover:bg-cyan-500/[0.04] transition-all shadow-lg"
                  >
                    <div className="p-2 rounded-xl bg-white/5 group-hover:bg-cyan-500/20 text-gray-400 group-hover:text-cyan-300 transition-colors">
                      <ChevronLeft className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-500">
                        Previous Lesson
                      </span>
                      <span className="block text-xs sm:text-sm font-semibold text-gray-200 group-hover:text-white truncate">
                        {prev.name}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <span className="hidden sm:block" />
                )}

                {next && (
                  <Link
                    to={next.path}
                    className="group flex items-center justify-end gap-3.5 p-4 rounded-2xl border border-white/10 bg-[#111116] hover:border-cyan-500/40 hover:bg-cyan-500/[0.04] transition-all text-right shadow-lg"
                  >
                    <div className="min-w-0">
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-500">
                        Next Lesson
                      </span>
                      <span className="block text-xs sm:text-sm font-semibold text-gray-200 group-hover:text-white truncate">
                        {next.name}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 group-hover:bg-cyan-500/20 text-gray-400 group-hover:text-cyan-300 transition-colors">
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </div>
                  </Link>
                )}
              </nav>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
