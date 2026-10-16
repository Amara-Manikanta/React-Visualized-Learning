import React, { useState } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import {
  Box,
  Code,
  Network,
  Eye,
  CheckCircle2,
  Heart,
  MessageCircle,
  Share2
} from "lucide-react";

export const SEARCH_KEYWORDS = [
  "What is a component",
  "React components",
  "LEGO brick analogy",
  "Component tree",
  "Parent child relationship",
  "Reusable UI",
  "Thinking in React",
  "Zero UI knowledge",
  "Functional component"
];

const toc = [
  { label: "1. The LEGO Brick Philosophy: Why We Don't Build Monoliths", hash: "lego-analogy" },
  { label: "2. Anatomy of a Component: A Function That Returns UI", hash: "anatomy" },
  { label: "3. Interactive Laboratory: Component Deconstructor", hash: "interactive-lab" },
  { label: "4. The Component Tree: Parents, Children, and Siblings", hash: "hierarchy" },
  { label: "5. Thinking in Components: Deconstructing Real UIs", hash: "composition" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "At its core in modern React, what actually is a 'Component'?",
    options: [
      "A regular JavaScript function that accepts inputs (props) and returns a blueprint of what should appear on screen (JSX).",
      "A special CSS file stored in the browser's cookies.",
      "A physical hardware chip on the user's graphics card.",
      "A database table containing server records."
    ],
    answer: 0,
    why: "In modern React, a component is simply a JavaScript function. When React calls this function, it returns JSX (a tree of UI elements). You can reuse this function hundreds of times across your application."
  },
  {
    q: "Why is the LEGO brick analogy so fitting for React component architecture?",
    options: [
      "Because instead of building an entire screen as one giant, fragile HTML document, you build small, isolated, reusable pieces (buttons, cards, headers) and assemble them together.",
      "Because React requires all UI elements to have sharp 90-degree corners.",
      "Because React only works for toy and gaming websites.",
      "Because components can never be modified after they are created."
    ],
    answer: 0,
    why: "Just like LEGO bricks, components are modular, self-contained, and interchangeable. If your 'Button' needs a new hover animation, you update it once in the Button component, and every screen using that button automatically benefits."
  },
  {
    q: "What rule must all custom React component names follow in JavaScript/JSX?",
    options: [
      "They MUST start with a Capital letter (e.g., <ProfileCard />, not <profileCard />).",
      "They must always end with the suffix 'Component'.",
      "They must be written entirely in uppercase letters (e.g., <BUTTON />).",
      "They must contain at least three numbers."
    ],
    answer: 0,
    why: "React uses capitalization to distinguish native HTML tags (like <div>, <button>, <span>) from your custom React components (like <UserCard />, <Navbar />). If you start a component with a lowercase letter, React treats it as a non-existent standard HTML tag!"
  }
];

