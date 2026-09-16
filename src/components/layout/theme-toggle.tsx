"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useUiLocale } from "@/components/providers/ui-locale-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { dict } = useUiLocale();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
      aria-label={isDark ? dict.header.lightMode : dict.header.darkMode}
      title={isDark ? dict.header.light : dict.header.dark}
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
    </button>
  );
}
