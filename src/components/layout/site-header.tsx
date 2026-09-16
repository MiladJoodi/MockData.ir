"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Home, Mail, Menu, Moon, Sun, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useTheme } from "@/components/providers/theme-provider";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import type { UiLocale } from "@/lib/i18n/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { dict, locale, setLocale } = useUiLocale();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelId = useId();
  const isFa = locale === "fa";
  const isDark = theme === "dark";

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const topLinks = [
    {
      href: "/playground",
      label: dict.common.playground,
      featured: true,
    },
    {
      href: "/#resources",
      label: dict.home.resourcesTitle,
      featured: false,
    },
  ] as const;

  function pickLocale(next: UiLocale) {
    setLocale(next);
  }

  const linkClass = (featured?: boolean) =>
    cn(
      "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] whitespace-nowrap transition-colors",
      isFa && "font-fa-label",
      featured
        ? "font-medium text-foreground hover:bg-[var(--surface-hover)]"
        : "text-muted-foreground hover:bg-[var(--surface-hover)] hover:text-foreground",
    );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-[var(--header-bg)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
          <Link
            href="/"
            aria-label={dict.common.home}
            title={dict.common.home}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-foreground transition-colors hover:bg-[var(--surface-hover)] md:size-auto md:rounded-none md:hover:bg-transparent"
            onClick={() => setMenuOpen(false)}
          >
            <Home
              className="size-5 md:hidden"
              strokeWidth={1.75}
              aria-hidden
            />
            <span
              className="hidden text-[15px] font-semibold tracking-tight ltr-tech md:inline"
              dir="ltr"
            >
              MockData.ir
            </span>
          </Link>

          <nav
            className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto"
            aria-label={dict.header.primaryNav}
          >
            {topLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(link.featured)}
              >
                {link.label}
                {link.featured ? (
                  <span
                    aria-hidden
                    className="size-1.5 shrink-0 rounded-full bg-[var(--request)]"
                  />
                ) : null}
              </Link>
            ))}

            <Link
              href="/docs"
              className={cn(linkClass(false), "hidden md:inline-flex")}
            >
              {dict.common.docs}
            </Link>
          </nav>

          <div className="ms-auto flex shrink-0 items-center gap-0.5">
            <div className="hidden items-center gap-0.5 md:flex">
              <LanguageSwitcher />
              <ThemeToggle />
              <Link
                href="/contact"
                aria-label={dict.header.contact}
                title={dict.header.contact}
                className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
              >
                <Mail className="size-4" strokeWidth={1.75} aria-hidden />
              </Link>
            </div>

            <button
              type="button"
              className="grid size-10 place-items-center rounded-md text-foreground transition-colors hover:bg-[var(--surface-hover)] md:hidden"
              aria-expanded={menuOpen}
              aria-controls={panelId}
              aria-label={menuOpen ? dict.common.close : dict.header.openMenu}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X className="size-5" strokeWidth={1.75} aria-hidden />
              ) : (
                <Menu className="size-5" strokeWidth={1.75} aria-hidden />
              )}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="md:hidden" id={panelId}>
          <button
            type="button"
            className="fixed inset-0 z-50 bg-black/45"
            aria-label={dict.common.close}
            onClick={() => setMenuOpen(false)}
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label={dict.header.menu}
            className={cn(
              "fixed inset-y-0 end-0 z-50 flex w-[min(15.5rem,80vw)] flex-col bg-background",
              "border-s border-border",
              "animate-in fade-in-0 duration-200",
              isFa ? "slide-in-from-left-4" : "slide-in-from-right-4",
            )}
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
              <span
                className={cn(
                  "text-[15px] font-semibold text-foreground",
                  isFa && "font-fa-label",
                )}
              >
                {dict.header.menu}
              </span>
              <button
                type="button"
                className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
                aria-label={dict.common.close}
                onClick={() => setMenuOpen(false)}
              >
                <X className="size-4" strokeWidth={1.75} aria-hidden />
              </button>
            </div>

            <nav
              className="flex flex-col py-1"
              aria-label={dict.header.menu}
            >
              <Link
                href="/docs"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "px-4 py-3 text-[14px] text-foreground transition-colors hover:bg-[var(--surface-hover)]",
                  isFa && "font-fa-label",
                )}
              >
                {dict.common.docs}
              </Link>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "px-4 py-3 text-[14px] text-foreground transition-colors hover:bg-[var(--surface-hover)]",
                  isFa && "font-fa-label",
                )}
              >
                {dict.header.contact}
              </Link>
              <button
                type="button"
                onClick={() => pickLocale(locale === "fa" ? "en" : "fa")}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3 text-start text-[14px] text-foreground transition-colors hover:bg-[var(--surface-hover)]",
                  isFa && "font-fa-label",
                )}
                aria-label={dict.header.apiLangGroup}
              >
                <span>{dict.header.apiLangGroup}</span>
                <span
                  className="text-[13px] text-muted-foreground tabular-nums"
                  dir="ltr"
                >
                  {locale === "fa" ? "FA" : "EN"}
                </span>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3 text-start text-[14px] text-foreground transition-colors hover:bg-[var(--surface-hover)]",
                  isFa && "font-fa-label",
                )}
                aria-label={
                  isDark ? dict.header.lightMode : dict.header.darkMode
                }
              >
                <span>{isDark ? dict.header.dark : dict.header.light}</span>
                {isDark ? (
                  <Moon
                    className="size-4 text-muted-foreground"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                ) : (
                  <Sun
                    className="size-4 text-muted-foreground"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                )}
              </button>
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
