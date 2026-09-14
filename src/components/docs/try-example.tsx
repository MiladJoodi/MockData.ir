import Link from "next/link";
import { CopyButton } from "@/components/docs/copy-button";

export function TryExample({ href }: { href: string }) {
  return (
    <div className="flex min-w-0 items-center gap-0.5">
      <span className="shrink-0 text-[11px] text-muted-foreground">Try:</span>
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        title={href}
        className="min-w-0 truncate font-mono text-[11px] text-[var(--request)] underline-offset-2 hover:underline"
      >
        {href}
      </Link>
      <CopyButton value={href} label="Copy example URL" />
    </div>
  );
}
