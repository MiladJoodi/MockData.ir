"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Toggle chip used by Remove empty / Extract / Pick / Omit. */
export function WorkbenchCheckChip({
  checked,
  onClick,
  title,
  children,
  className,
  disabled,
}: {
  checked: boolean;
  onClick: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-md border px-2 py-1 text-start transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--request)]/45",
        "disabled:pointer-events-none disabled:opacity-45",
        checked
          ? "border-[var(--request)]/40 bg-[var(--request)]/15"
          : "border-border bg-transparent hover:bg-[var(--surface-hover)]",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded-full border",
          checked
            ? "border-[var(--request)]/50 bg-[var(--request)]/20 text-[var(--request)]"
            : "border-border bg-transparent text-transparent",
        )}
        aria-hidden
      >
        <Check className="size-2.5" strokeWidth={3} />
      </span>
      {children}
    </button>
  );
}

/** Compact action chip matching Remove-empty density (Select all / Clear). */
export function WorkbenchChipButton({
  onClick,
  children,
  disabled,
  className,
}: {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-transparent px-2 py-1 text-[12px] text-muted-foreground transition-colors",
        "hover:bg-[var(--surface-hover)] hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--request)]/45",
        "disabled:pointer-events-none disabled:opacity-45",
        className,
      )}
    >
      {children}
    </button>
  );
}
