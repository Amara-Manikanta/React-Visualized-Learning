import React, { useState, useEffect } from "react";
import {
  X,
  Github,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Eye,
  EyeOff,
  Send,
  Sparkles
} from "lucide-react";
import {
  getSavedGitHubToken,
  saveGitHubToken,
  verifyGitHubToken,
  pushFileToGitHub
} from "../lib/githubSync";

export default function GitHubPushModal({
  isOpen,
  onClose,
  filePath,
  content,
  onSuccess
}) {
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [rememberToken, setRememberToken] = useState(true);
  const [commitMessage, setCommitMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [isPushing, setIsPushing] = useState(false);
  const [error, setError] = useState(null);
  const [pushResult, setPushResult] = useState(null);

  // Load saved token on mount
  useEffect(() => {
    const saved = getSavedGitHubToken();
    if (saved) {
      setToken(saved);
      // Auto-verify saved token in background
      verifyGitHubToken(saved)
        .then((user) => setVerifiedUser(user))
        .catch(() => setVerifiedUser(null));
    }
  }, [isOpen]);

  // Default commit message based on filePath
  useEffect(() => {
    if (filePath) {
      const fileName = filePath.split("/").pop().replace(".jsx", "");
      setCommitMessage(`docs(mobile): update ${fileName} via iPhone app`);
    }
    setError(null);
    setPushResult(null);
  }, [filePath, isOpen]);

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!token.trim()) {
      setError("Please enter a GitHub Personal Access Token first.");
      return;
    }
    setIsVerifying(true);
    setError(null);
    try {
      const user = await verifyGitHubToken(token);
      setVerifiedUser(user);
      if (rememberToken) saveGitHubToken(token);
    } catch (err) {
      setVerifiedUser(null);
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePush = async () => {
    if (!token.trim()) {
      setError("GitHub Personal Access Token is required to push.");
      return;
    }
    if (!commitMessage.trim()) {
      setError("Please provide a commit message.");
      return;
    }

    setIsPushing(true);
    setError(null);
    try {
      if (rememberToken) saveGitHubToken(token);
      const result = await pushFileToGitHub({
        token,
        filePath,
        content,
        message: commitMessage.trim(),
        branch: "main"
      });
      setPushResult(result);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f0f15] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#14141e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Push Code to GitHub
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  main
                </span>
              </h3>
              <p className="text-xs text-gray-400">Commit directly from your iPhone app</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs font-mono">
          {/* Target File details */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-gray-400 text-[11px] uppercase font-bold">Target Repository File:</div>
            <div className="text-cyan-300 font-bold break-all">{filePath}</div>
            <div className="text-[11px] text-gray-500 font-sans">
              Repo: <span className="text-gray-300">Amara-Manikanta/React-Visualized-Learning</span> (branch: main)
            </div>
          </div>

          {/* GitHub Token Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 font-bold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>GitHub Personal Access Token (PAT):</span>
              </label>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=React+Visualized+iPhone+App"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline text-[11px] flex items-center gap-1 font-sans"
              >
                <span>Generate Token (repo scope)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setVerifiedUser(null);
                }}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2.5 pr-20 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 font-mono text-xs"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="p-1.5 text-gray-400 hover:text-white"
                  title={showToken ? "Hide token" : "Show token"}
                >
                  {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={isVerifying || !token.trim()}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-200 text-[10px] font-bold disabled:opacity-40"
                >
                  {isVerifying ? <Loader2 className="w-3 h-3 animate-spin" /> : "Verify"}
                </button>
              </div>
            </div>

            {/* Token verified indicator */}
            {verifiedUser && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  Authenticated as <strong>@{verifiedUser.login}</strong>
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1 font-sans">
              <input
                type="checkbox"
                id="remember-token"
                checked={rememberToken}
                onChange={(e) => setRememberToken(e.target.checked)}
                className="w-3.5 h-3.5 accent-cyan-400 rounded cursor-pointer"
              />
              <label htmlFor="remember-token" className="text-gray-400 text-[11px] cursor-pointer">
                Remember token on this iPhone (stored locally in device browser storage)
              </label>
            </div>
          </div>

          {/* Commit Message */}
          <div className="space-y-1">
            <label className="text-gray-300 font-bold block">Commit Message:</label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Describe your changes..."
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 text-xs"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="whitespace-pre-wrap">{error}</div>
            </div>
          )}

          {/* Success Result */}
          {pushResult && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pushed to GitHub Successfully! 🚀</span>
              </div>
              <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
                Commit <code className="text-emerald-300 font-mono">{pushResult.commitSha.slice(0, 7)}</code> was committed to <code>main</code>. GitHub Actions is automatically building and deploying your change to the live website!
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={pushResult.commitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>View Commit on GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://github.com/Amara-Manikanta/React-Visualized-Learning/actions"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Deploy Actions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#14141e] flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-gray-500 font-sans">
            Requires Personal Access Token with <code>repo</code> scope.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-xs font-semibold cursor-pointer"
            >
              {pushResult ? "Close" : "Cancel"}
            </button>

            {!pushResult && (
              <button
                type="button"
                onClick={handlePush}
                disabled={isPushing || !token.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-40"
              >
                {isPushing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Pushing to GitHub...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm & Push</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
