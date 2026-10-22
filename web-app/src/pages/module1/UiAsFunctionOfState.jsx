import React, { useState } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { FunctionSquare, CheckCircle2, Split, Code, Layers } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "UI as a function of state",
  "UI = f(state)",
  "Declarative vs Imperative",
  "DOM surgery",
  "State synchronization",
  "Pure function",
  "Idempotent"
];

const toc = [
  { label: "1. The Intuition: Projection vs Manual Surgery", hash: "intuition" },
  { label: "2. The Mathematical Formulation: UI = f(state)", hash: "math-formulation" },
  { label: "3. Interactive Lab: Imperative jQuery vs Declarative React", hash: "interactive-lab" },
  { label: "4. The Pitfalls of Manual DOM Mutation", hash: "pitfalls" },
  { label: "5. Idempotence & State Projections in Production", hash: "production" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "What does the equation UI = f(state) guarantee when f is a pure projection?",
    options: [
      "Given the exact same state, the application will always produce the exact same DOM representation, regardless of previous history or user click sequences.",
      "The user interface will automatically compile directly to WebAssembly bytecode.",
      "State variables cannot be changed after the initial render.",
      "The browser will bypass HTML parsing entirely."
    ],
    answer: 0,
    why: "In pure functional projection, UI is an idempotent snapshot of state. Imperative DOM manipulation depends on historical transition sequences (e.g. 'if modal open and user clicked back, hide class X'), which causes state desynchronization bugs. Declarative projection ensures you only specify what the UI should look like for a given state."
  },
  {
    q: "Why is imperative DOM manipulation notoriously prone to subtle UI synchronization bugs in complex applications?",
    options: [
      "Because every state transition requires manual synchronization across N possible UI states, resulting in combinatorial explosion (2^N edge cases).",
      "Because JavaScript cannot modify DOM properties directly.",
      "Because modern browsers have disabled innerHTML for security reasons.",
      "Because CSS transitions block imperative JavaScript execution."
    ],
    answer: 0,
    why: "With imperative code, whenever state changes, the developer must remember every DOM element affected and manually add/remove classes or attributes. When multiple asynchronous events overlap (network responses, user taps, timeouts), steps get missed, leaving 'zombie' loading spinners or mismatched buttons."
  }
];

export default function UiAsFunctionOfState() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <GuideLayout
      title="UI = f(state) & Declarative vs Imperative DOM"
      intro="Why React shifts frontend engineering away from manual DOM surgery toward pure, predictable mathematical state projections."
      badge="Core Mental Model"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <FunctionSquare className="w-5 h-5" />
          <h2>1. The Intuition: Projection vs Manual Surgery</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Before React, web engineering was dominated by <em>imperative DOM surgery</em>. When data changed, you wrote explicit step-by-step instructions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-rose-500/20 bg-[#161214] shadow-xl">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-2">
              Imperative (jQuery / Vanilla JS)
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              "Find the button with ID `#submit-btn`. Remove the class `loading`. If error exists, find `#err-box`, set its text, and add class `visible`. If cart count is zero, hide `#badge`."
            </p>
            <div className="mt-3 text-[11px] font-mono text-rose-300 bg-rose-950/40 p-2 rounded">
              Danger: Every step depends on previous DOM state being intact.
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-cyan-500/20 bg-[#11161d] shadow-xl">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              Declarative (React)
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              "Here is my data structure: <code>{`{ isLoading: false, count: 4 }`}</code>. Given this state, here is the exact JSX snapshot of what the screen should be. React, you figure out the DOM diff."
            </p>
            <div className="mt-3 text-[11px] font-mono text-cyan-300 bg-cyan-950/40 p-2 rounded">
              Superpower: Idempotent. State dictates the screen directly.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Mathematical Formulation */}
      <section id="math-formulation" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Split className="w-5 h-5" />
          <h2>2. The Mathematical Formulation: UI = f(state)</h2>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] text-center my-6 shadow-xl">
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-cyan-300 mb-2">
            UI = f(state)
          </div>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
            The User Interface is simply a pure projection of application state through a composition of component functions.
          </p>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In mathematics, a function $f(x)$ is called <strong>idempotent</strong> if applying it multiple times yields the exact same result: $f(f(x)) = f(x)$. When React components are pure functions of their props and state, debugging becomes trivial: if the screen is wrong, you simply inspect the state object at that frame.
        </p>
      </section>

      {/* SECTION 3: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>3. Interactive Lab: Imperative vs Declarative Mental Model</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111116] p-5 sm:p-6 shadow-xl my-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Live State Projection Sandbox
            </span>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-gray-400">Current State:</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                count: {count}, loading: {isLoading ? "true" : "false"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Controls */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setCount((c) => c + 1)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-cyan-600/20"
                >
                  Increment Count
                </button>
                <button
                  onClick={() => setCount(0)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsLoading(!isLoading)}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs cursor-pointer"
                >
                  Toggle Loading
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Changing state recalculates the JSX projection function instantaneously.
              </p>
            </div>

            {/* Projected UI Output */}
            <div className="p-4 rounded-xl border border-white/10 bg-[#09090d] text-center">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-2">
                Rendered DOM Output
              </span>
              <div className="text-xl font-mono font-bold text-white mb-2">
                {isLoading ? (
                  <span className="text-amber-400 animate-pulse">Syncing with server...</span>
                ) : (
                  <span>Current Counter: {count}</span>
                )}
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400">
                &lt;div class="{isLoading ? 'loading' : 'ready'}"&gt;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Pitfalls */}
      <section id="pitfalls" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Code className="w-5 h-5" />
          <h2>4. The Pitfalls of Manual DOM Mutation</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Consider an e-commerce checkout button that can be <em>disabled</em>, <em>loading</em>, <em>error</em>, or <em>success</em>:
        </p>

        <CodeBlock
          filename="imperative-vs-declarative.ts"
          language="typescript"
          code={`// ❌ Imperative: 16 possible edge transitions to track manually
function onNetworkError() {
  submitBtn.classList.remove('spin');
  submitBtn.removeAttribute('disabled');
  errorLabel.innerText = "Payment failed";
  errorLabel.style.display = 'block';
  // BUG: Forgot to re-enable retry timer or clear cart badge!
}

// ✅ Declarative: Single pure projection
function CheckoutButton({ status, error }: { status: 'idle' | 'loading' | 'success', error?: string }) {
  return (
    <div>
      <button disabled={status === 'loading'} className={status}>
        {status === 'loading' ? <Spinner /> : 'Complete Order'}
      </button>
      {error && <span className="text-rose-400">{error}</span>}
    </div>
  );
}`}
        />
      </section>

      {/* SECTION 5: Production */}
      <section id="production" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Idempotence & State Projections in Production</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-3 text-xs sm:text-sm text-gray-300">
          <p>
            When building production React systems, adhering to <code>UI = f(state)</code> requires three strict engineering rules:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>No DOM reading for truth:</strong> Never query <code>document.querySelector()</code> to determine if a modal is open. Store it in React state.</li>
            <li><strong>No mutations during render:</strong> Never modify local variables outside the component or global stores inside the function body.</li>
            <li><strong>Deterministic renders:</strong> Avoid <code>Math.random()</code> or <code>Date.now()</code> directly in the JSX tree without passing them through state or refs.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
