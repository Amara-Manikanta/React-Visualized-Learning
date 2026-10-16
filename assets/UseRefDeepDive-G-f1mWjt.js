import{j as e}from"./index-BMvtjGH9.js";import{G as s,C as t,K as r}from"./KnowledgeCheck-BFnTwRIZ.js";import{B as n}from"./box-DaubXKBz.js";import{L as a}from"./Footer-MoOEs5c_.js";import{E as o}from"./eye-DM6oaI3X.js";import{T as i}from"./triangle-alert-BZ1B-cph.js";import{C as c}from"./circle-check-_YN6oiee.js";const b=["useRef","DOM access","Mutable box","Render cycle bypass","Persistent reference","forwardRef"],l=[{label:"1. The Intuition: A Secret Drawer That React Ignores",hash:"intuition"},{label:"2. The Anatomy of useRef: Plain JavaScript Object",hash:"anatomy"},{label:"3. DOM Node Access vs Instance Variable Storage",hash:"dom-vs-instance"},{label:"4. The Golden Rule: Never Read/Write Refs in Render",hash:"golden-rule"},{label:"5. Production Patterns: Timer IDs & Previous Props",hash:"production-patterns"},{label:"6. Knowledge Check",hash:"knowledge-check"}],d=[{q:"Why does mutating myRef.current = newValue NOT cause the component to re-render?",options:["Because useRef returns a plain JavaScript object whose property mutations are not tracked by React's scheduling lanes or Fiber reconciliation loops.","Because useRef runs in a separate Web Worker thread.","Because the browser DOM intercepts all ref modifications.","Because React freezes the ref object using Object.freeze()."],answer:0,why:"Unlike useState, which dispatches an action to the Fiber's updateQueue and schedules a render pass with the Scheduler, mutating ref.current is just normal JS property assignment: obj.current = val. React has no setter listener on it, so no re-render is triggered."},{q:"Why is reading or writing ref.current during the component render phase considered an anti-pattern in Concurrent React?",options:["Because the Render Phase can be executed multiple times or discarded without committing, causing unpredictable side effects and breaking pure rendering invariants.","Because refs cannot be read inside JSX tags.","Because the compiler throws a TypeScript syntax error.","Because refs are only allocated when the component unmounts."],answer:0,why:"In Concurrent React, a component render can be paused, restarted, or completely abandoned by the scheduler. If you read or write ref.current during render, components will experience inconsistent values across concurrent render attempts. Always read/write refs in event handlers or useEffect."}];function y(){return e.jsxs(s,{title:"useRef: Escaping React's Reactive Cycle",intro:"Learn why useRef is much more than a DOM pointer: it is a persistent, mutable memory box that survives across renders without triggering UI updates.",badge:"Hook Internals",toc:l,children:[e.jsxs("section",{id:"intuition",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(n,{className:"w-5 h-5"}),e.jsx("h2",{children:"1. The Intuition: A Secret Drawer That React Ignores"})]}),e.jsxs("p",{className:"text-gray-300 leading-relaxed text-sm sm:text-base",children:["If ",e.jsx("code",{children:"useState"})," is a billboard that announces changes to everyone and forces the entire room to look at it (a re-render), ",e.jsx("code",{children:"useRef"})," is a secret pocket notebook:"]}),e.jsxs("div",{className:"p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6",children:[e.jsx("span",{className:"text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2",children:"The Persistent Memory Box"}),e.jsx("p",{className:"text-xs sm:text-sm text-gray-300 leading-relaxed m-0",children:"You can write whatever you want into the notebook at any time. React never monitors it, never diffs it, and will never re-render your component because of it. Yet whenever your component does re-render for other reasons, the notebook is still sitting right there with the exact data you left in it."})]})]}),e.jsxs("section",{id:"anatomy",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(a,{className:"w-5 h-5"}),e.jsx("h2",{children:"2. The Anatomy of useRef: Plain JavaScript Object"})]}),e.jsxs("p",{className:"text-gray-300 leading-relaxed text-sm sm:text-base",children:["Under the hood, ",e.jsx("code",{children:"useRef(initialValue)"})," is almost literally implemented like this in React:"]}),e.jsx(t,{filename:"ReactFiberHooks.ts",language:"typescript",code:`function mountRef<T>(initialValue: T): { current: T } {
  const hook = mountWorkInProgressHook();
  const ref = { current: initialValue };
  hook.memoizedState = ref;
  return ref;
}

function updateRef<T>(): { current: T } {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState; // Returns the exact same object reference!
}`})]}),e.jsxs("section",{id:"dom-vs-instance",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(o,{className:"w-5 h-5"}),e.jsx("h2",{children:"3. DOM Node Access vs Instance Variable Storage"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-5 my-6",children:[e.jsxs("div",{className:"p-5 rounded-2xl border border-white/10 bg-[#111116]",children:[e.jsx("span",{className:"text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2",children:"Use Case 1: Imperative DOM Nodes"}),e.jsxs("p",{className:"text-xs sm:text-sm text-gray-400 leading-relaxed",children:["Focusing an input, triggering HTML5 media playback (",e.jsx("code",{children:"video.play()"}),"), measuring scroll geometry, or initializing Canvas/WebGL contexts."]})]}),e.jsxs("div",{className:"p-5 rounded-2xl border border-white/10 bg-[#111116]",children:[e.jsx("span",{className:"text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-2",children:"Use Case 2: Instance Variables"}),e.jsxs("p",{className:"text-xs sm:text-sm text-gray-400 leading-relaxed",children:["Storing interval/timeout IDs (",e.jsx("code",{children:"setInterval"}),"), remembering previous prop values, tracking whether a component has mounted, or storing WebSockets."]})]})]})]}),e.jsxs("section",{id:"golden-rule",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-rose-400 font-bold text-lg",children:[e.jsx(i,{className:"w-5 h-5"}),e.jsx("h2",{children:"4. The Golden Rule: Never Read/Write Refs in Render"})]}),e.jsx(t,{filename:"ref-antipattern.tsx",language:"typescript",code:`function BadComponent() {
  const countRef = useRef(0);

  // ❌ ILLEGAL: Writing to ref during render phase!
  countRef.current++;

  // ❌ ILLEGAL: Reading ref to render JSX output!
  return <h1>Render count: {countRef.current}</h1>;
}

function GoodComponent() {
  const countRef = useRef(0);

  // ✅ LEGAL: Mutating ref inside an event handler
  const handleClick = () => {
    countRef.current += 1;
  };

  // ✅ LEGAL: Reading/mutating ref inside useEffect (after commit)
  useEffect(() => {
    console.log("Current count after commit:", countRef.current);
  });

  return <button onClick={handleClick}>Click me</button>;
}`})]}),e.jsxs("section",{id:"production-patterns",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(c,{className:"w-5 h-5"}),e.jsx("h2",{children:"5. Production Patterns: Timer IDs & Previous Props"})]}),e.jsx(t,{filename:"usePrevious.ts",language:"typescript",code:`import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);

  useEffect(() => {
    ref.current = value; // Updates after render commit
  }, [value]);

  return ref.current; // Returns value from PREVIOUS render
}`})]}),e.jsx(r,{questions:d,id:"knowledge-check"})]})}export{b as SEARCH_KEYWORDS,y as default};
