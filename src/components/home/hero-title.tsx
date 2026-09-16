"use client";

import { useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/seo";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "mockdata-hero-load-id";

export function HeroTitle({ className }: { className?: string }) {
  const [mode, setMode] = useState<"pending" | "static" | "play">("pending");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setMode("static");
      return;
    }

    const loadId = String(performance.timeOrigin);
    let alreadyPlayed = false;
    try {
      alreadyPlayed = window.sessionStorage.getItem(STORAGE_KEY) === loadId;
    } catch {
      /* private mode */
    }

    if (alreadyPlayed) {
      setMode("static");
      return;
    }

    setMode("play");

    // Mark after a tick so React Strict Mode remount still gets "play"
    // once; soft client navigations later see the same loadId and stay static.
    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, loadId);
      } catch {
        /* ignore */
      }
    }, 50);

    return () => window.clearTimeout(timer);
  }, []);

  const letters = SITE_NAME.split("");

  return (
    <h1
      className={cn(
        "max-w-full text-5xl leading-[0.92] font-semibold tracking-[-0.05em] sm:text-7xl",
        className,
      )}
      dir="ltr"
    >
      <span className="sr-only">{SITE_NAME}</span>
      <span
        aria-hidden="true"
        className={cn(
          "hero-title-stage relative inline-block ltr-tech",
          mode === "pending" && "invisible",
          mode === "play" && "hero-title-play",
        )}
        style={{ ["--hero-n" as string]: letters.length }}
        dir="ltr"
      >
        <span className="inline-flex">
          {letters.map((char, i) => (
            <span
              key={i}
              className="hero-letter-mask inline-block overflow-hidden pb-[0.08em]"
            >
              <span
                className="hero-letter-face inline-block will-change-transform"
                style={{ ["--hero-i" as string]: i }}
              >
                {char}
              </span>
            </span>
          ))}
        </span>
        <span className="hero-title-sheen" />
      </span>
    </h1>
  );
}
