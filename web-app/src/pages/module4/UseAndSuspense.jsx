import React from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Sparkles, Layers, CheckCircle2, Split } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "use() Hook",
  "React 19 use",
  "Suspense",
  "Suspense Boundaries",
  "Promise streaming",
  "Conditional hooks",
  "Context unwrapping"
];

const toc = [
  { label: "1. The Intuition: Breaking the Rules of Hooks", hash: "intuition" },
  { label: "2. The Anatomy of use(): Promises vs Context", hash: "anatomy" },
  { label: "3. How Suspense Catches Thrown Promises", hash: "suspense-mechanics" },
  { label: "4. Resource Fetching: No More useEffect Waterfall", hash: "no-more-waterfall" },
  { label: "5. Production Patterns for Streaming Promises", hash: "production-patterns" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why is the React 19 `use()` hook allowed to be called inside `if` statements and loops, whereas all traditional hooks (useState, useEffect) are strictly forbidden?",
    options: [
      "Because `use()` is an unwrapper rather than a state-registering hook; it reads from an existing Promise or Context directly without relying on a static array index inside the Fiber's hook linked list.",
      "Because React 19 deprecated the Fiber linked list.",
      "Because use() is compiled by Babel into a standard async/await keyword.",
      "Because use() only runs on Node.js servers."
    ],
    answer: 0,
    why: "Traditional hooks like useState rely on call order to find their corresponding Hook node in Fiber.memoizedState. The use() hook is designed to read resources (Promises or Context). If passed a Context, it reads the value like useContext, but can be called conditionally! If passed a Promise, it unwraps the resolved value or suspends."
  },
  {
    q: "What actually happens under the hood when a component calls `use(promise)` on a promise that is still pending?",
    options: [
      "The component throws the Promise as an exception; the nearest ancestor <Suspense> boundary catches the thrown promise, renders its fallback UI, and attaches a .then() listener to resume rendering when settled.",
      "The component pauses JavaScript thread execution using Atomics.wait.",
      "The component returns null and schedules a 1-second timeout.",
      "React reloads the page."
    ],
    answer: 0,
    why: "This is the core mechanic of React Suspense! When a promise is pending, use(promise) literally throws the promise object up the call stack. The nearest <Suspense fallback={<Spinner />}> catches it, displays the fallback, and waits for promise.then(). Once resolved, React re-renders the component subtree with the unwrapped data."
  }
];

export default function UseAndSuspense() {
  return (
    <GuideLayout
      title="The use() Hook & Suspense Boundaries Visualized"
      intro="Discover React 19's most versatile hook: read promises and context conditionally, eliminate useEffect data fetching waterfalls, and understand thrown-promise mechanics."
      badge="React 19 Primitives"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Sparkles className="w-5 h-5" />
          <h2>1. The Intuition: Breaking the Rules of Hooks</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Ever since React 16.8, every React engineer has memorized the sacred rule: <em>"Never call hooks inside loops, conditions, or nested functions."</em>
        </p>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          React 19 breaks this rule with <code>use()</code>:
        </p>

        <CodeBlock
          filename="conditional-use.tsx"
          language="typescript"
          code={`import { use } from 'react';

function UserProfile({ shouldFetchPreferences, prefsPromise }: Props) {
  // ✅ 100% LEGAL IN REACT 19!
  // use() CAN be called conditionally inside an if statement!
  if (shouldFetchPreferences) {
    const preferences = use(prefsPromise); // Unwraps the promise!
    return <DisplayPreferences data={preferences} />;
  }

  return <div>Default Profile</div>;
}`}
        />
      </section>

      {/* SECTION 2: Anatomy */}
      <section id="anatomy" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>2. The Anatomy of use(): Promises vs Context</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-cyan-500/20 bg-[#111116]">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              use(Promise)
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Pass an in-flight promise (e.g. from Server Components or a fetcher). If pending, it suspends; if resolved, it returns the unwrapped data value; if rejected, it throws to the Error Boundary.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-indigo-500/20 bg-[#111116]">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-2">
              use(Context)
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Acts like <code>useContext(ThemeContext)</code>, but with one massive advantage: it can be called inside conditional blocks or loops, saving you from unneeded context subscriptions.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Suspense Mechanics */}
      <section id="suspense-mechanics" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Split className="w-5 h-5" />
          <h2>3. How Suspense Catches Thrown Promises</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Under the hood, when <code>use(promise)</code> encounters a pending promise:
        </p>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] font-mono text-xs text-gray-300 space-y-2 my-4">
          <div>1. Status check: promise.status === 'pending'</div>
          <div className="text-amber-300">2. throw promise; // Literally throws the pending promise!</div>
          <div className="text-cyan-300">3. &lt;Suspense&gt; boundary catches the thrown promise.</div>
          <div>4. Suspense renders fallback UI: &lt;Skeleton /&gt;</div>
          <div className="text-emerald-300">5. promise.then(() =&gt; triggerSubtreeRerender());</div>
        </div>
      </section>

      {/* SECTION 4: No More Waterfall */}
      <section id="no-more-waterfall" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>4. Resource Fetching: No More useEffect Waterfall</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In older React, components rendered empty first, waited for mount, ran useEffect, started fetching, and only then rendered data. With <code>use()</code> and Suspense, the promise starts before or during server streaming, eliminating render waterfalls.
        </p>
      </section>

      {/* SECTION 5: Production Patterns */}
      <section id="production-patterns" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Patterns for Streaming Promises</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300">
          <ul className="space-y-1.5 list-disc list-inside text-gray-400">
            <li>Never create a new promise inside the render function body without caching (e.g. create it outside or pass from Server Component), otherwise it creates an infinite render loop!</li>
            <li>Always nest <code>&lt;Suspense fallback=&#123;...&#125;&gt;</code> close to the component reading the promise to avoid blowing away outer layout navigation.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
