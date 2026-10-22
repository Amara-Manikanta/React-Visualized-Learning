import React, { useState, useTransition } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Zap, Clock, AlertTriangle, Layers, CheckCircle2 } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "Concurrent React",
  "useTransition",
  "useDeferredValue",
  "Non-blocking rendering",
  "Interruptible rendering",
  "Urgent updates",
  "Transition lanes"
];

const toc = [
  { label: "1. The Intuition: Urgent vs Non-Urgent Lanes", hash: "intuition" },
  { label: "2. The Problem: Synchronous Typing Stutter", hash: "stutter-problem" },
  { label: "3. Interactive Lab: useTransition vs Blocking Input", hash: "interactive-lab" },
  { label: "4. useTransition vs useDeferredValue", hash: "transition-vs-deferred" },
  { label: "5. Production Patterns for Non-blocking Search", hash: "production-patterns" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "What makes an update wrapped in startTransition() fundamentally different from a regular setState() in React 18 & 19?",
    options: [
      "Transition updates are marked as low-priority interruptible work; if an urgent event (like a new keystroke or tap) occurs, React pauses or abandons the transition render to keep input responsive.",
      "Transition updates are executed on a cloud server.",
      "Transition updates run inside CSS animations.",
      "Transition updates bypass the virtual DOM entirely."
    ],
    answer: 0,
    why: "Prior to Concurrent React, all renders were all-or-nothing. If filtering a 20,000-item table took 100ms, the browser input field froze completely while waiting. Wrapping the filter state in startTransition() allows React to prioritize typing (Urgent Lane) while calculating the filtered list in an interruptible background lane (Transition Lane)."
  },
  {
    q: "When should you use `useDeferredValue` instead of `useTransition`?",
    options: [
      "When you receive a value as a prop from a parent component that you don't control, and you want to defer re-rendering the heavy UI based on that prop.",
      "When you want to delay an API call by 5 seconds.",
      "When you want to cache values in localStorage.",
      "Only when building mobile apps with Capacitor."
    ],
    answer: 0,
    why: "useTransition gives you a startTransition function and an isPending boolean when you own the state setter (e.g. setSearchQuery). But if you receive 'query' as a prop from outside your component, you don't have access to the setter. useDeferredValue takes that prop directly and creates a lagged, deferred copy that updates in the background."
  }
];

export default function ConcurrentTransitions() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [filteredCount, setFilteredCount] = useState(0);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val); // URGENT: Updates input immediately with 0 lag!

    startTransition(() => {
      // TRANSITION: Low-priority background calculation
      let count = 0;
      for (let i = 0; i < 50000; i++) {
        if (Math.sin(i).toString().includes(val.slice(-1) || "1")) count++;
      }
      setFilteredCount(count);
    });
  };

  return (
    <GuideLayout
      title="Concurrent React & Transitions Visualized"
      intro="Discover how React's cooperative scheduler prioritizes urgent user keystrokes over heavy background calculations using interruptible Transition Lanes."
      badge="Concurrency & React 19"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Clock className="w-5 h-5" />
          <h2>1. The Intuition: Urgent vs Non-Urgent Lanes</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Think of a highway with an <strong>Emergency Siren Lane</strong> and a <strong>Freight Truck Lane</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-cyan-500/20 bg-[#111116]">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              Urgent Updates (Siren Lane)
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Typing letters into an input, clicking a checkbox, hovering a tooltip. Users expect immediate tactile feedback (&lt;16ms).
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-indigo-500/20 bg-[#111116]">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-2">
              Transition Updates (Freight Lane)
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Filtering a huge dataset, switching tabs, rendering a massive chart. Users understand these take a fraction of a second, as long as the page doesn't freeze.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: The Stutter Problem */}
      <section id="stutter-problem" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <AlertTriangle className="w-5 h-5" />
          <h2>2. The Problem: Synchronous Typing Stutter</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Without Concurrency, coupling text input directly to a heavy chart creates typing stutter:
        </p>

        <CodeBlock
          filename="blocking-input.tsx"
          language="typescript"
          code={`// ❌ Stuttery typing: Every keystroke synchronously blocks for 80ms!
function SearchBox() {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value); // Blocks main thread while re-rendering chart!
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <HugeChart query={query} />
    </div>
  );
}`}
        />
      </section>

      {/* SECTION 3: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Zap className="w-5 h-5" />
          <h2>3. Interactive Lab: useTransition Live Simulator</h2>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Type Rapidly Below:
              </span>
              <p className="text-xs text-gray-400">Notice the input box responds instantaneously while the heavy calculation shows a pending state.</p>
            </div>
            {isPending && (
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                Transition Pending (Non-blocking)...
              </span>
            )}
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Type numbers or letters rapidly..."
              className="w-full bg-[#09090d] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
            />

            <div className="p-4 rounded-xl bg-[#09090d] border border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">Heavy Matches Computed:</span>
              <span className="font-bold text-cyan-300 text-sm">{filteredCount.toLocaleString()} items</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: useTransition vs useDeferredValue */}
      <section id="transition-vs-deferred" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>4. useTransition vs useDeferredValue</h2>
        </div>

        <CodeBlock
          filename="useDeferredValue-pattern.tsx"
          language="typescript"
          code={`import { useDeferredValue } from 'react';

// When you don't control the setter (e.g. query is a prop from parent):
export function SearchResults({ query }: { query: string }) {
  // Deferred value lags behind query when urgent typing occurs
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      <HeavyList search={deferredQuery} />
    </div>
  );
}`}
        />
      </section>

      {/* SECTION 5: Production Patterns */}
      <section id="production-patterns" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Patterns for Non-blocking Search</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300">
          <ul className="space-y-1.5 list-disc list-inside text-gray-400">
            <li>Keep input state in the Urgent Lane: <code>setText(e.target.value)</code>.</li>
            <li>Wrap filtering or graph calculations in <code>startTransition</code>.</li>
            <li>Use <code>isPending</code> to provide subtle opacity or skeleton feedback without locking the screen.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
