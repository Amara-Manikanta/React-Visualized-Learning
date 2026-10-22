import React, { useState } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import CodeCompiler from "../../components/interactive/CodeCompiler";
import {
  Layout,
  FileCode,
  Terminal,
  CheckCircle2,
  TreeDeciduous,
  FormInput
} from "lucide-react";

export const SEARCH_KEYWORDS = [
  "HTML essentials",
  "HTML basics",
  "HTML for React",
  "Semantic HTML",
  "HTML tags",
  "HTML attributes",
  "HTML forms and inputs",
  "Document structure",
  "HTML practice compiler",
  "Zero UI knowledge"
];

const toc = [
  { label: "1. The Skeleton of the Web: What is HTML?", hash: "what-is-html" },
  { label: "2. Anatomy of a Tag: Elements & Attributes", hash: "anatomy-of-tag" },
  { label: "3. Semantic HTML vs 'Div Soup'", hash: "semantic-html" },
  { label: "4. Forms, Inputs & User Controls", hash: "forms-and-inputs" },
  { label: "5. The Document Tree Hierarchy", hash: "tree-hierarchy" },
  { label: "6. Interactive Practice: Live HTML Compiler", hash: "interactive-compiler" },
  { label: "7. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why do professional web and React developers prefer semantic tags (<article>, <nav>, <header>) over generic <div> tags?",
    options: [
      "Semantic tags convey clear meaning to screen readers, accessibility tools, and search engines, and create a maintainable document structure that maps cleanly to React components.",
      "Generic <div> tags use 50 times more memory in the browser engine.",
      "Modern browsers have deprecated the <div> tag entirely.",
      "Semantic tags are required to run JavaScript in React."
    ],
    answer: 0,
    why: "Semantic tags describe the purpose of the content. A screen reader knows that <nav> contains navigation links and <button> is interactive. Writing endless nested <div> tags ('div soup') hurts accessibility, SEO, and developer readability."
  },
  {
    q: "What is the key difference between an HTML tag and an HTML element?",
    options: [
      "A tag is the syntax marker (like <p> or </p>), while an element includes the opening tag, the closing tag, and all content nested between them.",
      "A tag is written in JavaScript while an element is written in CSS.",
      "A tag only exists on mobile devices.",
      "Elements are always invisible to the user."
    ],
    answer: 0,
    why: "In HTML terminology, <p> is an opening tag and </p> is a closing tag. The entire structure <p>Hello world</p> is the paragraph element."
  },
  {
    q: "Why is the 'type' attribute on an <input> element so crucial?",
    options: [
      "It determines how the browser handles user input (e.g. text, password masking, checkbox toggle, email validation, or number stepper).",
      "It changes the font family of the entire operating system.",
      "It sends an encrypted ping to a remote server.",
      "It forces the browser to restart."
    ],
    answer: 0,
    why: "The 'type' attribute instructs the browser on what kind of input control to render and how to validate it (e.g. type='password' masks characters, type='checkbox' provides a binary toggle, type='email' validates email formats)."
  }
];

