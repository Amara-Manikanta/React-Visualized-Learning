import React from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import CodeCompiler from "../../components/interactive/CodeCompiler";
import {
  Code,
  ArrowRight,
  Braces,
  Sparkles,
  Zap,
  Terminal,
  ShieldAlert
} from "lucide-react";

export const SEARCH_KEYWORDS = [
  "JavaScript for React",
  "Modern JavaScript ES6",
  "Arrow functions",
  "Destructuring objects and arrays",
  "Spread and rest operators",
  "Array map filter reduce",
  "JavaScript immutability",
  "Template literals",
  "Async await in React",
  "JavaScript live compiler",
  "Zero UI knowledge"
];

const toc = [
  { label: "1. The Big Shift: const vs let (Goodbye var)", hash: "const-vs-let" },
  { label: "2. Arrow Functions: Concise Functional Syntax", hash: "arrow-functions" },
  { label: "3. Destructuring: Unpacking Data Cleanly", hash: "destructuring" },
  { label: "4. The Spread Operator (...): Creating Clones", hash: "spread-operator" },
  { label: "5. The React Array Toolkit: map, filter, reduce", hash: "array-methods" },
  { label: "6. The Immutability Golden Rule in React", hash: "immutability" },
  { label: "7. Interactive Practice: Live JavaScript Compiler", hash: "interactive-compiler" },
  { label: "8. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why is array.push() strictly avoided when updating React state (e.g. const [items, setItems] = useState([]))?",
    options: [
      "Because .push() mutates the existing array in-place. React compares the old array reference to the new one (referential equality), sees they point to the exact same array memory address, and fails to re-render!",
      "Because .push() was deprecated in modern JavaScript.",
      "Because .push() converts numbers into text.",
      "Because React only allows arrays with 5 elements."
    ],
    answer: 0,
    why: "In React, state must be treated as immutable. Mutating an array with items.push(x) changes the contents inside the existing memory box without changing the reference pointer. React assumes nothing changed and skips re-rendering. Always write: setItems([...items, x]) to produce a brand new array!"
  },
  {
    q: "What does the array method .map() return?",
    options: [
      "A brand new array of the exact same length where each item has been transformed by your callback function.",
      "A boolean true or false.",
      "The sum of all numbers in the array.",
      "It deletes all items from the original array."
    ],
    answer: 0,
    why: "array.map(fn) walks through every element, runs fn(item), and returns a fresh new array with the transformed results. In React, we use .map() to transform arrays of data objects into arrays of JSX UI elements: users.map(u => <UserCard key={u.id} {...u} />)."
  },
  {
    q: "In the destructuring expression: const { name, role = 'User' } = profile; what does 'role = User' do?",
    options: [
      "It provides a default fallback value of 'User' if profile.role is undefined.",
      "It prevents the role from ever being modified.",
      "It renames the variable to 'User'.",
      "It sends an alert to the user."
    ],
    answer: 0,
    why: "Default values in destructuring provide an automatic fallback if the property is missing (undefined). This is commonly used in React components for optional props: function Avatar({ size = 40 }) { ... }."
  }
];

