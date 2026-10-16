import React, { useState } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Layers, Zap, CheckCircle2, ShieldCheck, Flame } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "React.memo",
  "Render Cascades",
  "Heatmap",
  "Bailout",
  "Shallow Comparison",
  "Object.is",
  "Component Tree"
];

const toc = [
  { label: "1. The Intuition: Fire in the Forest Canopy", hash: "intuition" },
  { label: "2. How React.memo Works Under the Hood", hash: "memo-mechanics" },
  { label: "3. Interactive Lab: Component Tree Render Heatmap", hash: "interactive-lab" },
  { label: "4. The Props Comparison Pitfall (Objects & Arrays)", hash: "comparison-pitfall" },
  { label: "5. Production Guidelines: When to Memoize", hash: "production-guidelines" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "How does React.memo determine whether to skip rendering a wrapped component?",
    options: [
      "It performs a shallow equality comparison (Object.is) on each key of the previous props and next props; if all match, it bails out.",
      "It compares the deep JSON strings of both props objects.",
      "It inspects whether the component's internal state has changed.",
      "It queries the browser cache for previous HTML output."
    ],
    answer: 0,
    why: "React.memo wraps your component and provides a bailout check during the beginWork phase of reconciliation. It performs a shallow comparison of props using Object.is. If every prop has the exact same reference or primitive value, React skips re-evaluating the component function entirely."
  },
  {
    q: "Why does passing `style={{ color: 'red' }}` to a memoized component break React.memo's bailout optimization?",
    options: [
      "Because inline object literals allocate a new object reference on every render, causing the shallow comparison (prevProps.style === nextProps.style) to always return false.",
      "Because inline styles disable the Virtual DOM.",
      "Because React.memo only works with Tailwind CSS class names.",
      "Because style objects cannot be compared by JavaScript."
    ],
    answer: 0,
    why: "In JavaScript, {} !== {}. On every render of the parent, a new style object is allocated. When React.memo compares prevProps.style with nextProps.style, they point to different memory addresses, completely defeating the memoization."
  }
];

export default function RenderCascadesMemo() {
  const [memoized, setMemoized] = useState(false);
  const [parentCount, setParentCount] = useState(0);

  return (
    <GuideLayout
      title="Re-render Cascades & React.memo Visualized"
      intro="Witness how a single state update triggers render cascades through component trees, and explore how React.memo establishes firebreaks to skip entire subtrees."
      badge="Performance Profiling"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Flame className="w-5 h-5 text-amber-400" />
          <h2>1. The Intuition: Fire in the Forest Canopy</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Imagine a lightning strike hitting a tree at the top of a hill. Fire spreads downwards across all connecting branches into the valley. In React, a state update at the root or parent component cascades down through all descendants unless you install a <strong>firebreak</strong> (<code>React.memo</code>).
        </p>
      </section>

      {/* SECTION 2: How React.memo Works */}
      <section id="memo-mechanics" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <ShieldCheck className="w-5 h-5" />
          <h2>2. How React.memo Works Under the Hood</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          During <code>beginWork</code>, React inspects the Fiber tag. If it's a <code>MemoComponent (14)</code>, it runs:
        </p>

        <CodeBlock
          filename="ReactFiberBeginWork.ts"
          language="typescript"
          code={`function updateMemoComponent(current, workInProgress, Component, compare) {
  const prevProps = current.memoizedProps;
  const nextProps = workInProgress.pendingProps;

  // Shallow comparison
  if (compare(prevProps, nextProps)) {
    // BAILOUT! Skip calling component function, reuse current child fibers
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  // Props changed: Call component function
  return updateFunctionComponent(current, workInProgress, Component, nextProps);
}`}
        />
      </section>

      {/* SECTION 3: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Zap className="w-5 h-5" />
          <h2>3. Interactive Lab: Component Tree Render Heatmap</h2>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setParentCount((c) => c + 1)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-cyan-600/20"
              >
                Re-render Parent (Count: {parentCount})
              </button>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={memoized}
                  onChange={(e) => setMemoized(e.target.checked)}
                  className="rounded text-cyan-500"
                />
                <span>Enable React.memo on Subtree</span>
              </label>
            </div>
            <span className="text-[11px] font-mono text-cyan-300">
              {memoized ? "Firebreak Active (Subtree Skipped)" : "Cascade Active (All Render)"}
            </span>
          </div>

          {/* Visual Heatmap Tree */}
          <div className="flex flex-col items-center gap-4 py-4 font-mono text-xs">
            {/* Root Parent */}
            <div className="px-5 py-2.5 rounded-xl border border-amber-500/50 bg-amber-950/40 text-amber-300 font-bold animate-pulse">
              &lt;Parent /&gt; (Re-rendered: {parentCount}x)
            </div>

            <div className="w-0.5 h-6 bg-white/20"></div>

            {/* Child Row */}
            <div className="flex gap-8">
              <div
                className={`px-4 py-2.5 rounded-xl border text-center transition-all ${
                  memoized
                    ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                    : "border-amber-500/40 bg-amber-950/20 text-amber-300 animate-pulse"
                }`}
              >
                <div>&lt;ExpensiveChart /&gt;</div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {memoized ? "Bailed out (0ms)" : "Re-rendered (Slow)"}
                </div>
              </div>

              <div
                className={`px-4 py-2.5 rounded-xl border text-center transition-all ${
                  memoized
                    ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                    : "border-amber-500/40 bg-amber-950/20 text-amber-300 animate-pulse"
                }`}
              >
                <div>&lt;DataGrid /&gt;</div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {memoized ? "Bailed out (0ms)" : "Re-rendered (Slow)"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Comparison Pitfall */}
      <section id="comparison-pitfall" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>4. The Props Comparison Pitfall (Objects & Arrays)</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          If any prop passed to a memoized component is an inline object, array, or function, the bailout check immediately fails:
        </p>

        <CodeBlock
          filename="memo-breaking-props.tsx"
          language="typescript"
          code={`const MemoList = React.memo(List);

function Dashboard() {
  // ❌ BROKEN: Inline object and function break React.memo!
  return (
    <MemoList
      config={{ pageSize: 20 }} // New object reference on every render
      onSelect={() => handleSelect()} // New function reference on every render
    />
  );

  // ✅ FIXED: Stable references via useMemo and useCallback
  const config = useMemo(() => ({ pageSize: 20 }), []);
  const onSelect = useCallback(() => handleSelect(), []);

  return <MemoList config={config} onSelect={onSelect} />;
}`}
        />
      </section>

      {/* SECTION 5: Production Guidelines */}
      <section id="production-guidelines" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Guidelines: When to Memoize</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300">
          <ul className="space-y-1.5 list-disc list-inside text-gray-400">
            <li>Only wrap components that are demonstrably slow or render large DOM subtrees.</li>
            <li>Don't wrap simple primitive buttons or text spans; the memoization comparison costs more than just rendering them.</li>
            <li>Prefer component composition patterns (e.g. lifting state or children props) before reaching for <code>React.memo</code>.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
