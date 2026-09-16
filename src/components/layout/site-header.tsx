import Link from "next/link";
import { Mail } from "lucide-react";
import { ApiLocaleToggle } from "@/components/layout/api-locale-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UpdatesMenu } from "@/components/layout/updates-menu";
import { cn } from "@/lib/utils";

const links = [
  { href: "/playground", label: "Playground", featured: true },
  { href: "/docs", label: "Docs" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[var(--header-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-5 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-[15px] font-semibold tracking-tight text-foreground select-none"
        >
          MockData.ir
        </Link>

        <nav
          className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto sm:gap-1"
          aria-label="Primary"
        >
          {links.map((link) => {
            const featured = "featured" in link && link.featured;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded px-2 py-1.5 text-[12px] transition-colors sm:px-2.5 sm:text-[13px]",
                  featured
                    ? "font-medium text-foreground hover:bg-[var(--surface-hover)]"
                    : "text-muted-foreground hover:bg-[var(--surface-hover)] hover:text-foreground",
                )}
              >
                {link.label}
                {featured ? (
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-[var(--request)]"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ApiLocaleToggle />
          <UpdatesMenu />
          <ThemeToggle />
          <Link
            href="/contact"
            aria-label="Contact"
            title="Contact"
            className="grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
          >
            <Mail className="size-4" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </header>
  );
}
