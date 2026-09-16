"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
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
}: {
  value: string | null;
  onChange: (id: string) => void;
  topicLabels: Record<string, { name: string; description?: string }>;
  categoryLabels: Record<string, string>;
  placeholder: string;
  searchPlaceholder: string;
  label: string;
  isFa: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
    inputRef.current?.focus();
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
          "flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-white px-3.5 py-2.5 text-start text-[14px] transition-colors dark:bg-background",
          "hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
          isFa && "font-fa-label",
        )}
      >
        <span
          className={cn(
            "truncate",
            !value && "text-muted-foreground",
          )}
        >
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
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
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
          <div className="max-h-64 overflow-y-auto py-1">
            {grouped.length === 0 ? (
              <p
                className={cn(
                  "px-3 py-6 text-center text-[13px] text-muted-foreground",
                  isFa && "font-fa-label",
                )}
              >
                —
              </p>
            ) : (
              grouped.map(({ cat, items }) => (
                <div key={cat} className="py-1">
                  <p
                    className={cn(
                      "px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80",
                      isFa && "font-fa-label normal-case tracking-normal",
                    )}
                  >
                    {categoryLabels[cat] ?? cat}
                  </p>
                  {items.map((t) => {
                    const selected = t.id === value;
                    const Icon = t.icon;
                    const copy = topicLabels[t.id];
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={cn(
                          "flex w-full items-start gap-2.5 px-3 py-2 text-start transition-colors",
                          selected
                            ? "bg-[var(--surface-hover)]"
                            : "hover:bg-[var(--surface-hover)]/70",
                          isFa && "font-fa-label",
                        )}
                        onClick={() => {
                          onChange(t.id);
                          setOpen(false);
                          setQuery("");
                        }}
                      >
                        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-border bg-background">
                          <Icon
                            className="size-3.5 text-muted-foreground"
                            strokeWidth={2}
                            aria-hidden
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
                            {copy?.name ?? t.id}
                            {selected ? (
                              <Check className="size-3.5 shrink-0" aria-hidden />
                            ) : null}
                          </span>
                          {copy?.description ? (
                            <span className="mt-0.5 line-clamp-1 block text-[11px] text-muted-foreground">
                              {copy.description}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
