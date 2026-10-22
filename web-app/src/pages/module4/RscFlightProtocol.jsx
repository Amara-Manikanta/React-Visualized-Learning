import React from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Server, Layers, Zap, CheckCircle2, Split } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "RSC",
  "React Server Components",
  "Flight Protocol",
  "Zero Bundle Size",
  "Server vs Client Components",
  "Streaming Wire Format",
  "use client"
];

const toc = [
  { label: "1. The Intuition: The Zero-Bundle-Size Dream", hash: "intuition" },
  { label: "2. Server Components vs Client Components", hash: "server-vs-client" },
  { label: "3. The Flight Wire Protocol Unmasked", hash: "flight-protocol" },
  { label: "4. Interactive Lab: Inspecting Flight Stream Chunks", hash: "interactive-lab" },
  { label: "5. Production Architecture: The 'use client' Boundary", hash: "use-client-boundary" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why do React Server Components (RSC) add ZERO kilobytes to the client JavaScript bundle size?",
    options: [
      "Because Server Components execute exclusively on the server at request time; their code, dependencies (like heavy markdown or date libraries), and database drivers are never sent to the browser. Only the rendered JSON Flight representation is sent.",
      "Because the browser compresses JavaScript files with Brotli.",
      "Because Server Components are compiled into CSS files.",
      "Because Server Components only render on mobile devices."
    ],
    answer: 0,
    why: "Unlike traditional client components, Server Components never leave the server. If a Server Component imports a 300KB markdown parsing library, that 300KB library stays on the server. The client receives only the serialized Flight stream containing the resulting HTML tags and client component slots."
  },
  {
    q: "What does the 'use client' directive at the top of a file actually mean in the RSC architecture?",
    options: [
      "It marks a boundary line between the server module graph and the client bundle; any component declared under 'use client' can use state, effects, and browser event listeners.",
      "It instructs the server to execute the component using WebAssembly.",
      "It makes the component offline-only.",
      "It forces the component to render on every single keystroke."
    ],
    answer: 0,
    why: "'use client' is not a statement that the component ONLY runs on the client (client components still pre-render to HTML on the server during SSR). Rather, it defines an entry point for the browser's JavaScript bundle, enabling useState, useEffect, and event listeners (onClick)."
  }
];

export default function RscFlightProtocol() {
  return (
    <GuideLayout
      title="React Server Components & Flight Wire Protocol"
      intro="Decode the inner mechanics of RSC: understand the Flight wire protocol, explore zero-bundle streaming, and master the 'use client' boundary."
      badge="Modern React 19 Architecture"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Server className="w-5 h-5" />
          <h2>1. The Intuition: The Zero-Bundle-Size Dream</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          For years, developers faced a brutal tradeoff: if you wanted rich interactive React apps, your users had to download 2MB of JavaScript bundles before seeing the page.
        </p>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            The RSC Revolution
          </span>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed m-0">
            React Server Components split the component graph into two worlds. The server executes heavy database queries, reads files, and parses markdown with zero client bundle cost. The browser only downloads the tiny interactive leaves (buttons, inputs) marked with <code>'use client'</code>.
          </p>
        </div>
      </section>

      {/* SECTION 2: Server vs Client */}
      <section id="server-vs-client" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Split className="w-5 h-5" />
          <h2>2. Server Components vs Client Components</h2>
        </div>

        <div className="overflow-x-auto custom-scrollbar my-6">
          <table className="w-full text-left text-xs sm:text-sm border-collapse rounded-xl overflow-hidden border border-white/10 bg-[#111116]">
            <thead>
              <tr className="border-b border-white/10 bg-[#16161f] text-gray-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-4">Capability</th>
                <th className="p-4 text-cyan-300">Server Component (Default)</th>
                <th className="p-4 text-indigo-300">Client Component ('use client')</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-light">
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-white font-mono text-xs">Direct Database Access</td>
                <td className="p-4 text-emerald-400">Yes (<code>await db.query()</code>)</td>
                <td className="p-4 text-rose-400">No (Security risk, no DB drivers)</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-white font-mono text-xs">Client Bundle Size</td>
                <td className="p-4 text-emerald-400 font-bold">0 KB added</td>
                <td className="p-4 text-gray-300">Bundled and shipped to browser</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-white font-mono text-xs">useState & useEffect</td>
                <td className="p-4 text-rose-400">No (Static snapshot on server)</td>
                <td className="p-4 text-emerald-400">Yes (Full interactive lifecycle)</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-white font-mono text-xs">Event Handlers (onClick)</td>
                <td className="p-4 text-rose-400">No (Functions cannot be serialized)</td>
                <td className="p-4 text-emerald-400">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: Flight Protocol */}
      <section id="flight-protocol" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>3. The Flight Wire Protocol Unmasked</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          How does the server communicate the rendered UI to the client without sending plain HTML? It uses the <strong>React Flight Protocol</strong> — a streaming, line-delimited JSON format:
        </p>

        <CodeBlock
          filename="rsc-flight-stream.txt"
          language="text"
          code={`1:I{"id":"./src/LikeButton.tsx","chunks":["client1"],"name":"default"}
2:{"title":"React Visualized","author":"Manikanta"}
M3:{"id":"db-post-99","likes":42}
J0:["$","div",null,{"className":"post","children":[["$","h1",null,{"children":"React Visualized"}],["$","$L1",null,{"initialLikes":42}]]}]`}
        />

        <div className="p-4 rounded-xl border border-white/10 bg-[#09090d] text-xs font-mono text-gray-300 space-y-1 my-4">
          <div><code>$</code> = React Virtual Element (<code>React.createElement</code>)</div>
          <div><code>$L1</code> = Reference to Client Component module ID <code>1</code> (<code>LikeButton</code>)</div>
          <div><code>M3</code> = Model chunk streamed from database query</div>
        </div>
      </section>

      {/* SECTION 4: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Zap className="w-5 h-5" />
          <h2>4. Interactive Lab: Inspecting Flight Stream Chunks</h2>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6">
          <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
            Simulated Wire Stream Decoder
          </span>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#09090d] border border-cyan-500/30 text-cyan-300">
              Chunk 1 (Fast Shell): &lt;Navbar&gt; + Static Sidebar (Streamed in 12ms)
            </div>
            <div className="p-3 rounded-lg bg-[#09090d] border border-amber-500/30 text-amber-300">
              Chunk 2 (Database Query): User Profile + Followers List (Streamed in 65ms)
            </div>
            <div className="p-3 rounded-lg bg-[#09090d] border border-emerald-500/30 text-emerald-300">
              Chunk 3 (Suspense Resolved): Recommended Articles Feed (Streamed in 140ms)
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: use client */}
      <section id="use-client-boundary" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Architecture: The 'use client' Boundary</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300">
          <ul className="space-y-1.5 list-disc list-inside text-gray-400">
            <li>Place <code>'use client'</code> at the leaf nodes of your tree (buttons, toggles, forms), not at the root page.</li>
            <li>Pass Server Components into Client Components as <code>children</code> props to keep them running on the server.</li>
            <li>Never import server-only code (database secrets, private API keys) into files with 'use client'.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
