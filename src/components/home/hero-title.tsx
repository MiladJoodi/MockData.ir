"use client";

import { useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/seo";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "mockdata-hero-reveal-v3";

function hasPlayed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markPlayed(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private mode / quota */
  }
}

export function HeroTitle({ className }: { className?: string }) {
  const [mode, setMode] = useState<"pending" | "static" | "play">("pending");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || hasPlayed()) {
      setMode("static");
      return;
    }

    setMode("play");
    markPlayed();
  }, []);

  const letters = SITE_NAME.split("");

  return (
    <h1
      className={cn(
        "text-5xl leading-[0.92] font-semibold tracking-[-0.05em] sm:text-7xl",
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
        <span className="hero-title-rule" />
      </span>
    </h1>
  );
}
