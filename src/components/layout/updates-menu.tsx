"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { latestUpdateId, siteUpdates } from "@/lib/changelog";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "mockdata-updates-seen";

function readSeenId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeSeenId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function UpdatesMenu() {
  const [open, setOpen] = useState(false);
  const [hasUnseen, setHasUnseen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    setHasUnseen(Boolean(latestUpdateId) && readSeenId() !== latestUpdateId);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && latestUpdateId) {
      writeSeenId(latestUpdateId);
      setHasUnseen(false);
    }
  }

  const latest = siteUpdates[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        className="relative grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
        aria-label="What's new"
        aria-expanded={open}
        aria-controls={panelId}
        title="What's new"
      >
        <Bell className="size-4" strokeWidth={1.75} aria-hidden />
        {hasUnseen ? (
          <span
            aria-hidden
            className="absolute top-1.5 right-1.5 flex size-2"
          >
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--request)] opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-[var(--request)]" />
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="What's new"
          className="absolute top-[calc(100%+0.4rem)] right-0 z-50 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-border bg-card shadow-lg"
        >
          <div className="border-b border-border px-3.5 py-2.5">
            <p className="text-[13px] font-semibold tracking-tight text-foreground">
              What&apos;s new
            </p>
            <p className="text-[11px] text-muted-foreground">
              Latest updates and features
            </p>
          </div>

          <ul className="max-h-[min(24rem,70vh)] overflow-y-auto py-1.5">
            {siteUpdates.map((item, index) => {
              const isLatest = index === 0;
              const body = (
                <>
                  <div className="mb-1 flex items-center gap-2">
                    <p
                      className={cn(
                        "min-w-0 flex-1 text-[13px] leading-snug",
                        isLatest
                          ? "font-semibold text-foreground"
                          : "font-medium text-foreground",
                      )}
                    >
                      {item.title}
                    </p>
                    {isLatest ? (
                      <span className="shrink-0 rounded bg-[var(--request-bg)] px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-[var(--request)] uppercase">
                        New
                      </span>
                    ) : null}
                  </div>
                  <p
                    className={cn(
                      "text-[12px] leading-5",
                      isLatest
                        ? "text-foreground/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.summary}
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                    {formatDate(item.date)}
                  </p>
                </>
              );

              return (
                <li key={item.id}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block px-3.5 py-2.5 transition-colors hover:bg-[var(--surface-hover)]",
                        isLatest && "bg-[var(--request-bg)]/40",
                      )}
                    >
                      {body}
                    </Link>
                  ) : (
                    <div
                      className={cn(
                        "px-3.5 py-2.5",
                        isLatest && "bg-[var(--request-bg)]/40",
                      )}
                    >
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {latest ? (
            <div className="border-t border-border px-3.5 py-2">
              <p className="truncate font-mono text-[10px] text-muted-foreground">
                Latest: {latest.title}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
