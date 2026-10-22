import { lazy, Suspense, useLayoutEffect } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";

// Core Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Prerequisites: HTML, CSS & Modern JavaScript for React
const HtmlEssentials = lazy(() => import("./pages/prerequisites/HtmlEssentials"));
const CssAndFlexbox = lazy(() => import("./pages/prerequisites/CssAndFlexbox"));
const JavascriptForReact = lazy(() => import("./pages/prerequisites/JavascriptForReact"));

// Module 0: Zero to React — Foundations for Absolute Beginners
const WhatIsUiAndDom = lazy(() => import("./pages/module0/WhatIsUiAndDom"));
const WhatIsAComponent = lazy(() => import("./pages/module0/WhatIsAComponent"));
const UnderstandingJsx = lazy(() => import("./pages/module0/UnderstandingJsx"));
const PropsPassingData = lazy(() => import("./pages/module0/PropsPassingData"));
const StateAndUseState = lazy(() => import("./pages/module0/StateAndUseState"));
const HandlingEventsAndForms = lazy(() => import("./pages/module0/HandlingEventsAndForms"));
const ConditionalRenderingAndLists = lazy(() => import("./pages/module0/ConditionalRenderingAndLists"));

// Module 1: The Core Mental Model & The Fiber Engine
const UiAsFunctionOfState = lazy(() => import("./pages/module1/UiAsFunctionOfState"));
const VdomVsRealDom = lazy(() => import("./pages/module1/VdomVsRealDom"));
const FiberReconciler = lazy(() => import("./pages/module1/FiberReconciler"));
const RenderAndCommit = lazy(() => import("./pages/module1/RenderAndCommit"));

// Module 2: The Complete Hooks Deep Dive
const UseStateBatching = lazy(() => import("./pages/module2/UseStateBatching"));
const UseEffectLifecycle = lazy(() => import("./pages/module2/UseEffectLifecycle"));
const UseRefDeepDive = lazy(() => import("./pages/module2/UseRefDeepDive"));
const UseMemoCallback = lazy(() => import("./pages/module2/UseMemoCallback"));
const CustomHooks = lazy(() => import("./pages/module2/CustomHooks"));

// Module 3: Rendering & Performance Engineering
const WhyComponentsRerender = lazy(() => import("./pages/module3/WhyComponentsRerender"));
const RenderCascadesMemo = lazy(() => import("./pages/module3/RenderCascadesMemo"));
const CompositionPatterns = lazy(() => import("./pages/module3/CompositionPatterns"));
const DomVirtualization = lazy(() => import("./pages/module3/DomVirtualization"));

// Module 4: Concurrent React & React 19 Modern Architecture
const ConcurrentTransitions = lazy(() => import("./pages/module4/ConcurrentTransitions"));
const ActionsAndForms = lazy(() => import("./pages/module4/ActionsAndForms"));
const OptimisticUi = lazy(() => import("./pages/module4/OptimisticUi"));
const UseAndSuspense = lazy(() => import("./pages/module4/UseAndSuspense"));
const RscFlightProtocol = lazy(() => import("./pages/module4/RscFlightProtocol"));

// Module 5: State Management & Architecture
const ContextApi = lazy(() => import("./pages/module5/ContextApi"));
const ExternalStores = lazy(() => import("./pages/module5/ExternalStores"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c10] text-gray-400">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-cyan-300">Mounting Fiber...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Prerequisites: HTML, CSS & Modern JavaScript for React */}
            <Route path="/prerequisites/html-essentials" element={<HtmlEssentials />} />
            <Route path="/prerequisites/css-and-flexbox" element={<CssAndFlexbox />} />
            <Route path="/prerequisites/javascript-for-react" element={<JavascriptForReact />} />

            {/* Module 0: Zero to React — Foundations for Absolute Beginners */}
            <Route path="/module-0/what-is-ui-and-dom" element={<WhatIsUiAndDom />} />
            <Route path="/module-0/what-is-a-component" element={<WhatIsAComponent />} />
            <Route path="/module-0/understanding-jsx" element={<UnderstandingJsx />} />
            <Route path="/module-0/props-passing-data" element={<PropsPassingData />} />
            <Route path="/module-0/state-and-usestate" element={<StateAndUseState />} />
            <Route path="/module-0/handling-events-and-forms" element={<HandlingEventsAndForms />} />
            <Route path="/module-0/conditional-rendering-and-lists" element={<ConditionalRenderingAndLists />} />

            {/* Module 1 */}
            <Route path="/module-1/ui-as-function-of-state" element={<UiAsFunctionOfState />} />
            <Route path="/module-1/vdom-vs-real-dom" element={<VdomVsRealDom />} />
            <Route path="/module-1/fiber-reconciler" element={<FiberReconciler />} />
            <Route path="/module-1/render-and-commit" element={<RenderAndCommit />} />

            {/* Module 2 */}
            <Route path="/module-2/use-state-batching" element={<UseStateBatching />} />
            <Route path="/module-2/use-effect-lifecycle" element={<UseEffectLifecycle />} />
            <Route path="/module-2/use-ref" element={<UseRefDeepDive />} />
            <Route path="/module-2/use-memo-callback" element={<UseMemoCallback />} />
            <Route path="/module-2/custom-hooks" element={<CustomHooks />} />

            {/* Module 3 */}
            <Route path="/module-3/why-components-rerender" element={<WhyComponentsRerender />} />
            <Route path="/module-3/render-cascades-memo" element={<RenderCascadesMemo />} />
            <Route path="/module-3/composition-patterns" element={<CompositionPatterns />} />
            <Route path="/module-3/dom-virtualization" element={<DomVirtualization />} />

            {/* Module 4 */}
            <Route path="/module-4/concurrent-transitions" element={<ConcurrentTransitions />} />
            <Route path="/module-4/actions-forms" element={<ActionsAndForms />} />
            <Route path="/module-4/optimistic-ui" element={<OptimisticUi />} />
            <Route path="/module-4/use-and-suspense" element={<UseAndSuspense />} />
            <Route path="/module-4/rsc-flight-protocol" element={<RscFlightProtocol />} />

            {/* Module 5 */}
            <Route path="/module-5/context-api" element={<ContextApi />} />
            <Route path="/module-5/external-stores" element={<ExternalStores />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </MotionConfig>
  );
}
