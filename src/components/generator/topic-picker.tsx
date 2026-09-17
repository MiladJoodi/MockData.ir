"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { GENERATOR_CATEGORIES } from "@/lib/generator/constants";
import { GENERATOR_TOPICS } from "@/lib/generator/registry";
import { cn } from "@/lib/utils";

export function TopicPicker({
  value,
  onChange,
  topicLabels,
  categoryLabels,
  placeholder,
  searchPlaceholder,
  label,
  isFa,
  emptySearchLabel,
}: {
  value: string | null;
  onChange: (id: string) => void;
  topicLabels: Record<string, { name: string; description?: string }>;
  categoryLabels: Record<string, string>;
  placeholder: string;
  searchPlaceholder: string;
  label: string;
  isFa: boolean;
  emptySearchLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const selectedLabel = value
    ? (topicLabels[value]?.name ?? value)
    : placeholder;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GENERATOR_TOPICS.filter((t) => {
      if (!q) return true;
      const copy = topicLabels[t.id];
      const hay =
        `${copy?.name ?? ""} ${copy?.description ?? ""} ${t.id} ${t.category}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, topicLabels]);

  const grouped = useMemo(() => {
    return GENERATOR_CATEGORIES.map((cat) => ({
      cat,
      items: filtered.filter((t) => t.category === cat),
    })).filter((g) => g.items.length > 0);
  }, [filtered]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    setQuery("");
  }, [open]);

  useLayoutEffect(() => {
    if (!open || query.trim()) return;
    const id = requestAnimationFrame(() => {
      selectedRef.current?.scrollIntoView({
        block: "center",
        inline: "nearest",
      });
      const coarse =
        typeof window !== "undefined" &&
        window.matchMedia("(pointer: coarse)").matches;
      if (!coarse) inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open, query, value, grouped]);

  return (
    <div className="space-y-2" ref={rootRef}>
      <p
        id={`${listId}-label`}
        className={cn(
          "text-[13px] font-medium text-foreground",
          isFa && "font-fa-label",
        )}
      >
        {label}
      </p>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${listId}-label`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-border bg-white px-3.5 text-start text-[14px] transition-colors dark:bg-background",
          "hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
          open && "border-foreground/30 ring-2 ring-foreground/15",
          isFa && "font-fa-label",
        )}
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {selectedLabel}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          className="overflow-hidden rounded-xl border border-border bg-white shadow-md dark:bg-card"
          id={listId}
          role="listbox"
          aria-labelledby={`${listId}-label`}
        >
          <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-white px-3 py-2.5 dark:bg-card">
            <Search
              className="size-3.5 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className={cn(
                "min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground",
                isFa && "font-fa-label",
              )}
            />
          </div>
          <div className="max-h-80 overflow-y-auto overscroll-contain px-3 py-2">
            {grouped.length === 0 ? (
              <p
                className={cn(
                  "px-1 py-8 text-center text-[13px] text-muted-foreground",
                  isFa && "font-fa-label",
                )}
              >
                {emptySearchLabel ?? "—"}
              </p>
            ) : (
              <div className="space-y-3">
                {grouped.map(({ cat, items }) => (
                  <div key={cat} className="space-y-1.5">
                    <p
                      className={cn(
                        "text-[11px] font-medium text-muted-foreground",
                        isFa ? "font-fa-label" : "uppercase tracking-wide",
                      )}
                    >
                      {categoryLabels[cat] ?? cat}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((t) => {
                        const selected = t.id === value;
                        const Icon = t.icon;
                        const copy = topicLabels[t.id];
                        return (
                          <button
                            key={t.id}
                            ref={selected ? selectedRef : undefined}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            title={copy?.name ?? t.id}
                            className={cn(
                              "inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] transition-colors",
                              selected
                                ? "border-[var(--request)]/40 bg-[var(--request)]/12 font-medium text-foreground"
                                : "border-border text-muted-foreground hover:border-foreground/20 hover:bg-[var(--surface-hover)] hover:text-foreground",
                              isFa && "font-fa-label",
                            )}
                            onClick={() => {
                              onChange(t.id);
                              setOpen(false);
                              setQuery("");
                            }}
                          >
                            <Icon
                              className="size-3.5 shrink-0"
                              strokeWidth={2}
                              aria-hidden
                            />
                            <span className="truncate">{copy?.name ?? t.id}</span>
                            {selected ? (
                              <Check
                                className="size-3 shrink-0 text-[var(--request)]"
                                strokeWidth={2.5}
                                aria-hidden
                              />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
