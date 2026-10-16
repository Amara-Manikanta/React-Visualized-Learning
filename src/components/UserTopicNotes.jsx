import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, Bookmark, X, Save, ChevronDown, ChevronUp } from "lucide-react";

export default function UserTopicNotes({ pagePath, toc = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newPoint, setNewPoint] = useState("");
  const [selectedSection, setSelectedSection] = useState("General");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const cleanPath = (pagePath || window.location.pathname).replace(/\/$/, "");
  const storageKey = `react_viz_notes_${cleanPath}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setNotes(JSON.parse(saved));
      } else {
        setNotes([]);
      }
    } catch {
      setNotes([]);
    }
  }, [storageKey]);

  const saveNotes = (updatedNotes) => {
    setNotes(updatedNotes);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } catch {
      // Ignore quota error
    }
  };

  const handleAddPoint = (e) => {
    e.preventDefault();
    if (!newPoint.trim()) return;

    const newEntry = {
      id: Date.now().toString(),
      text: newPoint.trim(),
      section: selectedSection,
      createdAt: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      completed: false,
    };

    saveNotes([newEntry, ...notes]);
    setNewPoint("");
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const handleSaveEdit = (id) => {
    if (!editText.trim()) return;
    const updated = notes.map((item) =>
      item.id === id ? { ...item, text: editText.trim() } : item
    );
    saveNotes(updated);
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = (id) => {
    const updated = notes.filter((item) => item.id !== id);
    saveNotes(updated);
  };

  const handleToggleComplete = (id) => {
    const updated = notes.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    saveNotes(updated);
  };

  return (
    <div className="mt-12 pt-8 border-t border-white/10" id="user-notes">
      <div className="rounded-2xl bg-gradient-to-r from-cyan-950/30 via-[#111116] to-indigo-950/30 border border-white/10 p-5 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Bookmark className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Your Topic Notes & Mental Models</h3>
                {notes.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {notes.length} {notes.length === 1 ? "note" : "notes"}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Save personal takeaways, internal Fiber pointers, or interview insights. Stored 100% offline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showNotification && (
              <span className="text-xs font-bold text-emerald-400 font-mono animate-pulse">
                Saved offline ✓
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{isOpen ? "Collapse" : "Open Notes"}</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-5 pt-5 border-t border-white/10 space-y-5">
            <form onSubmit={handleAddPoint} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                {toc.length > 0 && (
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="bg-[#09090d] border border-white/15 rounded-xl px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 shrink-0"
                  >
                    <option value="General">📍 Entire Lesson</option>
                    {toc.map((t, idx) => (
                      <option key={idx} value={t.label}>
                        § {t.label}
                      </option>
                    ))}
                  </select>
                )}

                <input
                  type="text"
                  placeholder="Record an intuition, edge-case trap, or mental model..."
                  value={newPoint}
                  onChange={(e) => setNewPoint(e.target.value)}
                  className="flex-1 bg-[#09090d] border border-white/15 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />

                <button
                  type="submit"
                  disabled={!newPoint.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap shadow-lg shadow-cyan-600/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Note</span>
                </button>
              </div>
            </form>

            {notes.length === 0 ? (
              <div className="py-6 text-center rounded-xl bg-black/30 border border-white/5 text-gray-400 text-xs">
                No custom notes for this lesson yet. Type above to write your first takeaway!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {notes.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      item.completed
                        ? "bg-black/20 border-white/5 opacity-60"
                        : "bg-black/40 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => handleToggleComplete(item.id)}
                        className={`mt-0.5 text-xs transition-colors cursor-pointer ${
                          item.completed ? "text-emerald-400" : "text-gray-500 hover:text-white"
                        }`}
                        title={item.completed ? "Mark incomplete" : "Mark complete"}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <div className="flex-1 min-w-0">
                        {editingId === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full bg-[#16161f] border border-cyan-400 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="p-1 rounded bg-cyan-600 text-white text-xs hover:bg-cyan-500 cursor-pointer"
                              title="Save"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 rounded bg-white/10 text-gray-400 hover:text-white text-xs cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                                {item.section}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono">{item.createdAt}</span>
                            </div>
                            <p
                              className={`text-xs md:text-sm leading-relaxed ${
                                item.completed ? "line-through text-gray-500" : "text-gray-200"
                              }`}
                            >
                              {item.text}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {editingId !== item.id && (
                      <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          title="Edit note"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
