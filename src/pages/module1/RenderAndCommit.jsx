import React from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { GitCommit, Layers, Clock, Eye, CheckCircle2 } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "Render and Commit",
  "Render Phase",
  "Commit Phase",
  "useLayoutEffect",
  "useEffect",
  "Browser Paint",
  "Mutation Phase",
  "Passive Effects"
];

const toc = [
  { label: "1. The Intuition: The Architect vs The Construction Crew", hash: "intuition" },
  { label: "2. The Complete Pipeline Timeline", hash: "pipeline-timeline" },
  { label: "3. Commit Sub-phases: Before Mutation, Mutation, Layout", hash: "commit-subphases" },
  { label: "4. useLayoutEffect vs useEffect Relative to Paint", hash: "effects-timing" },
  { label: "5. Production Guidelines for Effect Timing", hash: "production-guidelines" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "At what exact point in the pipeline does useLayoutEffect execute compared to useEffect?",
    options: [
      "useLayoutEffect runs synchronously immediately after DOM mutations but before the browser paints pixels; useEffect runs asynchronously after the browser paints.",
      "useLayoutEffect runs on the server; useEffect runs on the client browser.",
      "useLayoutEffect runs before the component function is called; useEffect runs after.",
      "Both execute at the exact same microtask tick."
    ],
    answer: 0,
    why: "useLayoutEffect is synchronous and fires immediately after React mutates the DOM, but BEFORE the browser has had a chance to paint the screen. This allows you to measure DOM dimensions (e.g. tooltip bounding box) and synchronously adjust styles without the user seeing a visual flicker. useEffect is deferred until after paint so it doesn't block screen responsiveness."
  },
  {
    q: "Why should heavy calculations or data fetches NOT be placed inside useLayoutEffect?",
    options: [
      "Because useLayoutEffect runs synchronously on the main thread before paint, meaning any slow code directly delays the browser from rendering the frame, freezing the UI.",
      "Because useLayoutEffect cannot access window or document objects.",
      "Because useLayoutEffect cancels any active useState updates.",
      "Because React throws an error if an async function is passed to useLayoutEffect."
    ],
    answer: 0,
    why: "Because it blocks browser painting. If your useLayoutEffect takes 50ms to run, the user sees a completely frozen screen for 50ms. Always default to useEffect unless you specifically need to read layout and mutate the DOM before paint to prevent visual flickering."
  }
];

export default function RenderAndCommit() {
  return (
    <GuideLayout
      title="The Render & Commit Pipeline Visualized"
      intro="Trace the lifecycle of a React update: from scheduling priority lanes to DOM mutation, layout effect measurements, browser paint, and passive effect execution."
      badge="Execution Pipeline"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>1. The Intuition: The Architect vs The Construction Crew</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          To visualize the separation between Render and Commit, imagine building a skyscraper:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              The Render Phase (The Architect)
            </span>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              The architect sits at their desk drafting blueprints. They can erase, redraw, throw drafts in the trash, or pause to answer a phone call without breaking any physical glass. <em>Zero bricks are placed on site.</em>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-2">
              The Commit Phase (The Construction Crew)
            </span>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Once the blueprint is finalized, the construction crew arrives on site. They tear down old walls, pour concrete, and install physical drywall. <em>This cannot be paused halfway without leaving an unfinished wall on the street.</em>
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Pipeline Timeline */}
      <section id="pipeline-timeline" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Clock className="w-5 h-5" />
          <h2>2. The Complete Pipeline Timeline</h2>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] space-y-6 shadow-xl my-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div>
              <span className="font-bold text-white text-sm">Trigger & Schedule</span>
              <p className="text-xs text-gray-400 m-0"><code>setState()</code> dispatches an update into the Fiber queue. Scheduler assigns a lane.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div>
              <span className="font-bold text-white text-sm">Render Phase (beginWork / completeWork)</span>
              <p className="text-xs text-gray-400 m-0">Constructs WorkInProgress tree offscreen in memory. Interruptible.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div>
              <span className="font-bold text-white text-sm">Commit Phase: Mutation</span>
              <p className="text-xs text-gray-400 m-0">Synchronously modifies real DOM nodes. <code>root.current = workInProgress</code> pointer swap.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              4
            </div>
            <div>
              <span className="font-bold text-white text-sm">Commit Phase: Layout Effects</span>
              <p className="text-xs text-gray-400 m-0">Runs <code>useLayoutEffect</code> synchronously. Browser has NOT painted yet!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              5
            </div>
            <div>
              <span className="font-bold text-white text-sm">Browser Paint</span>
              <p className="text-xs text-gray-400 m-0">Browser composites and renders pixels to the user's screen.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              6
            </div>
            <div>
              <span className="font-bold text-white text-sm">Passive Effects (useEffect)</span>
              <p className="text-xs text-gray-400 m-0">Asynchronously runs <code>useEffect</code> cleanups and effects without blocking paint.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Commit Subphases */}
      <section id="commit-subphases" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <GitCommit className="w-5 h-5" />
          <h2>3. Commit Sub-phases: Before Mutation, Mutation, Layout</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          React's <code>commitRoot()</code> function processes the Fiber tree through three consecutive synchronous passes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-xl border border-white/10 bg-[#111116]">
            <span className="font-mono text-xs font-bold text-cyan-400 uppercase block mb-1">
              Pass 1: Before Mutation
            </span>
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              Calls <code>getSnapshotBeforeUpdate</code> in class components and schedules passive effects. Reads DOM before changes.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-[#111116]">
            <span className="font-mono text-xs font-bold text-amber-400 uppercase block mb-1">
              Pass 2: Mutation
            </span>
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              Executes <code>commitPlacement()</code>, <code>commitUpdate()</code>, and <code>commitDeletion()</code>. DOM is physically modified.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-[#111116]">
            <span className="font-mono text-xs font-bold text-purple-400 uppercase block mb-1">
              Pass 3: Layout
            </span>
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              Fires <code>useLayoutEffect</code> callbacks and attaches <code>ref</code> objects to the newly created DOM elements.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: useLayoutEffect vs useEffect */}
      <section id="effects-timing" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Eye className="w-5 h-5" />
          <h2>4. useLayoutEffect vs useEffect Relative to Paint</h2>
        </div>

        <CodeBlock
          filename="layout-effect-timing.tsx"
          language="typescript"
          code={`import { useState, useLayoutEffect, useEffect, useRef } from "react";

export function Tooltip({ targetRect }: { targetRect: DOMRect }) {
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // ✅ useLayoutEffect: Runs BEFORE the browser paints!
  // If you used useEffect here, the user would see the tooltip flash at y=0
  // for 1 frame before jumping to its calculated position.
  useLayoutEffect(() => {
    if (ref.current) {
      setTooltipHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  // ✅ useEffect: Runs AFTER paint!
  // Perfect for data fetching, event listeners, or logging.
  useEffect(() => {
    trackTooltipImpression();
  }, []);

  return (
    <div ref={ref} style={{ transform: \`translateY(-\${tooltipHeight}px)\` }}>
      Helpful tooltip
    </div>
  );
}`}
        />
      </section>

      {/* SECTION 5: Production Guidelines */}
      <section id="production-guidelines" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Guidelines for Effect Timing</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-3 text-xs sm:text-sm text-gray-300">
          <div className="flex items-center gap-2 font-bold text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>The 99% Rule:</span>
          </div>
          <p className="m-0 leading-relaxed text-gray-400">
            Always use <code>useEffect</code> by default. Only reach for <code>useLayoutEffect</code> if and only if measuring a DOM property (e.g. scroll position, width, height) and updating state before paint is required to avoid visual flickering.
          </p>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
