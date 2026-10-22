import React, { useState } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import {
  ListFilter,
  ToggleLeft,
  Key,
  AlertTriangle,
  Shuffle,
  Plus,
  Trash2,
  Sparkles
} from "lucide-react";

export const SEARCH_KEYWORDS = [
  "Conditional rendering",
  "React lists",
  "Rendering lists with map",
  "React key prop",
  "Index as key anti-pattern",
  "Ternary operator",
  "Logical AND operator",
  "The 0 && trap",
  "Zero UI knowledge",
  "List keys explained"
];

const toc = [
  { label: "1. Conditional UI: Showing & Hiding Like a Light Switch", hash: "conditional-ui" },
  { label: "2. The 3 Patterns: if/else, Ternary, & Logical &&", hash: "the-three-patterns" },
  { label: "3. Transforming Data into UI: The Power of .map()", hash: "rendering-lists" },
  { label: "4. The 'Luggage Tag' Mystery: Why React Demands `key`s", hash: "the-key-mystery" },
  { label: "5. Interactive Laboratory: The Key Disaster Simulator", hash: "interactive-lab" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why is writing: {count && <p>Unread items</p>} dangerous when count equals 0?",
    options: [
      "Because in JavaScript, 0 is falsy, so the expression evaluates to the number 0. React prints the literal text '0' directly onto your screen instead of hiding the paragraph!",
      "Because 0 deletes the entire webpage from memory.",
      "Because numbers are not allowed inside curly braces in JSX.",
      "Because it crashes the browser with a syntax error."
    ],
    answer: 0,
    why: "In JavaScript, 0 && <p>...</p> evaluates to 0. While React ignores booleans (false renders nothing), it DOES render numbers! So a literal '0' shows up in your UI. The safe fix is to write: {count > 0 && <p>Unread items</p>}."
  },
  {
    q: "Why does React require a unique 'key' prop on every item when rendering an array with .map()?",
    options: [
      "Keys give each item a persistent, stable identity (like a luggage tag). When the list is filtered, sorted, or items are inserted, React uses the key to know which DOM node to move rather than re-creating them from scratch or scrambling their inputs.",
      "Keys are required by CSS to apply colors to lists.",
      "Keys encrypt the list data for security reasons.",
      "Keys prevent the user from scrolling the webpage."
    ],
    answer: 0,
    why: "Without unique keys, React doesn't know which item is which when items reorder or delete. It mistakenly pairs the wrong DOM elements with the wrong data, scrambling form inputs, focus, and internal animations."
  },
  {
    q: "Why is using the array index as a key (e.g. items.map((item, index) => <Card key={index} />)) considered an anti-pattern when lists change?",
    options: [
      "Because if you insert an item at the beginning or delete an item, every item's index shifts, causing React to attach existing DOM elements and state to the wrong data items.",
      "Because array indexes are not supported in JavaScript ES6.",
      "Because indexes take up too much RAM on the server.",
      "Because indexes must be negative numbers in React."
    ],
    answer: 0,
    why: "An index is tied to a *position*, not to the item itself. If you insert a new item at position 0, the previous item 0 now becomes item 1. React sees key={0} is still there, assumes it never moved, and gives the new item the old item's form inputs and state!"
  }
];

