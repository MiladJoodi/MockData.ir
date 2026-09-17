"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Home,
  Languages,
  Mail,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ResourcesNavMenu } from "@/components/layout/resources-nav-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useTheme } from "@/components/providers/theme-provider";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { cn } from "@/lib/utils";

const drawerIconClass = "size-4 shrink-0 text-muted-foreground";

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

  function closeMenu() {
    setMenuOpen(false);
  }

  const navLinkClass = cn(
    "inline-flex shrink-0 items-center rounded-md px-2 py-1.5 text-[13px] text-muted-foreground whitespace-nowrap transition-colors",
    "hover:bg-[var(--surface-hover)] hover:text-foreground",
    isFa && "font-fa-label",
  );

  const temporaryLabel = (
    <span dir="ltr" className="ltr-tech">
      {dict.common.temporary}
    </span>
  );

  const drawerItemClass = cn(
    "flex w-full items-center gap-2.5 px-4 py-2.5 text-start text-[13px] text-foreground transition-colors",
    "hover:bg-[var(--surface-hover)]",
    isFa && "font-fa-label",
  );

  const menuButton = (
    <button
      type="button"
      className="grid size-10 shrink-0 place-items-center rounded-md text-foreground transition-colors hover:bg-[var(--surface-hover)] md:hidden"
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
  );

  const brand = (
    <Link
      href="/"
      aria-label={dict.common.home}
      title={dict.common.home}
      className="hidden shrink-0 items-center rounded-md text-foreground transition-colors hover:opacity-80 md:inline-flex"
      onClick={closeMenu}
    >
      <span
        className="text-[15px] font-semibold tracking-tight ltr-tech"
        dir="ltr"
      >
        MockData.ir
      </span>
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-[var(--header-bg)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
          <div className="md:hidden">{menuButton}</div>
          {brand}

          <nav
            className={cn(
              "flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto md:hidden",
              // FA header is RTL, so reverse keeps Playground near the menu and Resources last.
              isFa && "flex-row-reverse",
            )}
            aria-label={dict.header.primaryNav}
            dir="ltr"
          >
            <Link href="/playground" className={navLinkClass}>
              {dict.common.playground}
            </Link>
            <Link href="/temporary" className={navLinkClass}>
              {temporaryLabel}
            </Link>
            <Link href="/generator" className={navLinkClass}>
              {dict.common.generator}
            </Link>
            <ResourcesNavMenu />
          </nav>

          <nav
            className="hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto md:flex"
            aria-label={dict.header.primaryNav}
          >
            <Link href="/playground" className={navLinkClass}>
              {dict.common.playground}
            </Link>
            <Link href="/temporary" className={navLinkClass}>
              {temporaryLabel}
            </Link>
            <Link href="/generator" className={navLinkClass}>
              {dict.common.generator}
            </Link>
            <ResourcesNavMenu />
            <Link href="/docs" className={navLinkClass}>
              {dict.common.docs}
            </Link>
          </nav>

          <div className="hidden shrink-0 items-center gap-0.5 md:flex">
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
        </div>
      </header>

      {menuOpen ? (
        <div className="md:hidden" id={panelId}>
          <button
            type="button"
            className="fixed inset-0 z-50 bg-black/45"
            aria-label={dict.common.close}
            onClick={closeMenu}
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label={dict.header.menu}
            className={cn(
              "fixed inset-y-0 z-50 flex w-[min(15rem,80vw)] flex-col bg-background",
              "animate-in fade-in-0 duration-200",
              isFa
                ? "right-0 border-s border-border slide-in-from-right-3"
                : "left-0 border-e border-border slide-in-from-left-3",
            )}
          >
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
              <span
                className={cn(
                  "text-[14px] font-medium text-foreground",
                  isFa && "font-fa-label",
                )}
              >
                {dict.header.menu}
              </span>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--surface-hover)]"
                aria-label={dict.common.close}
                onClick={closeMenu}
              >
                <X className="size-4" strokeWidth={1.75} aria-hidden />
              </button>
            </div>

            <nav
              className="flex min-h-0 flex-1 flex-col overflow-y-auto py-1"
              aria-label={dict.header.menu}
            >
              <Link href="/" onClick={closeMenu} className={drawerItemClass}>
                <Home className={drawerIconClass} strokeWidth={1.75} aria-hidden />
                {dict.common.home}
              </Link>
              <Link
                href="/docs"
                onClick={closeMenu}
                className={drawerItemClass}
              >
                <BookOpen
                  className={drawerIconClass}
                  strokeWidth={1.75}
                  aria-hidden
                />
                {dict.common.docs}
              </Link>

              <button
                type="button"
                onClick={() => setLocale(isFa ? "en" : "fa")}
                className={drawerItemClass}
                aria-label={dict.header.apiLangGroup}
              >
                <Languages
                  className={drawerIconClass}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="flex-1">{dict.header.apiLangGroup}</span>
                <span className="text-[12px] text-muted-foreground" dir="ltr">
                  {isFa ? "FA" : "EN"}
                </span>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className={drawerItemClass}
                aria-label={
                  isDark ? dict.header.lightMode : dict.header.darkMode
                }
              >
                {isDark ? (
                  <Moon
                    className={drawerIconClass}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                ) : (
                  <Sun
                    className={drawerIconClass}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                )}
                <span className="flex-1">
                  {isDark ? dict.header.dark : dict.header.light}
                </span>
              </button>
              <Link
                href="/contact"
                onClick={closeMenu}
                className={drawerItemClass}
              >
                <Mail
                  className={drawerIconClass}
                  strokeWidth={1.75}
                  aria-hidden
                />
                {dict.header.contact}
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
