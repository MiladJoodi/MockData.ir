"use client";

import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolbarProps = {
  children: ReactNode;
  className?: string;
};

export function WorkbenchToolbar({ children, className }: ToolbarProps) {
  return (
    <div
      role="toolbar"
      className={cn(
        "flex flex-wrap items-center gap-2 border-b border-border pb-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

const btnBase =
  "inline-flex h-9 items-center justify-center rounded-md text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--request)]/45 disabled:pointer-events-none disabled:opacity-45";

export const workbenchPrimaryBtn = cn(
  btnBase,
  "gap-1.5 bg-[var(--request)] px-3 text-white hover:opacity-90",
);

export const workbenchGhostBtn = cn(
  btnBase,
  "gap-1.5 border border-border bg-card px-3 text-foreground hover:bg-[var(--surface-hover)]",
);

export const workbenchIconBtn = cn(
  btnBase,
  "size-9 border border-border bg-card p-0 text-muted-foreground hover:bg-[var(--surface-hover)] hover:text-foreground",
);

type ActionButtonProps = {
  onClick: () => void;
  label: string;
  className?: string;
  disabled?: boolean;
};

/** Action button — same bordered style as Sort (not green Run). */
export function RunButton({
  onClick,
  label,
  className,
  disabled,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={cn(workbenchGhostBtn, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

type ClearButtonProps = {
  onClick: () => void;
  label: string;
  className?: string;
};

export function ClearButton({ onClick, label, className }: ClearButtonProps) {
  return (
    <button
      type="button"
      className={cn(workbenchIconBtn, className)}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <Trash2 className="size-3.5" aria-hidden />
    </button>
  );
}