const jsPracticePresets = [
  {
    name: "Array .map() Transformation",
    code: `// .map() transforms an array of data into another format!
const products = [
  { id: 1, name: "Mechanical Keyboard", price: 120 },
  { id: 2, name: "Wireless Mouse", price: 60 },
  { id: 3, name: "4K Monitor", price: 400 }
];

// Transform into formatted string tags:
const displayTags = products.map((item) => {
  return \`🏷️ \${item.name} — $\${item.price}\`;
});

console.log("Original Items:", products.length);
console.log("Transformed List:", displayTags);`
  },
  {
    name: "Array .filter() Search",
    code: `// .filter() creates a new array containing ONLY items that match a condition!
const developers = [
  { name: "Sara", role: "Frontend", experience: 5 },
  { name: "Kenji", role: "Backend", experience: 8 },
  { name: "Elena", role: "Frontend", experience: 3 },
  { name: "Devon", role: "DevOps", experience: 6 }
];

// Filter for frontend specialists with >= 4 years experience:
const seniorFrontends = developers.filter((dev) => {
  return dev.role === "Frontend" && dev.experience >= 4;
});

console.log("Filtered Results:", seniorFrontends);`
  },
  {
    name: "Object Destructuring & Spread",
    code: `// Destructuring extracts properties into clean local variables
const user = {
  id: "u-99",
  username: "alex_morgan",
  tier: "pro",
  stats: { followers: 1420, following: 380 }
};

// 1. Unpack properties:
const { username, tier, role = "Developer" } = user;
console.log("Extracted:", username, "| Tier:", tier, "| Fallback Role:", role);

// 2. Spread operator creates an immutable updated clone:
const updatedUser = {
  ...user,
  tier: "enterprise", // Overrides existing property
  isOnline: true       // Adds new property
};

console.log("Updated Immutable Clone:", updatedUser);`
  },
  {
    name: "Immutability Test (.push vs spread)",
    code: `// Why immutability is vital in React:
const originalList = ["React", "TypeScript"];

// ❌ ANTI-PATTERN: Mutating array directly:
// originalList.push("Next.js"); // Changes same memory box!

// ✓ REACT PATTERN: Immutable creation of fresh array:
const newList = [...originalList, "Next.js", "Tailwind"];

console.log("Original List (Untouched):", originalList);
console.log("New List (Fresh Memory Reference):", newList);
console.log("Are they different arrays?", originalList !== newList);`
  },
  {
    name: "Async / Await Simulation",
    code: `// Simulating fetching data from a remote server API:
async function fetchUserProfile(userId) {
  console.log("1. Initiating request for user:", userId);
  
  // Fake 100ms network delay:
  const user = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: "Alex Morgan", status: "Active" });
    }, 100);
  });

  console.log("2. Response received successfully!");
  return user;
}

fetchUserProfile("usr_42").then((result) => {
  console.log("3. User profile data payload:", result);
});`
  }
];

