import React, { useState } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import {
  FileCode,
  Brackets,
  CheckCircle2,
  Cpu,
  Sparkles
} from "lucide-react";

export const SEARCH_KEYWORDS = [
  "Understanding JSX",
  "JSX syntax",
  "React.createElement",
  "Curly braces in JSX",
  "JavaScript in JSX",
  "Fragment syntax",
  "className vs class",
  "Transpilation",
  "Zero UI knowledge",
  "JSX rules"
];

const toc = [
  { label: "1. Why JSX? The Myth of 'Separation of Concerns'", hash: "why-jsx" },
  { label: "2. The 3 Golden Rules of JSX", hash: "rules" },
  { label: "3. The Curly Braces Secret: A Portal to JavaScript", hash: "curly-braces" },
  { label: "4. Interactive Laboratory: JSX to Object Transpiler", hash: "interactive-lab" },
  { label: "5. Under the Hood: What React Actually Sees", hash: "under-the-hood" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why does React use JSX instead of keeping HTML and JavaScript in separate files?",
    options: [
      "Because in modern interactive applications, rendering logic (JS) and UI markup (HTML) are inherently tied together. Putting them in one component keeps concerns truly unified.",
      "Because web browsers cannot read HTML files anymore.",
      "Because JSX renders 10,000 times faster than regular HTML.",
      "Because JavaScript was removed from modern operating systems."
    ],
    answer: 0,
    why: "Historically, web developers tried to separate HTML and JS into separate files. But as apps became interactive, every button click required JavaScript to touch the HTML. React recognized that UI logic and markup are two sides of the same coin, and JSX lets you author them together."
  },
  {
    q: "Why do we write 'className' instead of 'class' when adding CSS styles in JSX?",
    options: [
      "Because 'class' is a reserved keyword in JavaScript (used for defining ES6 classes), so JSX uses 'className' to avoid syntax conflicts.",
      "Because 'class' is copyrighted by Oracle.",
      "Because modern CSS files only support the word 'className'.",
      "Because JSX does not support CSS."
    ],
    answer: 0,
    why: "Remember that JSX is ultimately compiled to regular JavaScript. Since 'class' is already a reserved keyword in JavaScript for defining classes (e.g. 'class Animal {}'), React uses 'className' which corresponds to the standard DOM property 'element.className'."
  },
  {
    q: "What do curly braces { } inside JSX markup allow you to do?",
    options: [
      "They open a portal directly into JavaScript, allowing you to embed any variable, calculation, string manipulation, or function call directly in your UI.",
      "They create an invisible secret comment for search engines.",
      "They compress the text to save memory on the hard drive.",
      "They lock the element so users cannot click it."
    ],
    answer: 0,
    why: "In JSX, text inside quotes like 'Hello' is treated as a literal static string. But when you wrap an expression in curly braces like {2 + 2} or {user.name.toUpperCase()}, React evaluates it as live JavaScript code!"
  }
];

