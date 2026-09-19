"use client";

import { useUiLocale } from "@/components/providers/ui-locale-provider";
import {
  formatJsonErrorLocation,
  translateJsonParseReason,
} from "@/lib/json-workbench/json-error-i18n";
import { cn } from "@/lib/utils";

type Props = {
  message: string;
  line?: number;
  column?: number;
  position?: number;
  /** Optional side label shown before the message (e.g. JSON A). */
  sideLabel?: string;
  className?: string;
};

export function ParseError({
  message,
  line,
  column,
  position,
  sideLabel,
  className,
}: Props) {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench.errors;
  const isFa = locale === "fa";

  const reason = translateJsonParseReason(message, t);
  const loc = formatJsonErrorLocation(t, { line, column, position });
  const body = loc ? `${reason} (${loc})` : reason;
  const text = sideLabel ? `${sideLabel}: ${body}` : body;

  return (
    <p
      role="alert"
      dir={isFa ? "rtl" : "ltr"}
      className={cn(
        "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[13px] text-destructive",
        isFa && "font-fa-label",
        className,
      )}
    >
      <span dir="auto">{text}</span>
    </p>
  );
}
