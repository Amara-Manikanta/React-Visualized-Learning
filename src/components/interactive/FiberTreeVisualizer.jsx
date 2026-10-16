import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Zap, Info, Eye } from "lucide-react";

// Initial Fiber Tree Topology
const INITIAL_NODES = {
  root: {
    id: "root",
    name: "FiberRootNode",
    tag: "HostRoot (3)",
    type: "div#root",
    currentVal: "Mounted",
    wipVal: "Mounted",
    child: "app",
    sibling: null,
    return: null,
    x: 280,
    y: 40,
  },
  app: {
    id: "app",
    name: "App",
    tag: "FunctionComponent (0)",
    type: "App",
    currentVal: "{ theme: 'dark' }",
    wipVal: "{ theme: 'dark' }",
    child: "header",
    sibling: null,
    return: "root",
    x: 280,
    y: 120,
  },
  header: {
    id: "header",
    name: "Header",
    tag: "FunctionComponent (0)",
    type: "Header",
    currentVal: "'React Visualized'",
    wipVal: "'React Visualized'",
    child: null,
    sibling: "counter",
    return: "app",
    x: 160,
    y: 200,
  },
  counter: {
    id: "counter",
    name: "Counter",
    tag: "FunctionComponent (0)",
    type: "Counter",
    currentVal: "count: 0",
    wipVal: "count: 1",
    child: "display",
    sibling: null,
    return: "app",
    x: 400,
    y: 200,
    isTarget: true,
  },
  display: {
    id: "display",
    name: "Display",
    tag: "FunctionComponent (0)",
    type: "Display",
    currentVal: "<span>0</span>",
    wipVal: "<span>1</span>",
    child: null,
    sibling: "btn",
    return: "counter",
    x: 320,
    y: 280,
    isTarget: true,
  },
  btn: {
    id: "btn",
    name: "Button",
    tag: "HostComponent (5)",
    type: "button",
    currentVal: "'Increment'",
    wipVal: "'Increment'",
    child: null,
    sibling: null,
    return: "counter",
    x: 480,
    y: 280,
  },
};