const practicePresets = [
  {
    name: "Semantic Article Card",
    code: `<article class="card">
  <header>
    <span class="badge">Tutorial</span>
    <h2>Understanding HTML for React</h2>
    <p class="meta">By Alex Morgan • 5 min read</p>
  </header>

  <p>HTML creates the foundational structure that React turns into dynamic components.</p>

  <footer>
    <button class="btn">Read Article</button>
  </footer>
</article>`,
    css: `.card {
  font-family: sans-serif;
  background: #111118;
  color: #e2e8f0;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #27273a;
  max-width: 380px;
}
.badge {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  font-size: 11px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: uppercase;
}
h2 {
  font-size: 18px;
  margin: 12px 0 4px 0;
  color: #ffffff;
}
.meta {
  font-size: 12px;
  color: #94a3b8;
  margin: 0 0 14px 0;
}
p {
  font-size: 14px;
  line-height: 1.6;
  color: #cbd5e1;
}
.btn {
  background: #f59e0b;
  color: #000;
  border: none;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}
.btn:hover {
  background: #d97706;
}`
  },
  {
    name: "User Feedback Form",
    code: `<form class="form-container">
  <h3>Send Us Feedback</h3>
  
  <label for="uname">Your Name</label>
  <input type="text" id="uname" placeholder="e.g. Jordan Smith" />

  <label for="uemail">Email Address</label>
  <input type="email" id="uemail" placeholder="name@company.com" />

  <label for="topic">Topic</label>
  <select id="topic">
    <option>General Inquiry</option>
    <option>Bug Report</option>
    <option>Feature Request</option>
  </select>

  <label for="msg">Message</label>
  <textarea id="msg" rows="3" placeholder="Tell us how we can help..."></textarea>

  <button type="button" class="submit-btn">Send Message</button>
</form>`,
    css: `.form-container {
  font-family: sans-serif;
  background: #0f172a;
  color: #f8fafc;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid #1e293b;
  max-width: 360px;
}
h3 { margin-top: 0; color: #38bdf8; }
label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 4px;
  color: #94a3b8;
}
input, select, textarea {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #ffffff;
  font-size: 13px;
  box-sizing: border-box;
}
.submit-btn {
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  background: #38bdf8;
  color: #0f172a;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}`
  },
  {
    name: "Pricing Feature Checklist",
    code: `<div class="pricing-card">
  <span class="plan-type">Pro Developer</span>
  <div class="price">$29 <span>/ month</span></div>

  <ul class="features">
    <li>✓ Unlimited React Labs</li>
    <li>✓ Full Fiber Tree Visualizer</li>
    <li>✓ Offline Electron App</li>
    <li>✓ Interactive Code Compilers</li>
  </ul>

  <button class="cta-btn">Upgrade Now</button>
</div>`,
    css: `.pricing-card {
  font-family: sans-serif;
  background: #181824;
  color: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #2d2d42;
  max-width: 340px;
  text-align: center;
}
.plan-type {
  font-size: 12px;
  text-transform: uppercase;
  color: #a855f7;
  font-weight: bold;
  letter-spacing: 1px;
}
.price {
  font-size: 32px;
  font-weight: 800;
  margin: 12px 0 16px 0;
}
.price span {
  font-size: 14px;
  font-weight: normal;
  color: #94a3b8;
}
.features {
  list-style: none;
  padding: 0;
  margin: 16px 0;
  text-align: left;
}
.features li {
  padding: 8px 0;
  font-size: 13px;
  color: #cbd5e1;
  border-bottom: 1px solid #272738;
}
.cta-btn {
  width: 100%;
  background: #a855f7;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
}`
  }
];

