import React from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Cpu, Zap, AlertTriangle, Layers, CheckCircle2 } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "useMemo",
  "useCallback",
  "Referential Equality",
  "Memoization",
  "React.memo",
  "Cache Invalidation",
  "Performance optimization"
];

const toc = [
  { label: "1. The Intuition: Object Identity in JavaScript", hash: "intuition" },
  { label: "2. useMemo vs useCallback: The Exact Difference", hash: "memo-vs-callback" },
  { label: "3. When Memoization Actually HURTS Performance", hash: "when-it-hurts" },
  { label: "4. The Only 2 Legitimate Use Cases for useCallback", hash: "legitimate-cases" },
  { label: "5. Production Checklist: Profiling Before Memoizing", hash: "production-checklist" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why does passing an inline callback `onClick={() => doSomething()}` to a child component cause that child to re-render, even if the child is wrapped in React.memo?",
    options: [
      "Because every render of the parent creates a brand-new function instance in memory with a different reference (=== returns false).",
      "Because React.memo disables event propagation.",
      "Because arrow functions cannot be serialized by the Fiber reconciler.",
      "Because the browser garbage collector deletes the function on every frame."
    ],
    answer: 0,
    why: "In JavaScript, {} !== {} and (() => {}) !== (() => {}). Every time the parent renders, a new function reference is allocated in heap. When React.memo does a shallow equality check (prevProps.onClick === nextProps.onClick), it sees two different memory addresses and re-renders the child. useCallback preserves the exact same function reference between renders."
  },
  {
    q: "Why is wrapping every single function in useCallback() considered an anti-pattern in React?",
    options: [
      "Because useCallback itself incurs memory overhead (allocating dependency arrays, function closures, and shallow diffing) that often exceeds the cost of a simple re-render.",
      "Because useCallback prevents components from receiving updated props.",
      "Because modern browsers limit the number of memoized hooks to 16 per component.",
      "Because useCallback turns client components into server components."
    ],
    answer: 0,
    why: "useCallback is not free. React must allocate the hook node, allocate the dependency array on every render, and perform Object.is comparisons. If the child component being passed the function is not wrapped in React.memo, useCallback accomplishes literally nothing while adding CPU and memory overhead."
  }
];

export default function UseMemoCallback() {
  return (
    <GuideLayout
      title="useMemo & useCallback Visualized"
      intro="Master referential equality in JavaScript, understand the internal mechanics of memoization, and learn when caching values helps vs when it hurts performance."
      badge="Optimization"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Cpu className="w-5 h-5" />
          <h2>1. The Intuition: Object Identity in JavaScript</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In JavaScript, primitive numbers and strings are compared by value, but objects, arrays, and functions are compared by <strong>memory reference</strong>:
        </p>

        <div className="p-4 rounded-xl border border-white/10 bg-[#09090d] font-mono text-xs text-gray-300 space-y-1 my-4">
          <div>1 === 1 // <span className="text-emerald-400">true</span></div>
          <div>"react" === "react" // <span className="text-emerald-400">true</span></div>
          <div>{"{}"} === {"{}"} // <span className="text-rose-400">false! (Different memory addresses)</span></div>
          <div>(() =&gt; {}) === (() =&gt; {}) // <span className="text-rose-400">false! (Newly allocated closures)</span></div>
        </div>
      </section>

      {/* SECTION 2: useMemo vs useCallback */}
      <section id="memo-vs-callback" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>2. useMemo vs useCallback: The Exact Difference</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In fact, <code>useCallback(fn, deps)</code> is just syntactic sugar for <code>useMemo(() =&gt; fn, deps)</code>!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-cyan-500/20 bg-[#111116]">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              useMemo(() =&gt; computeValue(), [deps])
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Executes the provided function and <strong>caches the result</strong> of that calculation. It re-computes only when dependencies change.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-indigo-500/20 bg-[#111116]">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-2">
              useCallback(fn, [deps])
            </span>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Does NOT execute the function. It <strong>caches the function reference itself</strong> so it doesn't change on every render.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: When it hurts */}
      <section id="when-it-hurts" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-rose-400 font-bold text-lg">
          <AlertTriangle className="w-5 h-5" />
          <h2>3. When Memoization Actually HURTS Performance</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Wrapping trivial calculations in <code>useMemo</code> is a net negative:
        </p>

        <CodeBlock
          filename="memo-overhead.ts"
          language="typescript"
          code={`// ❌ ANTI-PATTERN: Slower than plain JavaScript!
// React must allocate a closure function, allocate a 1-item array,
// and run Object.is diffing on every render just to add two numbers!
const sum = useMemo(() => a + b, [a, b]);

// ✅ CORRECT: Plain arithmetic is 1,000x faster than hook overhead
const sum = a + b;`}
        />
      </section>

      {/* SECTION 4: Legitimate Cases */}
      <section id="legitimate-cases" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>4. The Only 2 Legitimate Use Cases for useCallback</h2>
        </div>

        <div className="space-y-4 my-6">
          <div className="p-4 rounded-xl border border-white/10 bg-[#111116]">
            <span className="text-cyan-400 font-bold text-sm block mb-1">
              Case 1: Passing as a prop to a component wrapped in React.memo
            </span>
            <p className="text-xs text-gray-400 m-0">
              If the child component is <code>memo(ExpensiveChart)</code>, a stable callback prevents the chart from re-rendering needlessly.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-[#111116]">
            <span className="text-indigo-400 font-bold text-sm block mb-1">
              Case 2: Passing as a dependency to another hook (e.g. useEffect)
            </span>
            <p className="text-xs text-gray-400 m-0">
              If an effect depends on <code>[fetchData]</code>, wrapping <code>fetchData</code> in <code>useCallback</code> prevents an infinite render loop.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Production Checklist */}
      <section id="production-checklist" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Zap className="w-5 h-5" />
          <h2>5. Production Checklist: Profiling Before Memoizing</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300">
          <p>Before adding <code>useMemo</code> or <code>useCallback</code>, ask:</p>
          <ul className="space-y-1.5 list-disc list-inside text-gray-400">
            <li>Is the calculation demonstrably slow (&gt;1ms in React DevTools Profiler)?</li>
            <li>Is the child component wrapped in <code>React.memo</code>?</li>
            <li>Could this be solved more cleanly through component composition (children-as-props)?</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
