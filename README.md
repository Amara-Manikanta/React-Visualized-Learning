# React Visualized ⚛️

> **The Definitive Visual and Interactive Architecture Platform for Modern React Internals.**

From mental models and hook closures to the Fiber reconciler, React 19 (Server Components, Actions, `useOptimistic`), and high-scale performance engineering.

[![React 19](https://img.shields.io/badge/React-19.0.0-cyan.svg)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38bdf8.svg)](https://tailwindcss.com)
[![Oxlint 0 Warnings](https://img.shields.io/badge/Oxlint-0%20warnings-emerald.svg)](https://oxc.rs)
[![Electron macOS](https://img.shields.io/badge/Electron-Apple%20Silicon-blue.svg)](https://www.electronjs.org)
[![iOS Capacitor](https://img.shields.io/badge/Capacitor-iOS-purple.svg)](https://capacitorjs.com)

---

## 🎯 Mission & Pedagogical Principles

Like *"AI Engineering Visualized"*, every guide in React Visualized adheres to six core pedagogical principles:

1. **Intuition Before Code/Math**: Start with tangible real-world analogies (video game double-buffering, virtual stack frames) before inspecting internal structs.
2. **Interactive Laboratories**: Live simulators for every concept — interactive Fiber trees, stale closure triggers, render cascade heatmaps, and Flight wire stream inspectors.
3. **Visuals & Flowcharts**: Step-by-step pipeline diagrams, SVG pointer graphs, and memory layout transitions.
4. **Production Code**: Realistic, battle-tested modern TypeScript and ESNext code snippets.
5. **Knowledge Checks**: End-of-lesson interactive quiz banks testing underlying mechanics and "why", not syntax memorization, with randomized reshuffled options.
6. **Multi-Platform Ready**: Clean responsive Web UI, packaged for macOS (Electron Apple Silicon) and iOS (Capacitor).

---

## 📚 Curriculum & Topic Modules

### Module 1: The Core Mental Model & The Fiber Engine
- **Topic 1.1**: [UI = f(state) & Declarative vs Imperative DOM](#) — Why React shifts from imperative DOM surgery to pure, idempotent state projections.
- **Topic 1.2**: [Virtual DOM vs Real DOM](#) — Batching, layout thrashing prevention, synthetic events, and O(n) diffing heuristics.
- **Topic 1.3**: 🌟 **Flagship Lesson:** [The Fiber Reconciler & Double-Buffering Visualized](#) — Current Tree vs WorkInProgress Tree, unit-of-work traversal, and child/sibling/return pointers.
- **Topic 1.4**: [The Render & Commit Pipeline](#) — Asynchronous render/diffing vs synchronous commit mutation, layout effects (`useLayoutEffect`), and browser paint.

### Module 2: The Complete Hooks Deep Dive
- **Topic 2.1**: [`useState` & Batching](#) — The dispatch queue, circular update lists, snapshots, and the Stale Closure trap.
- **Topic 2.2**: [`useEffect` Lifecycle & Timing](#) — Mount, update, unmount, and why cleanup functions execute with old closure snapshots.
- **Topic 2.3**: [`useRef`: Escaping React's Reactive Cycle](#) — DOM node access vs mutable persistent memory boxes that bypass re-renders.
- **Topic 2.4**: [`useMemo` & `useCallback`](#) — Referential equality in JavaScript, cache invalidation, and when memoization hurts performance.
- **Topic 2.5**: [Custom Hooks Architecture](#) — Extracting reusable stateful logic while preserving complete state isolation.

### Module 3: Rendering & Performance Engineering
- **Topic 3.1**: [Why Components Re-render](#) — The 3 root triggers (state, parent re-renders, context updates) vs browser repaints.
- **Topic 3.2**: [Re-render Cascades & `React.memo`](#) — Interactive component tree heatmap and establishing bailout firebreaks.
- **Topic 3.3**: [Component Composition Patterns](#) — Lifting state up, pushing state down, and children-as-props optimization without memo.
- **Topic 3.4**: [DOM Virtualization](#) — Windowing 100,000+ list rows at 60fps using geometric overscan recycling.

### Module 4: Concurrent React & React 19 Modern Architecture
- **Topic 4.1**: [Concurrent React & Transitions](#) — `useTransition`, `useDeferredValue`, and non-blocking interruptible rendering.
- **Topic 4.2**: [React 19 Actions & Forms](#) — `useActionState`, `useFormStatus`, automatic form resets, and async transitions.
- **Topic 4.3**: [Optimistic UI Updates](#) — `useOptimistic` timeline, network latency simulation, and automated rollback on error.
- **Topic 4.4**: [The `use()` Hook & Suspense Boundaries](#) — Streaming promises, conditional hooks, and resource fetching without useEffect waterfalls.
- **Topic 4.5**: [React Server Components & Flight Wire Protocol](#) — Server vs Client components, zero-bundle streaming, and Flight JSON wire format.

### Module 5: State Management & Architecture
- **Topic 5.1**: [React Context API & The Consumer Trap](#) — Dependency injection vs why unoptimized context re-renders all consumers.
- **Topic 5.2**: [External Store Architecture: Zustand vs Redux](#) — `useSyncExternalStore`, preventing UI tearing, and atomic selector subscriptions.

---

## 🛠️ Tech Stack & Tooling

- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) + custom dark-mode theme (`#0c0c10`, `#111116`, `#16161f`, neon cyan/indigo/emerald accents)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router v7 (`HashRouter` for relative Electron and Capacitor asset resolution)
- **Linter**: Oxlint (maintaining strictly 0 warnings, 0 errors)
- **Content Validator**: Custom automated script (`scripts/check-content.mjs`) ensuring 0 broken links and 0 orphaned TOC hashes.

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone https://github.com/Amara-Manikanta/React-Visualized-Learning.git
cd react-visualized
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Production Build & Verification
```bash
npm run check    # Automated content validator (routes, TOC hashes, dead code)
npm run lint     # Oxlint verification (0 warnings, 0 errors)
npm run build    # Compiles search index & bundles production assets with Vite
```

### 4. macOS Electron Desktop App
```bash
npm run electron:dev        # Run Electron with live Vite HMR
npm run electron:build:mac  # Package macOS Apple Silicon app (.dmg, .zip)
```

### 5. iOS Mobile App (Capacitor)
```bash
npm run ios:sync  # Build web assets and sync to iOS native project
npm run ios:open  # Open in Xcode
```

---

## 📄 License
MIT License. Built for the global React engineering community.
