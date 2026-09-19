"use client";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  body?: string;
  className?: string;
};

export function EmptyState({ title, body, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-card/40 px-4 py-10 text-center",
        className,
      )}
    >
      <p className="text-[14px] font-medium text-foreground">{title}</p>
      {body ? (
        <p className="max-w-sm text-[13px] leading-relaxed text-muted-foreground">
          {body}
        </p>
      ) : null}
    </div>
  );
}
