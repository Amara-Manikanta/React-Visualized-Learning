import React from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Box, Eye, AlertTriangle, Layers, CheckCircle2 } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "useRef",
  "DOM access",
  "Mutable box",
  "Render cycle bypass",
  "Persistent reference",
  "forwardRef"
];

const toc = [
  { label: "1. The Intuition: A Secret Drawer That React Ignores", hash: "intuition" },
  { label: "2. The Anatomy of useRef: Plain JavaScript Object", hash: "anatomy" },
  { label: "3. DOM Node Access vs Instance Variable Storage", hash: "dom-vs-instance" },
  { label: "4. The Golden Rule: Never Read/Write Refs in Render", hash: "golden-rule" },
  { label: "5. Production Patterns: Timer IDs & Previous Props", hash: "production-patterns" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why does mutating myRef.current = newValue NOT cause the component to re-render?",
    options: [
      "Because useRef returns a plain JavaScript object whose property mutations are not tracked by React's scheduling lanes or Fiber reconciliation loops.",
      "Because useRef runs in a separate Web Worker thread.",
      "Because the browser DOM intercepts all ref modifications.",
      "Because React freezes the ref object using Object.freeze()."
    ],
    answer: 0,
    why: "Unlike useState, which dispatches an action to the Fiber's updateQueue and schedules a render pass with the Scheduler, mutating ref.current is just normal JS property assignment: obj.current = val. React has no setter listener on it, so no re-render is triggered."
  },
  {
    q: "Why is reading or writing ref.current during the component render phase considered an anti-pattern in Concurrent React?",
    options: [
      "Because the Render Phase can be executed multiple times or discarded without committing, causing unpredictable side effects and breaking pure rendering invariants.",
      "Because refs cannot be read inside JSX tags.",
      "Because the compiler throws a TypeScript syntax error.",
      "Because refs are only allocated when the component unmounts."
    ],
    answer: 0,
    why: "In Concurrent React, a component render can be paused, restarted, or completely abandoned by the scheduler. If you read or write ref.current during render, components will experience inconsistent values across concurrent render attempts. Always read/write refs in event handlers or useEffect."
  }
];

export default function UseRefDeepDive() {
  return (
    <GuideLayout
      title="useRef: Escaping React's Reactive Cycle"
      intro="Learn why useRef is much more than a DOM pointer: it is a persistent, mutable memory box that survives across renders without triggering UI updates."
      badge="Hook Internals"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Box className="w-5 h-5" />
          <h2>1. The Intuition: A Secret Drawer That React Ignores</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          If <code>useState</code> is a billboard that announces changes to everyone and forces the entire room to look at it (a re-render), <code>useRef</code> is a secret pocket notebook:
        </p>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            The Persistent Memory Box
          </span>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed m-0">
            You can write whatever you want into the notebook at any time. React never monitors it, never diffs it, and will never re-render your component because of it. Yet whenever your component does re-render for other reasons, the notebook is still sitting right there with the exact data you left in it.
          </p>
        </div>
      </section>

      {/* SECTION 2: Anatomy */}
      <section id="anatomy" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>2. The Anatomy of useRef: Plain JavaScript Object</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Under the hood, <code>useRef(initialValue)</code> is almost literally implemented like this in React:
        </p>

        <CodeBlock
          filename="ReactFiberHooks.ts"
          language="typescript"
          code={`function mountRef<T>(initialValue: T): { current: T } {
  const hook = mountWorkInProgressHook();
  const ref = { current: initialValue };
  hook.memoizedState = ref;
  return ref;
}

function updateRef<T>(): { current: T } {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState; // Returns the exact same object reference!
}`}
        />
      </section>

      {/* SECTION 3: DOM vs Instance */}
      <section id="dom-vs-instance" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Eye className="w-5 h-5" />
          <h2>3. DOM Node Access vs Instance Variable Storage</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116]">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              Use Case 1: Imperative DOM Nodes
            </span>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Focusing an input, triggering HTML5 media playback (<code>video.play()</code>), measuring scroll geometry, or initializing Canvas/WebGL contexts.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116]">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-2">
              Use Case 2: Instance Variables
            </span>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Storing interval/timeout IDs (<code>setInterval</code>), remembering previous prop values, tracking whether a component has mounted, or storing WebSockets.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: The Golden Rule */}
      <section id="golden-rule" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-rose-400 font-bold text-lg">
          <AlertTriangle className="w-5 h-5" />
          <h2>4. The Golden Rule: Never Read/Write Refs in Render</h2>
        </div>

        <CodeBlock
          filename="ref-antipattern.tsx"
          language="typescript"
          code={`function BadComponent() {
  const countRef = useRef(0);

  // ❌ ILLEGAL: Writing to ref during render phase!
  countRef.current++;

  // ❌ ILLEGAL: Reading ref to render JSX output!
  return <h1>Render count: {countRef.current}</h1>;
}

function GoodComponent() {
  const countRef = useRef(0);

  // ✅ LEGAL: Mutating ref inside an event handler
  const handleClick = () => {
    countRef.current += 1;
  };

  // ✅ LEGAL: Reading/mutating ref inside useEffect (after commit)
  useEffect(() => {
    console.log("Current count after commit:", countRef.current);
  });

  return <button onClick={handleClick}>Click me</button>;
}`}
        />
      </section>

      {/* SECTION 5: Production Patterns */}
      <section id="production-patterns" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Patterns: Timer IDs & Previous Props</h2>
        </div>

        <CodeBlock
          filename="usePrevious.ts"
          language="typescript"
          code={`import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);

  useEffect(() => {
    ref.current = value; // Updates after render commit
  }, [value]);

  return ref.current; // Returns value from PREVIOUS render
}`}
        />
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
