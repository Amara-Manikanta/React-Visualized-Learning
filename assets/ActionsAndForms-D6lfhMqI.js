import{j as e}from"./index-BMvtjGH9.js";import{G as a,C as t,K as n}from"./KnowledgeCheck-BFnTwRIZ.js";import{S as o}from"./send-DmOZzMYX.js";import{Z as i}from"./zap-C3YKHbse.js";import{L as r}from"./Footer-MoOEs5c_.js";import{C as s}from"./circle-check-_YN6oiee.js";const f=["React 19 Actions","useActionState","useFormStatus","Form Actions","Server Actions","Automatic form reset"],c=[{label:"1. The Intuition: What is a React 19 Action?",hash:"intuition"},{label:"2. useActionState: Goodbye to 4 Separate useState Hooks",hash:"use-action-state"},{label:"3. useFormStatus: Context-Free Pending Submissions",hash:"use-form-status"},{label:"4. Automatic Form Reset & Optimistic Interop",hash:"automatic-reset"},{label:"5. Production Action Handler Pattern",hash:"production-pattern"},{label:"6. Knowledge Check",hash:"knowledge-check"}],l=[{q:"How does React 19 define an 'Action'?",options:["An Action is an asynchronous function that uses transitions to manage pending states, error handling, and optimistic updates automatically.","An Action is an Redux action object with a { type, payload } structure.","An Action is a WebAssembly background worker.","An Action is a CSS keyframe animation trigger."],answer:0,why:"In React 19, an Action is a formal convention for async workflows. When you pass an async function to <form action={fn}> or useActionState, React automatically wraps it in a transition, tracks isPending, handles errors, and resets uncontrolled form inputs upon completion."},{q:"What problem does the React 19 hook `useFormStatus()` solve for nested submit buttons?",options:["It reads the pending status of the parent <form> automatically from internal React context without needing to prop-drill 'isSubmitting' down to the button.","It checks if the user's password meets security requirements.","It uploads form fields to Amazon S3.","It prevents forms from submitting if the browser is offline."],answer:0,why:"Previously, to disable a submit button or show a spinner inside a nested component, you had to pass isSubmitting props down through multiple layers. In React 19, any child inside a <form> can call useFormStatus() to read pending, data, method, and action directly."}];function g(){return e.jsxs(a,{title:"React 19 Actions & Forms Visualized",intro:"Explore React 19's unified Action architecture: useActionState, useFormStatus, automatic form resets, and async transition lifecycles.",badge:"React 19 Core",toc:c,children:[e.jsxs("section",{id:"intuition",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(o,{className:"w-5 h-5"}),e.jsx("h2",{children:"1. The Intuition: What is a React 19 Action?"})]}),e.jsx("p",{className:"text-gray-300 leading-relaxed text-sm sm:text-base",children:"For a decade, handling a simple form in React required writing tedious boilerplate:"}),e.jsxs("div",{className:"p-4 rounded-xl border border-white/10 bg-[#09090d] font-mono text-xs text-rose-300 space-y-1 my-4",children:[e.jsx("div",{children:"const [isSubmitting, setIsSubmitting] = useState(false);"}),e.jsx("div",{children:"const [error, setError] = useState(null);"}),e.jsx("div",{children:"const [data, setData] = useState(null);"}),e.jsx("div",{children:"// Plus manual try/catch, finally blocks, and e.preventDefault()..."})]}),e.jsxs("p",{className:"text-gray-300 leading-relaxed text-sm sm:text-base",children:["React 19 replaces all of that with native ",e.jsx("strong",{children:"Actions"}),". You pass an async function directly to a ",e.jsxs("code",{children:["<form action=","{asyncFn}",">"]})," or ",e.jsx("code",{children:"useActionState"}),", and React handles the async lifecycle automatically!"]})]}),e.jsxs("section",{id:"use-action-state",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(i,{className:"w-5 h-5"}),e.jsx("h2",{children:"2. useActionState: Goodbye to 4 Separate useState Hooks"})]}),e.jsx(t,{filename:"React19ActionForm.tsx",language:"typescript",code:`import { useActionState } from "react";

async function updateUsername(previousState: any, formData: FormData) {
  const newName = formData.get("username") as string;
  try {
    const res = await api.updateName(newName);
    return { success: true, name: res.name, error: null };
  } catch (err: any) {
    return { success: false, name: previousState.name, error: err.message };
  }
}

export function ProfileForm() {
  // [state, formAction, isPending]
  const [state, formAction, isPending] = useActionState(updateUsername, {
    name: "Alex",
    error: null,
  });

  return (
    <form action={formAction}>
      <input name="username" defaultValue={state.name} />
      <button disabled={isPending}>
        {isPending ? "Updating..." : "Save Profile"}
      </button>
      {state.error && <p className="text-rose-400">{state.error}</p>}
    </form>
  );
}`})]}),e.jsxs("section",{id:"use-form-status",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(r,{className:"w-5 h-5"}),e.jsx("h2",{children:"3. useFormStatus: Context-Free Pending Submissions"})]}),e.jsx("p",{className:"text-gray-300 leading-relaxed text-sm sm:text-base",children:"Any child button inside a form can read the submission status without prop drilling:"}),e.jsx(t,{filename:"SubmitButton.tsx",language:"typescript",code:`import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? <Spinner /> : "Submit"}
    </button>
  );
}`})]}),e.jsxs("section",{id:"automatic-reset",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(s,{className:"w-5 h-5"}),e.jsx("h2",{children:"4. Automatic Form Reset & Optimistic Interop"})]}),e.jsxs("p",{className:"text-gray-300 leading-relaxed text-sm sm:text-base",children:["When an Action succeeds on an uncontrolled ",e.jsxs("code",{children:["<form action=","{action}",">"]}),", React automatically clears and resets form fields for you, eliminating manual ",e.jsx("code",{children:"e.target.reset()"})," calls."]})]}),e.jsxs("section",{id:"production-pattern",className:"scroll-mt-24 space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5 text-cyan-400 font-bold text-lg",children:[e.jsx(s,{className:"w-5 h-5"}),e.jsx("h2",{children:"5. Production Action Handler Pattern"})]}),e.jsx("div",{className:"p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300",children:e.jsxs("ul",{className:"space-y-1.5 list-disc list-inside text-gray-400",children:[e.jsxs("li",{children:["Always return an explicit object structure: ",e.jsx("code",{children:"{ data, error }"}),"."]}),e.jsxs("li",{children:["Take advantage of native ",e.jsx("code",{children:"FormData"})," instead of binding controlled state to every input."]}),e.jsxs("li",{children:["Combine with ",e.jsx("code",{children:"useOptimistic"})," for instantaneous UI feedback before server responses arrive."]})]})})]}),e.jsx(n,{questions:l,id:"knowledge-check"})]})}export{f as SEARCH_KEYWORDS,g as default};