// Step-by-step traversal stages for workInProgress
const STEPS = [
  {
    phase: "IDLE",
    nodeId: null,
    action: "Tree is idle. Current tree is painted on the DOM. Click 'Trigger State Update' to dispatch setState() on <Counter />.",
    workType: "none",
    pointer: null,
  },
  {
    phase: "SCHEDULE",
    nodeId: "counter",
    action: "setState({ count: 1 }) dispatched! React creates an Update object, attaches it to Counter's updateQueue, and schedules a render pass with priority lanes.",
    workType: "schedule",
    pointer: "schedule",
  },
  {
    phase: "RENDER: beginWork",
    nodeId: "root",
    action: "workInProgressRoot created. beginWork() starts at HostRoot. Clones Current FiberRoot into WIP FiberRoot via createWorkInProgress().",
    workType: "beginWork",
    pointer: "child",
  },
  {
    phase: "RENDER: beginWork",
    nodeId: "app",
    action: "beginWork(App): React inspects props. App has no pending state updates, but passes down to children. Moves to first child via 'child' pointer.",
    workType: "beginWork",
    pointer: "child",
  },
  {
    phase: "RENDER: beginWork",
    nodeId: "header",
    action: "beginWork(Header): Pure component with unchanged props. Bailout on Header! Has no children (child = null), so completeWork(Header) begins.",
    workType: "beginWork",
    pointer: "sibling",
  },
  {
    phase: "RENDER: completeWork",
    nodeId: "header",
    action: "completeWork(Header): No DOM mutations needed. Checks for sibling pointer: finds 'counter' (sibling = counter). Moves horizontally!",
    workType: "completeWork",
    pointer: "sibling",
  },
  {
    phase: "RENDER: beginWork",
    nodeId: "counter",
    action: "beginWork(Counter): Processes update queue! count changed from 0 -> 1. Re-executes Counter(props). Reconciles child: marks Display with 'Update' flag!",
    workType: "beginWork",
    pointer: "child",
  },
  {
    phase: "RENDER: beginWork",
    nodeId: "display",
    action: "beginWork(Display): Receives new prop count: 1. Compares with old props: diff detected! Moves down. No children, so completeWork begins.",
    workType: "beginWork",
    pointer: "sibling",
  },
  {
    phase: "RENDER: completeWork",
    nodeId: "display",
    action: "completeWork(Display): Prepares mutation side-effects for commit. Checks sibling: finds 'btn' (sibling = btn). Jumps to sibling.",
    workType: "completeWork",
    pointer: "sibling",
  },
  {
    phase: "RENDER: beginWork",
    nodeId: "btn",
    action: "beginWork(Button): Unchanged HostComponent (button). No children. Immediately calls completeWork(Button).",
    workType: "beginWork",
    pointer: "return",
  },
  {
    phase: "RENDER: completeWork",
    nodeId: "btn",
    action: "completeWork(Button): Done. Has no sibling (sibling = null). Returns up to parent via 'return' pointer (return = counter).",
    workType: "completeWork",
    pointer: "return",
  },
  {
    phase: "RENDER: completeWork",
    nodeId: "counter",
    action: "completeWork(Counter): Bubbles up subtreeFlags (Display has Update flag). No sibling. Returns up to App via 'return' pointer.",
    workType: "completeWork",
    pointer: "return",
  },
  {
    phase: "RENDER: completeWork",
    nodeId: "app",
    action: "completeWork(App): Subtree effect list bubbled up. No sibling. Returns up to HostRoot via 'return' pointer.",
    workType: "completeWork",
    pointer: "return",
  },
  {
    phase: "RENDER: completeWork",
    nodeId: "root",
    action: "completeWork(HostRoot): Render phase COMPLETE! Entire WorkInProgress tree is built in memory with all flags collected.",
    workType: "completeWork",
    pointer: "commit",
  },
  {
    phase: "COMMIT PHASE (Synchronous)",
    nodeId: "display",
    action: "Commit Phase executes synchronously: React applies DOM mutations (updates text node in <span>0</span> to <span>1</span>). No browser layout thrashing!",
    workType: "commitMutation",
    pointer: "commit",
  },
  {
    phase: "DOUBLE BUFFER SWAP",
    nodeId: "root",
    action: "DOUBLE BUFFERING MAGIC: root.current = workInProgress! In a single pointer flip, the WorkInProgress tree becomes the new Current tree. Memory recycled for next render.",
    workType: "swap",
    pointer: "swap",
  },
];

