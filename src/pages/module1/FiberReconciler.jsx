import React from "react";
import GuideLayout from "../../components/GuideLayout";
import FiberTreeVisualizer from "../../components/interactive/FiberTreeVisualizer";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import CodeBlock from "../../components/CodeBlock";
import { Cpu, GitBranch, Layers, Zap, Clock, CheckCircle2, ArrowRight, Server } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "Fiber",
  "Fiber Reconciler",
  "Double Buffering",
  "workInProgress",
  "child pointer",
  "sibling pointer",
  "return pointer",
  "beginWork",
  "completeWork",
  "unit of work",
  "reconciliation"
];

const toc = [
  { label: "1. The Intuition: Video Game Buffering & Call Stacks", hash: "intuition" },
  { label: "2. Stack Reconciler vs Fiber Reconciler", hash: "stack-vs-fiber" },
  { label: "3. Interactive Laboratory: Fiber Tree & Double-Buffering", hash: "interactive-lab" },
  { label: "4. The Fiber Data Structure (Internal Schema)", hash: "fiber-struct" },
  { label: "5. Traversal Algorithm: child, sibling, return", hash: "traversal-algorithm" },
  { label: "6. Render vs Commit: The Atomic Pointer Swap", hash: "render-vs-commit" },
  { label: "7. Production Architecture & Mental Model Summary", hash: "summary" },
  { label: "8. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why did React rewrite its core engine from the React 15 'Stack Reconciler' to the Fiber Reconciler in React 16+?",
    options: [
      "The JavaScript execution stack cannot be paused or cooperatively interrupted once recursion starts, causing dropped frames (jank) during heavy tree diffing.",
      "The Stack Reconciler did not support modern ECMAScript classes or ES modules.",
      "Because Fiber allowed React to execute JavaScript on multiple OS threads simultaneously using Web Workers.",
      "Because the virtual DOM concept was deprecated in favor of direct WebGL rendering."
    ],
    answer: 0,
    why: "In React 15, reconciliation was synchronous and recursive. Once `render()` started walking a large component tree, it monopolized the main thread until completion. If diffing took 80ms, the browser dropped multiple 16.6ms frames, freezing input and animations. Fiber turns the execution stack into a heap-allocated singly linked list of 'virtual stack frames' that can be paused, prioritized, and resumed."
  },
  {
    q: "What is the primary role of the 'Double-Buffering' technique in React's Fiber engine?",
    options: [
      "It computes all updates in an offscreen 'WorkInProgress' tree in memory without touching the real screen, then swaps pointers in a single atomic operation during commit.",
      "It caches network requests in both localStorage and IndexedDB for offline mobile support.",
      "It keeps duplicate copies of React state so components can automatically recover from unhandled errors.",
      "It runs React rendering on two separate GPU buffers for faster canvas painting."
    ],
    answer: 0,
    why: "Borrowed from graphics engines, double-buffering keeps the `current` tree mounted and visible on the DOM while React computes the next state in an offscreen `workInProgress` tree. This prevents incomplete or inconsistent UI states from flashing on screen. Once the WIP tree is fully built, `root.current = workInProgress` swaps the trees instantaneously."
  },
  {
    q: "During Fiber traversal, how does React navigate to the next unit of work when a node has no children (`fiber.child === null`)?",
    options: [
      "It completes the current fiber, then moves to its `sibling`; if no sibling exists, it ascends via `return` to find an ancestor sibling.",
      "It performs a breadth-first search by querying the DOM `parentElement` directly.",
      "It throws an unhandled exception and aborts the render pass.",
      "It re-executes the root component from scratch."
    ],
    answer: 0,
    why: "Fiber uses a depth-first search implemented via three pointers: `child` (down), `sibling` (horizontal right), and `return` (up). When `fiber.child` is null, React calls `completeWork(fiber)`. If `fiber.sibling` exists, it proceeds to that sibling. Otherwise, it ascends through `fiber.return` until it finds an unprocessed sibling or reaches the root."
  },
  {
    q: "Why MUST the Render Phase remain pure and free of visible side effects?",
    options: [
      "Because the Render Phase is interruptible and can be paused, restarted, or discarded by the scheduler when higher-priority work arrives.",
      "Because the browser does not allow asynchronous code to write to console.log.",
      "Because the Commit Phase is responsible for evaluating JSX elements.",
      "Because Tailwind CSS classes cannot be resolved until the Commit Phase."
    ],
    answer: 0,
    why: "In Concurrent React, a render pass can be preempted or thrown away (for instance, if an urgent user keystroke arrives while an offscreen list is rendering). If your render function causes side effects (like mutating globals or inserting DOM nodes), aborted renders would leave corrupted or duplicated state in the application."
  }
];

