import React, { useState, useOptimistic, useTransition } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Send, RefreshCw, CheckCircle2, Clock, Layers } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "useOptimistic",
  "Optimistic UI",
  "React 19",
  "Auto rollback",
  "Network latency",
  "Chat UI",
  "Social like"
];

const toc = [
  { label: "1. The Intuition: Zero-Latency Psychology", hash: "intuition" },
  { label: "2. The useOptimistic Lifecycle & Auto-Rollback", hash: "lifecycle" },
  { label: "3. Interactive Lab: Live Optimistic Message Simulator", hash: "interactive-lab" },
  { label: "4. Under the Hood: Transient State Forking", hash: "under-the-hood" },
  { label: "5. Production Patterns for Robust Optimism", hash: "production-patterns" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "How does React 19's `useOptimistic` hook handle server errors or network drops?",
    options: [
      "Because the optimistic state is tied directly to the lifecycle of the async Action transition, if the Action rejects or throws, React automatically discards the optimistic branch and reverts back to the real state with zero manual rollback code.",
      "The developer must write a manual rollback try/catch block for every state property.",
      "It shows a native browser alert and crashes the page.",
      "It reloads the entire browser window."
    ],
    answer: 0,
    why: "This is the revolutionary beauty of useOptimistic. In previous versions, developers had to manually save old state in a variable and write custom rollback logic inside catch blocks. In React 19, the optimistic state is a transient overlay attached to the transition. Once the transition finishes (or fails), React automatically drops the optimistic overlay!"
  },
  {
    q: "Why MUST updates with `setOptimistic` be triggered inside a Transition or Form Action?",
    options: [
      "Because optimistic states are scoped to the duration of an asynchronous transition; React needs the transition boundary to know when to settle or rollback the optimistic value.",
      "Because browser security forbids optimistic updates without transitions.",
      "Because useOptimistic only works on HTTPS connections.",
      "Because useOptimistic requires WebSockets."
    ],
    answer: 0,
    why: "An optimistic update by definition represents temporary state while an async operation is in-flight. React ties useOptimistic to the active transition so it knows exactly when the real server state has arrived or when an error has occurred."
  }
];

export default function OptimisticUi() {
  const [messages, setMessages] = useState([
    { id: "1", text: "Welcome to React Visualized!", sending: false }
  ]);
  const [isPending, startTransition] = useTransition();

  // React 19 useOptimistic hook
  const [optimisticMessages, setOptimisticMessages] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      { id: Date.now().toString(), text: newMessage, sending: true }
    ]
  );

  const [inputVal, setInputVal] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const messageToSend = inputVal;
    setInputVal("");

    startTransition(async () => {
      // 1. Optimistic update (appears instantly on screen!)
      setOptimisticMessages(messageToSend);

      // 2. Simulate network delay (1.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 3. Commit permanent state after server ACK
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: messageToSend, sending: false }
      ]);
    });
  };

  return (
    <GuideLayout
      title="Optimistic UI Updates Visualized"
      intro="Explore React 19's native useOptimistic hook: how transient state forking provides instantaneous user feedback and guarantees zero-boilerplate auto-rollback on failure."
      badge="React 19 Concurrency"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Clock className="w-5 h-5" />
          <h2>1. The Intuition: Zero-Latency Psychology</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          When you tap "Like" or send a chat message on WhatsApp or iMessage, the app does not show a spinning wheel for 600ms while waiting for the server. The UI <strong>optimistically updates immediately</strong>. If the network drops 5 seconds later, the app shows an exclamation mark or rolls back.
        </p>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            The Latency Gap
          </span>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed m-0">
            Human perception registers lag at 100ms. Server roundtrips over cellular networks often take 300ms–1500ms. <code>useOptimistic</code> bridges this physical gap by decoupling UI responsiveness from network physics.
          </p>
        </div>
      </section>

      {/* SECTION 2: Lifecycle */}
      <section id="lifecycle" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <RefreshCw className="w-5 h-5" />
          <h2>2. The useOptimistic Lifecycle & Auto-Rollback</h2>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] space-y-4 shadow-xl my-6">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <span className="text-sm text-gray-200">User taps Send: <code>setOptimistic(message)</code> displays message with <code>sending: true</code> (0ms).</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <span className="text-sm text-gray-200">Async network call is in flight across cellular waves (~800ms).</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">3A</span>
            <span className="text-sm text-emerald-300 font-semibold">Success: Real server state is set. Optimistic overlay seamlessly replaced with confirmed record.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">3B</span>
            <span className="text-sm text-rose-300 font-semibold">Error / Rejection: Transition ends in failure. React auto-rolls back to previous state instantly!</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Send className="w-5 h-5" />
          <h2>3. Interactive Lab: Live Optimistic Message Simulator</h2>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Chat Stream (Simulates 1,500ms Network Latency)
            </span>
            {isPending && (
              <span className="text-xs font-mono text-amber-400 animate-pulse flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> In-Flight Network Request...
              </span>
            )}
          </div>

          {/* Message List */}
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto custom-scrollbar p-2 bg-[#09090d] rounded-xl border border-white/5">
            {optimisticMessages.map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                  m.sending
                    ? "bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 opacity-80"
                    : "bg-[#16161f] border border-white/10 text-white"
                }`}
              >
                <span>{m.text}</span>
                <span className="text-[10px] font-mono">
                  {m.sending ? (
                    <span className="text-cyan-400 font-bold">Optimistic Sending...</span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Confirmed
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type message & hit Send..."
              className="flex-1 bg-[#09090d] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </section>

      {/* SECTION 4: Under the Hood */}
      <section id="under-the-hood" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>4. Under the Hood: Transient State Forking</h2>
        </div>

        <CodeBlock
          filename="ReactOptimisticHooks.ts"
          language="typescript"
          code={`// Conceptual implementation of useOptimistic inside React Fiber
function useOptimistic<Passthrough, Optimistic>(
  passthrough: Passthrough,
  updateFn: (state: Passthrough, update: Optimistic) => Passthrough
) {
  // If an active transition is in flight, apply the updateFn overlay
  const isTransitionPending = checkIfCurrentLaneIsTransition();

  if (isTransitionPending && hasPendingOptimisticAction()) {
    const optimisticUpdate = getPendingOptimisticAction();
    return [updateFn(passthrough, optimisticUpdate), dispatchOptimistic];
  }

  // When transition completes (or rolls back), return the true passthrough state!
  return [passthrough, dispatchOptimistic];
}`}
        />
      </section>

      {/* SECTION 5: Production Patterns */}
      <section id="production-patterns" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Patterns for Robust Optimism</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300">
          <ul className="space-y-1.5 list-disc list-inside text-gray-400">
            <li>Generate client-side temporary IDs (UUIDs) for optimistic rows so keys remain stable.</li>
            <li>Use visual indicators (e.g. reduced opacity or a small clock icon) to subtly signify in-flight state.</li>
            <li>Combine with <code>toast.error()</code> inside catch blocks so users understand why an action rolled back.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
