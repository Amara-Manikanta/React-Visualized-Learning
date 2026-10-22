import React, { useState, useEffect, useRef } from "react";
import { transform } from "sucrase";
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Eye,
  AlertCircle,
  Sparkles,
  ChevronDown
} from "lucide-react";

/**
 * Universal Code Compiler & Interactive Practice Playground
 * Supports:
 * - mode="html": Live HTML + CSS sandbox preview
 * - mode="js": ES6+ JavaScript runner with interactive console output
 * - mode="react": Live in-browser React JSX compiler powered by Sucrase
 */
export default function CodeCompiler({
  mode = "react", // "html" | "js" | "react"
  initialCode = "",
  initialCss = "",
  presets = [],
  title = "Interactive Practice Sandbox",
  description = "Edit the code below and see the live result instantly."
}) {
  const [code, setCode] = useState(initialCode);
  const [css, setCss] = useState(initialCss);
  const [activeTab, setActiveTab] = useState(mode === "html" && initialCss ? "html" : "code");
  const [copied, setCopied] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [runtimeError, setRuntimeError] = useState(null);
  const [compiledComp, setCompiledComp] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [runCount, setRunCount] = useState(1);
  const editorRef = useRef(null);

  // Handle preset change
  const handlePresetSelect = (preset) => {
    setCode(preset.code);
    if (preset.css !== undefined) setCss(preset.css);
    setRuntimeError(null);
    setConsoleLogs([]);
  };

  // Reset to initial
  const handleReset = () => {
    setCode(initialCode);
    setCss(initialCss);
    setRuntimeError(null);
    setConsoleLogs([]);
    setRunCount((c) => c + 1);
  };

  // Copy code
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Allow indentation with Tab key inside textarea
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // EXECUTION ENGINES

  // 1. JavaScript Mode Execution
  const runJavaScript = () => {
    const logs = [];
    const startTime = performance.now();
    setRuntimeError(null);

    // Custom console capturer
    const customConsole = {
      log: (...args) => {
        logs.push({
          type: "log",
          items: args.map(formatLogItem),
          time: new Date().toLocaleTimeString().split(" ")[0]
        });
      },
      info: (...args) => {
        logs.push({
          type: "info",
          items: args.map(formatLogItem),
          time: new Date().toLocaleTimeString().split(" ")[0]
        });
      },
      warn: (...args) => {
        logs.push({
          type: "warn",
          items: args.map(formatLogItem),
          time: new Date().toLocaleTimeString().split(" ")[0]
        });
      },
      error: (...args) => {
        logs.push({
          type: "error",
          items: args.map(formatLogItem),
          time: new Date().toLocaleTimeString().split(" ")[0]
        });
      }
    };

    try {
      // Execute within custom console wrapper
      const fn = new Function("console", `"use strict";\n${code}`);
      const result = fn(customConsole);
      const elapsed = (performance.now() - startTime).toFixed(1);
      setExecutionTime(`${elapsed}ms`);

      if (result !== undefined && logs.length === 0) {
        logs.push({
          type: "return",
          items: [formatLogItem(result)],
          time: new Date().toLocaleTimeString().split(" ")[0]
        });
      }
      setConsoleLogs(logs);
    } catch (err) {
      setRuntimeError(err.message || String(err));
      logs.push({
        type: "error",
        items: [err.message || String(err)],
        time: new Date().toLocaleTimeString().split(" ")[0]
      });
      setConsoleLogs(logs);
    }
  };

  // 2. React JSX Compilation & Evaluation
  const runReact = () => {
    setRuntimeError(null);
    const startTime = performance.now();

    try {
      let processed = code.trim();

      // Normalize export default or naked functions
      if (/export\s+default\s+function\s+([A-Za-z0-9_]+)/.test(processed)) {
        const fnName = processed.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/)[1];
        processed = processed.replace(/export\s+default\s+function/, "function") + `\nreturn ${fnName};`;
      } else if (/export\s+default\s+([A-Za-z0-9_]+)/.test(processed)) {
        processed = processed.replace(/export\s+default\s+([A-Za-z0-9_]+);?/, "return $1;");
      } else if (!/return\s+/.test(processed)) {
        const match = processed.match(/function\s+([A-Z][A-Za-z0-9_]*)/);
        if (match) {
          processed += `\nreturn ${match[1]};`;
        }
      }

      // Compile JSX using Sucrase
      const compiled = transform(processed, {
        transforms: ["jsx"],
        production: true
      }).code;

      // Provide standard React hooks and helpers in local scope
      const factory = new Function(
        "React",
        "useState",
        "useEffect",
        "useRef",
        "useMemo",
        "useCallback",
        compiled
      );

      const Component = factory(
        React,
        React.useState,
        React.useEffect,
        React.useRef,
        React.useMemo,
        React.useCallback
      );

      if (typeof Component !== "function") {
        throw new Error(
          "Code must define or return a React component function (e.g. function App() { return <div>...</div>; })."
        );
      }

      // Wrap in error-protected component wrapper
      const SafeComponentWrapper = (props) => {
        try {
          return React.createElement(Component, props);
        } catch (err) {
          return React.createElement(
            "div",
            { className: "p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono" },
            React.createElement("strong", { className: "block mb-1" }, "Runtime Error:"),
            err.message
          );
        }
      };

      setCompiledComp(() => SafeComponentWrapper);
      const elapsed = (performance.now() - startTime).toFixed(1);
      setExecutionTime(`${elapsed}ms`);
    } catch (err) {
      setRuntimeError(err.message || String(err));
      setCompiledComp(null);
    }
  };

  // Run automatically when code or mode changes
  useEffect(() => {
    if (mode === "js") {
      runJavaScript();
    } else if (mode === "react") {
      runReact();
    }
  }, [code, mode, runCount]);

  // Line numbers calculation
  const lineCount = Math.max(1, code.split("\n").length);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="my-6 rounded-2xl border border-white/10 bg-[#09090d] shadow-2xl overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="px-4 py-3 border-b border-white/10 bg-[#121218] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <span className="text-xs font-mono font-bold text-gray-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            {title}
          </span>
        </div>

        {/* Preset Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {presets.length > 0 && (
            <div className="relative group">
              <select
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  if (!isNaN(idx) && presets[idx]) {
                    handlePresetSelect(presets[idx]);
                  }
                }}
                className="px-2.5 py-1 text-xs font-mono rounded-lg bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 focus:outline-none focus:border-cyan-400 cursor-pointer pr-6 appearance-none"
                defaultValue=""
              >
                <option value="" disabled>Load Practice Example...</option>
                {presets.map((p, idx) => (
                  <option key={p.name} value={idx} className="bg-[#121218] text-white">
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {mode === "html" && initialCss && (
            <div className="flex rounded-lg border border-white/10 p-0.5 bg-black/40">
              <button
                onClick={() => setActiveTab("html")}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  activeTab === "html" ? "bg-amber-500/20 text-amber-300 font-bold" : "text-gray-400 hover:text-white"
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => setActiveTab("css")}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  activeTab === "css" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-gray-400 hover:text-white"
                }`}
              >
                CSS
              </button>
            </div>
          )}

          <button
            onClick={mode === "js" ? runJavaScript : mode === "react" ? runReact : () => setRunCount((c) => c + 1)}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
            title="Re-run compiler"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Run</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            title="Reset code to original"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {description && (
        <div className="px-4 py-2 border-b border-white/5 bg-[#0e0e14] text-xs text-gray-400">
          {description}
        </div>
      )}

      {/* Main Workspace Split (Editor + Live Output) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10 min-h-[320px]">
        {/* LEFT COLUMN: Code Editor */}
        <div className="flex flex-col bg-[#0b0b10] relative">
          <div className="px-3 py-1.5 border-b border-white/5 bg-[#0d0d14] flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>
              {mode === "html" ? (activeTab === "css" ? "style.css" : "index.html") : mode === "js" ? "script.js" : "Component.jsx"}
            </span>
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Editable Sandbox</span>
          </div>

          <div className="flex-1 flex overflow-hidden relative">
            {/* Line numbers */}
            <div className="py-3 pl-3 pr-2 select-none text-[12px] font-mono text-gray-600 text-right min-w-[2.5rem] bg-[#08080c] border-r border-white/5">
              {(activeTab === "css" ? Array.from({ length: Math.max(1, css.split("\n").length) }, (_, i) => i + 1) : lineNumbers).map((n) => (
                <div key={n} className="leading-relaxed">{n}</div>
              ))}
            </div>

            {/* Editable Textarea */}
            {activeTab === "css" ? (
              <textarea
                value={css}
                onChange={(e) => setCss(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                className="w-full h-full p-3 bg-transparent text-gray-200 font-mono text-xs sm:text-[13px] leading-relaxed resize-none focus:outline-none custom-scrollbar whitespace-pre overflow-x-auto"
                placeholder="/* Write CSS styles here... */"
              />
            ) : (
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                className="w-full h-full p-3 bg-transparent text-gray-200 font-mono text-xs sm:text-[13px] leading-relaxed resize-none focus:outline-none custom-scrollbar whitespace-pre overflow-x-auto"
                placeholder={mode === "html" ? "<!-- Write HTML markup here... -->" : "// Write code here..."}
              />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Execution & Preview */}
        <div className="flex flex-col bg-[#0e0e14] relative">
          <div className="px-3 py-1.5 border-b border-white/5 bg-[#121218] flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span className="flex items-center gap-1.5">
              {mode === "js" ? <Terminal className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
              {mode === "js" ? "Live Console Output" : "Live Browser Preview"}
            </span>
            {executionTime && (
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                ⚡ {executionTime}
              </span>
            )}
          </div>

          <div className="flex-1 p-4 flex flex-col justify-start overflow-y-auto max-h-[460px] custom-scrollbar">
            {/* Error Notification */}
            {runtimeError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Compilation / Runtime Error</span>
                </div>
                <div className="text-[11px] text-rose-300/90 whitespace-pre-wrap">{runtimeError}</div>
              </div>
            )}

            {/* MODE 1: HTML Live Preview */}
            {mode === "html" && (
              <div className="w-full h-full flex flex-col">
                <div className="w-full rounded-xl border border-white/10 bg-[#09090d] overflow-hidden flex-1 flex flex-col shadow-inner">
                  {/* Fake browser bar */}
                  <div className="px-3 py-1.5 bg-[#14141c] border-b border-white/5 flex items-center gap-2 text-[10px] font-mono text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400/60" />
                    <span className="text-gray-400 select-none">preview://localhost:3000/</span>
                  </div>
                  <div className="p-4 flex-1 overflow-auto bg-white/5 text-gray-200 font-sans text-sm">
                    <style dangerouslySetInnerHTML={{ __html: css }} />
                    <div dangerouslySetInnerHTML={{ __html: code }} />
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2: JavaScript Console Output */}
            {mode === "js" && (
              <div className="w-full h-full font-mono text-xs space-y-2">
                {consoleLogs.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-gray-600 text-xs italic">
                    <span>[No console output yet. Click 'Run' to execute.]</span>
                  </div>
                ) : (
                  consoleLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border flex items-start justify-between gap-3 text-[12px] leading-relaxed ${
                        log.type === "error"
                          ? "bg-rose-950/40 border-rose-500/30 text-rose-300"
                          : log.type === "warn"
                          ? "bg-amber-950/40 border-amber-500/30 text-amber-300"
                          : log.type === "return"
                          ? "bg-purple-950/40 border-purple-500/30 text-purple-300"
                          : "bg-white/5 border-white/5 text-cyan-200"
                      }`}
                    >
                      <div className="flex-1 whitespace-pre-wrap break-all">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mr-2 opacity-80 inline-block bg-white/10">
                          {log.type}
                        </span>
                        {log.items.join(" ")}
                      </div>
                      <span className="text-[10px] text-gray-500 shrink-0 font-normal">{log.time}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* MODE 3: React Live Component */}
            {mode === "react" && (
              <div className="w-full h-full flex flex-col justify-center items-center">
                {compiledComp ? (
                  <div className="w-full p-4 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-[#12121c] to-[#181828] shadow-xl text-center">
                    {React.createElement(compiledComp)}
                  </div>
                ) : !runtimeError ? (
                  <div className="text-gray-500 text-xs font-mono italic">
                    [Component ready to render. Click 'Run' to compile.]
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to format any JS data type cleanly for the interactive console
function formatLogItem(item) {
  if (item === null) return "null";
  if (item === undefined) return "undefined";
  if (typeof item === "string") return `"${item}"`;
  if (typeof item === "number" || typeof item === "boolean") return String(item);
  if (typeof item === "function") return item.toString();
  if (item instanceof Error) return `${item.name}: ${item.message}`;
  try {
    return JSON.stringify(item, null, 2);
  } catch {
    return String(item);
  }
}
