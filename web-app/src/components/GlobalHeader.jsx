import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Check, Github, Layers } from "lucide-react";
import { MODULES, ALL_TOPICS } from "../config/navigation";
import { useReadPages } from "../lib/progress";
import CommandPalette from "./CommandPalette";

export default function GlobalHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);
  const location = useLocation();
  const read = useReadPages();

  const completedCount = ALL_TOPICS.filter((t) => read.has(t.path)).length;
  const progressPct = Math.round((completedCount / ALL_TOPICS.length) * 100);

  const changeTextSize = (delta) => {
    const root = document.documentElement;
    const current = parseFloat(getComputedStyle(root).getPropertyValue("--reading-scale") || "1");
    const next = Math.max(0.85, Math.min(1.3, current + delta));
    root.style.setProperty("--reading-scale", next.toString());
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0c0c10]/85 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center overflow-hidden group-hover:border-cyan-400/60 transition-all shadow-lg shadow-cyan-500/10">
              <svg className="w-5 h-5 text-cyan-400 group-hover:rotate-180 transition-transform duration-700" viewBox="-11.5 -10.23174 23 20.46348">
                <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
                <g stroke="currentColor" strokeWidth="1" fill="none">
                  <ellipse rx="11" ry="4.2"/>
                  <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                  <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                </g>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  React Visualized
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  React 19
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-gray-400 font-mono -mt-0.5">
                Fiber • Reconciler • Hooks • Concurrency
              </p>
            </div>
          </Link>

          {/* Desktop Modules Navigation Dropdown */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setModulesDropdownOpen(!modulesDropdownOpen)}
              onBlur={() => setTimeout(() => setModulesDropdownOpen(false), 200)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-200 transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Curriculum ({MODULES.length} Modules)</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${modulesDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {modulesDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-[420px] rounded-2xl bg-[#111116] border border-white/15 shadow-2xl p-3 z-50 grid gap-2 animate-in fade-in zoom-in-95 duration-150">
                {MODULES.map((mod) => {
                  const modRead = mod.topics.filter((t) => read.has(t.path)).length;
                  return (
                    <div key={mod.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
                      <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                        <span>{mod.title}</span>
                        <span className="text-[10px] font-mono text-cyan-400">
                          {modRead}/{mod.topics.length}
                        </span>
                      </div>
                      <div className="grid gap-1">
                        {mod.topics.map((t) => (
                          <Link
                            key={t.path}
                            to={t.path}
                            className={`flex items-center justify-between text-xs py-1 px-2 rounded-lg transition-colors ${
                              location.pathname === t.path
                                ? "bg-cyan-500/15 text-cyan-300 font-semibold"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <span className="truncate">{t.name}</span>
                            {read.has(t.path) && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Progress Tracker Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5">
            <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-semibold text-gray-300">
              {progressPct}% Done
            </span>
          </div>

          {/* Search Trigger */}
          <CommandPalette />

          {/* Text Size Scale */}
          <div className="hidden md:flex items-center rounded-xl border border-white/10 bg-white/5 p-0.5">
            <button
              onClick={() => changeTextSize(-0.05)}
              className="px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Decrease text size"
            >
              A−
            </button>
            <span className="text-white/10">|</span>
            <button
              onClick={() => changeTextSize(0.05)}
              className="px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Increase text size"
            >
              A+
            </button>
          </div>

          {/* GitHub Repo */}
          <a
            href="https://github.com/Amara-Manikanta/React-Visualized-Learning"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-[#0c0c10] border-t border-white/10 p-5 overflow-y-auto custom-scrollbar z-50">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">Total Progress:</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{progressPct}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-300">
                {completedCount} of {ALL_TOPICS.length} Topics
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {MODULES.map((mod) => (
              <div key={mod.id}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                  {mod.title}
                </h3>
                <div className="space-y-1">
                  {mod.topics.map((t) => (
                    <Link
                      key={t.path}
                      to={t.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${
                        location.pathname === t.path
                          ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 font-semibold"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <span>{t.name}</span>
                      {read.has(t.path) && <Check className="w-4 h-4 text-emerald-400" />}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
