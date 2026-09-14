import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  GET: "text-[var(--get)] bg-[var(--get)]/15 ring-1 ring-[var(--get)]/25",
  POST: "text-[var(--post)] bg-[var(--post)]/15 ring-1 ring-[var(--post)]/25",
  PATCH: "text-[var(--patch)] bg-[var(--patch)]/15 ring-1 ring-[var(--patch)]/25",
  PUT: "text-[var(--patch)] bg-[var(--patch)]/15 ring-1 ring-[var(--patch)]/25",
  DELETE: "text-[var(--delete)] bg-[var(--delete)]/15 ring-1 ring-[var(--delete)]/25",
};

export function MethodBadges({ methods }: { methods: string }) {
  const parts = methods
    .split(/[/\s]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <span className="inline-flex flex-wrap gap-1">
      {parts.map((method) => (
        <span
          key={method}
          className={cn(
            "inline-flex rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide",
            tones[method] ?? "bg-muted text-muted-foreground",
          )}
        >
          {method}
        </span>
      ))}
    </span>
  );
}
