export const MODULES = [
  {
    id: "module-0",
    title: "Module 0: Zero to React — Foundations for Absolute Beginners",
    shortTitle: "0. Foundations (0 UI Knowledge)",
    color: "from-emerald-500 to-teal-600",
    badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
    topics: [
      {
        path: "/module-0/what-is-ui-and-dom",
        name: "0.1 What is a UI & What is the DOM?",
        desc: "The physical layers of the web (HTML/CSS/JS), the living DOM tree, and why manual DOM surgery fails.",
        badge: "First Principles"
      },
      {
        path: "/module-0/what-is-a-component",
        name: "0.2 What is a Component? The LEGO Mental Model",
        desc: "Breaking screens into independent, reusable building blocks and understanding component trees.",
        badge: "Mental Model"
      },
      {
        path: "/module-0/understanding-jsx",
        name: "0.3 Understanding JSX: HTML with Superpowers",
        desc: "Why JSX is not HTML, how curly braces {} open JavaScript portals, and what JSX compiles into.",
        badge: "Syntax & Engine"
      },
      {
        path: "/module-0/props-passing-data",
        name: "0.4 Props: Passing Data to Components",
        desc: "Function arguments for UI, one-way data flow waterfalls, destructuring, and the children prop.",
        badge: "Data Flow"
      },
      {
        path: "/module-0/state-and-usestate",
        name: "0.5 State & useState: Giving Memory to Components",
        desc: "Why regular JS variables don't update the screen, how useState works, and the re-render loop.",
        badge: "Reactivity"
      },
      {
        path: "/module-0/handling-events-and-forms",
        name: "0.6 Handling User Events & Interactive Forms",
        desc: "The doorbell event model, onClick, controlled input single sources of truth, and preventDefault.",
        badge: "Interactivity"
      },
      {
        path: "/module-0/conditional-rendering-and-lists",
        name: "0.7 Conditional Rendering & Lists with Keys",
        desc: "Ternary & && operators, transforming data with .map(), and the luggage-tag key mystery solved.",
        badge: "Dynamic UI"
      }
    ]
  },
  {
    id: "module-1",
    title: "Module 1: The Core Mental Model & The Fiber Engine",
    shortTitle: "1. Mental Model & Fiber",
    color: "from-cyan-500 to-blue-600",
    badgeColor: "text-cyan-400 bg-cyan-950/40 border-cyan-500/30",
    topics: [
      {
        path: "/module-1/ui-as-function-of-state",
        name: "1.1 UI = f(state) & Declarative DOM",
        desc: "Why React shifts from imperative DOM surgery to pure state transformations.",
        badge: "Mental Model"
      },
      {
        path: "/module-1/vdom-vs-real-dom",
        name: "1.2 Virtual DOM vs Real DOM",
        desc: "Batching, layout thrashing prevention, synthetic events, and diffing heuristics.",
        badge: "Architecture"
      },
      {
        path: "/module-1/fiber-reconciler",
        name: "1.3 The Fiber Reconciler & Double-Buffering",
        desc: "Current Tree vs WorkInProgress Tree, unit-of-work traversal, child/sibling/return pointers.",
        badge: "Flagship Deep Dive",
        isFlagship: true
      },
      {
        path: "/module-1/render-and-commit",
        name: "1.4 The Render & Commit Pipeline",
        desc: "Render/Diffing phase vs Commit mutation, layout effects, and passive effects.",
        badge: "Execution"
      }
    ]
  },
  {
    id: "module-2",
    title: "Module 2: The Complete Hooks Deep Dive",
    shortTitle: "2. Hooks Internals",
    color: "from-indigo-500 to-purple-600",
    badgeColor: "text-indigo-400 bg-indigo-950/40 border-indigo-500/30",
    topics: [
      {
        path: "/module-2/use-state-batching",
        name: "2.1 useState & The Dispatch Queue",
        desc: "Snapshots, circular update queues, and the Stale Closure trap visualized.",
        badge: "State"
      },
      {
        path: "/module-2/use-effect-lifecycle",
        name: "2.2 useEffect Lifecycle & Timing",
        desc: "Mount, update, unmount, cleanup execution order relative to browser paint.",
        badge: "Effects"
      },
      {
        path: "/module-2/use-ref",
        name: "2.3 useRef: Escaping React's Reactive Cycle",
        desc: "DOM access vs mutable persistent memory box that bypasses re-renders.",
        badge: "Refs"
      },
      {
        path: "/module-2/use-memo-callback",
        name: "2.4 useMemo & useCallback",
        desc: "Referential equality, cache invalidation, and memoization anti-patterns.",
        badge: "Optimization"
      },
      {
        path: "/module-2/custom-hooks",
        name: "2.5 Custom Hooks Architecture",
        desc: "Extracting reusable stateful logic vs pure utility functions.",
        badge: "Design"
      }
    ]
  },
  {
    id: "module-3",
    title: "Module 3: Rendering & Performance Engineering",
    shortTitle: "3. Rendering & Perf",
    color: "from-amber-500 to-orange-600",
    badgeColor: "text-amber-400 bg-amber-950/40 border-amber-500/30",
    topics: [
      {
        path: "/module-3/why-components-rerender",
        name: "3.1 Why Components Re-render",
        desc: "Root causes: state triggers, parent renders, context changes, and prop mutations.",
        badge: "Core"
      },
      {
        path: "/module-3/render-cascades-memo",
        name: "3.2 Re-render Cascades & React.memo",
        desc: "Interactive component tree heatmap and skipping render subtrees.",
        badge: "Profiling"
      },
      {
        path: "/module-3/composition-patterns",
        name: "3.3 Component Composition Patterns",
        desc: "Lifting state up, children-as-props, and compound components.",
        badge: "Patterns"
      },
      {
        path: "/module-3/dom-virtualization",
        name: "3.4 DOM Virtualization",
        desc: "Windowing 100K+ list rows with dynamic heights and zero layout lag.",
        badge: "High Scale"
      }
    ]
  },
  {
    id: "module-4",
    title: "Module 4: Concurrent React & React 19 Modern Architecture",
    shortTitle: "4. Concurrent & React 19",
    color: "from-emerald-500 to-teal-600",
    badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
    topics: [
      {
        path: "/module-4/concurrent-transitions",
        name: "4.1 Concurrent React & Transitions",
        desc: "useTransition, useDeferredValue, and non-blocking interruptible rendering.",
        badge: "Concurrency"
      },
      {
        path: "/module-4/actions-forms",
        name: "4.2 React 19 Actions & Forms",
        desc: "useActionState, pending states, form actions, and automated reset.",
        badge: "React 19"
      },
      {
        path: "/module-4/optimistic-ui",
        name: "4.3 Optimistic UI Updates",
        desc: "useOptimistic timeline, network latency simulation, and auto-rollback.",
        badge: "React 19"
      },
      {
        path: "/module-4/use-and-suspense",
        name: "4.4 The use() Hook & Suspense Boundaries",
        desc: "Streaming promises, conditional hooks, and resource fetching without useEffect.",
        badge: "React 19"
      },
      {
        path: "/module-4/rsc-flight-protocol",
        name: "4.5 React Server Components & Flight Wire Protocol",
        desc: "Server vs Client components, zero-bundle streaming, and JSON wire chunks.",
        badge: "RSC"
      }
    ]
  },
  {
    id: "module-5",
    title: "Module 5: State Management & Architecture",
    shortTitle: "5. State & Architecture",
    color: "from-fuchsia-500 to-pink-600",
    badgeColor: "text-fuchsia-400 bg-fuchsia-950/40 border-fuchsia-500/30",
    topics: [
      {
        path: "/module-5/context-api",
        name: "5.1 React Context API & The Consumer Trap",
        desc: "When context shines vs why unoptimized context re-renders all consumers.",
        badge: "Context"
      },
      {
        path: "/module-5/external-stores",
        name: "5.2 External Store Architecture: Zustand vs Redux",
        desc: "useSyncExternalStore, atomic selector subscriptions, and tearing prevention.",
        badge: "Stores"
      }
    ]
  }
];

export const ALL_TOPICS = MODULES.flatMap((m) =>
  m.topics.map((t) => ({ ...t, moduleId: m.id, moduleTitle: m.title, moduleColor: m.color }))
);
