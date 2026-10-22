import React, { useState } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import CodeCompiler from "../../components/interactive/CodeCompiler";
import {
  Palette,
  Box,
  Rows3,
  Sparkles,
  Terminal,
  MousePointer,
  Sliders
} from "lucide-react";

export const SEARCH_KEYWORDS = [
  "CSS fundamentals",
  "Flexbox layout",
  "The box model",
  "CSS for React",
  "justify-content align-items",
  "CSS Grid",
  "CSS selectors",
  "Pseudo-classes",
  "className in React",
  "CSS live compiler",
  "Zero UI knowledge"
];

const toc = [
  { label: "1. The Dressing Room: How CSS Rules Work", hash: "how-css-works" },
  { label: "2. The Box Model: Content, Padding, Border, Margin", hash: "box-model" },
  { label: "3. Flexbox Mastery: The #1 React Layout Engine", hash: "flexbox-mastery" },
  { label: "4. Interactive Flexbox Axis Explorer", hash: "flexbox-lab" },
  { label: "5. Pseudo-Classes & Interactive States", hash: "pseudo-classes" },
  { label: "6. Connecting CSS to React: className & Inline Styles", hash: "css-in-react" },
  { label: "7. Interactive Practice: Live CSS & Layout Compiler", hash: "interactive-compiler" },
  { label: "8. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "In the CSS Box Model, what is the exact difference between 'padding' and 'margin'?",
    options: [
      "Padding is the internal breathing room INSIDE the element's border (pushing content inward), while Margin is the external spacing OUTSIDE the border (pushing neighboring elements away).",
      "Padding only applies to text fonts, while Margin only applies to images.",
      "Padding is only used in mobile viewports, while Margin is for desktop screens.",
      "Padding deletes elements, while Margin creates elements."
    ],
    answer: 0,
    why: "Remember: Content -> Padding (inner cushion) -> Border (boundary wall) -> Margin (outer buffer between neighbors). If you give a button a background color, padding is colored, but margin is transparent!"
  },
  {
    q: "In Flexbox (with default flex-direction: row), which property aligns items along the horizontal main axis?",
    options: [
      "justify-content (e.g. center, space-between, flex-start, flex-end)",
      "align-items",
      "text-align",
      "grid-template-columns"
    ],
    answer: 0,
    why: "In Flexbox, 'justify-content' always controls alignment along the Primary (Main) axis, while 'align-items' controls alignment along the Cross axis."
  },
  {
    q: "Why do we pass an object to inline styles in React (e.g. style={{ color: 'cyan', fontSize: 16 }}) instead of a string?",
    options: [
      "Because JSX is JavaScript. The outer curly braces { } enter JavaScript mode, and the inner curly braces { } define a JavaScript object with camelCase CSS property names.",
      "Because HTML5 removed CSS strings in 2024.",
      "Because React cannot read strings.",
      "Because inline styles require double security keys."
    ],
    answer: 0,
    why: "In JSX, style takes a JavaScript object. Property names like 'font-size' cannot be used as unquoted JS object keys, so React uses camelCase like 'fontSize' and values like '16px' or raw numbers 16."
  }
];

