import React, { useState } from "react";
import GuideLayout from "../../components/GuideLayout";
import CodeBlock from "../../components/CodeBlock";
import KnowledgeCheck from "../../components/KnowledgeCheck";
import {
  Bell,
  Sliders,
  Send,
  AlertTriangle,
  Terminal,
  Activity
} from "lucide-react";

export const SEARCH_KEYWORDS = [
  "Handling events",
  "React events",
  "Controlled components",
  "Controlled inputs",
  "event.preventDefault",
  "onClick handler",
  "onChange handler",
  "Single source of truth",
  "SyntheticEvent",
  "Zero UI knowledge",
  "Forms in React"
];

const toc = [
  { label: "1. The Doorbell Model: Listening to User Actions", hash: "event-model" },
  { label: "2. Passing Functions vs Calling Functions: The Trap", hash: "passing-handlers" },
  { label: "3. Controlled Inputs: The Single Source of Truth", hash: "controlled-inputs" },
  { label: "4. Forms & `event.preventDefault()`: Taming the Browser", hash: "forms-and-submit" },
  { label: "5. Interactive Laboratory: Event Telemetry Lab", hash: "interactive-lab" },
  { label: "6. Knowledge Check", hash: "knowledge-check" },
];

const quizQuestions = [
  {
    q: "Why is writing onClick={handleClick()} (with parentheses) a disastrous mistake in React?",
    options: [
      "Because parentheses execute the function immediately during the initial render, instead of waiting for the user to click the button. It can cause an infinite re-render loop if handleClick calls a state setter!",
      "Because modern browsers do not allow parentheses in JSX.",
      "Because it deletes all CSS files in the browser.",
      "Because React requires all click handlers to be written in German."
    ],
    answer: 0,
    why: "In JavaScript, adding () to a function invokes it right away! By writing onClick={handleClick} (without parentheses), you pass the function definition itself to React, telling it: 'Hold onto this function, and ONLY run it when the user actually clicks the button.'"
  },
  {
    q: "What is a 'Controlled Component' when dealing with text inputs in React?",
    options: [
      "An input whose displayed value is completely controlled by React state (value={text}), and whose updates are handled exclusively via onChange={(e) => setText(e.target.value)}.",
      "An input that is disabled so the user cannot type in it.",
      "An input that requires an admin password to edit.",
      "An input rendered directly by the operating system kernel."
    ],
    answer: 0,
    why: "In traditional HTML, inputs manage their own internal text. But in React, we connect the input's value directly to React state. React state becomes the 'single source of truth', making form validation, autocomplete, and resets easy to manage."
  },
  {
    q: "Why do we call event.preventDefault() inside a form's onSubmit handler?",
    options: [
      "To prevent the browser's default behavior of reloading the entire web page and submitting an HTTP POST request, allowing React to handle the submit smoothly in JavaScript.",
      "To prevent viruses from entering the operating system.",
      "To delete the user's browser history.",
      "To trigger a physical vibration on the user's smartphone."
    ],
    answer: 0,
    why: "By default from 1995, HTML forms submit data to a server URL and completely refresh the page. In modern Single Page Applications (SPAs), we call e.preventDefault() so the page never flickers or reloads, letting our React code send data asynchronously."
  }
];

