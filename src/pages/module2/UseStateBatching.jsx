import React, { useState } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Zap, Layers, CheckCircle2, Clock } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "useState",
  "Batching",
  "Automatic Batching",
  "Dispatch Queue",
  "Stale Closure",
  "State Snapshot",
  "Functional Update"
];

const toc = [
  { label: "1. The Intuition: State as a Photographic Snapshot", hash: "intuition" },
  { label: "2. The Dispatch Queue & Circular Linked List", hash: "dispatch-queue" },
  { label: "3. Interactive Lab: Stale Closure Trap & Batching", hash: "interactive-lab" },
  { label: "4. Automatic Batching in React 18 & 19", hash: "automatic-batching" },
  { label: "5. Production Patterns: Avoiding Stale Closures", hash: "production-patterns" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "If count is 0, what is the final value of count after clicking a button that calls: setCount(count + 1); setCount(count + 1); setCount(count + 1);",
    options: [
      "1, because each call captured 'count' as 0 during that specific render snapshot, queuing three replacements of 0 + 1.",
      "3, because React immediately updates count synchronously on each line.",
      "0, because multiple state calls cancel each other out.",
      "Undefined, because React throws a StaleStateError."
    ],
    answer: 0,
    why: "Inside the event handler function, 'count' is a constant captured in that render's closure with the value 0. The code effectively queued: queue.push(0 + 1), queue.push(0 + 1), queue.push(0 + 1). On the subsequent render, the last resolved value is 1. To get 3, use the functional update form: setCount(c => c + 1)."
  },
  {
    q: "What changed regarding batching in React 18+ (Automatic Batching)?",
    options: [
      "All state updates are now automatically batched together into a single render pass, even inside promises (fetch), setTimeout, and native event listeners.",
      "Batching was removed to make React faster on mobile devices.",
      "Only updates wrapped in flushSync() are batched.",
      "Batching only applies to class components."
    ],
    answer: 0,
    why: "In React 17 and earlier, React only batched updates triggered within React synthetic event handlers. Updates inside a setTimeout or fetch callback resulted in multiple independent renders. React 18 introduced Automatic Batching across all contexts, drastically improving performance."
  }
];