export default function JavascriptForReact() {
  return (
    <GuideLayout
      title="P.3 Modern JavaScript (ES6+) for React"
      intro="Master the modern JavaScript features you will use every day in React: Arrow functions, destructuring, the spread operator, array transformations, and immutability."
      badge="ES6+ Engine"
      toc={toc}
    >
      {/* SECTION 1: const vs let */}
      <section id="const-vs-let" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
          <Code className="w-5 h-5" />
          <h2>1. The Big Shift: const vs let (Goodbye var)</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In traditional 1995 JavaScript, all variables were declared with <code>var</code>. <code>var</code> had bizarre behavior: it ignored block scopes and leaked outside if-statements.
        </p>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In modern React development, <code>var</code> is completely dead. We strictly use two keywords:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-[#0e1612]">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              const (Constant / Default Choice)
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Use for <strong>90% of your variables</strong>. Signifies that the variable identifier cannot be reassigned. (e.g. <code>const title = "Dashboard"</code>).
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-cyan-500/30 bg-[#0e1418]">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              let (Reassignable Variable)
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Use only when you know you will deliberately reassign the value later (such as a loop counter or accumulating a temporary math value).
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Arrow Functions */}
      <section id="arrow-functions" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <ArrowRight className="w-5 h-5" />
          <h2>2. Arrow Functions: Concise Functional Syntax</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In React, you will write hundreds of functions: component definitions, event handlers, and callbacks. <strong>Arrow functions <code>{`() => {}`}</code></strong> make them short and elegant:
        </p>

        <CodeBlock
          filename="ArrowComparison.js"
          language="javascript"
          code={`// 1. Old Traditional Function:
function add(a, b) {
  return a + b;
}

// 2. Modern Arrow Function:
const add = (a, b) => a + b; // Implicit return!

// 3. In React Event Handlers:
<button onClick={() => alert("Button clicked!")}>
  Tap Me
</button>`}
        />
      </section>

      {/* SECTION 3: Destructuring */}
      <section id="destructuring" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-lg">
          <Braces className="w-5 h-5" />
          <h2>3. Destructuring: Unpacking Data Cleanly</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Destructuring allows you to unpack properties from objects or items from arrays into individual variables in a single line:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div>
            <span className="text-xs font-mono text-gray-400 block mb-2">Object Destructuring (Used for Props):</span>
            <CodeBlock
              filename="ObjectDestructure.js"
              language="javascript"
              code={`const user = { name: "Elena", role: "Architect" };

// Instead of:
// const name = user.name;
// const role = user.role;

// Unpack directly:
const { name, role } = user;

// In a React Component:
function ProfileCard({ name, role }) {
  return <h3>{name} ({role})</h3>;
}`}
            />
          </div>

          <div>
            <span className="text-xs font-mono text-gray-400 block mb-2">Array Destructuring (Used for useState):</span>
            <CodeBlock
              filename="ArrayDestructure.js"
              language="javascript"
              code={`const colors = ["#000", "#fff"];

// Unpack array items by position:
const [primary, secondary] = colors;

// This is the EXACT syntax used by useState!
const [count, setCount] = useState(0);`}
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: Spread Operator */}
      <section id="spread-operator" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg">
          <Sparkles className="w-5 h-5" />
          <h2>4. The Spread Operator (...): Creating Clones</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          The three dots <code>...</code> (spread operator) expand the contents of an object or array into a new container:
        </p>

        <CodeBlock
          filename="SpreadExample.js"
          language="javascript"
          code={`const baseUser = { id: 1, name: "Jordan" };

// Create a copy and add/override properties:
const updatedUser = {
  ...baseUser,
  isVerified: true,
  theme: "dark"
};
// baseUser is completely untouched!`}
        />
      </section>

      {/* SECTION 5: Array Methods */}
      <section id="array-methods" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Zap className="w-5 h-5" />
          <h2>5. The React Array Toolkit: map, filter, reduce</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In React, you almost never use traditional <code>for</code> loops. Instead, we use declarative array methods:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-xs">
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-[#0e1418]">
            <span className="font-bold text-cyan-400 font-mono block mb-1">.map() (Transform)</span>
            <p className="text-gray-300">Transforms every item into something new (e.g. raw data into JSX elements).</p>
          </div>
          <div className="p-4 rounded-xl border border-indigo-500/30 bg-[#121018]">
            <span className="font-bold text-indigo-400 font-mono block mb-1">.filter() (Select/Delete)</span>
            <p className="text-gray-300">Creates a new array containing only items passing a test condition.</p>
          </div>
          <div className="p-4 rounded-xl border border-purple-500/30 bg-[#15101a]">
            <span className="font-bold text-purple-400 font-mono block mb-1">.reduce() (Aggregate)</span>
            <p className="text-gray-300">Boils an entire list down to a single value (like calculating a shopping cart total).</p>
          </div>
        </div>
      </section>

      {/* SECTION 6: Immutability */}
      <section id="immutability" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-rose-400 font-bold text-lg">
          <ShieldAlert className="w-5 h-5" />
          <h2>6. The Immutability Golden Rule in React</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In JavaScript, arrays and objects are stored as <strong>references (pointers in memory)</strong>. Look at what happens if you mutate an object directly:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-rose-500/20 bg-[#161214]">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-2">
              ❌ Direct Mutation (Breaks React Re-rendering!)
            </span>
            <pre className="text-xs font-mono text-rose-300 p-3 bg-black/40 rounded-lg overflow-x-auto">
              <code>{`// In-place mutation:
user.name = "New Name";
items.push("New Item");

// React compares: oldUser === newUser
// Since memory pointer didn't change,
// React assumes NOTHING changed and DOES NOT RE-RENDER!`}</code>
            </pre>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-[#0e1612]">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              ✓ Immutable Update (Triggers Paint!)
            </span>
            <pre className="text-xs font-mono text-emerald-300 p-3 bg-black/40 rounded-lg overflow-x-auto">
              <code>{`// Create fresh copies:
setUser({ ...user, name: "New Name" });
setItems([...items, "New Item"]);

// React sees a brand-new memory reference,
// immediately schedules a re-render,
// and updates the user's screen!`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* SECTION 7: Live Compiler Practice */}
      <section id="interactive-compiler" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
          <Terminal className="w-5 h-5" />
          <h2>7. Interactive Practice: Live JavaScript Compiler</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Write and run real modern JavaScript below. Select different practice presets to explore array transformations, destructuring, and immutability with instant live terminal execution:
        </p>

        <CodeCompiler
          mode="js"
          title="Modern JavaScript (ES6+) REPL & Compiler"
          description="Edit and run ES6+ code. Output is captured live in the interactive terminal."
          initialCode={jsPracticePresets[0].code}
          presets={jsPracticePresets}
        />
      </section>

      {/* SECTION 8: Knowledge Check */}
      <section id="knowledge-check" className="scroll-mt-24">
        <KnowledgeCheck questions={quizQuestions} />
      </section>
    </GuideLayout>
  );
}
