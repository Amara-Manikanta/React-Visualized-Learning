import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, Hash, BookOpen } from "lucide-react";
import { ALL_TOPICS } from "../config/navigation";

const MAX_RESULTS = 20;

function scoreEntry(entry, q) {
  const name = entry.name.toLowerCase();
  const desc = (entry.desc || "").toLowerCase();
  const path = entry.path.toLowerCase();
  const badge = (entry.badge || "").toLowerCase();

  let best = 0;
  let matchedSection = null;

  if (name === q) best = 120;
  else if (name.startsWith(q)) best = 100;
  else if (name.includes(q)) best = 80;
  else if (badge.includes(q)) best = 70;
  else if (path.includes(q)) best = 55;
  else if (desc.includes(q)) best = 40;

  if (entry.sections) {
    for (const s of entry.sections) {
      const label = s.label.toLowerCase();
      let sc = 0;
      if (label === q) sc = 95;
      else if (label.startsWith(q)) sc = 75;
      else if (label.includes(q)) sc = 60;
      if (sc > best) {
        best = sc;
        matchedSection = s;
      }
    }
  }

  return { score: best, matchedSection };
}

function Highlight({ text, query }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-cyan-500/30 text-cyan-200 rounded-sm px-0.5 font-semibold">
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  );
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  // Global Cmd+K / Ctrl+K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const hits = [];
    for (const entry of ALL_TOPICS) {
      const { score, matchedSection } = scoreEntry(entry, q);
      if (score > 0) {
        hits.push({ entry, score, matchedSection });
      }
    }
    hits.sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name));
    return hits.slice(0, MAX_RESULTS);
  }, [query]);

  useEffect(() => setActive(0), [query]);

  const go = useCallback(
    (entry, section) => {
      setOpen(false);
      const target = section ? `${entry.path}#${section.hash}` : entry.path;
      navigate(target);
      if (section) {
        requestAnimationFrame(() => {
          document.getElementById(section.hash)?.scrollIntoView({ behavior: "smooth" });
        });
      }
    },
    [navigate]
  );

  const onKeyDown = (e) => {
    const list = query ? results : ALL_TOPICS.slice(0, 8);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(list.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (query && results[active]) {
        go(results[active].entry, results[active].matchedSection);
      } else if (!query && ALL_TOPICS[active]) {
        go(ALL_TOPICS[active], null);
      }
    }
  };

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <>
      <SearchTrigger onOpen={() => setOpen(true)} />

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-black/75 backdrop-blur-md"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search React Visualized"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#111116] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#16161f]/50">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search Fiber, hooks, RSC, Stale closures, optimization..."
                className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-500 outline-none"
              />
              <kbd className="text-[10px] font-mono text-gray-400 border border-white/10 rounded px-1.5 py-0.5 bg-white/5">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div ref={listRef} className="max-h-[55vh] overflow-y-auto custom-scrollbar p-2">
              {!query && (
                <>
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-gray-500">
                    Recommended Starting Topics
                  </div>
                  {ALL_TOPICS.slice(0, 7).map((topic, i) => (
                    <button
                      key={topic.path}
                      data-idx={i}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(topic, null)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        active === i ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-sm font-medium truncate">{topic.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 shrink-0">
                        {topic.badge}
                      </span>
                    </button>
                  ))}
                </>
              )}

              {query && results.length === 0 && (
                <div className="px-4 py-12 text-center">
                  <div className="text-sm font-medium text-gray-300 mb-1">No topics matching “{query}”</div>
                  <div className="text-xs text-gray-500">
                    Try searching for “fiber”, “closure”, “useOptimistic”, “rsc”, or “reconciler”.
                  </div>
                </div>
              )}

              {query &&
                results.map((r, i) => (
                  <button
                    key={`${r.entry.path}-${r.matchedSection?.hash ?? ""}`}
                    data-idx={i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.entry, r.matchedSection)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                      active === i
                        ? "bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-transparent border border-cyan-500/30 text-white"
                        : "border border-transparent hover:bg-white/5 text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-100 truncate">
                        <Highlight text={r.entry.name} query={query} />
                      </span>
                      {r.matchedSection && (
                        <>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          <span className="text-xs text-cyan-300 font-mono flex items-center gap-1 truncate">
                            <Hash className="w-3 h-3" />
                            <Highlight text={r.matchedSection.label} query={query} />
                          </span>
                        </>
                      )}
                    </div>
                    {r.entry.desc && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">{r.entry.desc}</p>
                    )}
                  </button>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/10 bg-[#16161f]/30 text-[11px] text-gray-500">
              <div className="flex items-center gap-3">
                <span><kbd className="font-mono bg-white/5 px-1 py-0.5 rounded border border-white/10">↑↓</kbd> Navigate</span>
                <span><kbd className="font-mono bg-white/5 px-1 py-0.5 rounded border border-white/10">↵</kbd> Select</span>
                <span><kbd className="font-mono bg-white/5 px-1 py-0.5 rounded border border-white/10">ESC</kbd> Close</span>
              </div>
              <span className="font-mono text-cyan-400/80">{ALL_TOPICS.length} Topics Ready</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchTrigger({ onOpen }) {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <button
      onClick={onOpen}
      aria-label="Search topics"
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
    >
      <Search className="w-4 h-4 text-cyan-400" />
      <span className="hidden sm:inline text-xs font-medium">Search Internals...</span>
      <kbd className="hidden sm:inline text-[10px] font-mono border border-white/15 bg-white/5 rounded px-1.5 py-0.5 text-gray-400">
        {isMac ? "⌘K" : "Ctrl+K"}
      </kbd>
    </button>
  );
}