export default function UnderstandingJsx() {
  const [selectedPreset, setSelectedPreset] = useState("greeting");
  const [customName, setCustomName] = useState("Alex Morgan");
  const [discountPct, setDiscountPct] = useState(25);
  const [isProMember, setIsProMember] = useState(true);

  const presets = {
    greeting: {
      name: "Dynamic User Greeting",
      jsx: `function WelcomeBanner() {
  const name = "${customName}";
  
  return (
    <div className="banner">
      <h1>Hello, {name.toUpperCase()}! 👋</h1>
      <p>Length: {name.length} characters</p>
    </div>
  );
}`,
      ast: {
        type: "div",
        props: {
          className: "banner",
          children: [
            {
              type: "h1",
              props: { children: `Hello, ${customName.toUpperCase()}! 👋` }
            },
            {
              type: "p",
              props: { children: `Length: ${customName.length} characters` }
            }
          ]
        }
      }
    },
    math: {
      name: "Price Calculation",
      jsx: `function CheckoutPrice() {
  const basePrice = 100;
  const discount = ${discountPct};
  
  return (
    <div className="price-tag">
      <span>Original: \${'$'}{basePrice}</span>
      <strong>Final: \${'$'}{basePrice * (1 - discount / 100)}</strong>
    </div>
  );
}`,
      ast: {
        type: "div",
        props: {
          className: "price-tag",
          children: [
            {
              type: "span",
              props: { children: "Original: $100" }
            },
            {
              type: "strong",
              props: { children: `Final: $${100 * (1 - discountPct / 100)}` }
            }
          ]
        }
      }
    },
    ternary: {
      name: "Conditional Status Badge",
      jsx: `function MembershipBadge() {
  const isPro = ${isProMember ? "true" : "false"};
  
  return (
    <div className="badge-card">
      <h3>Account Status:</h3>
      <span className={isPro ? "badge-pro" : "badge-free"}>
        {isPro ? "⭐ ELITE PRO MEMBER" : "🌱 Free Explorer"}
      </span>
    </div>
  );
}`,
      ast: {
        type: "div",
        props: {
          className: "badge-card",
          children: [
            {
              type: "h3",
              props: { children: "Account Status:" }
            },
            {
              type: "span",
              props: {
                className: isProMember ? "badge-pro" : "badge-free",
                children: isProMember ? "⭐ ELITE PRO MEMBER" : "🌱 Free Explorer"
              }
            }
          ]
        }
      }
    }
  };

  return (
    <GuideLayout
      title="0.3 Understanding JSX: HTML with Superpowers"
      intro="Why React combines markup and JavaScript into JSX, how curly braces open JavaScript portals, and what JSX compiles into behind the scenes."
      badge="Syntax & Mechanics"
      toc={toc}
    >
      {/* SECTION 1: Why JSX */}
      <section id="why-jsx" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <FileCode className="w-5 h-5" />
          <h2>1. Why JSX? The Myth of 'Separation of Concerns'</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          When people first see React, they usually exclaim: <em>"Wait! Are you writing HTML inside JavaScript? That violates everything I was taught about separating HTML and JS!"</em>
        </p>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          For years, developers separated HTML files (content) from JS files (logic). But in real life, when you click a button or type in a search box:
        </p>

        <div className="p-5 rounded-2xl border border-cyan-500/20 bg-[#0e1418] shadow-xl my-6">
          <p className="text-sm font-semibold text-cyan-300 mb-2">
            The Fundamental Truth of User Interfaces:
          </p>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Rendering logic and markup are <strong>fundamentally inseparable</strong>. How a button looks depends on whether it is disabled. What text is displayed depends on who is logged in.
          </p>
          <div className="mt-3 text-xs font-mono text-cyan-400 bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-500/30">
            JSX is NOT HTML. JSX is a syntax extension for JavaScript that looks like HTML so it is comfortable to write!
          </div>
        </div>
      </section>

      {/* SECTION 2: The 3 Golden Rules of JSX */}
      <section id="rules" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>2. The 3 Golden Rules of JSX</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Because JSX is actually JavaScript under the hood, it is much stricter than standard HTML. You must remember these 3 rules:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-3">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-bold text-white">Return a Single Root Element</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              A function can only return ONE value. You cannot return two adjacent tags without wrapping them in a parent <code>&lt;div&gt;</code> or an invisible Fragment <code>&lt;&gt; ... &lt;/&gt;</code>.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-3">
            <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="text-sm font-bold text-white">Close All Tags Explicitly</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              In HTML, tags like <code>&lt;img&gt;</code> and <code>&lt;input&gt;</code> don't need closing. In JSX, every tag MUST close with a slash: <code>&lt;img /&gt;</code> and <code>&lt;input /&gt;</code>.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-3">
            <span className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="text-sm font-bold text-white">camelCase Attributes & className</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              HTML uses <code>class</code> and <code>onclick</code>. In JSX, you must write <code>className</code> (because 'class' is a JS keyword) and <code>onClick</code> in camelCase.
            </p>
          </div>
        </div>

        <CodeBlock
          filename="RulesDemonstration.jsx"
          language="jsx"
          code={`// Correct JSX adhering to all 3 rules:
function Profile() {
  return (
    // Rule 1: Wrapped in a single Fragment <> ... </>
    <>
      {/* Rule 2: All tags self-close with /> */}
      <img src="/avatar.png" alt="User" className="avatar-img" />
      
      {/* Rule 3: className and camelCase event names */}
      <button className="btn-primary" onClick={() => alert("Hi")}>
        View Bio
      </button>
    </>
  );
}`}
        />
      </section>

      {/* SECTION 3: The Curly Braces Secret */}
      <section id="curly-braces" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-lg">
          <Brackets className="w-5 h-5" />
          <h2>3. The Curly Braces Secret: A Portal to JavaScript</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          The true magic of JSX is that you can slip any JavaScript expression right inside your UI using <strong>curly braces <code>{`{ }`}</code></strong>:
        </p>

        <div className="p-6 rounded-2xl border border-indigo-500/20 bg-[#121018] my-6 space-y-4">
          <div className="text-xs font-mono text-indigo-400 font-bold uppercase">
            What Can Go Inside Curly Braces?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="font-bold text-emerald-400 block mb-1">✓ Variables & Math</span>
              <code>&lt;p&gt;Total: {'{'}price * 1.08{'}'}&lt;/p&gt;</code>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="font-bold text-cyan-400 block mb-1">✓ String Methods</span>
              <code>&lt;h1&gt;{'{'}user.name.toUpperCase(){'}'}&lt;/h1&gt;</code>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="font-bold text-amber-400 block mb-1">✓ Conditionals (Ternary)</span>
              <code>&lt;span&gt;{'{'}isOnline ? "🟢 Online" : "🔴 Offline"{'}'}&lt;/span&gt;</code>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="font-bold text-purple-400 block mb-1">✓ Dynamic Styles/Objects</span>
              <code>&lt;div style={'{'}{'{'} color: "cyan" {'}'}{'}'}&gt;</code>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
          <Sparkles className="w-5 h-5" />
          <h2>4. Interactive Laboratory: JSX to Object Transpiler</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Choose a preset below and adjust the inputs. Notice how JSX code compiles directly into a clean JavaScript Object, which the browser then turns into visual pixels:
        </p>

        {/* Simulator Box */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] shadow-2xl space-y-6">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-mono font-bold text-gray-400 mr-2">Preset:</span>
            {Object.keys(presets).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedPreset(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedPreset === key
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 scale-105"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {presets[key].name}
              </button>
            ))}
          </div>

          {/* Interactive Controls */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono">
            {selectedPreset === "greeting" && (
              <div className="flex items-center gap-2 w-full max-w-sm">
                <span className="text-cyan-400">customName:</span>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="px-3 py-1.5 rounded bg-black border border-white/20 text-white font-sans text-xs w-full focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}

            {selectedPreset === "math" && (
              <div className="flex items-center gap-3 w-full max-w-sm">
                <span className="text-amber-400">Discount: {discountPct}%</span>
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={discountPct}
                  onChange={(e) => setDiscountPct(Number(e.target.value))}
                  className="flex-1 accent-amber-400 cursor-pointer"
                />
              </div>
            )}

            {selectedPreset === "ternary" && (
              <div className="flex items-center gap-3">
                <span className="text-purple-400">Toggle Status:</span>
                <button
                  onClick={() => setIsProMember(!isProMember)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    isProMember
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : "bg-gray-800 border-white/10 text-gray-400"
                  }`}
                >
                  {isProMember ? "Active: ⭐ PRO" : "Active: 🌱 FREE"}
                </button>
              </div>
            )}
          </div>

          {/* 3-Column Pipeline View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Column 1: JSX Code */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-[#111116] flex flex-col justify-between">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase mb-2 block">
                1. What You Write (JSX)
              </span>
              <pre className="text-xs font-mono text-gray-300 overflow-x-auto p-3 rounded-lg bg-[#09090d] border border-white/5 flex-1">
                <code>{presets[selectedPreset].jsx}</code>
              </pre>
            </div>

            {/* Column 2: Transpiled JS Object */}
            <div className="p-4 rounded-xl border border-purple-500/20 bg-[#111116] flex flex-col justify-between">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase mb-2 block">
                2. What React Sees (JS Object)
              </span>
              <pre className="text-[11px] font-mono text-purple-200 overflow-x-auto p-3 rounded-lg bg-[#09090d] border border-white/5 flex-1">
                <code>{JSON.stringify(presets[selectedPreset].ast, null, 2)}</code>
              </pre>
            </div>

            {/* Column 3: Browser Render */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-[#111116] flex flex-col justify-between">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase mb-2 block">
                3. What User Sees (Screen)
              </span>
              <div className="p-4 rounded-lg bg-[#16161f] border border-white/5 flex-1 flex flex-col items-center justify-center text-center">
                {selectedPreset === "greeting" && (
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-cyan-300">
                      Hello, {customName.toUpperCase()}! 👋
                    </h3>
                    <p className="text-xs text-gray-400">
                      Length: {customName.length} characters
                    </p>
                  </div>
                )}

                {selectedPreset === "math" && (
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 line-through block">
                      Original: $100
                    </span>
                    <span className="text-xl font-black text-amber-400">
                      Final: ${100 * (1 - discountPct / 100)}
                    </span>
                    <span className="text-[10px] text-emerald-400 block">
                      Saved ${discountPct}!
                    </span>
                  </div>
                )}

                {selectedPreset === "ternary" && (
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 block">Account Status:</span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono ${
                        isProMember
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-gray-800 text-gray-400 border border-white/10"
                      }`}
                    >
                      {isProMember ? "⭐ ELITE PRO MEMBER" : "🌱 Free Explorer"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Under the Hood */}
      <section id="under-the-hood" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Cpu className="w-5 h-5" />
          <h2>5. Under the Hood: What React Actually Sees</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Browsers cannot execute JSX directly. When you run your build tool (like Vite), a compiler converts every JSX tag into a call to <code>React.createElement()</code> (or the modern <code>jsx()</code> runtime):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div>
            <span className="text-xs font-mono font-bold text-gray-400 block mb-2">
              You Write (JSX):
            </span>
            <CodeBlock
              filename="Component.jsx"
              language="jsx"
              code={`<button className="primary" onClick={handleClick}>
  Confirm Order
</button>`}
            />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-purple-400 block mb-2">
              Compiler Produces (Plain JS):
            </span>
            <CodeBlock
              filename="Compiled.js"
              language="javascript"
              code={`React.createElement(
  "button",
  { className: "primary", onClick: handleClick },
  "Confirm Order"
);`}
            />
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          This function returns a lightweight JavaScript object describing the DOM node. That object is what people call a <strong>Virtual DOM element</strong>!
        </p>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <section id="knowledge-check" className="scroll-mt-24">
        <KnowledgeCheck questions={quizQuestions} />
      </section>
    </GuideLayout>
  );
}
