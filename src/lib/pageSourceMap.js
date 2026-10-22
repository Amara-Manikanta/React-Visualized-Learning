// Imports all page source files at build time as raw strings so they work 100% offline
const rawPages = import.meta.glob("../pages/**/*.jsx", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Map route path to source file path inside repo
export const ROUTE_TO_FILE_MAP = {
  // Prerequisites
  "/prerequisites/html-essentials": "src/pages/prerequisites/HtmlEssentials.jsx",
  "/prerequisites/css-and-flexbox": "src/pages/prerequisites/CssAndFlexbox.jsx",
  "/prerequisites/javascript-for-react": "src/pages/prerequisites/JavascriptForReact.jsx",

  // Module 0
  "/module-0/what-is-ui-and-dom": "src/pages/module0/WhatIsUiAndDom.jsx",
  "/module-0/what-is-a-component": "src/pages/module0/WhatIsAComponent.jsx",
  "/module-0/understanding-jsx": "src/pages/module0/UnderstandingJsx.jsx",
  "/module-0/props-passing-data": "src/pages/module0/PropsPassingData.jsx",
  "/module-0/state-and-usestate": "src/pages/module0/StateAndUseState.jsx",
  "/module-0/handling-events-and-forms": "src/pages/module0/HandlingEventsAndForms.jsx",
  "/module-0/conditional-rendering-and-lists": "src/pages/module0/ConditionalRenderingAndLists.jsx",

  // Module 1
  "/module-1/ui-as-function-of-state": "src/pages/module1/UiAsFunctionOfState.jsx",
  "/module-1/vdom-vs-real-dom": "src/pages/module1/VdomVsRealDom.jsx",
  "/module-1/fiber-reconciler": "src/pages/module1/FiberReconciler.jsx",
  "/module-1/render-and-commit": "src/pages/module1/RenderAndCommit.jsx",

  // Module 2
  "/module-2/use-state-batching": "src/pages/module2/UseStateBatching.jsx",
  "/module-2/use-effect-lifecycle": "src/pages/module2/UseEffectLifecycle.jsx",
  "/module-2/use-ref": "src/pages/module2/UseRefDeepDive.jsx",
  "/module-2/use-memo-callback": "src/pages/module2/UseMemoCallback.jsx",
  "/module-2/custom-hooks": "src/pages/module2/CustomHooks.jsx",

  // Module 3
  "/module-3/why-components-rerender": "src/pages/module3/WhyComponentsRerender.jsx",
  "/module-3/render-cascades-memo": "src/pages/module3/RenderCascadesMemo.jsx",
  "/module-3/composition-patterns": "src/pages/module3/CompositionPatterns.jsx",
  "/module-3/dom-virtualization": "src/pages/module3/DomVirtualization.jsx",

  // Module 4
  "/module-4/concurrent-transitions": "src/pages/module4/ConcurrentTransitions.jsx",
  "/module-4/actions-forms": "src/pages/module4/ActionsAndForms.jsx",
  "/module-4/optimistic-ui": "src/pages/module4/OptimisticUi.jsx",
  "/module-4/use-and-suspense": "src/pages/module4/UseAndSuspense.jsx",
  "/module-4/rsc-flight-protocol": "src/pages/module4/RscFlightProtocol.jsx",

  // Module 5
  "/module-5/context-api": "src/pages/module5/ContextApi.jsx",
  "/module-5/external-stores": "src/pages/module5/ExternalStores.jsx",
};

/**
 * Get the original bundled source code for a route
 */
export function getOriginalSource(pathname) {
  const clean = pathname.split("#")[0].replace(/\/$/, "");
  const filePath = ROUTE_TO_FILE_MAP[clean];
  if (!filePath) return null;

  // Key in rawPages is relative to this file: ../pages/...
  const relativeKey = filePath.replace("src/pages/", "../pages/");
  return rawPages[relativeKey] || null;
}

/**
 * Get the repository file path for a route
 */
export function getFilePathForRoute(pathname) {
  const clean = pathname.split("#")[0].replace(/\/$/, "");
  return ROUTE_TO_FILE_MAP[clean] || null;
}

/**
 * LocalStorage draft helpers for mobile editing
 */
const DRAFT_PREFIX = "react_visualized_draft_";

export function getSavedDraft(pathname) {
  const clean = pathname.split("#")[0].replace(/\/$/, "");
  try {
    return localStorage.getItem(`${DRAFT_PREFIX}${clean}`) || null;
  } catch {
    return null;
  }
}

export function saveDraft(pathname, code) {
  const clean = pathname.split("#")[0].replace(/\/$/, "");
  try {
    localStorage.setItem(`${DRAFT_PREFIX}${clean}`, code);
  } catch (e) {
    console.error("Failed to save draft to localStorage:", e);
  }
}

export function clearDraft(pathname) {
  const clean = pathname.split("#")[0].replace(/\/$/, "");
  try {
    localStorage.removeItem(`${DRAFT_PREFIX}${clean}`);
  } catch (e) {
    console.error("Failed to clear draft from localStorage:", e);
  }
}
