import React from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Sparkles, Layers, CheckCircle2, Split, Code } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "Custom Hooks",
  "Hook Composition",
  "Stateful logic extraction",
  "State isolation",
  "useDebounce",
  "useOnlineStatus"
];

const toc = [
  { label: "1. The Intuition: Extracting Nouns vs Verbs", hash: "intuition" },
  { label: "2. State Isolation: Why Custom Hooks Do NOT Share State", hash: "state-isolation" },
  { label: "3. Custom Hook vs Plain Utility Function", hash: "hook-vs-util" },
  { label: "4. Production Example: useOnlineStatus & useDebounce", hash: "production-examples" },
  { label: "5. Design Checklist for Resilient Custom Hooks", hash: "design-checklist" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "If Component A and Component B both call useCounter(), do they share the same counter state?",
    options: [
      "No, each component call allocates completely independent Hook nodes inside its own respective Fiber's memoizedState linked list.",
      "Yes, custom hooks behave like global singletons.",
      "Only if they are rendered inside the same parent div.",
      "Only if useCounter is exported as a default export."
    ],
    answer: 0,
    why: "Custom hooks share stateful LOGIC, not state itself. Each component invocation creates its own discrete Fiber node. When Component A calls useCounter(), its useState calls register on Component A's Fiber; Component B registers on Component B's Fiber."
  },
  {
    q: "When should you write a custom hook (useX) instead of a regular JavaScript utility function?",
    options: [
      "When the logic requires calling other React hooks (like useState, useEffect, or useContext) to maintain reactive state or lifecycle subscriptions.",
      "Whenever the function has more than 10 lines of code.",
      "Whenever the function returns an object instead of a string.",
      "To avoid importing React into your file."
    ],
    answer: 0,
    why: "If a function doesn't need to call other React hooks, it should simply be a pure helper utility function. The only reason to prefix a function with 'use' and make it a custom hook is to leverage React's hook engine and lifecycle."
  }
];

export default function CustomHooks() {
  return (
    <GuideLayout
      title="Custom Hooks Architecture Visualized"
      intro="Learn how to extract reusable stateful logic into clean, composable custom hooks while maintaining complete state isolation across component boundaries."
      badge="Design Patterns"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Sparkles className="w-5 h-5" />
          <h2>1. The Intuition: Extracting Nouns vs Verbs</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Before hooks existed in React 16.8, sharing stateful logic required complex patterns like <em>Higher-Order Components (HOCs)</em> or <em>Render Props</em>, leading to "wrapper hell" in component trees. Custom hooks solved this by turning stateful behavior into simple composable functions:
        </p>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            The Composable Mental Model
          </span>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed m-0">
            A custom hook lets you describe <em>what</em> external system you want to track (e.g. <code>const isOnline = useOnlineStatus()</code>), completely hiding the messy details of event listeners, cleanup timers, and local state.
          </p>
        </div>
      </section>

      {/* SECTION 2: State Isolation */}
      <section id="state-isolation" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Split className="w-5 h-5" />
          <h2>2. State Isolation: Why Custom Hooks Do NOT Share State</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          A common beginner mistake is assuming custom hooks act as global stores:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116]">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              Component &lt;Sidebar /&gt;
            </span>
            <div className="font-mono text-xs text-gray-300 bg-black/40 p-3 rounded-xl">
              const online = useOnlineStatus(); // Allocates Hook node on Sidebar's Fiber
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116]">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-2">
              Component &lt;ChatWidget /&gt;
            </span>
            <div className="font-mono text-xs text-gray-300 bg-black/40 p-3 rounded-xl">
              const online = useOnlineStatus(); // Allocates completely independent Hook node on ChatWidget's Fiber
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Hook vs Util */}
      <section id="hook-vs-util" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Code className="w-5 h-5" />
          <h2>3. Custom Hook vs Plain Utility Function</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-3 text-xs sm:text-sm text-gray-300">
          <div className="flex items-center gap-2 font-bold text-white">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>The Rule of Thumb:</span>
          </div>
          <p className="text-gray-400 leading-relaxed m-0">
            If your function does not call <code>useState</code>, <code>useEffect</code>, <code>useRef</code>, <code>useContext</code>, or any other hook, it should <strong>NOT</strong> be a custom hook! Name it like a normal function (e.g. <code>formatCurrency</code>, not <code>useFormatCurrency</code>).
          </p>
        </div>
      </section>

      {/* SECTION 4: Production Examples */}
      <section id="production-examples" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>4. Production Example: useOnlineStatus & useDebounce</h2>
        </div>

        <CodeBlock
          filename="useDebounce.ts"
          language="typescript"
          code={`import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler); // Resets timer on rapid keystrokes!
    };
  }, [value, delayMs]);

  return debouncedValue;
}`}
        />
      </section>

      {/* SECTION 5: Design Checklist */}
      <section id="design-checklist" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Design Checklist for Resilient Custom Hooks</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300">
          <ul className="space-y-1.5 list-disc list-inside text-gray-400">
            <li>Ensure every listener has an active cleanup return inside <code>useEffect</code>.</li>
            <li>Return arrays <code>[value, setter]</code> when 1-2 items; return objects <code>{`{ data, error, isLoading }`}</code> when returning 3+ items for easy destructuring.</li>
            <li>Always follow the Rules of Hooks (call only at top level, never conditionally).</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
