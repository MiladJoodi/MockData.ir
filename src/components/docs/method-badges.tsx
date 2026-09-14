import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  GET: "text-[var(--get)] bg-[var(--get)]/12 ring-1 ring-[var(--get)]/30",
  POST: "text-[var(--post)] bg-[var(--post)]/12 ring-1 ring-[var(--post)]/30",
  PATCH: "text-[var(--patch)] bg-[var(--patch)]/12 ring-1 ring-[var(--patch)]/30",
  PUT: "text-[var(--patch)] bg-[var(--patch)]/12 ring-1 ring-[var(--patch)]/30",
  DELETE: "text-[var(--delete)] bg-[var(--delete)]/12 ring-1 ring-[var(--delete)]/30",
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