export default function HandlingEventsAndForms() {
  const [formData, setFormData] = useState({
    name: "Alex",
    email: "alex@example.com",
    notifications: true
  });
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [submittedMessage, setSubmittedMessage] = useState(null);

  const addLog = (eventType, details) => {
    const timestamp = new Date().toLocaleTimeString();
    setTelemetryLogs((prev) => [
      { id: Date.now() + Math.random(), eventType, details, timestamp },
      ...prev.slice(0, 5)
    ]);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    addLog(`onChange: ${field}`, `value="${value}"`);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Stop full page reload
    addLog("onSubmit", "event.preventDefault() called! Page reload avoided.");
    setSubmittedMessage(
      `✓ Form submitted successfully for ${formData.name} (${formData.email}) without page refresh!`
    );
    setTimeout(() => setSubmittedMessage(null), 4000);
  };

  return (
    <GuideLayout
      title="0.6 Handling User Events & Interactive Forms"
      intro="How React captures user clicks, keystrokes, and form submissions through SyntheticEvents and controlled input architectures."
      badge="Interactivity"
      toc={toc}
    >
      {/* SECTION 1: The Doorbell Model */}
      <section id="event-model" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
          <Bell className="w-5 h-5" />
          <h2>1. The Doorbell Model: Listening to User Actions</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Think of user interactions like a house doorbell. The user pushes a button (the physical event). But nothing happens unless you have wired up a chime receiver (an <strong>event handler function</strong>) to respond when it rings:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-cyan-500/20 bg-[#0e1418] shadow-xl">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase block mb-1">
              onClick
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Fires when the user clicks a button, taps a card, or selects a menu item.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-indigo-500/20 bg-[#121018] shadow-xl">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase block mb-1">
              onChange
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Fires on every single keystroke inside a text field, checkbox toggle, or slider drag.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-[#0e1612] shadow-xl">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase block mb-1">
              onSubmit
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Fires when a user clicks a submit button or presses "Enter" inside a form.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Passing Functions vs Calling Functions */}
      <section id="passing-handlers" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-rose-400 font-bold text-lg">
          <AlertTriangle className="w-5 h-5" />
          <h2>2. Passing Functions vs Calling Functions: The Trap</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          This is the <strong>#1 most common mistake</strong> made by every single beginner in React:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-2xl border border-rose-500/20 bg-[#161214] space-y-2">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase block">
              ❌ WRONG: Invoking Immediately with ()
            </span>
            <code className="text-xs text-rose-300 font-mono block bg-black/40 p-2 rounded">
              &lt;button onClick=&#123;handleClick()&#125;&gt;
            </code>
            <p className="text-xs text-gray-400 leading-relaxed">
              Adding <code>()</code> runs the function IMMEDIATELY when the component mounts! If <code>handleClick</code> calls <code>setState</code>, your app gets caught in an infinite crash loop!
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-[#0e1612] space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
              ✓ CORRECT: Passing the Function Reference
            </span>
            <code className="text-xs text-emerald-300 font-mono block bg-black/40 p-2 rounded">
              &lt;button onClick=&#123;handleClick&#125;&gt;
            </code>
            <p className="text-xs text-gray-400 leading-relaxed">
              No parentheses! You are passing the function like a recipe. React holds onto it and only calls it when the user actually pushes the button.
            </p>
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          If you need to pass an argument, wrap it inside an inline arrow function:
        </p>

        <CodeBlock
          filename="InlineHandler.jsx"
          language="jsx"
          code={`// If you need to pass a parameter like userId:
<button onClick={() => deleteUser(123)}>
  Delete User
</button>`}
        />
      </section>

      {/* SECTION 3: Controlled Inputs */}
      <section id="controlled-inputs" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-lg">
          <Sliders className="w-5 h-5" />
          <h2>3. Controlled Inputs: The Single Source of Truth</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In normal HTML, an <code>&lt;input&gt;</code> box keeps its own secret memory of what the user typed. But in React, we don't want two different places holding data. We want <strong>React State to be the master</strong>:
        </p>

        <CodeBlock
          filename="ControlledInput.jsx"
          language="jsx"
          code={`import { useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <input
      type="text"
      // 1. Value is strictly bound to React state
      value={query}
      // 2. Keystroke informs React state of new value
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search documentation..."
    />
  );
}`}
        />

        <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 text-xs sm:text-sm text-indigo-200">
          <strong>The Two-Way Link:</strong> When the user presses a key on their keyboard:
          <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-300">
            <li>The browser creates an event object <code>e</code>.</li>
            <li><code>e.target.value</code> contains what was typed.</li>
            <li>We call <code>setQuery(e.target.value)</code>.</li>
            <li>React re-renders the input with the new text. All of this takes less than 1 millisecond!</li>
          </ol>
        </div>
      </section>

      {/* SECTION 4: Forms & event.preventDefault */}
      <section id="forms-and-submit" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg">
          <Send className="w-5 h-5" />
          <h2>4. Forms & `event.preventDefault()`: Taming the Browser</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          When HTML was invented in 1995, clicking a "Submit" button on a form caused the browser to freeze, reload the entire page, and make a full HTTP network request.
        </p>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          In modern web applications (Single Page Apps), we NEVER want the browser to reload the page! We handle form submissions seamlessly with <code>event.preventDefault()</code>:
        </p>

        <CodeBlock
          filename="SubmitForm.jsx"
          language="jsx"
          code={`function LoginForm() {
  function handleSubmit(event) {
    // 1. CRITICAL: Stop browser from refreshing the tab!
    event.preventDefault();

    // 2. Now handle the data cleanly in JavaScript!
    console.log("Submitting login asynchronously via fetch / API...");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" />
      <button type="submit">Sign In</button>
    </form>
  );
}`}
        />
      </section>

      {/* SECTION 5: Interactive Lab */}
      <section id="interactive-lab" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
          <Terminal className="w-5 h-5" />
          <h2>5. Interactive Laboratory: Event Telemetry Lab</h2>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Type into the input fields below or submit the form. Watch the real-time event telemetry log capture every <code>SyntheticEvent</code>, demonstrating controlled state updates:
        </p>

        {/* Simulator Box */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] shadow-2xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Interactive Form */}
            <form
              onSubmit={handleSubmit}
              className="p-5 rounded-2xl border border-white/10 bg-[#111116] space-y-4"
            >
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase block mb-1">
                Controlled Form Component
              </span>

              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">
                  Full Name (Controlled Input):
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onFocus={() => addLog("onFocus", "Input focused by user")}
                  onBlur={() => addLog("onBlur", "Input lost focus")}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white font-sans text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">
                  Email Address:
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white font-sans text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="notifications-toggle"
                  checked={formData.notifications}
                  onChange={(e) => handleInputChange("notifications", e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
                <label
                  htmlFor="notifications-toggle"
                  className="text-xs text-gray-300 cursor-pointer"
                >
                  Receive release telemetry & updates
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Form (event.preventDefault())</span>
              </button>

              {submittedMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono animate-fade-in">
                  {submittedMessage}
                </div>
              )}
            </form>

            {/* Right: Telemetry Stream */}
            <div className="p-5 rounded-2xl border border-white/10 bg-[#09090d] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Live Event Telemetry Log
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">SyntheticEvents</span>
                </div>

                <div className="space-y-2">
                  {telemetryLogs.length === 0 ? (
                    <div className="text-gray-600 text-xs font-mono italic p-4 text-center">
                      [Waiting for user action: type into the inputs or click submit...]
                    </div>
                  ) : (
                    telemetryLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono flex items-start justify-between gap-2"
                      >
                        <div>
                          <span className="text-cyan-400 font-bold mr-2">{log.eventType}</span>
                          <span className="text-gray-300">{log.details}</span>
                        </div>
                        <span className="text-gray-500 text-[10px] shrink-0">{log.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-gray-400">
                Notice that every keystroke triggers an <code>onChange</code> event, immediately synchronizing React's memory state without page flicker.
              </div>
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
