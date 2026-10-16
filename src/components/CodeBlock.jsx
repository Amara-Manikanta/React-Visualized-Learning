import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CodeBlock({ code, language = "tsx", filename = null }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-xl border border-white/10 bg-[#09090d] overflow-hidden shadow-xl">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#121218] text-xs font-mono text-gray-400">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 inline-block"></span>
            {filename}
          </span>
          <span className="uppercase text-[10px] tracking-wider text-gray-500 font-semibold">{language}</span>
        </div>
      )}
      <div className="relative group">
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all opacity-80 group-hover:opacity-100"
          title="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto text-gray-300 leading-relaxed custom-scrollbar">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
