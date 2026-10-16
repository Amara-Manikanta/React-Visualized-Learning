import React from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Split, Layers, CheckCircle2, Box } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "Component Composition",
  "Children as Props",
  "Lifting State Up",
  "Pushing State Down",
  "Compound Components",
  "Render Optimization without Memo"
];

const toc = [
  { label: "1. The Intuition: Composition Over Optimization", hash: "intuition" },
  { label: "2. The 'Children as Props' Performance Superpower", hash: "children-as-props" },
  { label: "3. Pushing State Down to Leaf Nodes", hash: "push-state-down" },
  { label: "4. The Compound Components Architecture", hash: "compound-components" },
  { label: "5. Production Architecture Comparison", hash: "comparison" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why does passing an expensive component as a 'children' prop to a stateful wrapper component prevent the expensive component from re-rendering when the wrapper updates its state?",
    options: [
      "The 'children' JSX element was evaluated in the parent scope where state did NOT change; its object reference is identical across the wrapper's re-renders, so React skips it.",
      "Because children props are automatically wrapped in React.memo by the compiler.",
      "Because children props run in a Web Worker.",
      "Because React freezes the children prop in local memory."
    ],
    answer: 0,
    why: "When you write <ColorPicker>{expensiveChild}</ColorPicker>, expensiveChild is evaluated in the outer component. When ColorPicker's local state changes, ColorPicker re-renders, but its props.children has the exact same object reference as before (prevProps.children === nextProps.children). React's reconciler bails out automatically without needing React.memo!"
  },
  {
    q: "What is the primary benefit of the 'Compound Components' pattern (like <Select> and <Select.Option>)?",
    options: [
      "It allows components to implicitly share state and communicate via Context without exposing cumbersome prop drilling to consumers.",
      "It makes components render without JavaScript.",
      "It forces all sub-components to be static HTML.",
      "It avoids using React hooks."
    ],
    answer: 0,
    why: "Compound components provide an expressive, declarative API where a parent manages state (e.g. active tab or open dropdown) and child components implicitly consume and update that state via Context, giving consumers complete flexibility over markup and styling."
  }
];

export default function CompositionPatterns() {
  return (
    <GuideLayout
      title="Component Composition Patterns Visualized"
      intro="Learn how structural architecture and composition (children-as-props and compound components) can eliminate 90% of re-renders without a single React.memo."
      badge="Component Architecture"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Split className="w-5 h-5" />
          <h2>1. The Intuition: Composition Over Optimization</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Many engineers sprinkle <code>React.memo</code>, <code>useMemo</code>, and <code>useCallback</code> everywhere when an app feels sluggish. But in 9 out of 10 cases, the cleanest solution is simply restructuring the component hierarchy:
        </p>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            The Structural Secret
          </span>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed m-0">
            Keep volatile, fast-changing state (like hover effects, input typing, scroll tracking) encapsulated inside small, isolated leaf components. Never place high-frequency state high up in the tree where it forces thousands of descendants to re-evaluate.
          </p>
        </div>
      </section>

      {/* SECTION 2: Children as Props */}
      <section id="children-as-props" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>2. The 'Children as Props' Performance Superpower</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Look at this miraculous pattern that eliminates re-renders without any memoization:
        </p>

        <CodeBlock
          filename="children-prop-trick.tsx"
          language="typescript"
          code={`// ❌ BAD: Typing into input re-renders <VeryExpensiveTree /> on every keystroke!
function Page() {
  const [text, setText] = useState("");
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <VeryExpensiveTree />
    </div>
  );
}

// ✅ PERFECT: <VeryExpensiveTree /> NEVER re-renders on keystrokes!
function InputContainer({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState("");
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      {children} {/* Identical object reference across renders! */}
    </div>
  );
}

function Page() {
  return (
    <InputContainer>
      <VeryExpensiveTree />
    </InputContainer>
  );
}`}
        />
      </section>

      {/* SECTION 3: Push State Down */}
      <section id="push-state-down" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Box className="w-5 h-5" />
          <h2>3. Pushing State Down to Leaf Nodes</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          If only a dialog button needs to know whether the modal is open, do not lift <code>isOpen</code> into the root page. Create an isolated <code>&lt;OpenModalButton /&gt;</code> component.
        </p>
      </section>

      {/* SECTION 4: Compound Components */}
      <section id="compound-components" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>4. The Compound Components Architecture</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Compound components let you design flexible, accessible design systems like Radix UI or Headless UI:
        </p>

        <CodeBlock
          filename="CompoundTabs.tsx"
          language="typescript"
          code={`import { createContext, useContext, useState } from "react";

const TabContext = createContext<{ active: string; setActive: (t: string) => void } | null>(null);

export function Tabs({ defaultTab, children }: { defaultTab: string; children: React.ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return <TabContext.Provider value={{ active, setActive }}>{children}</TabContext.Provider>;
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 border-b border-white/10">{children}</div>;
}

export function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabContext)!;
  const isSelected = ctx.active === value;
  return (
    <button
      onClick={() => ctx.setActive(value)}
      className={isSelected ? "border-b-2 border-cyan-400 text-white font-bold" : "text-gray-400"}
    >
      {children}
    </button>
  );
}`}
        />
      </section>

      {/* SECTION 5: Comparison */}
      <section id="comparison" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Architecture Comparison</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300">
          <ul className="space-y-1.5 list-disc list-inside text-gray-400">
            <li><strong>Composition first:</strong> Push state down, lift static JSX up via children props.</li>
            <li><strong>Compound APIs:</strong> Provide intuitive slot-based flexibility for UI libraries.</li>
            <li><strong>Zero memo needed:</strong> 80%+ of memo calls can be deleted once components are properly composed.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
