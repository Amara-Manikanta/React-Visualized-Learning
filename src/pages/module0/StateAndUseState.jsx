import React, { useState } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import {
  Zap,
  AlertOctagon,
  Cpu,
  RefreshCw,
  Bell
} from "lucide-react";

export const SEARCH_KEYWORDS = [
  "useState hook",
  "React state",
  "Component memory",
  "Re-render cycle",
  "State vs props",
  "Local state",
  "State setter function",
  "Re-rendering explained",
  "Zero UI knowledge",
  "Array destructuring useState"
];

const toc = [
  { label: "1. Why Normal Variables Fail: The Screen Refresh Paradox", hash: "why-state" },
  { label: "2. What is State? Component Memory That Triggers Paint", hash: "what-is-state" },
  { label: "3. Anatomy of `useState`: Dissecting the Array Pair", hash: "anatomy-of-usestate" },
  { label: "4. Interactive Laboratory: Normal Variable vs React State", hash: "interactive-lab" },
  { label: "5. The Re-render Lifecycle in Plain English", hash: "the-re-render-cycle" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why doesn't updating a normal JavaScript variable (e.g. let count = 0; count = count + 1) cause React to update what is on screen?",
    options: [
      "Because local variables discard their values when the function finishes running, and changing a plain variable does not alert React to re-execute the component and paint new pixels.",
      "Because modern browsers block variables starting with 'let'.",
      "Because JavaScript variables only work inside console.log.",
      "Because React only reads data from backend servers."
    ],
    answer: 0,
    why: "Two reasons: 1) Local variables don't persist between function calls. 2) More importantly, React has no idea you changed a normal variable. React only re-renders when you call a State Setter function (like setCount), which acts as an alarm bell telling React to redraw the screen."
  },
  {
    q: "In the code: const [count, setCount] = useState(0), what is 'setCount'?",
    options: [
      "A setter function provided by React that updates the component's internal memory AND triggers a re-render so the screen reflects the new value.",
      "A built-in math calculator in JavaScript.",
      "A special CSS animation class.",
      "A database query command."
    ],
    answer: 0,
    why: "Calling setCount(5) does two things simultaneously: 1) stores 5 in React's memory cell for this component, and 2) schedules a re-render so React re-executes the component function and paints 5 to the screen."
  },
  {
    q: "When a component re-renders because state changed, what does React actually do?",
    options: [
      "React re-runs the component function from top to bottom, generates a fresh UI blueprint (JSX) with the new state value, diffs it against the old blueprint, and updates only the changed DOM nodes.",
      "React restarts the user's web browser completely.",
      "React downloads all JavaScript files from the server again from scratch.",
      "React clears all localStorage cookies on the device."
    ],
    answer: 0,
    why: "Re-rendering in React does NOT mean refreshing the entire browser tab! React simply calls your component function again, grabs the new JSX returned, compares it with the previous snapshot, and updates only the tiny text node that actually changed."
  }
];

