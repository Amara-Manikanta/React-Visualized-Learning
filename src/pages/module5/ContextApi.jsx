import React from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Network, AlertTriangle, Layers, CheckCircle2, Split } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "React Context API",
  "Consumer Re-render Trap",
  "Dependency Injection",
  "Context Splitting",
  "createContext",
  "useContext",
  "Global State"
];

const toc = [
  { label: "1. The Intuition: Teleportation vs State Management", hash: "intuition" },
  { label: "2. The Consumer Re-render Trap Explained", hash: "consumer-trap" },
  { label: "3. Context Splitting: Separating Data from Dispatch", hash: "context-splitting" },
  { label: "4. When to Use Context (And When NOT To)", hash: "when-to-use" },
  { label: "5. Production Architecture Checklist", hash: "production-checklist" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why is React Context NOT considered a true 'state management' system like Zustand or Redux?",
    options: [
      "Because Context does not have built-in atomic selectors; any update to the context value forces every single component that calls useContext() to re-render, even if they only need an untouched property.",
      "Because Context can only store strings and numbers.",
      "Because Context was deprecated in React 19.",
      "Because Context only works on mobile devices."
    ],
    answer: 0,
    why: "Context is fundamentally a Dependency Injection mechanism (teleporting values down the tree without prop drilling). When the value passed to <Context.Provider value={obj}> updates by reference, React marks every consumer Fiber dirty. It lacks fine-grained selector subscriptions."
  },
  {
    q: "How does the 'Context Splitting' pattern prevent consumer components from re-rendering unnecessarily?",
    options: [
      "By separating read-only data and dispatch functions into two distinct Contexts: StateContext (changes often) and DispatchContext (never changes).",
      "By converting the React tree into an HTML iframe.",
      "By caching state inside a CSS stylesheet.",
      "By encrypting the context value with SHA-256."
    ],
    answer: 0,
    why: "Components that only trigger actions (like a button calling dispatch()) only subscribe to DispatchContext. Since the dispatch function reference never changes, action buttons NEVER re-render when the state data updates!"
  }
];

export default function ContextApi() {
  return (
    <GuideLayout
      title="React Context API & The Consumer Trap"
      intro="Understand what Context was actually designed for (dependency injection) and how to avoid the catastrophic 're-render all consumers' trap through Context Splitting."
      badge="State Architecture"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Network className="w-5 h-5" />
          <h2>1. The Intuition: Teleportation vs State Management</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Think of <strong>Prop Drilling</strong> as passing a bucket of water through 10 people in a line to reach a garden. If the 5th person drops the bucket, the water is lost.
        </p>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          <strong>Context is a wormhole (teleporter):</strong> you drop the water into the portal at the top, and the garden catches it at the bottom without anyone in the middle touching it.
        </p>

        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-xs sm:text-sm text-amber-200 my-4">
          <strong>The Catch:</strong> When the portal's value changes, EVERY component that has a receiver connected to that portal vibrates and wakes up (a re-render).
        </div>
      </section>

      {/* SECTION 2: The Consumer Trap */}
      <section id="consumer-trap" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-rose-400 font-bold text-lg">
          <AlertTriangle className="w-5 h-5" />
          <h2>2. The Consumer Re-render Trap Explained</h2>
        </div>

        <CodeBlock
          filename="context-trap.tsx"
          language="typescript"
          code={`// ❌ ANTI-PATTERN: Giant mega-context
const AppContext = createContext({ user: null, theme: 'dark', cart: [] });

function ThemeToggle() {
  // ⚠️ BUG: ThemeToggle only cares about theme, but re-renders EVERY TIME
  // a user adds an item to cart or user logs in!
  const { theme, setTheme } = useContext(AppContext);
  return <button onClick={() => setTheme('light')}>{theme}</button>;
}`}
        />
      </section>

      {/* SECTION 3: Context Splitting */}
      <section id="context-splitting" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Split className="w-5 h-5" />
          <h2>3. Context Splitting: Separating Data from Dispatch</h2>
        </div>

        <CodeBlock
          filename="split-context-pattern.tsx"
          language="typescript"
          code={`const TasksContext = createContext<Task[] | null>(null);
const TasksDispatchContext = createContext<React.Dispatch<Action> | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

// Components that only dispatch actions never re-render when tasks change!
export function AddTaskButton() {
  const dispatch = useContext(TasksDispatchContext)!;
  return <button onClick={() => dispatch({ type: 'ADD' })}>Add Task</button>;
}`}
        />
      </section>

      {/* SECTION 4: When to Use */}
      <section id="when-to-use" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>4. When to Use Context (And When NOT To)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-[#111116]">
            <span className="text-emerald-400 font-bold text-xs uppercase block mb-2">✅ Ideal For Context</span>
            <ul className="space-y-1.5 text-xs text-gray-300 list-disc list-inside">
              <li>Low-frequency global preferences (Theme, Locale, Dark Mode)</li>
              <li>Authentication & active user session data</li>
              <li>Compound component local communication (Tabs, Accordions)</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-rose-500/20 bg-[#111116]">
            <span className="text-rose-400 font-bold text-xs uppercase block mb-2">❌ Terrible For Context</span>
            <ul className="space-y-1.5 text-xs text-gray-300 list-disc list-inside">
              <li>High-frequency state (mouse coordinates, animations, game loops)</li>
              <li>Large complex entities where components need individual slices (use Zustand)</li>
              <li>Text input fields or search keystrokes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 5: Production Checklist */}
      <section id="production-checklist" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Architecture Checklist</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300">
          <ul className="space-y-1.5 list-disc list-inside text-gray-400">
            <li>Always memoize provider values: <code>const value = useMemo(() =&gt; ({`{ data }`}), [data])</code>.</li>
            <li>Split state and dispatch contexts to protect action trigger buttons from re-rendering.</li>
            <li>Use custom consumer hooks that assert not-null: <code>useTasks()</code> throws if used outside <code>&lt;TasksProvider&gt;</code>.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
