import React from "react";
import { Link } from "react-router-dom";
import { MODULES } from "../config/navigation";
import { Monitor, Smartphone, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#09090d] text-gray-400 text-xs">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <svg className="w-4 h-4" viewBox="-11.5 -10.23174 23 20.46348">
                  <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
                  <g stroke="currentColor" strokeWidth="1" fill="none">
                    <ellipse rx="11" ry="4.2"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                  </g>
                </svg>
              </div>
              <span className="text-base font-bold text-white tracking-tight">React Visualized</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              The definitive visual and interactive architectural documentation for modern React. Built for engineers who want to master what happens under the hood.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/5">
                <Monitor className="w-3.5 h-3.5 text-cyan-400" /> macOS Electron
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" /> iOS Ready
              </span>
            </div>
          </div>

          {/* Module Links */}
          {MODULES.map((m) => (
            <div key={m.id} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {m.shortTitle}
              </h4>
              <ul className="space-y-2">
                {m.topics.map((t) => (
                  <li key={t.path}>
                    <Link
                      to={t.path}
                      className="text-gray-400 hover:text-cyan-300 transition-colors line-clamp-1"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-mono">
          <div>
            Built with React 19, Tailwind CSS v4, Framer Motion, and Oxlint.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Amara-Manikanta/React-Visualized-Learning"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
