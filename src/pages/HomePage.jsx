import React from "react";
import { Link } from "react-router-dom";
import GlobalHeader from "../components/GlobalHeader";
import Footer from "../components/Footer";
import { MODULES, ALL_TOPICS } from "../config/navigation";
import { useReadPages } from "../lib/progress";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Layers,
  Terminal,
  BookmarkCheck,
  CheckCircle2,
  Monitor,
  Smartphone
} from "lucide-react";

export default function HomePage() {
  const read = useReadPages();
  const completedCount = ALL_TOPICS.filter((t) => read.has(t.path)).length;
  const progressPct = Math.round((completedCount / ALL_TOPICS.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0c10] text-gray-200 font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      <GlobalHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-white/10">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/10 to-purple-600/15 blur-[120px] pointer-events-none -z-10" />

          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 text-center">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-6 shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>React 19 • Fiber Architecture • Concurrency • Server Components</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
              The Definitive Visual Platform for{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                React Internals
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light mb-10">
              Master the engine beneath JSX. Explore animated Fiber double-buffering, hook closure traps, render cascade heatmaps, and React 19 RSC streaming.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/module-0/what-is-ui-and-dom"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Zero UI Knowledge? Start Here (Topic 0.1)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/module-1/fiber-reconciler"
                className="px-6 py-3.5 rounded-2xl bg-[#16161f] hover:bg-[#1a1a24] text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-500/50 font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Flagship: Fiber Reconciler</span>
              </Link>
            </div>

            {/* Platform Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-12 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                <Monitor className="w-3.5 h-3.5 text-cyan-400" /> macOS Electron
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" /> iOS Simulator / Capacitor
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" /> 0 Oxlint Errors
              </span>
            </div>
          </div>
        </section>

        {/* 6 PEDAGOGICAL PILLARS */}
        <section className="py-14 border-b border-white/10 bg-[#09090d]/60">
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                Core Methodology
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Engineered for Deep Architectural Intuition
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  title: "1. Intuition Before Code",
                  desc: "Start with video game double-buffering and call-stack analogies before inspecting Fiber structs.",
                  icon: Sparkles,
                  color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
                },
                {
                  title: "2. Interactive Laboratories",
                  desc: "Step through child/sibling/return pointers and toggle live closures in real-time simulators.",
                  icon: Zap,
                  color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                },
                {
                  title: "3. Visuals & Flowcharts",
                  desc: "Step-by-step render pipelines, SVG tree graphs, and memory layout transitions.",
                  icon: Layers,
                  color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                },
                {
                  title: "4. Production TypeScript",
                  desc: "Realistic, modern React 19 / ESNext code examples showing real engine constructs.",
                  icon: Terminal,
                  color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                },
                {
                  title: "5. Knowledge Checks",
                  desc: "End-of-lesson interactive quiz banks testing 'why', not syntax memorization, with reshuffled options.",
                  icon: BookmarkCheck,
                  color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                },
                {
                  title: "6. Multi-Platform Offline",
                  desc: "Packaged for macOS (Electron) and iOS (Capacitor) with offline user topic notes.",
                  icon: Monitor,
                  color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
                },
              ].map((pill, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-white/10 bg-[#111116] hover:border-white/20 transition-all shadow-lg"
                >
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3.5 ${pill.color}`}>
                    <pill.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{pill.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed m-0">{pill.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CURRICULUM MODULES */}
        <section className="py-16 lg:py-20 max-w-[1300px] mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                Full Curriculum
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {MODULES.length} Modules • {ALL_TOPICS.length} Visualized Lessons
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span>Overall Progress:</span>
              <span className="font-bold text-cyan-400">{progressPct}% Complete</span>
              <span className="text-gray-600">({completedCount}/{ALL_TOPICS.length})</span>
            </div>
          </div>

          <div className="space-y-8">
            {MODULES.map((mod) => (
              <div
                key={mod.id}
                className="rounded-2xl border border-white/10 bg-[#111116] overflow-hidden shadow-xl"
              >
                {/* Module Bar */}
                <div className="p-5 sm:p-6 border-b border-white/10 bg-[#16161f]/60 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${mod.badgeColor} mb-2 inline-block`}>
                      {mod.shortTitle}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{mod.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-gray-400">
                    {mod.topics.length} Lessons
                  </span>
                </div>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
                  {mod.topics.map((t) => {
                    const isRead = read.has(t.path);
                    return (
                      <Link
                        key={t.path}
                        to={t.path}
                        className="p-5 hover:bg-white/[0.03] transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-mono text-cyan-400 font-semibold group-hover:text-cyan-300">
                              {t.badge}
                            </span>
                            {isRead && (
                              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Done
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                            {t.name}
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed">{t.desc}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 group-hover:text-cyan-400 mt-4 transition-colors">
                          <span>Enter Lesson</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
