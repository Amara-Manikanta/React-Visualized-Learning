import { useState, useEffect } from "react";

const STORAGE_KEY = "react_visualized_read_pages";

export function getReadPages() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function setRead(pathname, read) {
  if (typeof window === "undefined") return;
  const current = getReadPages();
  const cleanPath = pathname.split("#")[0].replace(/\/$/, "");
  if (read) {
    current.add(cleanPath);
  } else {
    current.delete(cleanPath);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
    window.dispatchEvent(new Event("react_visualized_progress_change"));
  } catch {
    // Ignore storage quota
  }
}

export function useReadPages() {
  const [read, setReadState] = useState(() => getReadPages());

  useEffect(() => {
    const handler = () => setReadState(getReadPages());
    window.addEventListener("react_visualized_progress_change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("react_visualized_progress_change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return read;
}
