import React, { useMemo, useState } from "react";
import { HelpCircle, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

function shuffled(n) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function KnowledgeCheck({ questions = [], title = "Knowledge Check: Test Your Mental Model", id = "knowledge-check" }) {
  const [picked, setPicked] = useState({});
  const [round, setRound] = useState(0);

  const sig = questions.map((q) => q.q).join("\u0000");
  const orders = useMemo(
    () => questions.map((q) => shuffled(q.options.length)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sig, round]
  );

  if (!questions.length) return null;

  const answered = Object.keys(picked).length;
  const correct = questions.reduce((a, q, i) => a + (picked[i] === q.answer ? 1 : 0), 0);
  const done = answered === questions.length;

  return (
    <section className="mt-12 mb-6 scroll-mt-24" id={id}>
      <div className="rounded-2xl border border-white/10 bg-[#111116] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white m-0">{title}</h2>
          </div>
          {answered > 0 && (
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300">
              {correct} / {questions.length} Correct
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-400 mb-6">
          Focus on the underlying mechanics and "why", not syntax memorization. Detailed explanations reveal immediately after picking.
        </p>

        <div className="space-y-6">
          {questions.map((q, qi) => {
            const choice = picked[qi];
            const hasAnswered = choice !== undefined;
            return (
              <div key={qi} className="p-4 sm:p-5 rounded-xl border border-white/5 bg-[#09090d]/60">
                <div className="flex gap-3 mb-3">
                  <span className="shrink-0 w-6 h-6 rounded-md bg-white/10 text-gray-300 text-xs font-mono font-bold flex items-center justify-center mt-0.5">
                    {qi + 1}
                  </span>
                  <div className="text-sm sm:text-base font-semibold text-gray-100 leading-relaxed">{q.q}</div>
                </div>

                <div className="space-y-2 sm:ml-9">
                  {orders[qi].map((oi, pos) => {
                    const opt = q.options[oi];
                    const isCorrect = oi === q.answer;
                    const isPicked = choice === oi;
                    let cls = "border-white/10 bg-white/[0.02] text-gray-300 hover:border-white/25 hover:bg-white/[0.05]";
                    if (hasAnswered && isCorrect) {
                      cls = "border-emerald-500/60 bg-emerald-500/[0.12] text-emerald-100 font-medium";
                    } else if (hasAnswered && isPicked) {
                      cls = "border-rose-500/60 bg-rose-500/[0.12] text-rose-100";
                    } else if (hasAnswered) {
                      cls = "border-white/5 bg-white/[0.01] text-gray-600";
                    }

                    return (
                      <button
                        key={oi}
                        disabled={hasAnswered}
                        onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-xs sm:text-sm transition-all flex gap-3 items-start cursor-pointer ${cls} ${
                          hasAnswered ? "cursor-default" : ""
                        }`}
                      >
                        <span className="shrink-0 font-mono text-xs opacity-60 mt-0.5">
                          {String.fromCharCode(65 + pos)}
                        </span>
                        <span className="leading-relaxed flex-1">{opt}</span>
                        {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-auto mt-0.5" />}
                        {hasAnswered && isPicked && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-auto mt-0.5" />}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div className="sm:ml-9 mt-4 p-4 rounded-xl border border-white/10 bg-gradient-to-r from-[#16161f] to-[#121218]">
                    <div className="text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      {choice === q.answer ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct Insight
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Conceptual Gap
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed m-0">{q.why}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {done && (
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-400 m-0">
              {correct === questions.length
                ? "🎯 Perfect! You have mastered the underlying architecture and nuances of this topic."
                : `${correct} of ${questions.length} correct. Review the conceptual gap cards above to solidify your mental model.`}
            </p>
            <button
              onClick={() => {
                setPicked({});
                setRound((r) => r + 1);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/15 bg-white/5 text-gray-200 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry With Reshuffled Options</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