const cssPresets = [
  {
    name: "Modern Responsive Navbar",
    code: `<nav class="navbar">
  <div class="logo">
    <span class="logo-icon">⚛️</span>
    <strong>React Visualized</strong>
  </div>

  <div class="nav-links">
    <a href="#" class="active">Guides</a>
    <a href="#">Simulators</a>
    <a href="#">Roadmap</a>
  </div>

  <button class="cta-button">Get Started</button>
</nav>`,
    css: `.navbar {
  font-family: sans-serif;
  background: #12121a;
  padding: 12px 20px;
  border-radius: 14px;
  border: 1px solid #272738;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #38bdf8;
  font-size: 14px;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 16px;
}
.nav-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}
.nav-links a:hover, .nav-links a.active {
  color: #ffffff;
}
.cta-button {
  background: #38bdf8;
  color: #0f172a;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s;
}
.cta-button:hover {
  transform: scale(1.04);
}`
  },
  {
    name: "Centered Glassmorphic Modal",
    code: `<div class="modal-backdrop">
  <div class="modal-card">
    <div class="icon-bubble">✨</div>
    <h2>Unlock Pro Certification</h2>
    <p>Complete all 6 modules and build 10 interactive laboratories to earn your React Internals badge.</p>
    
    <div class="button-group">
      <button class="btn-cancel">Later</button>
      <button class="btn-primary">Claim Badge</button>
    </div>
  </div>
</div>`,
    css: `.modal-backdrop {
  font-family: sans-serif;
  background: rgba(10, 10, 15, 0.8);
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-card {
  background: #161622;
  border: 1px solid #2a2a3e;
  border-radius: 20px;
  padding: 24px;
  max-width: 340px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}
.icon-bubble {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
  font-size: 20px;
}
h2 {
  font-size: 17px;
  color: #fff;
  margin: 0 0 8px 0;
}
p {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0 0 16px 0;
}
.button-group {
  display: flex;
  gap: 10px;
}
.btn-cancel {
  flex: 1;
  background: transparent;
  border: 1px solid #334155;
  color: #94a3b8;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
}
.btn-primary {
  flex: 1;
  background: #a855f7;
  border: none;
  color: #fff;
  font-weight: bold;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
}`
  },
  {
    name: "Auto-Fit Product Grid",
    code: `<div class="grid-container">
  <div class="item-card">
    <span class="tag">Flagship</span>
    <h4>Fiber Reconciler</h4>
    <p>Double-buffering & traversal.</p>
  </div>
  <div class="item-card">
    <span class="tag">Hooks</span>
    <h4>useState & Closures</h4>
    <p>Dispatch queues & snapshots.</p>
  </div>
  <div class="item-card">
    <span class="tag">React 19</span>
    <h4>RSC Wire Stream</h4>
    <p>Server components protocol.</p>
  </div>
</div>`,
    css: `.grid-container {
  font-family: sans-serif;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
}
.item-card {
  background: #111118;
  border: 1px solid #272738;
  padding: 14px;
  border-radius: 12px;
  transition: border-color 0.2s;
}
.item-card:hover {
  border-color: #38bdf8;
}
.tag {
  font-size: 9px;
  font-weight: bold;
  text-transform: uppercase;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}
h4 {
  font-size: 13px;
  color: #fff;
  margin: 8px 0 4px 0;
}
p {
  font-size: 11px;
  color: #94a3b8;
  margin: 0;
}`
  }
];

