import React from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Database, Layers, AlertTriangle, CheckCircle2, Split } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "External Stores",
  "Zustand",
  "Redux",
  "useSyncExternalStore",
  "Tearing",
  "Atomic Selectors",
  "Subscription pattern"
];

const toc = [
  { label: "1. The Intuition: What is UI Tearing?", hash: "intuition" },
  { label: "2. useSyncExternalStore: The Concurrency Bridge", hash: "use-sync-external-store" },
  { label: "3. Zustand Atomic Selectors vs Context vs Redux", hash: "store-comparison" },
  { label: "4. The Subscription Pattern Under the Hood", hash: "subscription-pattern" },
  { label: "5. Production Recommendations for Modern State", hash: "production-recommendations" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "What is 'UI Tearing' and why did React introduce the `useSyncExternalStore` hook?",
    options: [
      "Tearing occurs when a component renders with one version of external store data, a non-React async event updates the store during a concurrent render pause, and another component renders with the new version, displaying conflicting visual states simultaneously.",
      "Tearing is when the browser GPU crashes due to excessive CSS animations.",
      "Tearing is when HTML text exceeds the width of a div container.",
      "Tearing is when WebSockets drop connection packets."
    ],
    answer: 0,
    why: "In Concurrent React, rendering is interruptible. If an external store (like Redux or Zustand) mutates in the middle of a render pause, two components on the screen could read different values from the exact same store in the same frame! useSyncExternalStore guarantees synchronous, tear-free reads."
  },
  {
    q: "Why do Zustand atomic selectors (e.g. `useStore(state => state.bears)`) prevent unnecessary component re-renders?",
    options: [
      "The component only subscribes to the specific slice returned by the selector; if other properties in the store change, the selector result remains strictly equal (===) and the component bails out.",
      "Because Zustand stores are compiled into WebAssembly.",
      "Because Zustand bypasses the React reconciler.",
      "Because Zustand converts all state into immutable JSON files."
    ],
    answer: 0,
    why: "Unlike Context (which notifies every consumer on any change), Zustand selectors inspect whether the returned slice has changed via Object.is comparison. If state.fish changes, a component subscribing only to state.bears will never re-render."
  }
];

export default function ExternalStores() {
  return (
    <GuideLayout
      title="External Store Architecture: Zustand vs Redux"
      intro="Learn how modern external stores integrate with Concurrent React using useSyncExternalStore to eliminate UI tearing and achieve surgical, atomic selector reactivity."
      badge="Modern State Architecture"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h2>1. The Intuition: What is UI Tearing?</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Imagine a master clock in an airport terminal. If Component A at the top of the board reads <code>10:00:00 AM</code>, the render is paused by React for 1 millisecond, the clock ticks to <code>10:00:01 AM</code>, and Component B at the bottom reads the new time — the display shows two conflicting times at once! That visual glitch is called <strong>UI Tearing</strong>.
        </p>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            The Concurrency Challenge
          </span>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed m-0">
            Because React 18 & 19 can pause, resume, and discard renders across cooperative frames, external stores outside React's Fiber memory need a formal handshake to guarantee consistent snapshots. That handshake is <code>useSyncExternalStore</code>.
          </p>
        </div>
      </section>

      {/* SECTION 2: useSyncExternalStore */}
      <section id="use-sync-external-store" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Database className="w-5 h-5" />
          <h2>2. useSyncExternalStore: The Concurrency Bridge</h2>
        </div>

        <CodeBlock
          filename="useSyncExternalStore-signature.ts"
          language="typescript"
          code={`import { useSyncExternalStore } from 'react';

// The primitive behind Zustand, Redux Toolkit, and TanStack Store
const value = useSyncExternalStore(
  subscribe,          // Function to register callback on store mutations
  getSnapshot,        // Returns current immutable snapshot on client
  getServerSnapshot   // Optional: Returns snapshot during SSR
);`}
        />
      </section>

      {/* SECTION 3: Store Comparison */}
      <section id="store-comparison" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Split className="w-5 h-5" />
          <h2>3. Zustand Atomic Selectors vs Context vs Redux</h2>
        </div>

        <div className="overflow-x-auto custom-scrollbar my-6">
          <table className="w-full text-left text-xs sm:text-sm border-collapse rounded-xl overflow-hidden border border-white/10 bg-[#111116]">
            <thead>
              <tr className="border-b border-white/10 bg-[#16161f] text-gray-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-4">Feature</th>
                <th className="p-4 text-cyan-300">Zustand</th>
                <th className="p-4 text-amber-300">React Context</th>
                <th className="p-4 text-purple-300">Redux Toolkit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-light">
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-white font-mono text-xs">Atomic Selectors</td>
                <td className="p-4 text-emerald-400 font-bold">Yes (Fine-grained)</td>
                <td className="p-4 text-rose-400">No (Re-renders all)</td>
                <td className="p-4 text-emerald-400 font-bold">Yes (useSelector)</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-white font-mono text-xs">Provider Wrapping Required</td>
                <td className="p-4 text-emerald-400">No (Direct import)</td>
                <td className="p-4 text-gray-400">Yes (&lt;Context.Provider&gt;)</td>
                <td className="p-4 text-gray-400">Yes (&lt;Provider&gt;)</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-white font-mono text-xs">Bundle Footprint</td>
                <td className="p-4 text-emerald-400 font-bold">&lt;1.2 KB</td>
                <td className="p-4 text-emerald-400 font-bold">0 KB (Built-in)</td>
                <td className="p-4 text-gray-400">~12 KB</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-white font-mono text-xs">Boilerplate Level</td>
                <td className="p-4 text-emerald-400">Minimal</td>
                <td className="p-4 text-amber-400">Moderate</td>
                <td className="p-4 text-gray-400">Structured (Slices)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: Subscription Pattern */}
      <section id="subscription-pattern" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>4. The Subscription Pattern Under the Hood</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Notice how atomic selectors allow components to ignore unrelated changes:
        </p>

        <CodeBlock
          filename="zustand-selector.tsx"
          language="typescript"
          code={`import { create } from 'zustand';

interface StoreState {
  bears: number;
  fish: number;
  addBear: () => void;
}

const useStore = create<StoreState>((set) => ({
  bears: 0,
  fish: 100,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
}));

// ✅ This component ONLY re-renders when "bears" changes!
// When "fish" updates, this component is completely untouched.
export function BearCounter() {
  const bears = useStore((state) => state.bears);
  return <h1>Bears: {bears}</h1>;
}`}
        />
      </section>

      {/* SECTION 5: Production Recommendations */}
      <section id="production-recommendations" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Recommendations for Modern State</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300">
          <ul className="space-y-1.5 list-disc list-inside text-gray-400">
            <li><strong>Server Cache:</strong> Use TanStack Query or React 19 RSC/Actions for server state (don't put API caches in global Redux/Zustand).</li>
            <li><strong>Global Client State:</strong> Use Zustand for global UI state requiring surgical selectors (e.g. music players, sidebars, active canvas).</li>
            <li><strong>Local State:</strong> Use <code>useState</code> and <code>useReducer</code>.</li>
            <li><strong>Theme/Locale:</strong> Use React Context.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