export default function WhatIsAComponent() {
  const [activeComponent, setActiveComponent] = useState("card");
  const [likes, setLikes] = useState(128);
  const [hasLiked, setHasLiked] = useState(false);

  const componentSnippets = {
    card: {
      title: "<PostCard /> (Parent Container)",
      role: "The master container assembling all pieces into a coherent visual card.",
      code: `function PostCard() {
  return (
    <article className="post-card">
      <AuthorHeader />
      <PostBody />
      <ActionToolbar />
    </article>
  );
}`
    },
    header: {
      title: "<AuthorHeader />",
      role: "Displays creator credentials, combining the Avatar image and Verified Badge.",
      code: `function AuthorHeader() {
  return (
    <div className="author-header">
      <Avatar />
      <div>
        <h4>Dan Abramov</h4>
        <VerifiedBadge />
      </div>
    </div>
  );
}`
    },
    avatar: {
      title: "<Avatar />",
      role: "Self-contained circular image thumbnail with fallback ring.",
      code: `function Avatar() {
  return (
    <img 
      src="/dan.jpg" 
      alt="User" 
      className="w-10 h-10 rounded-full border border-cyan-400" 
    />
  );
}`
    },
    badge: {
      title: "<VerifiedBadge />",
      role: "Reusable icon indicator confirming identity authenticity.",
      code: `function VerifiedBadge() {
  return (
    <span className="badge text-cyan-400">
      ✓ Verified Dev
    </span>
  );
}`
    },
    body: {
      title: "<PostBody />",
      role: "Renders the actual content text and associated hashtag tags.",
      code: `function PostBody() {
  return (
    <p className="post-text">
      UI is just data projected through components! 🚀 #React19
    </p>
  );
}`
    },
    actions: {
      title: "<ActionToolbar />",
      role: "Encapsulates engagement buttons (Like, Comment, Share) and their click events.",
      code: `function ActionToolbar() {
  return (
    <div className="flex gap-4">
      <LikeButton />
      <CommentButton />
      <ShareButton />
    </div>
  );
}`
    }
  };

  return (
    <GuideLayout
      title="0.2 What is a Component? The LEGO Mental Model"
      intro="How React breaks giant, fragile web pages into small, reusable, isolated building blocks that snap together like LEGO bricks."
      badge="Mental Model"
      toc={toc}
    >
      {/* SECTION 1: The LEGO Brick Philosophy */}
      <section id="lego-analogy" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg">
          <Box className="w-5 h-5" />
          <h2>1. The LEGO Brick Philosophy: Why We Don't Build Monoliths</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Imagine you want to build a model car out of plastic. You have two options:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-rose-500/20 bg-[#161214] shadow-xl">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-2">
              Option A: The Monolith (Carved from One Solid Block)
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              You carve the entire car out of one solid block of stone. If one wheel breaks, you must throw away the entire car and start over. You cannot reuse that wheel on another car.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-[#0e1612] shadow-xl">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              Option B: The LEGO Set (Modular Components)
            </span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              You build the car from interchangeable bricks: 4 wheels, 2 doors, 1 windshield. If a wheel breaks, you swap that one brick. You can use those exact same wheels to build an airplane or a truck tomorrow!
            </p>
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          This is exactly why React was created. Instead of writing a single 5,000-line HTML file, you build an application out of <strong>small, independent, reusable components</strong>.
        </p>
      </section>

      {/* SECTION 2: Anatomy of a Component */}
      <section id="anatomy" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Code className="w-5 h-5" />
          <h2>2. Anatomy of a Component: A Function That Returns UI</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          What does a React component actually look like in real code? It is shockingly simple: <strong>it is just a JavaScript function that returns markup (JSX)</strong>.
        </p>

        <CodeBlock
          filename="Greeting.jsx"
          language="jsx"
          code={`// 1. Must start with a CAPITAL letter: Greeting, not greeting
export default function Greeting() {
  // 2. You can write regular JavaScript here (math, logic, variables)
  const user = "Alex";
  const currentTime = new Date().toLocaleTimeString();

  // 3. Return the UI blueprint (JSX)
  return (
    <div className="welcome-banner">
      <h2>Hello, {user}!</h2>
      <p>Current session began at: {currentTime}</p>
      <button className="primary-btn">Start Exploring</button>
    </div>
  );
}`}
        />

        <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-xs sm:text-sm text-cyan-200">
          <strong>The Golden Rule of Component Naming:</strong> Always start your component function with an uppercase letter (<code>function UserCard()</code>). If you write <code>function userCard()</code> with lowercase, React thinks it is a native browser tag and will fail to mount it!
        </div>
      </section>

      {/* SECTION 3: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
          <Eye className="w-5 h-5" />
          <h2>3. Interactive Laboratory: Component Deconstructor</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Click on any part of the social media card below to "deconstruct" it into its atomic component. See how each individual brick has its own isolated responsibility.
        </p>

        {/* Simulator Box */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] shadow-2xl space-y-6">
          {/* Component Selection Pills */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-mono font-bold text-gray-400 mr-2">Highlight:</span>
            {[
              { id: "card", label: "<PostCard /> (Full Container)" },
              { id: "header", label: "<AuthorHeader />" },
              { id: "avatar", label: "<Avatar />" },
              { id: "badge", label: "<VerifiedBadge />" },
              { id: "body", label: "<PostBody />" },
              { id: "actions", label: "<ActionToolbar />" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActiveComponent(btn.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeComponent === btn.id
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 scale-105"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Visual Card */}
            <div className="p-6 rounded-xl border border-white/10 bg-[#16161f] flex flex-col items-center justify-center min-h-[300px]">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-4">
                Interactive Rendered Output
              </span>

              {/* The Post Card */}
              <div
                onClick={() => setActiveComponent("card")}
                className={`max-w-sm w-full p-5 rounded-2xl bg-[#0e0e14] transition-all cursor-pointer ${
                  activeComponent === "card"
                    ? "ring-2 ring-cyan-400 shadow-2xl shadow-cyan-500/20"
                    : "border border-white/10 hover:border-white/20"
                }`}
              >
                {/* Author Header */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveComponent("header");
                  }}
                  className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                    activeComponent === "header"
                      ? "ring-2 ring-indigo-400 bg-indigo-950/20"
                      : "hover:bg-white/5"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveComponent("avatar");
                    }}
                    className={`w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md transition-all ${
                      activeComponent === "avatar"
                        ? "ring-2 ring-emerald-400 scale-110"
                        : ""
                    }`}
                  >
                    DA
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">Dan Abramov</h4>
                      {/* Verified Badge */}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveComponent("badge");
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                          activeComponent === "badge"
                            ? "ring-2 ring-amber-400 bg-amber-500/30 text-amber-300"
                            : "bg-cyan-500/20 text-cyan-300"
                        }`}
                      >
                        ✓ Core Team
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">@dan_abramov • 2h ago</span>
                  </div>
                </div>

                {/* Post Body */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveComponent("body");
                  }}
                  className={`my-3 p-3 rounded-xl transition-all ${
                    activeComponent === "body"
                      ? "ring-2 ring-purple-400 bg-purple-950/20"
                      : "hover:bg-white/5"
                  }`}
                >
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    Components are the heart of React! Break your UI down until every piece does exactly one thing well. 🧱✨
                  </p>
                  <span className="text-[11px] font-mono text-cyan-400 mt-2 block">
                    #ReactInternals #WebDev
                  </span>
                </div>

                {/* Action Toolbar */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveComponent("actions");
                  }}
                  className={`flex items-center justify-between pt-3 border-t border-white/10 px-2 transition-all ${
                    activeComponent === "actions"
                      ? "ring-2 ring-rose-400 bg-rose-950/20 rounded-xl"
                      : ""
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHasLiked(!hasLiked);
                      setLikes((c) => (hasLiked ? c - 1 : c + 1));
                    }}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                      hasLiked ? "text-rose-400" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? "fill-rose-400" : ""}`} />
                    <span>{likes}</span>
                  </button>

                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <MessageCircle className="w-4 h-4" />
                    <span>24</span>
                  </button>

                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Code Inspection */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-white/10 bg-[#09090d]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-400 font-mono">
                    {componentSnippets[activeComponent].title}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Inspected Component</span>
                </div>
                <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                  {componentSnippets[activeComponent].role}
                </p>
                <pre className="p-3 rounded-lg bg-[#111116] border border-white/5 text-xs font-mono text-cyan-200 overflow-x-auto">
                  <code>{componentSnippets[activeComponent].code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: The Component Tree */}
      <section id="hierarchy" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-lg">
          <Network className="w-5 h-5" />
          <h2>4. The Component Tree: Parents, Children, and Siblings</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Just like a family genealogy tree, React components form a parent-child hierarchy:
        </p>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] my-6 font-mono text-xs sm:text-sm">
          <div className="text-xs text-indigo-400 font-bold uppercase mb-4">
            Component Hierarchy Map
          </div>
          <div className="space-y-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              📁 &lt;App&gt; (Root Parent)
            </div>
            <div className="pl-6 space-y-2 border-l-2 border-white/10 ml-4">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                ├─ 📁 &lt;PostCard&gt; (Child of App)
              </div>
              <div className="pl-6 space-y-2 border-l-2 border-white/10 ml-4">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  ├─ 📄 &lt;AuthorHeader&gt; (Child of PostCard)
                </div>
                <div className="pl-6 space-y-1 border-l-2 border-white/10 ml-4 text-[11px]">
                  <div className="text-gray-400">├─ &lt;Avatar /&gt; (Leaf Node)</div>
                  <div className="text-gray-400">└─ &lt;VerifiedBadge /&gt; (Leaf Node)</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  ├─ 📄 &lt;PostBody /&gt; (Sibling of AuthorHeader)
                </div>
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  └─ 📄 &lt;ActionToolbar /&gt; (Sibling of AuthorHeader)
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Understanding this hierarchy is vital because in React:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
          <li><strong>Parents</strong> pass information down to their <strong>Children</strong> via <em>Props</em>.</li>
          <li>When a <strong>Parent</strong> updates, its <strong>Children</strong> re-render automatically.</li>
        </ul>
      </section>

      {/* SECTION 5: Thinking in Components */}
      <section id="composition" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Thinking in Components: Deconstructing Real UIs</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          When experienced React developers look at any app (Netflix, Spotify, Uber, Airbnb), they don't see colors and shapes. They see a puzzle of components!
        </p>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Here is the step-by-step mental exercise to use whenever you are asked to build a new feature:
        </p>

        <div className="space-y-4 my-6">
          <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Draw Boxes Around Every Distinct Piece</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Take a screenshot of the design. Draw boxes around the navigation bar, search input, item card, thumbnail, and buttons.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Single Responsibility Principle</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Each component should ideally do just ONE thing. If a component grows too big or has too many jobs, break it into smaller sub-components.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-[#16161f]">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Identify Reusability</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Will this button or card appear in more than one place? If yes, build it as a reusable component that accepts customizable data (Props)!
              </p>
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