export default function FiberTreeVisualizer() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [activeTreeTab, setActiveTreeTab] = useState("both"); // "current", "wip", "both"
  const [selectedNodeId, setSelectedNodeId] = useState("counter");

  const timerRef = useRef(null);

  const step = STEPS[currentStepIdx];
  const isCommitted = currentStepIdx >= STEPS.length - 2;

  // Auto-play effect
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentStepIdx < STEPS.length - 1) {
          setCurrentStepIdx((idx) => idx + 1);
        } else {
          setIsPlaying(false);
        }
      }, speed);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIdx, speed]);

  const handleTriggerUpdate = () => {
    setCurrentStepIdx(1);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
    setSelectedNodeId("counter");
  };

  const handleStepForward = () => {
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx((i) => i + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((i) => i - 1);
    }
  };

  const selectedNode = INITIAL_NODES[selectedNodeId] || INITIAL_NODES.counter;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111116] overflow-hidden shadow-2xl my-8">
      {/* Header Bar */}
      <div className="px-5 py-4 border-b border-white/10 bg-[#16161f]/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Fiber Engine & Double-Buffering Simulator</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Interactive Lab
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Traverse child, sibling, and return pointers in real time. Watch Current swap with WorkInProgress.
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center rounded-xl border border-white/10 bg-[#09090d] p-1">
          <button
            onClick={() => setActiveTreeTab("both")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTreeTab === "both" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-gray-400 hover:text-white"
            }`}
          >
            Dual Tree (Double-Buffering)
          </button>
          <button
            onClick={() => setActiveTreeTab("current")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTreeTab === "current" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-gray-400 hover:text-white"
            }`}
          >
            Current Tree (Screen)
          </button>
          <button
            onClick={() => setActiveTreeTab("wip")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTreeTab === "wip" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-gray-400 hover:text-white"
            }`}
          >
            WorkInProgress (Memory)
          </button>
        </div>
      </div>

      {/* Traversal State Banner */}
      <div className="px-5 py-3.5 bg-[#09090d] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-gray-400 uppercase tracking-wider text-[11px]">Phase:</span>
          <span
            className={`font-mono font-bold px-2.5 py-1 rounded-md text-[11px] border ${
              step.phase.startsWith("RENDER")
                ? "bg-cyan-950/40 text-cyan-300 border-cyan-500/40"
                : step.phase.startsWith("COMMIT")
                ? "bg-amber-950/40 text-amber-300 border-amber-500/40"
                : step.phase.startsWith("DOUBLE")
                ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/40"
                : "bg-white/5 text-gray-300 border-white/10"
            }`}
          >
            {step.phase}
          </span>
          {step.nodeId && (
            <span className="text-gray-400 flex items-center gap-1">
              Active Fiber: <span className="font-mono font-bold text-white">&lt;{INITIAL_NODES[step.nodeId]?.name} /&gt;</span>
            </span>
          )}
        </div>

        <div className="text-gray-400 font-mono text-[11px]">
          Step {currentStepIdx + 1} of {STEPS.length}
        </div>
      </div>

      {/* Action Explanation Narrative */}
      <div className="p-4 bg-gradient-to-r from-cyan-950/20 via-[#14141c] to-indigo-950/20 border-b border-white/10 text-xs sm:text-sm text-cyan-100 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed m-0 font-light flex-1">{step.action}</p>
      </div>

      {/* Visual Canvas Area */}
      <div className="p-4 sm:p-6 bg-[#0c0c10] overflow-x-auto custom-scrollbar">
        <div className="min-w-[700px] flex gap-8 justify-center">
          {/* Current Tree Container */}
          {(activeTreeTab === "both" || activeTreeTab === "current") && (
            <div className="flex-1 bg-[#111116] border border-blue-500/20 rounded-2xl p-4 shadow-xl relative">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  <span className="font-bold text-xs uppercase tracking-wider text-blue-300">
                    Current Tree (Visible Screen)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-500">root.current</span>
              </div>

              {/* Render Nodes for Current Tree */}
              <div className="relative h-[340px] w-full">
                <TreeSvgLayer nodes={INITIAL_NODES} isWip={false} />
                {Object.values(INITIAL_NODES).map((node) => {
                  const isActive = step.nodeId === node.id && !isCommitted;
                  const isSelected = selectedNodeId === node.id;
                  const val = isCommitted ? node.wipVal : node.currentVal;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      style={{ left: `${node.x - 70}px`, top: `${node.y}px` }}
                      className={`absolute w-[140px] p-2.5 rounded-xl border text-xs cursor-pointer transition-all duration-300 select-none ${
                        isSelected ? "ring-2 ring-cyan-400 shadow-cyan-500/20 shadow-lg" : ""
                      } ${
                        isActive
                          ? "bg-blue-600/30 border-blue-400 text-white shadow-lg shadow-blue-500/30 scale-105 z-20"
                          : "bg-[#16161f] border-white/10 text-gray-300 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px] truncate">{node.name}</span>
                        <span className="text-[9px] font-mono text-gray-400">
                          {node.tag.split(" ")[0]}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-blue-300 bg-blue-950/40 px-1.5 py-0.5 rounded truncate">
                        {val}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WorkInProgress Tree Container */}
          {(activeTreeTab === "both" || activeTreeTab === "wip") && (
            <div className="flex-1 bg-[#111116] border border-cyan-500/30 rounded-2xl p-4 shadow-xl relative">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span className="font-bold text-xs uppercase tracking-wider text-cyan-300">
                    WorkInProgress Tree (Heap Memory)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-500">workInProgressRoot</span>
              </div>

              {/* Render Nodes for WIP Tree */}
              <div className="relative h-[340px] w-full">
                <TreeSvgLayer nodes={INITIAL_NODES} isWip={true} />
                {Object.values(INITIAL_NODES).map((node) => {
                  const isActive = step.nodeId === node.id;
                  const isSelected = selectedNodeId === node.id;
                  const isTouched = currentStepIdx > 1;

                  let borderCls = "border-white/10 bg-[#16161f] text-gray-400";
                  if (isActive && step.workType === "beginWork") {
                    borderCls = "bg-cyan-600/30 border-cyan-400 text-white shadow-xl shadow-cyan-500/40 scale-105 z-20";
                  } else if (isActive && step.workType === "completeWork") {
                    borderCls = "bg-emerald-600/30 border-emerald-400 text-white shadow-xl shadow-emerald-500/40 scale-105 z-20";
                  } else if (isActive && step.workType === "commitMutation") {
                    borderCls = "bg-amber-600/30 border-amber-400 text-white shadow-xl shadow-amber-500/40 scale-105 z-20";
                  } else if (isTouched) {
                    borderCls = "bg-[#16161f] border-cyan-500/20 text-gray-200";
                  }

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      style={{ left: `${node.x - 70}px`, top: `${node.y}px` }}
                      className={`absolute w-[140px] p-2.5 rounded-xl border text-xs cursor-pointer transition-all duration-300 select-none ${
                        isSelected ? "ring-2 ring-cyan-400 shadow-cyan-500/20 shadow-lg" : ""
                      } ${borderCls}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px] truncate">{node.name}</span>
                        {isActive && (
                          <span className="text-[8px] font-bold font-mono px-1 rounded bg-cyan-400/20 text-cyan-300">
                            {step.workType}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded truncate">
                        {node.wipVal}
                      </div>
                      {node.isTarget && currentStepIdx >= 6 && currentStepIdx < 14 && (
                        <div className="mt-1 text-[8px] font-mono text-amber-300 font-bold">
                          flags: Update (4)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Controls & Playback */}
      <div className="p-4 sm:p-5 bg-[#0e0e13] border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        {/* Playback Button Group */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerUpdate}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Trigger setState()</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-white transition-all cursor-pointer"
            title={isPlaying ? "Pause" : "Auto-Play"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handleStepBackward}
            disabled={currentStepIdx <= 0 || isPlaying}
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-gray-300 hover:text-white transition-all cursor-pointer"
            title="Step Backward"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleStepForward}
            disabled={currentStepIdx >= STEPS.length - 1 || isPlaying}
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-gray-300 hover:text-white transition-all cursor-pointer"
            title="Step Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
          <span>Speed:</span>
          <div className="flex items-center gap-1">
            {[2000, 1200, 600].map((s, idx) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                  speed === s ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {idx === 0 ? "0.75x" : idx === 1 ? "1x" : "2x"}
              </button>
            ))}
          </div>
        </div>

        {/* Pointers Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span>
            <span>child (down)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-purple-400 inline-block"></span>
            <span>sibling (right)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span>
            <span>return (up)</span>
          </div>
        </div>
      </div>

      {/* Fiber Node Inspector Card */}
      <div className="p-5 bg-[#09090d] border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Fiber Node Internal Struct: &lt;{selectedNode.name} /&gt;
            </h4>
          </div>
          <span className="text-[10px] font-mono text-gray-500">
            Click any node in the canvas above to inspect its heap representation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#14141c] border border-white/5">
            <span className="text-gray-500 block text-[10px] mb-1">tag & type:</span>
            <div className="text-cyan-300 font-semibold">{selectedNode.tag}</div>
            <div className="text-gray-400 text-[11px] mt-0.5">{selectedNode.type}</div>
          </div>

          <div className="p-3 rounded-xl bg-[#14141c] border border-white/5">
            <span className="text-gray-500 block text-[10px] mb-1">child / sibling / return:</span>
            <div className="text-indigo-300 text-[11px]">
              child: {selectedNode.child ? `<${INITIAL_NODES[selectedNode.child].name}>` : "null"}
            </div>
            <div className="text-purple-300 text-[11px]">
              sibling: {selectedNode.sibling ? `<${INITIAL_NODES[selectedNode.sibling].name}>` : "null"}
            </div>
            <div className="text-emerald-300 text-[11px]">
              return: {selectedNode.return ? `<${INITIAL_NODES[selectedNode.return].name}>` : "null"}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#14141c] border border-white/5">
            <span className="text-gray-500 block text-[10px] mb-1">memoizedState:</span>
            <div className="text-emerald-300 font-semibold">{selectedNode.wipVal}</div>
            <div className="text-gray-500 text-[10px] mt-0.5">Linked list of hook nodes</div>
          </div>

          <div className="p-3 rounded-xl bg-[#14141c] border border-white/5">
            <span className="text-gray-500 block text-[10px] mb-1">alternate pointer:</span>
            <div className="text-cyan-300 font-semibold">FiberNode (Double Buffer)</div>
            <div className="text-gray-500 text-[10px] mt-0.5">
              current.alternate === workInProgress
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SVG Layer connecting nodes with child, sibling, and return arrows
function TreeSvgLayer({ nodes, isWip }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <marker id={`arrow-child-${isWip ? 'wip' : 'cur'}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#00d8fe" />
        </marker>
        <marker id={`arrow-sibling-${isWip ? 'wip' : 'cur'}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
        </marker>
        <marker id={`arrow-return-${isWip ? 'wip' : 'cur'}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
        </marker>
      </defs>

      {/* Root -> App (child) */}
      <line
        x1={nodes.root.x}
        y1={nodes.root.y + 35}
        x2={nodes.app.x}
        y2={nodes.app.y}
        stroke="#00d8fe"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        markerEnd={`url(#arrow-child-${isWip ? 'wip' : 'cur'})`}
      />

      {/* App -> Header (child) */}
      <line
        x1={nodes.app.x - 20}
        y1={nodes.app.y + 35}
        x2={nodes.header.x}
        y2={nodes.header.y}
        stroke="#00d8fe"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        markerEnd={`url(#arrow-child-${isWip ? 'wip' : 'cur'})`}
      />

      {/* Header -> Counter (sibling) */}
      <line
        x1={nodes.header.x + 55}
        y1={nodes.header.y + 15}
        x2={nodes.counter.x - 55}
        y2={nodes.counter.y + 15}
        stroke="#a855f7"
        strokeWidth="2"
        markerEnd={`url(#arrow-sibling-${isWip ? 'wip' : 'cur'})`}
      />

      {/* Counter -> App (return) */}
      <path
        d={`M ${nodes.counter.x - 10} ${nodes.counter.y} Q ${nodes.app.x + 40} ${nodes.counter.y - 20} ${nodes.app.x + 10} ${nodes.app.y + 35}`}
        fill="none"
        stroke="#10b981"
        strokeWidth="1"
        strokeDasharray="2 2"
        markerEnd={`url(#arrow-return-${isWip ? 'wip' : 'cur'})`}
      />

      {/* Counter -> Display (child) */}
      <line
        x1={nodes.counter.x - 20}
        y1={nodes.counter.y + 35}
        x2={nodes.display.x}
        y2={nodes.display.y}
        stroke="#00d8fe"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        markerEnd={`url(#arrow-child-${isWip ? 'wip' : 'cur'})`}
      />

      {/* Display -> Button (sibling) */}
      <line
        x1={nodes.display.x + 55}
        y1={nodes.display.y + 15}
        x2={nodes.btn.x - 55}
        y2={nodes.btn.y + 15}
        stroke="#a855f7"
        strokeWidth="2"
        markerEnd={`url(#arrow-sibling-${isWip ? 'wip' : 'cur'})`}
      />

      {/* Button -> Counter (return) */}
      <path
        d={`M ${nodes.btn.x - 10} ${nodes.btn.y} Q ${nodes.counter.x + 30} ${nodes.btn.y - 20} ${nodes.counter.x + 10} ${nodes.counter.y + 35}`}
        fill="none"
        stroke="#10b981"
        strokeWidth="1"
        strokeDasharray="2 2"
        markerEnd={`url(#arrow-return-${isWip ? 'wip' : 'cur'})`}
      />
    </svg>
  );
}
