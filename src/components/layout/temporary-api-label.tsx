"use client";

import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { cn } from "@/lib/utils";

/** "API موقت" / "Temporary API" without RTL reversing the words. */
export function TemporaryApiLabel({ className }: { className?: string }) {
  const { locale, dict } = useUiLocale();

  if (locale !== "fa") {
    return (
      <span className={cn("ltr-tech", className)} dir="ltr">
        {dict.common.temporary}
      </span>
    );
  }

  return (
    <span className={cn("font-fa-label", className)} dir="rtl">
      <span className="ltr-tech" dir="ltr">
        API
      </span>
      {"\u00A0"}
      موقت
    </span>
  );
}