export default function StateAndUseState() {
  // Simulator state: React State
  const [reactCount, setReactCount] = useState(0);
  const [renderCount, setRenderCount] = useState(1);
  const [pulse, setPulse] = useState(false);

  // We simulate what happens with a regular JS variable (doesn't trigger re-render)
  const [fakeJsVar, setFakeJsVar] = useState(0);

  const handleReactIncrement = () => {
    setReactCount((c) => c + 1);
    setRenderCount((r) => r + 1);
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
  };

  return (
    <GuideLayout
      title="0.5 State & useState: Giving Memory to Components"
      intro="Why regular variables cannot update the screen, how useState provides persistent memory, and how calling a setter triggers the miraculous re-render loop."
      badge="Reactivity"
      toc={toc}
    >
      {/* SECTION 1: Why Normal Variables Fail */}
      <section id="why-state" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-rose-400 font-bold text-lg">
          <AlertOctagon className="w-5 h-5" />
          <h2>1. Why Normal Variables Fail: The Screen Refresh Paradox</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Every beginner programmer attempts to make their first React button work using a standard JavaScript variable:
        </p>

        <CodeBlock
          filename="BrokenCounter.jsx"
          language="jsx"
          code={`// ❌ THIS WILL NOT WORK!
function BrokenCounter() {
  let count = 0; // Regular JavaScript variable

  function handleClick() {
    count = count + 1; // It increments in RAM...
    console.log("Count is now:", count); // Console shows: 1, 2, 3!
  }

  // But the screen NEVER changes! It stays stuck at 0 forever.
  return <button onClick={handleClick}>Clicked {count} times</button>;
}`}
        />

        <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-950/20 text-xs sm:text-sm text-rose-200 space-y-2">
          <span className="font-bold text-rose-300 block">Why did this fail? Two critical reasons:</span>
          <ol className="list-decimal list-inside space-y-2 text-gray-300 leading-relaxed">
            <li>
              <strong>Local variables vanish:</strong> Every time a function executes, its local variables are created from scratch. When it finishes, they are erased from the call stack.
            </li>
            <li>
              <strong>React has no alarm bell:</strong> React is not psychic. Changing <code>count = count + 1</code> does not inform React that anything happened. Without an alarm bell, React will never redraw the screen!
            </li>
          </ol>
        </div>
      </section>

      {/* SECTION 2: What is State */}
      <section id="what-is-state" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Zap className="w-5 h-5" />
          <h2>2. What is State? Component Memory That Triggers Paint</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          To make a component interactive, we need two superpowers:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-cyan-500/20 bg-[#0e1418] shadow-xl">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              Superpower 1: Long-Term Memory
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Data must be stored in a persistent memory vault managed by React that survives across function calls, rather than being discarded when the function ends.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-[#0e1612] shadow-xl">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              Superpower 2: The Render Trigger Bell
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Whenever that memory changes, an alarm bell must ring alerting React: <em>"Hey, the data changed! Re-run this component function and paint the new pixels to the screen!"</em>
            </p>
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          This combined superpower is called <strong>State</strong>. In React, we create state using the built-in <code>useState</code> Hook!
        </p>
      </section>

      {/* SECTION 3: Anatomy of useState */}
      <section id="anatomy-of-usestate" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-lg">
          <Cpu className="w-5 h-5" />
          <h2>3. Anatomy of `useState`: Dissecting the Array Pair</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          The syntax for <code>useState</code> looks unusual at first glance, but it is one of the most elegant designs in software engineering:
        </p>

        <CodeBlock
          filename="useStateSyntax.jsx"
          language="jsx"
          code={`import { useState } from "react";

function Counter() {
  // Dissecting the declaration:
  const [count, setCount] = useState(0);
  //       ▲        ▲                 ▲
  //       │        │                 └── 1. Initial Value on mount (0)
  //       │        └──────────────────── 2. Setter Function (triggers re-render)
  //       └───────────────────────────── 3. Current State Variable snapshot
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`}
        />

        <div className="space-y-3 my-6">
          <div className="p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="text-xs font-bold text-cyan-400 font-mono block mb-1">
              1. The Current State Value (`count`)
            </span>
            <p className="text-xs text-gray-400 leading-relaxed">
              On the very first render, it equals the initial value you provided (<code>0</code>). On future renders, React supplies whatever updated value you saved.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="text-xs font-bold text-indigo-400 font-mono block mb-1">
              2. The State Setter Function (`setCount`)
            </span>
            <p className="text-xs text-gray-400 leading-relaxed">
              The function you call whenever you want to update the value. Calling <code>setCount(1)</code> tells React: "Update the memory cell to 1, and re-run this component now!"
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="text-xs font-bold text-emerald-400 font-mono block mb-1">
              3. Array Destructuring (`[a, b] = useState(...)`)
            </span>
            <p className="text-xs text-gray-400 leading-relaxed">
              <code>useState</code> returns an array with exactly two elements: <code>[value, setter]</code>. The square brackets <code>[count, setCount]</code> are just JavaScript syntax to unpack those two items into handy variable names.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
          <Bell className="w-5 h-5" />
          <h2>4. Interactive Laboratory: Normal Variable vs React State</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Click both buttons below. Watch what happens in the memory inspector: on the left, the plain variable changes internally but the screen remains frozen. On the right, React State alerts the engine, pulses a re-render, and updates the screen live!
        </p>

        {/* Simulator Box */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box A: Plain JS Variable */}
            <div className="p-5 rounded-2xl border border-rose-500/20 bg-[#141012] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase">
                    Approach A: Plain JS Variable
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">let count = 0</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Has NO trigger bell. Changes variable in memory, but screen never refreshes.
                </p>
              </div>

              {/* Fake Frozen UI */}
              <div className="p-6 rounded-xl bg-black/50 border border-white/10 text-center space-y-2">
                <span className="text-xs text-gray-400 block font-mono">Rendered UI on Screen:</span>
                <span className="text-4xl font-black text-gray-500 block">0</span>
                <span className="text-[10px] font-mono text-rose-400">
                  (FROZEN: React was never told to re-render!)
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setFakeJsVar((c) => c + 1)}
                  className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all cursor-pointer"
                >
                  Click Me (Mutate Variable: let count++)
                </button>

                <div className="p-2.5 rounded bg-white/5 font-mono text-[11px] text-gray-400 flex justify-between">
                  <span>RAM Memory Value:</span>
                  <span className="text-amber-400 font-bold">{fakeJsVar}</span>
                </div>
              </div>
            </div>

            {/* Box B: React State */}
            <div
              className={`p-5 rounded-2xl border bg-[#0e1614] flex flex-col justify-between space-y-4 transition-all ${
                pulse
                  ? "border-emerald-400 shadow-xl shadow-emerald-500/20 scale-[1.01]"
                  : "border-emerald-500/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    Approach B: React State (useState)
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">const [c, setC]</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Has the trigger bell! Updates React's memory cell AND immediately redraws UI.
                </p>
              </div>

              {/* Live Reactive UI */}
              <div className="p-6 rounded-xl bg-black/50 border border-white/10 text-center space-y-2">
                <span className="text-xs text-gray-400 block font-mono">Rendered UI on Screen:</span>
                <span className="text-4xl font-black text-emerald-400 block animate-pulse">
                  {reactCount}
                </span>
                <span className="text-[10px] font-mono text-emerald-300">
                  ✓ Active: Screen updated instantly!
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleReactIncrement}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  Click Me (Call: setCount(count + 1))
                </button>

                <div className="p-2.5 rounded bg-white/5 font-mono text-[11px] text-gray-400 flex justify-between">
                  <span>Component Renders Executed:</span>
                  <span className="text-cyan-400 font-bold">{renderCount} renders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: The Re-render Lifecycle */}
      <section id="the-re-render-cycle" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg">
          <RefreshCw className="w-5 h-5" />
          <h2>5. The Re-render Lifecycle in Plain English</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          What happens behind the scenes during every split second of a user interaction? Here is the exact 4-step sequence:
        </p>

        <div className="space-y-4 my-6 font-mono text-xs">
          <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <span className="text-white font-bold block mb-1">Trigger (User Event)</span>
              <p className="text-gray-400 font-sans leading-relaxed">
                The user taps a button, types in an input, or receives data from a server API. The event listener calls <code>{"setCount(c => c + 1)"}</code>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <span className="text-white font-bold block mb-1">Render (Calling Component Function)</span>
              <p className="text-gray-400 font-sans leading-relaxed">
                React calls your component function again. This time, <code>useState()</code> returns the brand new count value (e.g., <code>1</code> instead of <code>0</code>). Your function returns a new JSX tree.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <span className="text-white font-bold block mb-1">Reconciliation (Diffing Trees)</span>
              <p className="text-gray-400 font-sans leading-relaxed">
                React compares the new JSX blueprint against the previous one. It notices that only the number inside the <code>&lt;button&gt;</code> changed; everything else is identical.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <div>
              <span className="text-white font-bold block mb-1">Commit (Mutating the DOM)</span>
              <p className="text-gray-400 font-sans leading-relaxed">
                React surgically updates only that single text node in the browser DOM. The browser paints the pixels, and the user sees the new number!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <section id="knowledge-check" className="scroll-mt-24">
        <KnowledgeCheck questions={quizQuestions} />
      </section>
    </GuideLayout>
  );
}
