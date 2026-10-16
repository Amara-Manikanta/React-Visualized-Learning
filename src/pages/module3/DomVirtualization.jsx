import React, { useState } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Rows, Layers, Zap, CheckCircle2 } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "DOM Virtualization",
  "List Windowing",
  "react-window",
  "Overscan",
  "Scroll Offset",
  "Virtualizer",
  "100K items"
];

const toc = [
  { label: "1. The Intuition: The Index Card Window", hash: "intuition" },
  { label: "2. The Mathematical Model of Windowing", hash: "math-model" },
  { label: "3. Interactive Lab: 10,000 Row Virtual Window Simulator", hash: "interactive-lab" },
  { label: "4. Overscan & Scroll Jitter Prevention", hash: "overscan" },
  { label: "5. Production Implementation with react-window", hash: "production-code" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why does rendering 50,000 standard DOM nodes freeze the browser, whereas virtualizing them keeps the app at 60fps?",
    options: [
      "Virtualization only mounts the 15-20 DOM nodes currently visible inside the viewport bounding box plus a small overscan buffer, keeping DOM node count constant regardless of list size.",
      "Virtualization compresses the HTML into a binary stream.",
      "Virtualization forces the browser to run on the GPU.",
      "Virtualization skips rendering CSS styles."
    ],
    answer: 0,
    why: "The browser's style calculation, layout reflow, and paint algorithms degrade exponentially with tens of thousands of real DOM nodes. Virtual windowing calculates the total scroll height mathematically (totalCount * itemHeight), but only creates and mounts the tiny slice of DOM nodes visible in the current viewport."
  },
  {
    q: "What is the purpose of the 'overscan' buffer in a virtualized list?",
    options: [
      "It renders a small number of items immediately above and below the visible viewport to prevent empty white flashes during rapid user scrolling.",
      "It stores previous search queries in memory.",
      "It pre-downloads images from the CDN.",
      "It translates text into the user's preferred language."
    ],
    answer: 0,
    why: "If a virtual list strictly rendered only nodes currently within the viewport boundary, fast scrolling would reveal empty white space before the next render cycle could mount the new nodes. An overscan buffer renders e.g. 5 extra items above and below to absorb scroll inertia."
  }
];

export default function DomVirtualization() {
  const [scrollTop, setScrollTop] = useState(0);
  const totalItems = 10000;
  const itemHeight = 40;
  const viewportHeight = 240;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
  const endIndex = Math.min(totalItems - 1, Math.floor((scrollTop + viewportHeight) / itemHeight) + 2);
  const visibleItems = [];

  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      top: i * itemHeight,
    });
  }

  return (
    <GuideLayout
      title="DOM Virtualization Visualized"
      intro="Learn how list windowing renders 100,000+ items at a steady 60fps by recycling a fixed pool of DOM nodes using pure geometry."
      badge="High Scale Optimization"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Rows className="w-5 h-5" />
          <h2>1. The Intuition: The Index Card Window</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Imagine a phone book containing 100,000 phone numbers. If you unrolled the paper so all 100,000 numbers lay on the floor at once, it would span several miles and collapse under its own weight. Instead, you hold a magnifying glass over a single page, seeing only 20 numbers at a time as you slide the glass down. That is <strong>DOM Virtualization</strong>.
        </p>
      </section>

      {/* SECTION 2: Math Model */}
      <section id="math-model" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>2. The Mathematical Model of Windowing</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] font-mono text-xs sm:text-sm text-gray-300 space-y-2 my-4">
          <div>totalHeight = totalCount * itemHeight // e.g. 100,000 * 40px = 4,000,000px</div>
          <div>startIndex = Math.floor(scrollTop / itemHeight)</div>
          <div>visibleCount = Math.ceil(viewportHeight / itemHeight)</div>
          <div>endIndex = startIndex + visibleCount</div>
        </div>
      </section>

      {/* SECTION 3: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Zap className="w-5 h-5" />
          <h2>3. Interactive Lab: 10,000 Row Virtual Window Simulator</h2>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Virtual List (Total: 10,000 Rows)
              </span>
              <p className="text-xs text-gray-400">Scroll the container below. Notice the DOM node count remains constant (~8-10 items)!</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-cyan-300">
              <span>Rendered DOM Nodes: {visibleItems.length}</span>
              <span className="text-gray-500">|</span>
              <span>Showing: #{startIndex} to #{endIndex}</span>
            </div>
          </div>

          <div
            onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
            style={{ height: `${viewportHeight}px` }}
            className="border border-white/10 rounded-xl bg-[#09090d] overflow-y-auto relative custom-scrollbar"
          >
            {/* Phantom Height Spacer */}
            <div style={{ height: `${totalItems * itemHeight}px`, width: "100%", position: "relative" }}>
              {/* Only Render Visible Slices */}
              {visibleItems.map((item) => (
                <div
                  key={item.index}
                  style={{
                    position: "absolute",
                    top: `${item.top}px`,
                    left: 0,
                    right: 0,
                    height: `${itemHeight}px`,
                  }}
                  className="px-4 flex items-center justify-between border-b border-white/5 hover:bg-white/[0.04] text-xs font-mono text-gray-300"
                >
                  <span className="font-semibold text-white">Item #{item.index}</span>
                  <span className="text-[10px] text-cyan-400">UUID: {Math.sin(item.index).toString(36).substring(7)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Overscan */}
      <section id="overscan" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>4. Overscan & Scroll Jitter Prevention</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Always include an <code>overscanCount</code> (typically 3 to 5 items). This pre-renders a small cushion just above and below the screen, eliminating visual flicker when scrolling at high velocity.
        </p>
      </section>

      {/* SECTION 5: Production Code */}
      <section id="production-code" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Implementation with react-window</h2>
        </div>

        <CodeBlock
          filename="VirtualizedTable.tsx"
          language="typescript"
          code={`import { FixedSizeList as List } from 'react-window';

const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
  <div style={style} className="row-item">
    Row #{index}
  </div>
);

export function VirtualizedList({ items }: { items: string[] }) {
  return (
    <List
      height={500}
      itemCount={items.length}
      itemSize={45}
      width="100%"
      overscanCount={5}
    >
      {Row}
    </List>
  );
}`}
        />
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
