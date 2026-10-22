import React, { useState } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Layers, Activity, Cpu, CheckCircle2, Zap } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "Virtual DOM",
  "VDOM",
  "Real DOM",
  "Layout Thrashing",
  "Reflow",
  "Repaint",
  "SyntheticEvent",
  "Batching",
  "Diffing heuristics"
];

const toc = [
  { label: "1. The Intuition: Heavy C++ DOM vs Lightweight JS Objects", hash: "intuition" },
  { label: "2. Layout Thrashing & The Real Cost of Browser Reflows", hash: "layout-thrashing" },
  { label: "3. Interactive Lab: Real-time Layout Thrashing Simulator", hash: "interactive-lab" },
  { label: "4. The 3 Heuristics of React's Diffing Algorithm", hash: "diffing-heuristics" },
  { label: "5. SyntheticEvent System & Event Delegation", hash: "synthetic-events" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why is modifying the real browser DOM significantly slower than updating plain JavaScript objects in memory?",
    options: [
      "Because DOM mutations trigger expensive recalculations of CSS styles, geometric layout coordinates (reflow), and pixel rasterization (repaint) across the C++ rendering engine.",
      "Because JavaScript cannot communicate with the browser DOM without sending network packets over HTTP.",
      "Because the browser locks the entire GPU whenever innerHTML is updated.",
      "Because modern browser security policies rate-limit DOM element updates to 10 per second."
    ],
    answer: 0,
    why: "A real HTML element is a heavy C++ object with hundreds of CSS style cascades and layout coordinates. Alternating between writing to the DOM and reading layout properties (like offsetHeight) forces synchronous layout recalculation ('layout thrashing'). The Virtual DOM allows React to batch calculations in pure JS memory before applying minimal mutations."
  },
  {
    q: "Why does React require unique and stable 'key' props when rendering dynamic arrays of elements?",
    options: [
      "Keys allow React's diffing heuristic to identify elements across renders in O(n) time, preventing unnecessary unmounting and recreation of DOM nodes.",
      "Keys are required by CSS Flexbox to calculate item ordering.",
      "Keys provide cryptographic security against cross-site scripting (XSS) attacks in lists.",
      "Keys allow the browser to serialize the DOM into JSON for localStorage caching."
    ],
    answer: 0,
    why: "Without keys, if you insert an item at the beginning of an array, React assumes every single item changed and re-renders all children destructively. A stable key gives the Fiber node an identity, enabling React to simply move the existing DOM node in O(n) time rather than destroying and recreating it."
  }
];

