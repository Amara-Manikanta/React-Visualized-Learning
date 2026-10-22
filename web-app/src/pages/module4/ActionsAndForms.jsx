import React from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import { Send, CheckCircle2, Layers, Zap } from "lucide-react";

export const SEARCH_KEYWORDS = [
  "React 19 Actions",
  "useActionState",
  "useFormStatus",
  "Form Actions",
  "Server Actions",
  "Automatic form reset"
];

const toc = [
  { label: "1. The Intuition: What is a React 19 Action?", hash: "intuition" },
  { label: "2. useActionState: Goodbye to 4 Separate useState Hooks", hash: "use-action-state" },
  { label: "3. useFormStatus: Context-Free Pending Submissions", hash: "use-form-status" },
  { label: "4. Automatic Form Reset & Optimistic Interop", hash: "automatic-reset" },
  { label: "5. Production Action Handler Pattern", hash: "production-pattern" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "How does React 19 define an 'Action'?",
    options: [
      "An Action is an asynchronous function that uses transitions to manage pending states, error handling, and optimistic updates automatically.",
      "An Action is an Redux action object with a { type, payload } structure.",
      "An Action is a WebAssembly background worker.",
      "An Action is a CSS keyframe animation trigger."
    ],
    answer: 0,
    why: "In React 19, an Action is a formal convention for async workflows. When you pass an async function to <form action={fn}> or useActionState, React automatically wraps it in a transition, tracks isPending, handles errors, and resets uncontrolled form inputs upon completion."
  },
  {
    q: "What problem does the React 19 hook `useFormStatus()` solve for nested submit buttons?",
    options: [
      "It reads the pending status of the parent <form> automatically from internal React context without needing to prop-drill 'isSubmitting' down to the button.",
      "It checks if the user's password meets security requirements.",
      "It uploads form fields to Amazon S3.",
      "It prevents forms from submitting if the browser is offline."
    ],
    answer: 0,
    why: "Previously, to disable a submit button or show a spinner inside a nested component, you had to pass isSubmitting props down through multiple layers. In React 19, any child inside a <form> can call useFormStatus() to read pending, data, method, and action directly."
  }
];

export default function ActionsAndForms() {
  return (
    <GuideLayout
      title="React 19 Actions & Forms Visualized"
      intro="Explore React 19's unified Action architecture: useActionState, useFormStatus, automatic form resets, and async transition lifecycles."
      badge="React 19 Core"
      toc={toc}
    >
      {/* SECTION 1: Intuition */}
      <section id="intuition" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Send className="w-5 h-5" />
          <h2>1. The Intuition: What is a React 19 Action?</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          For a decade, handling a simple form in React required writing tedious boilerplate:
        </p>

        <div className="p-4 rounded-xl border border-white/10 bg-[#09090d] font-mono text-xs text-rose-300 space-y-1 my-4">
          <div>const [isSubmitting, setIsSubmitting] = useState(false);</div>
          <div>const [error, setError] = useState(null);</div>
          <div>const [data, setData] = useState(null);</div>
          <div>// Plus manual try/catch, finally blocks, and e.preventDefault()...</div>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          React 19 replaces all of that with native <strong>Actions</strong>. You pass an async function directly to a <code>&lt;form action={'{asyncFn}'}&gt;</code> or <code>useActionState</code>, and React handles the async lifecycle automatically!
        </p>
      </section>

      {/* SECTION 2: useActionState */}
      <section id="use-action-state" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Zap className="w-5 h-5" />
          <h2>2. useActionState: Goodbye to 4 Separate useState Hooks</h2>
        </div>

        <CodeBlock
          filename="React19ActionForm.tsx"
          language="typescript"
          code={`import { useActionState } from "react";

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
}`}
        />
      </section>

      {/* SECTION 3: useFormStatus */}
      <section id="use-form-status" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Layers className="w-5 h-5" />
          <h2>3. useFormStatus: Context-Free Pending Submissions</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Any child button inside a form can read the submission status without prop drilling:
        </p>

        <CodeBlock
          filename="SubmitButton.tsx"
          language="typescript"
          code={`import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? <Spinner /> : "Submit"}
    </button>
  );
}`}
        />
      </section>

      {/* SECTION 4: Automatic Reset */}
      <section id="automatic-reset" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>4. Automatic Form Reset & Optimistic Interop</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          When an Action succeeds on an uncontrolled <code>&lt;form action={'{action}'}&gt;</code>, React automatically clears and resets form fields for you, eliminating manual <code>e.target.reset()</code> calls.
        </p>
      </section>

      {/* SECTION 5: Production Pattern */}
      <section id="production-pattern" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <h2>5. Production Action Handler Pattern</h2>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-2 text-xs sm:text-sm text-gray-300">
          <ul className="space-y-1.5 list-disc list-inside text-gray-400">
            <li>Always return an explicit object structure: <code>{`{ data, error }`}</code>.</li>
            <li>Take advantage of native <code>FormData</code> instead of binding controlled state to every input.</li>
            <li>Combine with <code>useOptimistic</code> for instantaneous UI feedback before server responses arrive.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: Knowledge Check */}
      <KnowledgeCheck questions={quizQuestions} id="knowledge-check" />
    </GuideLayout>
  );
}
