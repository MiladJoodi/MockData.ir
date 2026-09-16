"use client";

import { useState } from "react";
import { GENERATOR_QTY_PRESETS } from "@/lib/generator/constants";
import type { GeneratorOutputMode } from "@/lib/generator/modes";
import { cn } from "@/lib/utils";

export function QuantityAndModeRow({
  quantity,
  onQuantityChange,
  mode,
  onModeChange,
  recordsLabel,
  customLabel,
  modeLabel,
  modePayload,
  modeApi,
  modeHint,
  isFa,
}: {
  quantity: number;
  onQuantityChange: (n: number) => void;
  mode: GeneratorOutputMode;
  onModeChange: (mode: GeneratorOutputMode) => void;
  recordsLabel: string;
  customLabel: string;
  modeLabel: string;
  modePayload: string;
  modeApi: string;
  modeHint: string;
  isFa: boolean;
}) {
  const isPreset = (GENERATOR_QTY_PRESETS as readonly number[]).includes(
    quantity,
  );
  const [customOpen, setCustomOpen] = useState(!isPreset);

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:items-start sm:gap-5">
      <div className="space-y-2">
        <p
          className={cn(
            "text-[13px] font-medium text-foreground",
            isFa && "font-fa-label",
          )}
        >
          {recordsLabel}
        </p>
        <div
          className="inline-flex max-w-full flex-wrap items-center gap-0 overflow-hidden rounded-lg border border-border"
          role="group"
          aria-label={recordsLabel}
        >
          {GENERATOR_QTY_PRESETS.map((n, index) => {
            const selected = !customOpen && quantity === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setCustomOpen(false);
                  onQuantityChange(n);
                }}
                aria-pressed={selected}
                className={cn(
                  "min-w-11 px-2.5 py-2 text-[13px] tabular-nums transition-colors",
                  index > 0 && "border-s border-border",
                  selected
                    ? "bg-[var(--request)]/15 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )}
              >
                {n.toLocaleString(isFa ? "fa-IR" : "en-US")}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setCustomOpen(true)}
            aria-pressed={customOpen}
            className={cn(
              "border-s border-border px-2.5 py-2 text-[12px] transition-colors",
              customOpen
                ? "bg-[var(--request)]/15 font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              isFa && "font-fa-label",
            )}
          >
            {customLabel}
          </button>
        </div>
        {customOpen ? (
          <input
            type="number"
            min={1}
            max={1000}
            inputMode="numeric"
            autoFocus
            value={quantity}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") return;
              const n = Number(raw);
              if (!Number.isFinite(n)) return;
              onQuantityChange(Math.min(1000, Math.max(1, Math.floor(n))));
            }}
            className="w-28 rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground tabular-nums outline-none focus-visible:border-foreground/30 focus-visible:ring-2 focus-visible:ring-foreground/15"
            dir="ltr"
            aria-label={customLabel}
          />
        ) : null}
      </div>

      <div className="space-y-2">
        <p
          className={cn(
            "text-[13px] font-medium text-foreground",
            isFa && "font-fa-label",
          )}
        >
          {modeLabel}
        </p>
        <div
          className="inline-flex overflow-hidden rounded-lg border border-border"
          role="group"
          aria-label={modeLabel}
        >
          {(
            [
              ["payload", modePayload],
              ["api", modeApi],
            ] as const
          ).map(([id, label], index) => {
            const active = mode === id;
            return (
              <button
                key={id}
                type="button"
                title={modeHint}
                aria-pressed={active}
                onClick={() => onModeChange(id)}
                className={cn(
                  "px-3 py-2 text-[12px] transition-colors",
                  index > 0 && "border-s border-border",
                  active
                    ? "bg-[var(--request)]/15 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                  isFa && "font-fa-label",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p
          className={cn(
            "text-[11px] leading-4 text-muted-foreground",
            isFa && "font-fa-label",
          )}
        >
          {modeHint}
        </p>
      </div>
    </div>
  );
}