export default function HtmlEssentials() {
  const [selectedTag, setSelectedTag] = useState("header");

  const tagDetails = {
    header: {
      tag: "<header>",
      meaning: "Introductory container for a page or article (titles, logos, navigation).",
      example: "<header>\n  <h1>React Visualized</h1>\n</header>"
    },
    nav: {
      tag: "<nav>",
      meaning: "Contains navigation links for the site or section.",
      example: "<nav>\n  <a href='#home'>Home</a>\n  <a href='#about'>About</a>\n</nav>"
    },
    main: {
      tag: "<main>",
      meaning: "The dominant, unique central content of the document (excluding sidebars/headers).",
      example: "<main>\n  <article>Central post</article>\n</main>"
    },
    article: {
      tag: "<article>",
      meaning: "Self-contained composition that makes sense on its own (blog post, product card, comment).",
      example: "<article>\n  <h2>Post Title</h2>\n  <p>Content...</p>\n</article>"
    },
    button: {
      tag: "<button>",
      meaning: "An interactive clickable element that triggers JavaScript actions or form submission.",
      example: "<button type='button' onClick={handleClick}>\n  Click Me\n</button>"
    }
  };

  return (
    <GuideLayout
      title="P.1 HTML Essentials & The Element Tree"
      intro="Before React comes HTML: Master tags, elements, attributes, semantic architecture, and the DOM tree hierarchy with an interactive live HTML compiler."
      badge="HTML5 & DOM"
      toc={toc}
    >
      {/* SECTION 1: What is HTML */}
      <section id="what-is-html" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
          <Layout className="w-5 h-5" />
          <h2>1. The Skeleton of the Web: What is HTML?</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          If you have <strong>zero prior background in web development</strong>, think of a website as a human body:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-[#16130e] shadow-xl">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-2">
              1. HTML (The Skeleton)
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              The bones and framework. HTML tells the browser: <em>"Here is a headline, here is a button, here is a picture, here is an input field."</em>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-cyan-500/30 bg-[#0e1418] shadow-xl">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              2. CSS (The Skin & Clothes)
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              The visual styling. CSS defines colors, fonts, sizes, spacing, shadows, dark-mode themes, and layout positions.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-indigo-500/30 bg-[#121018] shadow-xl">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-2">
              3. JavaScript & React (The Nervous System)
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              The brain and muscles. JavaScript handles clicks, user typing, animations, server communication, and dynamic updates.
            </p>
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Every React component you will ever write ultimately returns <strong>JSX</strong>, which compiles into these exact same HTML elements. Understanding HTML means you will never guess what a React component is creating under the hood!
        </p>
      </section>

      {/* SECTION 2: Anatomy of a Tag */}
      <section id="anatomy-of-tag" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <FileCode className="w-5 h-5" />
          <h2>2. Anatomy of a Tag: Elements & Attributes</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          HTML is written using <strong>tags</strong> wrapped in angle brackets <code>&lt; &gt;</code>:
        </p>

        <CodeBlock
          filename="anatomy.html"
          language="html"
          code={`<!-- An HTML Element with an attribute and text content -->
<button class="primary-btn" id="save-btn" disabled>
  Save Changes
</button>
<!--
  ▲             ▲              ▲        ▲        ▲
  │             │              │        │        └── Content: Text displayed to user
  │             │              │        └─────────── Boolean Attribute: Disables button
  │             │              └──────────────────── Attribute: Unique ID
  │             └─────────────────────────────────── Attribute: CSS class for styling
  └───────────────────────────────────────────────── Opening Tag Name (<button>)
-->`}
        />

        <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-xs sm:text-sm text-cyan-200">
          <strong>Self-Closing Tags:</strong> Some elements cannot contain nested text or children (e.g. <code>&lt;img&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;hr&gt;</code>). In React JSX, these must always be closed with a slash: <code>&lt;img src="..." alt="..." /&gt;</code>.
        </div>
      </section>

      {/* SECTION 3: Semantic HTML */}
      <section id="semantic-html" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>3. Semantic HTML vs 'Div Soup'</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          A generic <code>&lt;div&gt;</code> is just an invisible, meaningless box. When beginners write web apps, they often wrap everything in dozens of divs:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-rose-500/20 bg-[#161214]">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-2">
              ❌ 'Div Soup' (Anti-pattern)
            </span>
            <pre className="text-xs font-mono text-rose-300 p-3 bg-black/40 rounded-lg overflow-x-auto">
              <code>{`<div class="header">
  <div class="nav-links">
    <div class="item">Home</div>
  </div>
</div>
<div class="content">
  <div class="post">...</div>
</div>`}</code>
            </pre>
            <p className="text-xs text-gray-400 mt-2">
              Screen readers and browsers have no idea what any of these boxes mean.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-[#0e1612]">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              ✓ Semantic HTML (Clean & Accessible)
            </span>
            <pre className="text-xs font-mono text-emerald-300 p-3 bg-black/40 rounded-lg overflow-x-auto">
              <code>{`<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <article>...</article>
</main>`}</code>
            </pre>
            <p className="text-xs text-gray-400 mt-2">
              Crystal clear structure that directly maps to React components: <code>&lt;Header&gt;</code>, <code>&lt;Navbar&gt;</code>, <code>&lt;Article&gt;</code>!
            </p>
          </div>
        </div>

        {/* Interactive Tag Inspector */}
        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-4">
          <span className="text-xs font-mono font-bold text-gray-400 uppercase block">
            Click to Inspect Core Semantic Elements:
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.keys(tagDetails).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedTag(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                  selectedTag === key
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-lg"
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                }`}
              >
                {tagDetails[key].tag}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#09090d] border border-white/5 font-mono text-xs space-y-2">
            <div className="text-amber-400 font-bold">{tagDetails[selectedTag].tag}</div>
            <div className="text-gray-300 font-sans text-xs">{tagDetails[selectedTag].meaning}</div>
            <pre className="p-2 rounded bg-white/5 text-cyan-300 text-[11px]">
              <code>{tagDetails[selectedTag].example}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* SECTION 4: Forms and Inputs */}
      <section id="forms-and-inputs" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-lg">
          <FormInput className="w-5 h-5" />
          <h2>4. Forms, Inputs & User Controls</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Interactive web apps survive on user input. In HTML, the <code>&lt;form&gt;</code> element bundles input controls together:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 text-xs">
          <div className="p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="font-bold text-cyan-400 font-mono block mb-1">&lt;input type="text"&gt;</span>
            <p className="text-gray-400">Single-line text for names, usernames, and search bars.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="font-bold text-cyan-400 font-mono block mb-1">&lt;input type="password"&gt;</span>
            <p className="text-gray-400">Masks typed characters with dots for secure authentication.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="font-bold text-emerald-400 font-mono block mb-1">&lt;input type="checkbox"&gt;</span>
            <p className="text-gray-400">Binary toggles for terms of service, remember me, or filters.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <span className="font-bold text-amber-400 font-mono block mb-1">&lt;select&gt; & &lt;option&gt;</span>
            <p className="text-gray-400">Dropdown menus offering choices from a pre-defined list.</p>
          </div>
        </div>
      </section>

      {/* SECTION 5: The Document Tree */}
      <section id="tree-hierarchy" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-purple-400 font-bold text-lg">
          <TreeDeciduous className="w-5 h-5" />
          <h2>5. The Document Tree Hierarchy</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          HTML elements nest inside one another like Russian nesting dolls. This nesting forms a <strong>Tree Data Structure</strong>:
        </p>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] font-mono text-xs space-y-2">
          <div className="text-purple-400 font-bold">&lt;html&gt; (Root Parent)</div>
          <div className="pl-6 border-l-2 border-white/10 space-y-2 ml-2">
            <div className="text-cyan-400 font-semibold">&lt;body&gt; (Child of html)</div>
            <div className="pl-6 border-l-2 border-white/10 space-y-2 ml-2">
              <div className="text-amber-400">&lt;main&gt; (Child of body)</div>
              <div className="pl-6 border-l-2 border-white/10 space-y-1 ml-2 text-gray-400">
                <div>&lt;h1&gt;Welcome&lt;/h1&gt; (Sibling 1)</div>
                <div>&lt;p&gt;Paragraph content&lt;/p&gt; (Sibling 2)</div>
                <div>&lt;button&gt;Get Started&lt;/button&gt; (Sibling 3)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Live Compiler Practice */}
      <section id="interactive-compiler" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
          <Terminal className="w-5 h-5" />
          <h2>6. Interactive Practice: Live HTML Compiler</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Practice writing and editing real HTML below. Try selecting different presets, modifying tags and attributes, and watching the browser viewport update live:
        </p>

        <CodeCompiler
          mode="html"
          title="HTML & DOM Live Practice Sandbox"
          description="Type HTML in the editor. Watch it render in real-time in the browser preview pane."
          initialCode={practicePresets[0].code}
          initialCss={practicePresets[0].css}
          presets={practicePresets}
        />
      </section>

      {/* SECTION 7: Knowledge Check */}
      <section id="knowledge-check" className="scroll-mt-24">
        <KnowledgeCheck questions={quizQuestions} />
      </section>
    </GuideLayout>
  );
}
