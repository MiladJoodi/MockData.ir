"use client";

import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { locale, setLocale, dict } = useUiLocale();

  return (
    <div
      role="group"
      aria-label={dict.header.apiLangGroup}
      className="flex items-center gap-0.5 text-[12px] tabular-nums"
      title={dict.header.apiLangGroup}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded px-1.5 py-1 transition-colors",
          locale === "en"
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-pressed={locale === "en"}
      >
        {dict.header.english}
      </button>
      <span className="text-border" aria-hidden>
        |
      </span>
      <button
        type="button"
        onClick={() => setLocale("fa")}
        className={cn(
          "font-fa-label rounded px-1.5 py-1 transition-colors",
          locale === "fa"
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-pressed={locale === "fa"}
        lang="fa"
      >
        {dict.header.persian}
      </button>
    </div>
  );
}