export default function UseStateBatching() {
  const [directCount, setDirectCount] = useState(0);
  const [functionalCount, setFunctionalCount] = useState(0);
  const [log, setLog] = useState([]);

  const handleDirectThree = () => {
    setDirectCount(directCount + 1);
    setDirectCount(directCount + 1);
    setDirectCount(directCount + 1);
    setLog((l) => [
      `Direct 3x: Queued (count + 1) three times using snapshot ${directCount}. Result -> ${directCount + 1}`,
      ...l.slice(0, 4)
    ]);
  };

  const handleFunctionalThree = () => {
    setFunctionalCount((c) => c + 1);
    setFunctionalCount((c) => c + 1);
    setFunctionalCount((c) => c + 1);
    setLog((l) => [
      `Functional 3x: Passed (c => c + 1) three times. Result -> ${functionalCount + 3}`,
      ...l.slice(0, 4)
    ]);
  };

  return (
    <GuideLayout
      title="useState & Batching Visualized"
      intro="Uncover how React processes the hook dispatch queue, why state behaves like a photographic snapshot, and how to master the infamous Stale Closure trap."
      badge="Hook Internals"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Clock className="w-5 h-5" />
          <h2>1. The Intuition: State as a Photographic Snapshot</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Setting state does not mutate a variable in place. Calling <code>setCount(count + 1)</code> is not like assigning <code>x = x + 1</code> in standard programming.
        </p>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            The Snapshot Mental Model
          </span>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed m-0">
            Every render is a frozen photograph of your component in time. Props, event handlers, and local state variables are immutable constants inside that frame. When you call <code>setState</code>, you are not altering the current photograph — you are commissioning React to take a <em>brand-new photograph</em> for the next render frame.
          </p>
        </div>
      </section>

      {/* SECTION 2: The Dispatch Queue */}
      <section id="dispatch-queue" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>2. The Dispatch Queue & Circular Linked List</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Internally, each <code>useState</code> call corresponds to a <code>Hook</code> node inside the Fiber's <code>memoizedState</code> linked list:
        </p>

        <CodeBlock
          filename="ReactFiberHooks.ts"
          language="typescript"
          code={`type Update<A> = {
  lane: Lane;
  action: A; // e.g. count + 1 OR (c => c + 1)
  hasEagerState: boolean;
  eagerState: any;
  next: Update<A>; // Circular linked list
};

type Hook = {
  memoizedState: any; // Current rendered state value
  baseState: any;
  queue: {
    pending: Update<any> | null; // Head of circular update queue
    dispatch: (action: any) => void;
    lastRenderedReducer: any;
    lastRenderedState: any;
  };
  next: Hook | null; // Pointer to next hook in component
};`}
        />
      </section>

      {/* SECTION 3: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Zap className="w-5 h-5" />
          <h2>3. Interactive Lab: Stale Closure Trap & Batching</h2>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Direct Snapshot Form */}
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10">
              <span className="text-xs font-mono font-bold text-rose-300 uppercase block mb-1">
                A: Direct Snapshot 3x
              </span>
              <p className="text-xs text-gray-400 mb-3">
                Calls <code>setCount(count + 1)</code> three times in a row.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-mono font-bold text-white">{directCount}</span>
                <button
                  onClick={handleDirectThree}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-rose-600/20"
                >
                  Run setCount(count + 1) x3
                </button>
              </div>
              <span className="text-[11px] font-mono text-rose-300/80">
                Increment by 1 (Snapshot trapped!)
              </span>
            </div>

            {/* Functional Updater Form */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10">
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase block mb-1">
                B: Functional Updater 3x
              </span>
              <p className="text-xs text-gray-400 mb-3">
                Calls <code>setCount(c =&gt; c + 1)</code> three times in a row.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-mono font-bold text-white">{functionalCount}</span>
                <button
                  onClick={handleFunctionalThree}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  Run setCount(c =&gt; c + 1) x3
                </button>
              </div>
              <span className="text-[11px] font-mono text-emerald-300/80">
                Increments by 3 (Queue evaluated sequentially!)
              </span>
            </div>
          </div>

          {/* Execution Log */}
          {log.length > 0 && (
            <div className="p-3 rounded-xl bg-[#09090d] border border-white/5 font-mono text-xs text-gray-400 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Dispatch Log:</span>
              {log.map((entry, idx) => (
                <div key={idx} className="truncate text-cyan-300/80">
                  {entry}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: Automatic Batching */}
      <section id="automatic-batching" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>4. Automatic Batching in React 18 & 19</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          React groups multiple state updates into a single render to optimize performance. Previously, updates inside promises or timeouts were not batched:
        </p>

        <CodeBlock
          filename="batching-evolution.js"
          language="javascript"
          code={`// React 17:
fetchData().then(() => {
  setIsLoading(false); // Render pass 1
  setData(result);     // Render pass 2 (Unnecessary layout thrashing!)
});

// React 18 & 19 (Automatic Batching):
fetchData().then(() => {
  setIsLoading(false);
  setData(result);
  // React reconciles both into a SINGLE synchronous commit pass!
});

// Opting out of batching (rarely needed, e.g. for urgent DOM reading):
import { flushSync } from 'react-dom';
flushSync(() => {
  setIsLoading(false);
}); // Flushes to real DOM immediately`}
        />
      </section>

      {/* SECTION 5: Production Patterns */}
      <section id="production-patterns" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Patterns: Avoiding Stale Closures</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-3 text-xs sm:text-sm text-gray-300">
          <p>
            Whenever state updates depend on the previous state value, <strong>always use the functional form</strong>:
          </p>
          <div className="p-3 rounded-xl bg-black/40 font-mono text-cyan-300 text-xs">
            setItems(prevItems =&gt; [...prevItems, newItem]);
          </div>
          <p className="text-gray-400 m-0">
            This avoids relying on the closure variable, guaranteeing your update receives the freshest state even inside asynchronous timeouts, event listeners, or WebSockets.
          </p>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
