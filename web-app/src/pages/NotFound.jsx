import React from "react";
import { Link } from "react-router-dom";
import GlobalHeader from "../components/GlobalHeader";
import Footer from "../components/Footer";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0c0c10] text-gray-200">
      <GlobalHeader />
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-2xl border border-white/10 bg-[#111116] shadow-2xl">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4">
            <Compass className="w-6 h-6 animate-spin" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">404</h1>
          <h2 className="text-base font-semibold text-gray-300 mb-4">Topic Node Not Found</h2>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            The Fiber reconciliation pointer walked off the tree. Let's return to the root component.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-lg shadow-cyan-600/25"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Curriculum</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
