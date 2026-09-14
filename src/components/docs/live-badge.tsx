export function LiveBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[var(--get)]"
      title="Live · API is active"
    >
      <span className="relative flex size-1.5" aria-hidden>
        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--get)] opacity-45" />
        <span className="relative size-1.5 rounded-full bg-[var(--get)]" />
      </span>
      LIVE
    </span>
  );
}