export default function ConditionalRenderingAndLists() {
  const [useStableKeys, setUseStableKeys] = useState(true);
  const [items, setItems] = useState([
    { id: "task-1", title: "1. Design Component Wireframes", color: "border-cyan-500/40 text-cyan-300" },
    { id: "task-2", title: "2. Build Interactive Simulator", color: "border-indigo-500/40 text-indigo-300" },
    { id: "task-3", title: "3. Run Oxlint & Deploy Pipeline", color: "border-emerald-500/40 text-emerald-300" }
  ]);

  const shuffleList = () => {
    setItems((prev) => [...prev].reverse());
  };

  const addItemToTop = () => {
    const newId = `task-${Date.now()}`;
    const newTask = {
      id: newId,
      title: `⭐ New Priority Task #${items.length + 1}`,
      color: "border-amber-500/40 text-amber-300"
    };
    setItems((prev) => [newTask, ...prev]);
  };

  const removeFirstItem = () => {
    setItems((prev) => prev.slice(1));
  };

  return (
    <GuideLayout
      title="0.7 Conditional Rendering & Lists with Keys"
      intro="Master showing and hiding UI elements dynamically, mapping array data to JSX, and solving the infamous 'Key Disaster' in React reconciler."
      badge="Dynamic UI"
      toc={toc}
    >
      {/* SECTION 1: Conditional UI */}
      <section id="conditional-ui" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <ToggleLeft className="w-5 h-5" />
          <h2>1. Conditional UI: Showing & Hiding Like a Light Switch</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In real web applications, interfaces are rarely static. Screens must adapt to the user's circumstances:
        </p>

        <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
          <li>If the user is logged in, show their <strong>User Profile</strong>; otherwise, show the <strong>Login Button</strong>.</li>
          <li>If the shopping cart is empty, show <em>"Your cart is empty"</em>; otherwise, show the <strong>Checkout Button</strong>.</li>
          <li>If a network request is loading, show a <strong>Spinning Loader</strong>.</li>
        </ul>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In React, you don't use special template syntax. Because JSX is just JavaScript, you use standard JavaScript logic!
        </p>
      </section>

      {/* SECTION 2: The 3 Patterns */}
      <section id="the-three-patterns" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-lg">
          <ListFilter className="w-5 h-5" />
          <h2>2. The 3 Patterns: if/else, Ternary, & Logical &&</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase block">
              Pattern 1: if / else (Early Return)
            </span>
            <p className="text-xs text-gray-400 leading-relaxed">
              Best for entire screen branches or when waiting for data to load:
            </p>
            <pre className="text-[11px] font-mono text-cyan-200 bg-black/40 p-2.5 rounded-lg border border-white/5">
              <code>{`if (isLoading) {
  return <Spinner />;
}`}</code>
            </pre>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase block">
              Pattern 2: Ternary (? :)
            </span>
            <p className="text-xs text-gray-400 leading-relaxed">
              Best for choosing between two elements inline:
            </p>
            <pre className="text-[11px] font-mono text-indigo-200 bg-black/40 p-2.5 rounded-lg border border-white/5">
              <code>{`{isLoggedIn ? (
  <Dashboard />
) : (
  <LoginForm />
)}`}</code>
            </pre>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
              Pattern 3: Logical AND (&&)
            </span>
            <p className="text-xs text-gray-400 leading-relaxed">
              Best for showing something OR showing nothing at all:
            </p>
            <pre className="text-[11px] font-mono text-emerald-200 bg-black/40 p-2.5 rounded-lg border border-white/5">
              <code>{`{hasDiscount && (
  <SaleBadge />
)}`}</code>
            </pre>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 text-xs sm:text-sm text-amber-200 space-y-1">
          <span className="font-bold text-amber-300 block">⚠️ The Infamous `0 && UI` Trap:</span>
          <p className="text-gray-300 leading-relaxed">
            Never write <code>{`{unreadCount && <Badge />}`}</code>. In JavaScript, <code>0 && ...</code> evaluates to the number <code>0</code>! While React ignores <code>false</code>, it <em>will</em> render the number <code>0</code> on screen. Always write: <code>{`{unreadCount > 0 && <Badge />}`}</code>!
          </p>
        </div>
      </section>

      {/* SECTION 3: Transforming Data with map() */}
      <section id="rendering-lists" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Sparkles className="w-5 h-5" />
          <h2>3. Transforming Data into UI: The Power of .map()</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In real software, your data comes as an array of objects from a database:
        </p>

        <CodeBlock
          filename="ProductList.jsx"
          language="jsx"
          code={`const products = [
  { id: "p1", name: "Mechanical Keyboard", price: 120 },
  { id: "p2", name: "Ergonomic Mouse", price: 85 },
  { id: "p3", name: "4K OLED Monitor", price: 450 }
];

export default function ProductCatalog() {
  return (
    <div className="catalog-grid">
      {/* .map() transforms each data object into a JSX element! */}
      {products.map((item) => (
        <div key={item.id} className="product-card">
          <h3>{item.name}</h3>
          <p>\${'$'}{item.price}</p>
          <button>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}`}
        />
      </section>

      {/* SECTION 4: The Luggage Tag Mystery */}
      <section id="the-key-mystery" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
          <Key className="w-5 h-5" />
          <h2>4. The 'Luggage Tag' Mystery: Why React Demands `key`s</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Imagine you check three black suitcases at an airport. If the airline does not put a <strong>unique luggage tag</strong> with your name on each suitcase, how will they know which bag belongs to which passenger when bags get shifted or re-ordered?
        </p>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In React, the <code>key</code> prop is the luggage tag. When an array changes (items are reordered, deleted, or inserted at the top), React looks at the keys:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-rose-500/20 bg-[#161214]">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase block mb-1">
              Without Stable Keys (or key=index)
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              If an item is inserted at the top, React thinks item 0 just changed text, and item 1 just changed text. Any internal inputs or checkboxes get attached to the wrong item!
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-[#0e1612]">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase block mb-1">
              With Unique IDs (key=item.id)
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              React matches the tag <code>id="p1"</code> with its existing DOM node. It simply moves the node in the DOM tree. All internal user input, focus, and state are preserved perfectly!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-rose-400 font-bold text-lg">
          <AlertTriangle className="w-5 h-5" />
          <h2>5. Interactive Laboratory: The Key Disaster Simulator</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          <strong>Try this live experiment:</strong>
          <br />
          1. Type a personal note into Task 1's text box (e.g. <em>"Important note!"</em>).
          <br />
          2. Now click <strong>"Add New Task to TOP"</strong> or <strong>"Shuffle Items"</strong>.
          <br />
          Notice what happens when you toggle between <strong>Unique Keys</strong> vs <strong>Index Keys</strong>!
        </p>

        {/* Simulator Box */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] shadow-2xl space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-gray-400">Key Mode:</span>
              <button
                onClick={() => setUseStableKeys(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                  useStableKeys
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10"
                    : "bg-white/5 border-white/10 text-gray-400"
                }`}
              >
                ✓ Unique Keys (key=item.id)
              </button>
              <button
                onClick={() => setUseStableKeys(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                  !useStableKeys
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-500/10"
                    : "bg-white/5 border-white/10 text-gray-400"
                }`}
              >
                ⚠ Index Keys (key=index)
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={addItemToTop}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Top</span>
              </button>

              <button
                onClick={shuffleList}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Reverse Order</span>
              </button>

              <button
                onClick={removeFirstItem}
                disabled={items.length <= 1}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove First</span>
              </button>
            </div>
          </div>

          {/* Mode Warning Banner */}
          <div
            className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
              useStableKeys
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                : "bg-rose-950/40 border-rose-500/30 text-rose-300 animate-pulse"
            }`}
          >
            <span>
              {useStableKeys
                ? "✓ SAFE: React identifies each node by its permanent item.id. Notes stay with their task!"
                : "⚠ HAZARD: Using key={index}. When items reorder, text notes will stay stuck at index 0!"}
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/40">
              {useStableKeys ? "Stable Reconciler" : "Buggy Reconciler"}
            </span>
          </div>

          {/* Live Task List */}
          <div className="space-y-3">
            {items.map((item, index) => {
              const currentKey = useStableKeys ? item.id : index;
              return (
                <div
                  key={currentKey}
                  className={`p-4 rounded-xl border bg-[#111116] flex flex-wrap items-center justify-between gap-4 transition-all shadow-lg ${item.color}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                        key="{currentKey}"
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono block">
                      Internal ID: {item.id} | Array Index: {index}
                    </span>
                  </div>

                  <div className="flex-1 max-w-xs">
                    <input
                      type="text"
                      placeholder="Type personal note..."
                      className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs font-sans placeholder-gray-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              );
            })}
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
