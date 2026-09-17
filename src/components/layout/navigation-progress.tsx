"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  startNavigationProgress,
  subscribeNavigationProgressStart,
} from "@/lib/navigation-progress";
import { cn } from "@/lib/utils";

const SHOW_DELAY_MS = 180;
const COMPLETE_MS = 220;

function sameDocumentNavigation(url: URL) {
  return (
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  );
}

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const routeKeyRef = useRef(routeKey);

  const [phase, setPhase] = useState<"idle" | "pending" | "visible" | "done">(
    "idle",
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  const phaseRef = useRef(phase);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  phaseRef.current = phase;

  function clearTimers() {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }

  function begin() {
    clearTimers();
    setPhase("pending");
    showTimerRef.current = setTimeout(() => {
      setPhase("visible");
      showTimerRef.current = null;
    }, SHOW_DELAY_MS);
  }

  function finish() {
    clearTimers();
    const current = phaseRef.current;
    if (current === "idle") return;

    if (current === "pending") {
      setPhase("idle");
      return;
    }

    setPhase("done");
    hideTimerRef.current = setTimeout(
      () => {
        setPhase("idle");
        hideTimerRef.current = null;
      },
      reducedMotion ? 0 : COMPLETE_MS,
    );
  }

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => subscribeNavigationProgressStart(begin), []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || isModifiedClick(event) || event.button !== 0) {
        return;
      }
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;

      const hrefAttr = anchor.getAttribute("href");
      if (!hrefAttr || hrefAttr.startsWith("mailto:") || hrefAttr.startsWith("tel:")) {
        return;
      }

      const targetAttr = anchor.getAttribute("target");
      if (targetAttr && targetAttr !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(hrefAttr, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (sameDocumentNavigation(url)) return;

      begin();
    }

    function onPopState() {
      begin();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (routeKeyRef.current === routeKey) return;
    routeKeyRef.current = routeKey;
    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- settle only when the route identity changes
  }, [routeKey]);

  if (phase === "idle") return null;

  const showBar = phase === "visible" || phase === "done";

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] overflow-hidden"
      role="progressbar"
      aria-hidden={!showBar}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-busy={phase === "visible"}
    >
      <div
        className={cn(
          "h-full bg-[var(--request)]",
          !showBar && "opacity-0",
          phase === "done" && "w-full transition-[width,opacity] duration-200 ease-out",
          phase === "visible" &&
            (reducedMotion ? "w-1/3" : "nav-progress-indeterminate"),
        )}
      />
    </div>
  );
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}

export { startNavigationProgress };
