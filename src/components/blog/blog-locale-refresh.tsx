"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useUiLocale } from "@/components/providers/ui-locale-provider";
import type { UiLocale } from "@/lib/i18n/constants";

/**
 * When the header language switcher changes locale, refresh the RSC tree
 * so article MDX reloads for the new cookie locale (same language-neutral URL).
 */
export function BlogLocaleRefresh({
  serverLocale,
}: {
  serverLocale: UiLocale;
}) {
  const { locale, ready } = useUiLocale();
  const router = useRouter();
  const previous = useRef<UiLocale | null>(null);

  useEffect(() => {
    if (!ready) return;

    if (previous.current === null) {
      previous.current = locale;
      if (locale !== serverLocale) {
        router.refresh();
      }
      return;
    }

    if (previous.current !== locale) {
      previous.current = locale;
      router.refresh();
    }
  }, [locale, ready, router, serverLocale]);

  return null;
}
