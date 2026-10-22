import React from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { RefreshCw, Layers, AlertTriangle, CheckCircle2, Cpu } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "Why Components Re-render",
  "Re-render Triggers",
  "Parent re-render",
  "Context updates",
  "Prop mutation",
  "Component lifecycle"
];

const toc = [
  { label: "1. The Intuition: The 3 Core Triggers", hash: "intuition" },
  { label: "2. The Parent Re-render Cascade Myth", hash: "parent-cascade" },
  { label: "3. Context Invalidation: The Silent Performance Killer", hash: "context-invalidation" },
  { label: "4. The Difference Between Rendering and Painting", hash: "render-vs-paint" },
  { label: "5. Production Checklist: Profiling Re-renders", hash: "profiling" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why does a child component re-render when its parent component re-renders, even if the child's props have not changed at all?",
    options: [
      "By default, React recursively reconciles the entire subtree beneath any component that scheduled a state update, unless the child is wrapped in React.memo or uses children composition.",
      "Because props are cloned into a new memory space on every frame.",
      "Because JavaScript cannot compare prop values.",
      "Because the browser DOM forces child nodes to redraw."
    ],
    answer: 0,
    why: "React does not inspect whether a child's props changed before re-rendering by default! When a component re-renders, React assumes its entire return JSX tree might need re-evaluation. Re-rendering just means calling the component function — it does NOT necessarily mean mutating the real DOM."
  },
  {
    q: "What is the crucial distinction between a component 're-rendering' and the browser 're-painting'?",
    options: [
      "Re-rendering is React calling your component function in JS memory; re-painting is the browser rasterizing pixel changes to screen only if the DOM was actually modified.",
      "They are identical terms for the same browser operation.",
      "Re-rendering happens on the server; re-painting happens on the client.",
      "Re-painting happens before re-rendering."
    ],
    answer: 0,
    why: "A component can re-render 100 times without the browser painting a single new pixel if the returned JSX produces the exact same virtual DOM output! Re-renders are fast in V8; real DOM reflows and repaints are the true performance bottlenecks."
  }
];

export default function WhyComponentsRerender() {
  return (
    <GuideLayout
      title="Why Components Re-render Visualized"
      intro="Separate myth from reality: discover the three fundamental triggers of React re-renders and understand why calling a component function is completely different from browser painting."
      badge="Core Profiling"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <RefreshCw className="w-5 h-5" />
          <h2>1. The Intuition: The 3 Core Triggers</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          There are only three reasons a React component ever re-renders:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl">
            <span className="text-cyan-400 font-mono text-xs font-bold block mb-2">1. State Change</span>
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              The component itself dispatched a <code>setState()</code> or <code>useReducer()</code> action.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl">
            <span className="text-indigo-400 font-mono text-xs font-bold block mb-2">2. Parent Re-render</span>
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              Its parent component re-rendered. By default, React traverses and calls every child function.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl">
            <span className="text-purple-400 font-mono text-xs font-bold block mb-2">3. Context Change</span>
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              A Context Provider value above the component updated its reference via <code>useContext()</code>.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Parent Cascade */}
      <section id="parent-cascade" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>2. The Parent Re-render Cascade Myth</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Many developers believe child components only re-render if their props change. <strong>This is false.</strong>
        </p>

        <CodeBlock
          filename="cascade-example.tsx"
          language="typescript"
          code={`function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      {/* ⚠️ Even though Child has NO PROPS, it re-renders every time Parent re-renders! */}
      <Child />
    </div>
  );
}

function Child() {
  console.log("Child re-rendered!");
  return <div>Static Content</div>;
}`}
        />
      </section>

      {/* SECTION 3: Context Invalidation */}
      <section id="context-invalidation" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
          <AlertTriangle className="w-5 h-5" />
          <h2>3. Context Invalidation: The Silent Performance Killer</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          When a context value changes, <strong>all consumers</strong> of that context re-render, even if they only read an unrelated property inside the context object!
        </p>

        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-xs sm:text-sm text-amber-200 my-4">
          Never pass a single giant object into a single Context Provider. Split contexts into discrete domains (e.g. <code>UserContext</code> vs <code>ThemeContext</code>).
        </div>
      </section>

      {/* SECTION 4: Render vs Paint */}
      <section id="render-vs-paint" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Cpu className="w-5 h-5" />
          <h2>4. The Difference Between Rendering and Painting</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116]">
            <span className="text-cyan-400 font-bold text-sm block mb-1">Rendering (Fast V8 Execution)</span>
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              React executing your component function, computing return JSX, and diffing virtual DOM in memory. Takes microseconds.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116]">
            <span className="text-emerald-400 font-bold text-sm block mb-1">Painting (Heavy C++ Engine)</span>
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              The browser recalculating CSS layout geometry, generating draw commands, and sending GPU vertex buffers.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Profiling */}
      <section id="profiling" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Checklist: Profiling Re-renders</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300">
          <p>When investigating lag in React DevTools Profiler:</p>
          <ul className="space-y-1.5 list-disc list-inside text-gray-400">
            <li>Enable "Highlight updates when components render" in DevTools settings.</li>
            <li>Look for long flamegraph bars (&gt;16ms frame budget).</li>
            <li>Check "Why did this render?" in DevTools to see which prop or hook changed.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
