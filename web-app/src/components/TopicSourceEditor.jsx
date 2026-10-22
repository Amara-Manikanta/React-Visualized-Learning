import React, { useState, useEffect, useRef } from "react";
import { transform } from "sucrase";
import {
  Code,
  Play,
  RotateCcw,
  Copy,
  Check,
  UploadCloud,
  FileCode,
  Sparkles,
  AlertCircle,
  Eye,
  CheckCircle2
} from "lucide-react";
import {
  getOriginalSource,
  getSavedDraft,
  saveDraft,
  clearDraft,
  getFilePathForRoute
} from "../lib/pageSourceMap";
import GitHubPushModal from "./GitHubPushModal";

export default function TopicSourceEditor({ pathname, onCloseViewMode }) {
  const filePath = getFilePathForRoute(pathname);
  const originalCode = getOriginalSource(pathname) || "// Source code not found for this route.";
  const [code, setCode] = useState(() => getSavedDraft(pathname) || originalCode);
  const [isDraft, setIsDraft] = useState(() => Boolean(getSavedDraft(pathname)));
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState("editor"); // "editor" | "preview" | "split"
  const [runtimeError, setRuntimeError] = useState(null);
  const [compiledComponent, setCompiledComponent] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);
  const editorRef = useRef(null);

  // Auto-save draft when code changes
  useEffect(() => {
    if (code !== originalCode) {
      saveDraft(pathname, code);
      setIsDraft(true);
    } else {
      clearDraft(pathname);
      setIsDraft(false);
    }
  }, [code, originalCode, pathname]);

  // Handle Tab key indentation
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

  // Compile and run the edited React component in-browser
  const compileAndTest = () => {
    setIsCompiling(true);
    setRuntimeError(null);

    try {
      let processed = code.trim();

      // Strip imports that browser cannot resolve directly in string eval
      // We will provide standard React exports and components in scope
      processed = processed.replace(/import\s+.*?from\s+['"].*?['"];?/g, "");

      // Handle export default
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
        production: true,
      }).code;

      // Dummy GuideLayout and components if imported
      const MockGuideLayout = ({ title, children }) => (
        <div className="p-4 sm:p-6 rounded-2xl border border-cyan-500/30 bg-[#0e0e16] text-left">
          <div className="mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400">Preview: {title}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
              Tested in Live Sandbox
            </span>
          </div>
          <div className="space-y-6">{children}</div>
        </div>
      );

      const MockCodeBlock = ({ code: blockCode, language = "jsx" }) => (
        <pre className="p-3 my-2 rounded-lg bg-black/60 border border-white/10 font-mono text-xs overflow-x-auto text-cyan-200">
          <div className="text-[9px] uppercase text-gray-500 mb-1">{language}</div>
          <code>{blockCode}</code>
        </pre>
      );

      const MockKnowledgeCheck = () => (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-xs text-emerald-300">
          ✓ Knowledge Check Quiz component mounted.
        </div>
      );

      const factory = new Function(
        "React",
        "useState",
        "useEffect",
        "useRef",
        "useMemo",
        "useCallback",
        "GuideLayout",
        "CodeBlock",
        "KnowledgeCheck",
        compiled
      );

      const Component = factory(
        React,
        React.useState,
        React.useEffect,
        React.useRef,
        React.useMemo,
        React.useCallback,
        MockGuideLayout,
        MockCodeBlock,
        MockKnowledgeCheck
      );

      if (typeof Component !== "function") {
        throw new Error(
          "Code must define or export a valid React component function."
        );
      }

      const SafeWrapper = (props) => {
        try {
          return React.createElement(Component, props);
        } catch (err) {
          return (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono">
              <strong>Runtime Render Error:</strong> {err.message}
            </div>
          );
        }
      };

      setCompiledComponent(() => SafeWrapper);
      setActiveTab("preview");
    } catch (err) {
      setRuntimeError(err.message || String(err));
      setCompiledComponent(null);
    } finally {
      setIsCompiling(false);
    }
  };

  // Copy AI Prompt
  const handleCopyPrompt = () => {
    const prompt = `You are an expert React pedagogical engineer. Here is the current source code for the topic file \`${filePath}\`:

\`\`\`jsx
${code}
\`\`\`

Task:
Please review and update this topic component. Improve explanations, enhance interactive visualizers, or fix code clarity.
Return the complete, drop-in replacement JSX code for this component.`;

    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  // Revert to original
  const handleRevert = () => {
    if (window.confirm("Revert this topic code to the original bundled version? Any local edits will be discarded.")) {
      clearDraft(pathname);
      setCode(originalCode);
      setIsDraft(false);
      setRuntimeError(null);
      setCompiledComponent(null);
    }
  };

  // Line count
  const lines = code.split("\n");

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0a0a0f] shadow-2xl overflow-hidden my-6">
      {/* Top Action Toolbar */}
      <div className="p-3 sm:p-4 border-b border-white/10 bg-[#12121a] flex flex-wrap items-center justify-between gap-3">
        {/* File Info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white break-all">
                {filePath || "Topic Component"}
              </span>
              {isDraft ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Local Draft (Edited)
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                  Original
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-500 font-mono">
              {lines.length} lines • In-browser live editor
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Prompt Copy */}
          <button
            onClick={handleCopyPrompt}
            className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Copy pre-formatted prompt with full source code to ask ChatGPT, Claude, or Gemini"
          >
            {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{copiedPrompt ? "Prompt Copied! ✓" : "Copy for AI Prompt"}</span>
          </button>

          {/* Test & Run */}
          <button
            onClick={compileAndTest}
            disabled={isCompiling}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title="Compile JSX live and render on phone"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test Live</span>
          </button>

          {/* Push to GitHub */}
          <button
            onClick={() => setShowPushModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title="Push changes directly to your GitHub repository"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Push to GitHub</span>
          </button>

          {/* Revert Button if draft */}
          {isDraft && (
            <button
              onClick={handleRevert}
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              title="Revert to original bundled source"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy Raw Code */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(code);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2000);
            }}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            title="Copy raw code"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Tabs: Code vs Preview */}
      <div className="px-4 py-2 border-b border-white/10 bg-[#0d0d14] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("editor")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "editor"
                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Source Code ({lines.length} lines)</span>
          </button>

          <button
            onClick={() => {
              if (!compiledComponent) compileAndTest();
              else setActiveTab("preview");
            }}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "preview"
                ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Rendered Preview</span>
          </button>
        </div>

        {onCloseViewMode && (
          <button
            onClick={onCloseViewMode}
            className="text-xs text-gray-400 hover:text-cyan-300 transition-colors"
          >
            Switch to Normal Reading View ↗
          </button>
        )}
      </div>

      {/* Main Workspace */}
      <div className="min-h-[420px] max-h-[650px] overflow-hidden flex flex-col bg-[#0b0b10]">
        {/* Error notification if compile failed */}
        {runtimeError && (
          <div className="p-3 bg-rose-950/80 border-b border-rose-500/40 text-rose-300 text-xs font-mono flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1 whitespace-pre-wrap">{runtimeError}</div>
          </div>
        )}

        {activeTab === "editor" ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Line numbers */}
            <div className="py-3 pl-3 pr-2 select-none text-[12px] font-mono text-gray-600 text-right min-w-[3rem] bg-[#08080c] border-r border-white/5 overflow-hidden">
              {lines.map((_, i) => (
                <div key={i + 1} className="leading-relaxed">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Editable code area */}
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              className="w-full h-full p-3 bg-transparent text-gray-200 font-mono text-xs sm:text-[13px] leading-relaxed resize-none focus:outline-none custom-scrollbar whitespace-pre overflow-x-auto"
              placeholder="// Paste updated React JSX component code here..."
            />
          </div>
        ) : (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
            {compiledComponent ? (
              React.createElement(compiledComponent)
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500 text-xs font-mono">
                <span>[Click 'Test Live' to compile and view your modified component]</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom helper tip */}
      <div className="p-3 border-t border-white/10 bg-[#0e0e14] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gray-400">
        <span>💡 Tip: Edit code, click "Test Live", then tap "Push to GitHub" to deploy directly from your iPhone!</span>
        {isDraft && (
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Draft saved locally on phone
          </span>
        )}
      </div>

      {/* GitHub Push Modal */}
      <GitHubPushModal
        isOpen={showPushModal}
        onClose={() => setShowPushModal(false)}
        filePath={filePath}
        content={code}
        onSuccess={() => {
          clearDraft(pathname);
          setIsDraft(false);
        }}
      />
    </div>
  );
}