export default function CssAndFlexbox() {
  // Interactive Flexbox axis simulator
  const [justify, setJustify] = useState("space-between");
  const [align, setAlign] = useState("center");
  const [direction, setDirection] = useState("row");
  const [gap, setGap] = useState(12);

  return (
    <GuideLayout
      title="P.2 CSS Fundamentals, The Box Model & Flexbox"
      intro="Transform bare HTML bones into stunning interfaces: Master the Box Model, responsive Flexbox alignment, CSS Grid, and styling React components."
      badge="CSS3 & Layout"
      toc={toc}
    >
      {/* SECTION 1: How CSS Works */}
      <section id="how-css-works" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Palette className="w-5 h-5" />
          <h2>1. The Dressing Room: How CSS Rules Work</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          If HTML defines <em>what exists</em>, CSS (Cascading Style Sheets) defines <em>how it looks</em>. A CSS rule has three core parts:
        </p>

        <CodeBlock
          filename="styles.css"
          language="css"
          code={`/* Selector: Who gets styled? */
.call-to-action-btn {
  /* Property: What are we changing? : Value */
  background-color: #06b6d4;  /* Neon Cyan */
  color: #000000;             /* Black text */
  padding: 12px 24px;         /* Inner cushion */
  border-radius: 10px;        /* Rounded corners */
  border: none;               /* Remove default border */
  font-weight: 700;           /* Bold text */
  cursor: pointer;            /* Hand cursor on hover */
}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-xs">
          <div className="p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="font-bold text-amber-400 font-mono block mb-1">Tag Selectors (`button`)</span>
            <p className="text-gray-400">Styles every single button on the page. Broad and generic.</p>
          </div>
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-[#0e1418]">
            <span className="font-bold text-cyan-400 font-mono block mb-1">Class Selectors (`.card`)</span>
            <p className="text-gray-300">The primary tool in React! Reusable on any element with <code>className="card"</code>.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="font-bold text-purple-400 font-mono block mb-1">ID Selectors (`#header`)</span>
            <p className="text-gray-400">Unique to a single element on the page. Used sparingly.</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: The Box Model */}
      <section id="box-model" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
          <Box className="w-5 h-5" />
          <h2>2. The Box Model: Content, Padding, Border, Margin</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In CSS, <strong>everything is a box</strong>. Even circular avatars or rounded pills are square boxes shaped with CSS. Every box has 4 concentric layers:
        </p>

        {/* Visual Box Model Diagram */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#0b0b10] my-6 font-mono text-xs flex flex-col items-center">
          <div className="w-full max-w-md p-6 rounded-2xl bg-amber-950/30 border-2 border-dashed border-amber-500/60 text-center">
            <span className="text-amber-400 font-bold uppercase tracking-wider block mb-2">
              MARGIN (Outer transparent buffer pushing neighbors)
            </span>

            <div className="p-6 rounded-xl bg-purple-950/30 border-2 border-purple-500/60 text-center">
              <span className="text-purple-400 font-bold uppercase tracking-wider block mb-2">
                BORDER (The physical wall / frame)
              </span>

              <div className="p-6 rounded-lg bg-emerald-950/40 border-2 border-emerald-500/60 text-center">
                <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-2">
                  PADDING (Internal cushion between content and wall)
                </span>

                <div className="p-4 rounded bg-cyan-950/60 border border-cyan-400 text-center font-bold text-cyan-200">
                  CONTENT (The text, icon, or image itself)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 text-xs sm:text-sm text-amber-200">
          <strong>Pro Tip (`box-sizing: border-box`):</strong> By default in ancient CSS, adding padding made elements grow wider than their declared width. Modern web and React development universally uses <code>* &#123; box-sizing: border-box; &#125;</code>, meaning width always includes content + padding + border!
        </div>
      </section>

      {/* SECTION 3: Flexbox Mastery */}
      <section id="flexbox-mastery" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg">
          <Rows3 className="w-5 h-5" />
          <h2>3. Flexbox Mastery: The #1 React Layout Engine</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Before Flexbox was created, centering a button or putting two cards side-by-side required ugly hacks (floats, tables). Flexbox solved this forever with two simple concepts:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-[#0e1612]">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              1. The Main Axis (`justify-content`)
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              When <code>flex-direction: row</code>, the main axis is <strong>Horizontal</strong> (left to right). <code>justify-content</code> controls whether items pack at the start, center, end, or spread out with <code>space-between</code>.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-indigo-500/20 bg-[#121018]">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-2">
              2. The Cross Axis (`align-items`)
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              The cross axis runs perpendicular (vertical). <code>align-items: center</code> creates the holy grail of web design: <strong>effortless vertical centering</strong>!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: Interactive Flexbox Lab */}
      <section id="flexbox-lab" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Sliders className="w-5 h-5" />
          <h2>4. Interactive Flexbox Axis Explorer</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Adjust the controls below to visually feel how <code>flex-direction</code>, <code>justify-content</code>, and <code>align-items</code> transform the container in real time:
        </p>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] shadow-2xl space-y-5">
          {/* Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <label className="text-gray-400 block mb-1">Direction:</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="row" className="bg-[#121218]">row (Horizontal)</option>
                <option value="column" className="bg-[#121218]">column (Vertical)</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">justify-content:</label>
              <select
                value={justify}
                onChange={(e) => setJustify(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="flex-start" className="bg-[#121218]">flex-start</option>
                <option value="center" className="bg-[#121218]">center</option>
                <option value="flex-end" className="bg-[#121218]">flex-end</option>
                <option value="space-between" className="bg-[#121218]">space-between</option>
                <option value="space-around" className="bg-[#121218]">space-around</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">align-items:</label>
              <select
                value={align}
                onChange={(e) => setAlign(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="center" className="bg-[#121218]">center</option>
                <option value="flex-start" className="bg-[#121218]">flex-start</option>
                <option value="flex-end" className="bg-[#121218]">flex-end</option>
                <option value="stretch" className="bg-[#121218]">stretch</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">gap: {gap}px</label>
              <input
                type="range"
                min="0"
                max="32"
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer mt-2"
              />
            </div>
          </div>

          {/* Interactive Playground Viewport */}
          <div
            className="p-6 rounded-xl border border-cyan-500/30 bg-[#14141e] min-h-[180px] transition-all"
            style={{
              display: "flex",
              flexDirection: direction,
              justifyContent: justify,
              alignItems: align,
              gap: `${gap}px`
            }}
          >
            <div className="px-4 py-3 rounded-xl bg-cyan-500 text-black font-bold font-mono text-xs shadow-lg shadow-cyan-500/20">
              Box 1
            </div>
            <div className="px-4 py-3 rounded-xl bg-indigo-500 text-white font-bold font-mono text-xs shadow-lg shadow-indigo-500/20">
              Box 2
            </div>
            <div className="px-4 py-3 rounded-xl bg-purple-500 text-white font-bold font-mono text-xs shadow-lg shadow-purple-500/20">
              Box 3
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/40 font-mono text-xs text-gray-400">
            <code>
              display: flex; flex-direction: {direction}; justify-content: {justify}; align-items: {align}; gap: {gap}px;
            </code>
          </div>
        </div>
      </section>

      {/* SECTION 5: Pseudo-classes */}
      <section id="pseudo-classes" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-purple-400 font-bold text-lg">
          <MousePointer className="w-5 h-5" />
          <h2>5. Pseudo-Classes & Interactive States</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Interfaces are tactile. Pseudo-classes style elements according to user interactions without writing extra JavaScript:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono my-6">
          <div className="p-3 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="text-cyan-400 font-bold block mb-1">:hover</span>
            <span className="text-gray-400">User's cursor moves over element</span>
          </div>
          <div className="p-3 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="text-amber-400 font-bold block mb-1">:active</span>
            <span className="text-gray-400">Moment user physically clicks down</span>
          </div>
          <div className="p-3 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="text-emerald-400 font-bold block mb-1">:focus</span>
            <span className="text-gray-400">Input selected or tabbed via keyboard</span>
          </div>
          <div className="p-3 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="text-rose-400 font-bold block mb-1">:disabled</span>
            <span className="text-gray-400">Button or input is turned off</span>
          </div>
        </div>
      </section>

      {/* SECTION 6: Connecting CSS to React */}
      <section id="css-in-react" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg">
          <Sparkles className="w-5 h-5" />
          <h2>6. Connecting CSS to React: className & Inline Styles</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In React, there are two primary ways to style components directly:
        </p>

        <CodeBlock
          filename="ReactStyling.jsx"
          language="jsx"
          code={`// Method 1: className (Most popular in Tailwind & CSS modules)
function Badge({ isPro }) {
  return (
    <span className={isPro ? "badge-pro" : "badge-free"}>
      PRO
    </span>
  );
}

// Method 2: Inline style object (Great for dynamic coordinates/colors)
function DynamicMeter({ percentage }) {
  return (
    <div 
      style={{ 
        width: \`\${percentage}%\`, 
        backgroundColor: percentage > 80 ? "emerald" : "cyan",
        height: 8,
        borderRadius: 4
      }} 
    />
  );
}`}
        />
      </section>

      {/* SECTION 7: Live Compiler Practice */}
      <section id="interactive-compiler" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
          <Terminal className="w-5 h-5" />
          <h2>7. Interactive Practice: Live CSS & Layout Compiler</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Practice building real-world layouts with live CSS and Flexbox below. Toggle between the HTML and CSS tabs, modify colors, alignments, and padding, and see the live result immediately:
        </p>

        <CodeCompiler
          mode="html"
          title="CSS & Flexbox Practice Sandbox"
          description="Edit HTML and CSS rules. Test Flexbox centering, gap, padding, and pseudo-classes live."
          initialCode={cssPresets[0].code}
          initialCss={cssPresets[0].css}
          presets={cssPresets}
        />
      </section>

      {/* SECTION 8: Knowledge Check */}
      <section id="knowledge-check" className="scroll-mt-24">
        <KnowledgeCheck questions={quizQuestions} />
      </section>
    </GuideLayout>
  );
}
