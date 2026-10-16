import React, { useState } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import {
  ArrowDown,
  Sliders,
  Layers,
  Code2,
  Lock,
  AlertTriangle,
  User,
  Activity
} from "lucide-react";

export const SEARCH_KEYWORDS = [
  "React props",
  "Passing props",
  "One way data flow",
  "Unidirectional data flow",
  "Props destructuring",
  "Default props",
  "children prop",
  "Props are read-only",
  "Zero UI knowledge",
  "Component arguments"
];

const toc = [
  { label: "1. Props as Function Arguments: Customizing Blueprints", hash: "intuition" },
  { label: "2. The Unidirectional Waterfall: One-Way Data Flow", hash: "one-way-flow" },
  { label: "3. Destructuring & Default Props: Clean Signatures", hash: "destructuring" },
  { label: "4. The Special `children` Prop: Flexible Containers", hash: "children-prop" },
  { label: "5. Interactive Laboratory: Props Waterfall Simulator", hash: "interactive-lab" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "If a React component is a function, what are 'Props' in that mental model?",
    options: [
      "Props are the arguments passed into the component function, allowing the parent to customize how the child behaves and renders.",
      "Props are temporary cookies saved in the user's browser cache.",
      "Props are CSS animations executed by the browser engine.",
      "Props are backend database passwords."
    ],
    answer: 0,
    why: "Just as function greet(name) takes 'name' as an argument, <Greeting name='Sara' /> takes props as inputs. A component receives props as a single JavaScript object parameter: function Greeting(props) { return <h1>{props.name}</h1>; }."
  },
  {
    q: "Can a child component modify or reassign the props it receives from its parent?",
    options: [
      "NO. Props are strictly READ-ONLY and immutable. A component must never modify its own props (Pure Function rule).",
      "YES, any child can change its props using props.name = 'new name'.",
      "Only if the user clicks a button three times.",
      "Only if the prop is a number, not a string."
    ],
    answer: 0,
    why: "In React, data flows strictly one-way (unidirectional). If a child could mutate its parent's props directly, data flow would become unpredictable and hard to debug. If a child wants to change data, the parent must pass down a state setter function!"
  },
  {
    q: "What is the special 'children' prop in React?",
    options: [
      "It represents whatever JSX is nested between the opening and closing tags of a component (e.g. <Card><p>Hello</p></Card>).",
      "It restricts the component to only be displayed on children's toy websites.",
      "It creates an array of sub-domains on your server.",
      "It counts how many users have downloaded your mobile app."
    ],
    answer: 0,
    why: "The 'children' prop allows you to create flexible container components. When you write <Modal><LoginForm /></Modal>, the <LoginForm /> element is passed automatically to Modal as props.children."
  }
];

