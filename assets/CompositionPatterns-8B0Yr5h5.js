import{j as e}from"./index-BMvtjGH9.js";import{G as n,C as t,K as o}from"./KnowledgeCheck-BFnTwRIZ.js";import{S as i}from"./split-D4i16zut.js";import{L as s}from"./Footer-MoOEs5c_.js";import{B as a}from"./box-DaubXKBz.js";import{C as r}from"./circle-check-_YN6oiee.js";const g=["Component Composition","Children as Props","Lifting State Up","Pushing State Down","Compound Components","Render Optimization without Memo"],c=[{label:"1. The Intuition: Composition Over Optimization",hash:"intuition"},{label:"2. The 'Children as Props' Performance Superpower",hash:"children-as-props"},{label:"3. Pushing State Down to Leaf Nodes",hash:"push-state-down"},{label:"4. The Compound Components Architecture",hash:"compound-components"},{label:"5. Production Architecture Comparison",hash:"comparison"},{label:"6. Knowledge Check",hash:"knowledge-check"}],l=[{q:"Why does passing an expensive component as a 'children' prop to a stateful wrapper component prevent the expensive component from re-rendering when the wrapper updates its state?",options:["The 'children' JSX element was evaluated in the parent scope where state did NOT change; its object reference is identical across the wrapper's re-renders, so React skips it.","Because children props are automatically wrapped in React.memo by the compiler.","Because children props run in a Web Worker.","Because React freezes the children prop in local memory."],answer:0,why:"When you write <ColorPicker>{expensiveChild}</ColorPicker>, expensiveChild is evaluated in the outer component. When ColorPicker's local state changes, ColorPicker re-renders, but its props.children has the exact same object reference as before (prevProps.children === nextProps.children). React's reconciler bails out automatically without needing React.memo!"},{q:"What is the primary benefit of the 'Compound Components' pattern (like <Select> and <Select.Option>)?",options:["It allows components to implicitly share state and communicate via Context without exposing cumbersome prop drilling to consumers.","It makes components render without JavaScript.","It forces all sub-components to be static HTML.","It avoids using React hooks."],answer:0,why:"Compound components provide an expressive, declarative API where a parent manages state (e.g. active tab or open dropdown) and child components implicitly consume and update that state via Context, giving consumers complete flexibility over markup and styling."}];function f(){return e.jsxs(n,{title:"Component Composition Patterns Visualized",intro:"Learn how structural architecture and composition (children-as-props and compound components) can eliminate 90% of re-renders without a single React.memo.",badge:"Component Architecture",toc:c,children:[e.jsxs("section",{id:"intuition",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(i,{className:"w-5 h-5"}),e.jsx("h2",{children:"1. The Intuition: Composition Over Optimization"})]}),e.jsxs("p",{className:"text-gray-300 leading-relaxed text-sm sm:text-base",children:["Many engineers sprinkle ",e.jsx("code",{children:"React.memo"}),", ",e.jsx("code",{children:"useMemo"}),", and ",e.jsx("code",{children:"useCallback"})," everywhere when an app feels sluggish. But in 9 out of 10 cases, the cleanest solution is simply restructuring the component hierarchy:"]}),e.jsxs("div",{className:"p-5 rounded-2xl border border-white/10 bg-[#111116] shadow-xl my-6",children:[e.jsx("span",{className:"text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2",children:"The Structural Secret"}),e.jsx("p",{className:"text-xs sm:text-sm text-gray-300 leading-relaxed m-0",children:"Keep volatile, fast-changing state (like hover effects, input typing, scroll tracking) encapsulated inside small, isolated leaf components. Never place high-frequency state high up in the tree where it forces thousands of descendants to re-evaluate."})]})]}),e.jsxs("section",{id:"children-as-props",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(s,{className:"w-5 h-5"}),e.jsx("h2",{children:"2. The 'Children as Props' Performance Superpower"})]}),e.jsx("p",{className:"text-gray-300 leading-relaxed text-sm sm:text-base",children:"Look at this miraculous pattern that eliminates re-renders without any memoization:"}),e.jsx(t,{filename:"children-prop-trick.tsx",language:"typescript",code:`// ❌ BAD: Typing into input re-renders <VeryExpensiveTree /> on every keystroke!
function Page() {
  const [text, setText] = useState("");
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <VeryExpensiveTree />
    </div>
  );
}

// ✅ PERFECT: <VeryExpensiveTree /> NEVER re-renders on keystrokes!
function InputContainer({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState("");
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      {children} {/* Identical object reference across renders! */}
    </div>
  );
}

function Page() {
  return (
    <InputContainer>
      <VeryExpensiveTree />
    </InputContainer>
  );
}`})]}),e.jsxs("section",{id:"push-state-down",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(a,{className:"w-5 h-5"}),e.jsx("h2",{children:"3. Pushing State Down to Leaf Nodes"})]}),e.jsxs("p",{className:"text-gray-300 leading-relaxed text-sm sm:text-base",children:["If only a dialog button needs to know whether the modal is open, do not lift ",e.jsx("code",{children:"isOpen"})," into the root page. Create an isolated ",e.jsx("code",{children:"<OpenModalButton />"})," component."]})]}),e.jsxs("section",{id:"compound-components",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(s,{className:"w-5 h-5"}),e.jsx("h2",{children:"4. The Compound Components Architecture"})]}),e.jsx("p",{className:"text-gray-300 leading-relaxed text-sm sm:text-base",children:"Compound components let you design flexible, accessible design systems like Radix UI or Headless UI:"}),e.jsx(t,{filename:"CompoundTabs.tsx",language:"typescript",code:`import { createContext, useContext, useState } from "react";

const TabContext = createContext<{ active: string; setActive: (t: string) => void } | null>(null);

export function Tabs({ defaultTab, children }: { defaultTab: string; children: React.ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return <TabContext.Provider value={{ active, setActive }}>{children}</TabContext.Provider>;
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 border-b border-white/10">{children}</div>;
}

export function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabContext)!;
  const isSelected = ctx.active === value;
  return (
    <button
      onClick={() => ctx.setActive(value)}
      className={isSelected ? "border-b-2 border-cyan-400 text-white font-bold" : "text-gray-400"}
    >
      {children}
    </button>
  );
}`})]}),e.jsxs("section",{id:"comparison",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(r,{className:"w-5 h-5"}),e.jsx("h2",{children:"5. Production Architecture Comparison"})]}),e.jsx("div",{className:"p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300",children:e.jsxs("ul",{className:"space-y-1.5 list-disc list-inside text-gray-400",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Composition first:"})," Push state down, lift static JSX up via children props."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Compound APIs:"})," Provide intuitive slot-based flexibility for UI libraries."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Zero memo needed:"})," 80%+ of memo calls can be deleted once components are properly composed."]})]})})]}),e.jsx(o,{questions:l,id:"knowledge-check"})]})}export{g as SEARCH_KEYWORDS,f as default};