export default function FiberReconciler() {
  return (
    <GuideLayout
      title="The Fiber Reconciler & Double-Buffering Visualized"
      intro="React's internal engine is not a recursive DOM tree diff. It is a cooperatively scheduled, heap-allocated virtual stack machine utilizing graphics-card double buffering to achieve stutter-free, interruptible rendering."
      badge="Flagship Internal Architecture"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Cpu className="w-5 h-5" />
          <h2>1. The Intuition: Video Game Buffering & Call Stacks</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          To truly understand React Fiber, forget about HTML tags for a moment. Picture two classic engineering problems:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl">
            <div className="flex items-center gap-2.5 text-cyan-300 font-bold text-sm mb-2.5">
              <Layers className="w-4 h-4" />
              <span>Analogy 1: The Screen Tearing Problem</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              In 1990s video games, if the graphics card drew pixels directly into the display monitor's memory while the electron gun scanned the screen, you saw ugly horizontal lines known as <strong className="text-white">screen tearing</strong>. The solution? <strong className="text-cyan-300">Double Buffering</strong>. The game engine draws into an invisible "Back Buffer". When the frame is complete, it instantly swaps pointers with the "Front Buffer" in a single atomic refresh cycle.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl">
            <div className="flex items-center gap-2.5 text-indigo-300 font-bold text-sm mb-2.5">
              <Clock className="w-4 h-4" />
              <span>Analogy 2: The Uninterruptible Executive</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Imagine an executive who reads every email through an infinite recursive folder structure and refuses to answer urgent phone calls until all 10,000 emails are read. That was the <strong className="text-white">React 15 Stack Reconciler</strong>. Fiber turns each email into a discrete index card (a <strong className="text-indigo-300">Fiber Node</strong>) with a "Next" pointer, allowing the executive to pause after every card, answer urgent calls, and pick up right where they left off.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs sm:text-sm text-cyan-200 flex items-start gap-3">
          <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed m-0">
            <strong>Key Mental Model:</strong> A <em>Fiber</em> is a reimplementation of the JavaScript call stack specialized for React components. If a regular function call pushes a stack frame to thread memory that you cannot inspect or pause, a Fiber is a <strong>virtual stack frame</strong> living as a plain JavaScript object in heap memory.
          </p>
        </div>
      </section>

      {/* SECTION 2: Stack Reconciler vs Fiber */}
      <section id="stack-vs-fiber" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <GitBranch className="w-5 h-5" />
          <h2>2. Stack Reconciler (React 15) vs Fiber Reconciler (React 16+)</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Why did the React team spend over two years completely rewriting the reconciliation engine from scratch? Let's compare their architectural paradigms:
        </p>

        <div className="overflow-x-auto custom-scrollbar my-6">
          <table className="w-full text-left text-xs sm:text-sm border-collapse rounded-xl overflow-hidden border border-white/10 bg-[#111116]">
            <thead>
              <tr className="border-b border-white/10 bg-[#16161f] text-gray-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-4">Dimension</th>
                <th className="p-4 text-rose-300">Stack Reconciler (React 15)</th>
                <th className="p-4 text-cyan-300">Fiber Reconciler (React 16+)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-light">
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-white font-mono text-xs">Traversal Mechanism</td>
                <td className="p-4 text-gray-400">Recursive JavaScript function calls (`renderChildren()`)</td>
                <td className="p-4 text-gray-200">Iterative singly linked-list loop (`while (workInProgress !== null)`)</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-white font-mono text-xs">Interruptibility</td>
                <td className="p-4 text-rose-400 font-mono text-xs">Run-to-completion (Uninterruptible)</td>
                <td className="p-4 text-emerald-400 font-mono text-xs">Fully cooperative & interruptible via Scheduler</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-white font-mono text-xs">Memory Structure</td>
                <td className="p-4 text-gray-400">OS Call Stack frames (evaporate on return)</td>
                <td className="p-4 text-gray-200">Heap objects with `child`, `sibling`, `return` pointers</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-white font-mono text-xs">Frame Budget (16.6ms)</td>
                <td className="p-4 text-rose-400">Frequent frame drops during large tree updates</td>
                <td className="p-4 text-emerald-400">Yields to browser event loop before 16.6ms deadline</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-white font-mono text-xs">Priority Scheduling</td>
                <td className="p-4 text-gray-400">FIFO queue; all updates have equal priority</td>
                <td className="p-4 text-cyan-300">Discrete Priority Lanes (Discrete, Continuous, Default, Idle)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: Interactive Laboratory */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Zap className="w-5 h-5" />
          <h2>3. Interactive Laboratory: Fiber Tree & Double-Buffering Simulator</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Click <strong className="text-cyan-300">Trigger setState()</strong> below to watch how React Fiber processes a state update. Observe how the offscreen <strong className="text-cyan-400">WorkInProgress</strong> tree is constructed step-by-step using <code>beginWork</code> and <code>completeWork</code>, leaving the <strong className="text-blue-400">Current</strong> tree untouched until the synchronous <strong>Commit Phase</strong> swaps pointers:
        </p>

        {/* Flagship Interactive Visualizer Component */}
        <FiberTreeVisualizer />
      </section>

      {/* SECTION 4: Internal Schema */}
      <section id="fiber-struct" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Server className="w-5 h-5" />
          <h2>4. The Fiber Data Structure (Internal Schema)</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Every component in your React application is represented by a <code>FiberNode</code> instance. Here is the actual TypeScript definition stripped of debugging fields:
        </p>

        <CodeBlock
          filename="ReactInternalFiber.ts"
          language="typescript"
          code={`export type WorkTag =
  | 0 // FunctionComponent
  | 1 // ClassComponent
  | 3 // HostRoot (root div container)
  | 5 // HostComponent (HTML tags: div, span, button)
  | 6 // HostText
  | 11 // ForwardRef
  | 13; // SuspenseComponent

export interface Fiber {
  // 1. Tag & Identity
  tag: WorkTag;
  key: null | string;
  elementType: any;
  type: any;
  stateNode: any; // Actual DOM node or Class instance

  // 2. Topology Pointers (The Singly Linked List)
  return: Fiber | null;  // Parent Fiber (virtual return address)
  child: Fiber | null;   // First child Fiber
  sibling: Fiber | null; // Next sibling Fiber
  index: number;

  // 3. State & Props Memory
  pendingProps: any;     // Incoming props to be reconciled
  memoizedProps: any;    // Props used to create the current output
  memoizedState: any;    // Head of the hook linked list (useState / useReducer)
  updateQueue: any;      // Circular list of pending setState dispatches

  // 4. Double Buffering Pointer
  alternate: Fiber | null; // Points to counterpart in other buffer (Current <-> WIP)

  // 5. Effects & Scheduling Flags
  flags: Flags;          // Mutation bitmask (Placement, Update, Deletion)
  subtreeFlags: Flags;   // Bitmask of whether children contain mutations
  lanes: Lanes;          // Priority lane bitmask (Urgent vs Transition)
}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-xl border border-white/10 bg-[#111116]">
            <span className="font-mono text-cyan-400 text-xs font-bold block mb-1">Topology Pointers</span>
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              <code>child</code>, <code>sibling</code>, and <code>return</code> replace traditional array children, enabling React to traverse the tree in any direction without maintaining a recursive call stack.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-[#111116]">
            <span className="font-mono text-emerald-400 text-xs font-bold block mb-1">alternate</span>
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              The secret to double-buffering. <code>current.alternate === workInProgress</code>. React reuses existing Fiber allocations between renders instead of thrashing the garbage collector.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-[#111116]">
            <span className="font-mono text-amber-400 text-xs font-bold block mb-1">flags (Side-Effects)</span>
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              32-bit integer bitmasks like <code>Placement (2)</code> and <code>Update (4)</code> that record exact DOM surgeries needed during the commit phase.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Traversal Algorithm */}
      <section id="traversal-algorithm" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <ArrowRight className="w-5 h-5" />
          <h2>5. Traversal Algorithm: beginWork & completeWork</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          React executes a Depth-First Search (DFS) inside a non-blocking <code>workLoopConcurrent</code> loop. It processes each Fiber through two distinct functions:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          <div className="p-5 rounded-2xl border border-cyan-500/30 bg-[#111116] shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
                1. beginWork(current, wip, renderLanes)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                Top-Down (Descent)
              </span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed list-disc list-inside">
              <li>Invoked when descending into a Fiber node.</li>
              <li>Checks if props or state changed (or if context updated).</li>
              <li>If unchanged and no pending updates, triggers a <strong className="text-cyan-300">Bailout</strong> (`bailoutOnAlreadyFinishedWork`).</li>
              <li>If changed, calls component function <code>Component(props)</code> to obtain fresh JSX children.</li>
              <li>Diffs children against previous fibers via <code>reconcileChildFibers()</code>.</li>
              <li><strong>Returns:</strong> The first child Fiber (`wip.child`), or <code>null</code> if it's a leaf node.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-[#111116] shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-emerald-300 uppercase tracking-wider">
                2. completeWork(current, wip, renderLanes)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                Bottom-Up (Ascent)
              </span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed list-disc list-inside">
              <li>Invoked when a node has no more children to explore.</li>
              <li>For DOM host nodes (<code>div</code>, <code>span</code>), creates real browser DOM element (`stateNode`) or computes property diffs.</li>
              <li>Bubbles up <code>subtreeFlags</code> to parent so React knows in O(1) if descendants have side-effects.</li>
              <li>If <code>wip.sibling</code> exists, jumps horizontally to the sibling and restarts <code>beginWork</code>.</li>
              <li>If no sibling exists, ascends to <code>wip.return</code> and continues <code>completeWork</code> on the parent.</li>
            </ul>
          </div>
        </div>

        <CodeBlock
          filename="ReactFiberWorkLoop.ts"
          language="typescript"
          code={`function workLoopConcurrent() {
  // Perform work until deadline or until no units of work remain
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork: Fiber): void {
  const current = unitOfWork.alternate;

  // 1. Descent: beginWork
  let next = beginWork(current, unitOfWork, renderLanes);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    // 2. Leaf reached: completeWork and ascend/sibling jump
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}`}
        />
      </section>

      {/* SECTION 6: Render vs Commit */}
      <section id="render-vs-commit" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>6. Render vs Commit: The Atomic Pointer Swap</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          React strictly separates execution into two phases. Understanding this boundary is the secret to demystifying React 19 concurrent features and useEffect timing:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116]">
            <div className="text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider mb-2">
              Phase 1: Render / Reconciliation Phase
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>• <strong>Timing:</strong> Asynchronous, cooperative, interruptible.</p>
              <p>• <strong>Operations:</strong> Evaluates component functions, runs useState reducers, diffs children, constructs WorkInProgress tree in heap.</p>
              <p>• <strong>DOM Mutations:</strong> ZERO. Does not touch the real browser DOM.</p>
              <p>• <strong>Discardable:</strong> If a higher-priority task arrives, React abandons the WIP tree and starts over.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116]">
            <div className="text-amber-400 font-mono text-xs uppercase font-bold tracking-wider mb-2">
              Phase 2: Commit Phase
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>• <strong>Timing:</strong> Synchronous, non-interruptible.</p>
              <p>• <strong>Mutation Subphase:</strong> Inserts, updates, and deletes real DOM nodes based on collected <code>flags</code>.</p>
              <p>• <strong>Pointer Swap:</strong> <code>root.current = workInProgress</code> instantly updates screen pointer.</p>
              <p>• <strong>Layout & Passive Effects:</strong> Runs <code>useLayoutEffect</code> synchronously, then schedules <code>useEffect</code> after browser paint.</p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-xs sm:text-sm text-emerald-200">
          <div className="font-bold flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>The Power of the Atomic Pointer Swap</span>
          </div>
          <p className="leading-relaxed m-0 text-gray-300">
            Because DOM mutations occur in a single synchronous commit batch, the browser layout engine never performs partial reflows. Furthermore, the previous <code>current</code> tree is retained as the new <code>workInProgress</code> buffer for the next state update, reducing memory churn to near zero.
          </p>
        </div>
      </section>

      {/* SECTION 7: Summary */}
      <section id="summary" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>7. Production Architecture & Mental Model Summary</h2>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] space-y-4 text-xs sm:text-sm text-gray-300">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </span>
            <p className="m-0 leading-relaxed">
              <strong className="text-white">Fibers are Virtual Stack Frames:</strong> They replace the native C++ call stack with heap objects that JavaScript can pause, inspect, prioritize, and resume.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </span>
            <p className="m-0 leading-relaxed">
              <strong className="text-white">Three Pointers Form the Web:</strong> <code>child</code> leads to firstborn; <code>sibling</code> leads to horizontal brother/sister; <code>return</code> points back to parent.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </span>
            <p className="m-0 leading-relaxed">
              <strong className="text-white">Double-Buffering Eliminates Screen Tearing:</strong> The visible screen reads from <code>current</code>; state mutations build the <code>workInProgress</code> tree offscreen.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              4
            </span>
            <p className="m-0 leading-relaxed">
              <strong className="text-white">Render Phase is Pure, Commit Phase Mutates:</strong> Never trigger side effects in render functions because concurrent renders can be interrupted or discarded at any moment.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