export default function PropsPassingData() {
  // Parent state feeding the child props
  const [userName, setUserName] = useState("Elena Rostova");
  const [userRole, setUserRole] = useState("Principal Systems Architect");
  const [themeColor, setThemeColor] = useState("cyan");
  const [isOnline, setIsOnline] = useState(true);
  const [reputationScore, setReputationScore] = useState(940);
  const [mutationAttempted, setMutationAttempted] = useState(false);

  const themeClasses = {
    cyan: {
      border: "border-cyan-500/30",
      bg: "from-cyan-950/20 to-blue-950/20",
      text: "text-cyan-400",
      ring: "ring-cyan-400"
    },
    indigo: {
      border: "border-indigo-500/30",
      bg: "from-indigo-950/20 to-purple-950/20",
      text: "text-indigo-400",
      ring: "ring-indigo-400"
    },
    emerald: {
      border: "border-emerald-500/30",
      bg: "from-emerald-950/20 to-teal-950/20",
      text: "text-emerald-400",
      ring: "ring-emerald-400"
    },
    amber: {
      border: "border-amber-500/30",
      bg: "from-amber-950/20 to-orange-950/20",
      text: "text-amber-400",
      ring: "ring-amber-400"
    }
  };

  return (
    <GuideLayout
      title="0.4 Props: Passing Data to Components"
      intro="How parent components pass custom data down to child components like function arguments, and why unidirectional data flow makes UIs rock solid."
      badge="Data Flow"
      toc={toc}
    >
      {/* SECTION 1: Props as Function Arguments */}
      <section id="intuition" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Sliders className="w-5 h-5" />
          <h2>1. Props as Function Arguments: Customizing Blueprints</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In lesson 0.2, we learned that a component is a reusable LEGO brick. But if every button or card had the exact same text and color, your app would be useless!
        </p>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          This is where <strong>Props</strong> (short for <em>properties</em>) come in. In standard JavaScript, you pass arguments to functions to customize their output:
        </p>

        <CodeBlock
          filename="comparison.js"
          language="javascript"
          code={`// 1. Regular JavaScript Function with an argument:
function calculateTax(price) {
  return price * 0.08;
}
calculateTax(100); // => 8

// 2. React Component with Props:
function UserBadge(props) {
  return <span>{props.name} ({props.role})</span>;
}
// You pass props just like HTML attributes!
<UserBadge name="Elena" role="Architect" />`}
        />

        <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-xs sm:text-sm text-cyan-200">
          <strong>Key Rule:</strong> Whatever attributes you write on a JSX tag (e.g. <code>title="..."</code>, <code>price={100}</code>) are bundled into a single object called <code>props</code> and passed into your component function!
        </div>
      </section>

      {/* SECTION 2: The Unidirectional Waterfall */}
      <section id="one-way-flow" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-lg">
          <ArrowDown className="w-5 h-5" />
          <h2>2. The Unidirectional Waterfall: One-Way Data Flow</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In React, data flows in one single direction: <strong>downwards, like a waterfall</strong>. Parents pass data down to children, who can pass it down to grandchildren:
        </p>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] my-6 font-mono text-xs">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-center">
              &lt;DashboardPage user=&#123;user&#125; /&gt;
              <div className="text-[10px] text-gray-400 font-normal">Owns the master user data</div>
            </div>
            <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
            <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-center">
              &lt;UserProfileCard name=&#123;user.name&#125; isOnline=&#123;user.isOnline&#125; /&gt;
              <div className="text-[10px] text-gray-400 font-normal">Receives slice of data from parent</div>
            </div>
            <ArrowDown className="w-4 h-4 text-indigo-400 animate-bounce" />
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-center">
              &lt;StatusDot isOnline=&#123;isOnline&#125; /&gt;
              <div className="text-[10px] text-gray-400 font-normal">Leaf component renders green or gray dot</div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-950/20 text-xs sm:text-sm text-rose-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-300">
            <Lock className="w-4 h-4" />
            Props are Read-Only (Pure Function Rule)!
          </div>
          <p className="text-gray-300 leading-relaxed">
            A child component <strong>CANNOT</strong> reassign or mutate its own props. Doing <code>props.name = "new"</code> is forbidden. If a child wants to change something, the parent must pass down an interactive trigger function!
          </p>
        </div>
      </section>

      {/* SECTION 3: Destructuring & Default Props */}
      <section id="destructuring" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg">
          <Code2 className="w-5 h-5" />
          <h2>3. Destructuring & Default Props: Clean Signatures</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Writing <code>props.name</code>, <code>props.role</code>, <code>props.score</code> over and over gets tiresome. Modern React developers use JavaScript <strong>Object Destructuring</strong> right in the function parameter:
        </p>

        <CodeBlock
          filename="UserCard.jsx"
          language="jsx"
          code={`// 1. Instead of writing (props) and doing props.name:
// 2. We destructure { name, role, isOnline = false } directly!
export default function UserCard({ 
  name, 
  role, 
  isOnline = false, // Default prop: if not passed, defaults to false!
  score = 0 
}) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{role}</p>
      <span>Status: {isOnline ? "🟢 Online" : "⚪ Offline"}</span>
      <span>Reputation: {score} pts</span>
    </div>
  );
}`}
        />
      </section>

      {/* SECTION 4: The Special children Prop */}
      <section id="children-prop" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-purple-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>4. The Special `children` Prop: Flexible Containers</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          What if you want to create a reusable container like a modal window, a glass card, or a layout wrapper? You don't know ahead of time what elements will go inside it!
        </p>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          React solves this with the special <code>children</code> prop. Whatever you put between the opening and closing tags of a component is passed automatically as <code>props.children</code>:
        </p>

        <CodeBlock
          filename="GlassCard.jsx"
          language="jsx"
          code={`// Reusable Container:
function GlassCard({ title, children }) {
  return (
    <div className="glass-container">
      <h2>{title}</h2>
      {/* Renders whatever is placed inside the tag! */}
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage in an app:
<GlassCard title="User Settings">
  {/* These children get injected into <div className="card-body"> */}
  <input type="text" placeholder="Change Email" />
  <button>Save Changes</button>
</GlassCard>`}
        />
      </section>

      {/* SECTION 5: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
          <Activity className="w-5 h-5" />
          <h2>5. Interactive Laboratory: Props Waterfall Simulator</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Experiment with the Parent component controls on the left. Watch how React instantly packages these values into a <code>props</code> object and streams them down to child components:
        </p>

        {/* Simulator Box */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] shadow-2xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Parent Controls */}
            <div className="p-5 rounded-xl border border-white/10 bg-[#111116] space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  &lt;ParentDashboard /&gt; State (Source)
                </span>
                <span className="text-[10px] font-mono text-gray-500">Controls Props</span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <label className="text-gray-400 block mb-1">Name:</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-black border border-white/10 text-white font-sans text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Role:</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-black border border-white/10 text-white font-sans text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Principal Systems Architect">Principal Systems Architect</option>
                    <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
                    <option value="Lead UX Researcher">Lead UX Researcher</option>
                    <option value="React 19 Core Contributor">React 19 Core Contributor</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-gray-400">Theme Accent:</span>
                  <div className="flex items-center gap-1.5">
                    {["cyan", "indigo", "emerald", "amber"].map((col) => (
                      <button
                        key={col}
                        onClick={() => setThemeColor(col)}
                        className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                          themeColor === col ? "scale-110 border-white shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                        } ${
                          col === "cyan" ? "bg-cyan-500" : col === "indigo" ? "bg-indigo-500" : col === "emerald" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-gray-400">Online Status:</span>
                  <button
                    onClick={() => setIsOnline(!isOnline)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      isOnline
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-gray-800 border-white/10 text-gray-500"
                    }`}
                  >
                    {isOnline ? "🟢 Online" : "⚪ Offline"}
                  </button>
                </div>

                <div>
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>Reputation Score:</span>
                    <span className="text-white font-bold">{reputationScore} pts</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    value={reputationScore}
                    onChange={(e) => setReputationScore(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Mutate Props Test */}
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => setMutationAttempted(!mutationAttempted)}
                    className="w-full py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold hover:bg-rose-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Test: Child Attempts to Mutate Props</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Child Render & Props Inspector */}
            <div className="space-y-4">
              <div
                className={`p-6 rounded-2xl border bg-gradient-to-br ${themeClasses[themeColor].bg} ${themeClasses[themeColor].border} shadow-2xl transition-all relative overflow-hidden`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-base shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{userName}</h4>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOnline ? "bg-emerald-400 animate-pulse" : "bg-gray-500"
                          }`}
                        />
                      </div>
                      <p className={`text-xs font-mono ${themeClasses[themeColor].text}`}>
                        {userRole}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold text-white">
                    {reputationScore} XP
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300">
                  <span className="font-semibold text-white block mb-0.5">Container Child:</span>
                  "This custom message is injected via the <code>children</code> prop!"
                </div>

                {mutationAttempted && (
                  <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-mono animate-fade-in">
                    ❌ <strong>TypeError: Cannot assign to read only property 'name' of object '#&lt;Object&gt;'</strong>
                    <div className="text-[11px] text-rose-300 mt-1">
                      React enforces strict immutability on props objects!
                    </div>
                  </div>
                )}
              </div>

              {/* Props Object Stream Visualizer */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#09090d] font-mono text-xs">
                <span className="text-[10px] text-gray-500 uppercase font-bold block mb-2">
                  Active Props Object Received by &lt;UserCard /&gt;:
                </span>
                <pre className="text-cyan-300 text-[11px] overflow-x-auto">
                  <code>{JSON.stringify(
                    {
                      name: userName,
                      role: userRole,
                      theme: themeColor,
                      isOnline: isOnline,
                      score: reputationScore
                    },
                    null,
                    2
                  )}</code>
                </pre>
              </div>
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