export default function VdomVsRealDom() {
  const [listCount, setListCount] = useState(5);

  return (
    <GuideLayout
      title="Virtual DOM vs Real DOM Visualized"
      intro="Explore the mechanics of layout thrashing, batched reconciliation, synthetic event delegation, and React's O(n) diffing heuristics."
      badge="Core Architecture"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>1. The Intuition: Heavy C++ DOM vs Lightweight JS Objects</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          A common misconception is that the Virtual DOM is "faster than the real DOM." In absolute terms, vanilla JavaScript writing directly to a single DOM node is faster than React creating virtual objects, diffing them, and then mutating the DOM.
        </p>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          So why does Virtual DOM exist? Because humans writing manual DOM updates invariably trigger <strong className="text-cyan-300">Layout Thrashing</strong> in complex UIs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              The Real Browser DOM (C++ Object)
            </span>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              An HTML <code>&lt;div&gt;</code> element in Chromium has over 200 prototype properties, style geometry caches, layout bounding boxes, and event listener arrays. Allocating or reading it touches the C++ browser engine boundary.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-2">
              A Virtual DOM Element (Plain JS Object)
            </span>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              <code>{`{ type: 'div', props: { className: 'card' }, children: [...] }`}</code>. It is a plain JavaScript object literal. Creating 10,000 of these in V8 takes less than 2 milliseconds.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Layout Thrashing */}
      <section id="layout-thrashing" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Activity className="w-5 h-5" />
          <h2>2. Layout Thrashing & The Real Cost of Browser Reflows</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          When you write to the DOM (e.g. <code>element.style.width = '100px'</code>), the browser marks its layout geometry as dirty. If you immediately read a layout property (e.g. <code>element.offsetHeight</code>), the browser is forced to stop JavaScript execution, synchronously recalculate CSS styles and layout boxes across the entire page (<strong>Forced Synchronous Layout</strong>), and return the value.
        </p>

        <CodeBlock
          filename="layout-thrashing-antipattern.js"
          language="javascript"
          code={`// ❌ Classic Layout Thrashing (Forces 100 Synchronous Reflows)
for (let i = 0; i < elements.length; i++) {
  // WRITE: Dirties the layout
  elements[i].style.width = '200px';
  // READ: Forces browser to synchronously compute reflow right now!
  const height = elements[i].offsetHeight;
}

// ✅ React's Batched Virtual DOM Approach
// 1. Compute all changes in memory (zero DOM reads/writes)
// 2. Diff against previous Virtual DOM snapshot
// 3. Batch ALL writes together in a single synchronous commit pass`}
        />
      </section>

      {/* SECTION 3: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Zap className="w-5 h-5" />
          <h2>3. Interactive Lab: Virtual DOM Diffing Simulator</h2>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
            <div>
              <h4 className="text-sm font-bold text-white">Dynamic List Re-ordering Lab</h4>
              <p className="text-xs text-gray-400">Observe how key reconciliation preserves existing DOM nodes.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setListCount((c) => Math.min(8, c + 1))}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
              >
                + Add Item
              </button>
              <button
                onClick={() => setListCount((c) => Math.max(2, c - 1))}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs cursor-pointer"
              >
                - Remove Item
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-[#09090d] border border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-3">
                Virtual DOM Snapshot (Heap Memory)
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {Array.from({ length: listCount }, (_, i) => (
                  <div key={i} className="p-2 rounded bg-cyan-950/30 border border-cyan-500/20 text-cyan-200 flex justify-between">
                    <span>&lt;Item key="item-{i}" /&gt;</span>
                    <span className="text-gray-500 text-[10px]">Fiber #{i + 10}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#09090d] border border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-3">
                Mutations Flushed to Real DOM
              </span>
              <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 text-xs">
                <div className="font-bold mb-1">Batch Completed:</div>
                <p className="text-gray-400 text-xs m-0">
                  Total items: {listCount}. React diffing identified 0 destructed nodes and 1 batched mutation operation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Diffing Heuristics */}
      <section id="diffing-heuristics" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Cpu className="w-5 h-5" />
          <h2>4. The 3 Heuristics of React's Diffing Algorithm</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Finding the minimum number of operations to transform one arbitrary tree into another has a complexity of $O(n^3)$ in computer science. For a page with 1,000 nodes, that would require one billion comparisons! React achieves $O(n)$ linear complexity by adopting three pragmatic heuristics:
        </p>

        <div className="space-y-4 my-6">
          <div className="p-4 rounded-xl border border-white/10 bg-[#111116] flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs">
              Heuristic 1
            </span>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Two elements of different types produce different trees</h4>
              <p className="text-xs text-gray-400 leading-relaxed m-0">
                If an element changes from <code>&lt;div&gt;</code> to <code>&lt;span&gt;</code>, or from <code>&lt;Header&gt;</code> to <code>&lt;Footer&gt;</code>, React does not attempt to match children. It destroys the entire subtree and builds the new one from scratch.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-[#111116] flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs">
              Heuristic 2
            </span>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Stable keys maintain child identity across renders</h4>
              <p className="text-xs text-gray-400 leading-relaxed m-0">
                Keys should be unique, predictable, and stable (e.g. database ID). Never use array indices if list order can change, as that causes state crossover bugs in form inputs!
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-[#111116] flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
              Heuristic 3
            </span>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Diffing is strictly single-level (Level-by-Level DFS)</h4>
              <p className="text-xs text-gray-400 leading-relaxed m-0">
                React only compares nodes at the same depth in the tree. It never moves a node across different parent hierarchies during a diff pass.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: SyntheticEvent */}
      <section id="synthetic-events" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. SyntheticEvent System & Event Delegation</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          React does not attach event handlers (like <code>onClick</code>) directly to individual DOM nodes. Instead, React uses <strong>Event Delegation</strong>:
        </p>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-3 text-xs sm:text-sm text-gray-300">
          <p>
            In React 17+, all events are attached to the root DOM container (<code>root.render</code> container). When a user clicks a button inside a 5,000-row table:
          </p>
          <ul className="space-y-2 list-disc list-inside text-gray-400">
            <li>The native browser event bubbles up to the root container.</li>
            <li>React intercepts it and wraps it in a cross-browser <code>SyntheticEvent</code> wrapper.</li>
            <li>React traverses the Fiber tree's <code>return</code> pointers to execute matching <code>onClick</code> props.</li>
            <li>This saves massive memory by eliminating thousands of individual DOM event listener closures!</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
