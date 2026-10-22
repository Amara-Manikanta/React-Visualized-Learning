import { ALL_TOPICS, MODULES } from "../config/navigation";

export function neighbours(pathname) {
  const cleanPath = pathname.split("#")[0].replace(/\/$/, "");
  const idx = ALL_TOPICS.findIndex((t) => t.path === cleanPath);
  if (idx === -1) return { prev: null, next: null };

  return {
    prev: idx > 0 ? ALL_TOPICS[idx - 1] : null,
    next: idx < ALL_TOPICS.length - 1 ? ALL_TOPICS[idx + 1] : null,
  };
}

export function sectionFor(pathname) {
  const cleanPath = pathname.split("#")[0].replace(/\/$/, "");
  const moduleFound = MODULES.find((m) =>
    m.topics.some((t) => t.path === cleanPath)
  );

  if (!moduleFound) return null;

  return {
    group: moduleFound.shortTitle,
    title: moduleFound.title,
    items: moduleFound.topics,
  };
}
