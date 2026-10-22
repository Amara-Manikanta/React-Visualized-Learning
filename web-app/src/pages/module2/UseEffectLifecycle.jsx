import React from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Clock, RefreshCw, AlertTriangle, Layers, CheckCircle2 } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "useEffect",
  "useEffect Lifecycle",
  "Effect Cleanup",
  "StrictMode",
  "Dependency Array",
  "Race Conditions",
  "Browser Paint"
];

const toc = [
  { label: "1. The Intuition: Synchronizing with an External System", hash: "intuition" },
  { label: "2. Execution Order: Mount, Update, Cleanup, Unmount", hash: "execution-order" },
  { label: "3. The Cleanup Paradox: Running Old Cleanup with Old State", hash: "cleanup-paradox" },
  { label: "4. StrictMode Double-Invocation in React 18 & 19", hash: "strict-mode" },
  { label: "5. Production Patterns: Handling Race Conditions", hash: "race-conditions" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "When a component re-renders and triggers an updated useEffect, in what exact order do the effect and its cleanup function execute?",
    options: [
      "The cleanup function from the PREVIOUS render executes first (with the previous render's closure state), and only then does the NEW effect execute.",
      "The new effect executes first, and the cleanup function runs in the background afterward.",
      "Both the cleanup and the new effect run concurrently in parallel Web Workers.",
      "Cleanup functions only execute when the component completely unmounts."
    ],
    answer: 0,
    why: "React always cleans up the previous effect before running the next effect. Crucially, the cleanup function captures the props and state from the render it was created in! For instance, if an effect subscribed to chat room #1, when the user switches to room #2, React runs cleanup(room1) first, and then executes subscribe(room2)."
  },
  {
    q: "Why does React StrictMode intentionally mount, unmount, and remount components in development?",
    options: [
      "To verify that your effect cleanup functions properly tear down connections, preventing memory leaks when React 19 fast-restores hidden/offscreen tabs.",
      "To test whether the browser's JavaScript garbage collector is functioning.",
      "To compile JSX into WebAssembly.",
      "To simulate slow network latency on localhost."
    ],
    answer: 0,
    why: "Concurrent React features (such as Offscreen / Activity, and tab preservation) preserve component state while unmounting DOM trees. In development, StrictMode runs Mount -> Unmount -> Mount to ensure your effects are fully resilient and have symmetrical cleanup logic."
  }
];

export default function UseEffectLifecycle() {
  return (
    <GuideLayout
      title="useEffect Lifecycle & Timing Visualized"
      intro="Demystify effect execution relative to browser paint, understand why cleanup functions run with stale snapshots, and master StrictMode double-mounting."
      badge="Hook Lifecycle"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Clock className="w-5 h-5" />
          <h2>1. The Intuition: Synchronizing with an External System</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Effects are an escape hatch from the React paradigm. You should not use <code>useEffect</code> to transform data for rendering or handle user interaction events. <code>useEffect</code> exists to <strong>synchronize your component with external systems</strong> (browser DOM APIs, WebSocket connections, audio players, or third-party widgets).
        </p>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            The Timing Guarantee
          </span>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed m-0">
            <code>useEffect</code> is strictly deferred until <strong>after the browser has painted</strong> pixels to screen. This ensures your app stays responsive and doesn't block 60fps animations while setting up timers or network subscriptions.
          </p>
        </div>
      </section>

      {/* SECTION 2: Execution Order */}
      <section id="execution-order" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>2. Execution Order: Mount, Update, Cleanup, Unmount</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          When dependencies change across renders, React follows an exact, predictable sequencing pipeline:
        </p>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] space-y-4 my-6 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <span className="text-sm text-gray-200">Component renders JSX with <code>id: 2</code></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <span className="text-sm text-gray-200">React commits real DOM and the browser paints frame <code>id: 2</code></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">3</span>
            <span className="text-sm text-rose-300 font-semibold">PREVIOUS Cleanup runs with <code>id: 1</code> (Tears down old connection)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">4</span>
            <span className="text-sm text-emerald-300 font-semibold">NEW Effect runs with <code>id: 2</code> (Establishes new connection)</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: Cleanup Paradox */}
      <section id="cleanup-paradox" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <RefreshCw className="w-5 h-5" />
          <h2>3. The Cleanup Paradox: Running Old Cleanup with Old State</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Why does the cleanup see the <em>old</em> state rather than the <em>new</em> state? Because JavaScript closures freeze variables at function creation time:
        </p>

        <CodeBlock
          filename="chat-room-effect.tsx"
          language="typescript"
          code={`function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    // 1. SETUP: Subscribes to roomId (e.g. "general")
    const connection = createConnection(roomId);
    connection.connect();

    // 2. CLEANUP: When roomId switches to "random", this function executes!
    // It captures "general" from its closure, disconnecting the OLD room!
    return () => {
      connection.disconnect();
    };
  }, [roomId]);

  return <div>Welcome to {roomId}</div>;
}`}
        />
      </section>

      {/* SECTION 4: StrictMode */}
      <section id="strict-mode" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <AlertTriangle className="w-5 h-5" />
          <h2>4. StrictMode Double-Invocation in React 18 & 19</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In development, if wrapped in <code>&lt;React.StrictMode&gt;</code>, React intentionally mounts, unmounts, and remounts your effect:
        </p>

        <div className="p-4 rounded-xl border border-white/10 bg-[#16161f] font-mono text-xs text-gray-300 space-y-1 my-4">
          <div className="text-cyan-400 font-bold">Development Console Sequence:</div>
          <div>1. Setup effect (Component Mounts)</div>
          <div className="text-rose-400">2. Cleanup effect (Simulated Unmount)</div>
          <div className="text-emerald-400">3. Setup effect (Component Remounts with same state)</div>
        </div>

        <p className="text-xs text-gray-400">
          If your component breaks or duplicates data during step 3, your effect cleanup is broken!
        </p>
      </section>

      {/* SECTION 5: Race Conditions */}
      <section id="race-conditions" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Patterns: Handling Race Conditions</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          When fetching data inside useEffect, fast sequential user clicks can cause network race conditions where an earlier response overwrites a later one:
        </p>

        <CodeBlock
          filename="safe-fetch-effect.ts"
          language="typescript"
          code={`useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    // If user switched to another tab while fetch was in flight, ignore!
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true; // Cleanup invalidates stale in-flight response
  };
}, [userId]);`}
        />
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
