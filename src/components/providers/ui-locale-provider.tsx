"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  UI_LOCALE_EVENT,
  type UiLocale,
} from "@/lib/i18n/constants";
import {
  applyDocumentLocale,
  readStoredUiLocale,
  writeUiLocale,
} from "@/lib/i18n/client-locale";
import { getDictionary, type Messages } from "@/lib/i18n/get-dictionary";

type UiLocaleContextValue = {
  locale: UiLocale;
  dict: Messages;
  setLocale: (locale: UiLocale) => void;
  ready: boolean;
};

const UiLocaleContext = createContext<UiLocaleContextValue | null>(null);

export function UiLocaleProvider({
  children,
  initialLocale = "fa",
}: {
  children: ReactNode;
  initialLocale?: UiLocale;
}) {
  const [locale, setLocaleState] = useState<UiLocale>(initialLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredUiLocale();
    setLocaleState(stored);
    applyDocumentLocale(stored);
    // Keep API sample-data preference aligned with UI on load.
    writeUiLocale(stored);
    setReady(true);

    function onLocale(e: Event) {
      const next = (e as CustomEvent<UiLocale>).detail;
      if (next === "en" || next === "fa") {
        setLocaleState(next);
        applyDocumentLocale(next);
      }
    }
    window.addEventListener(UI_LOCALE_EVENT, onLocale);
    return () => window.removeEventListener(UI_LOCALE_EVENT, onLocale);
  }, []);

  const setLocale = useCallback((next: UiLocale) => {
    writeUiLocale(next);
    setLocaleState(next);
    applyDocumentLocale(next);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      dict: getDictionary(locale),
      setLocale,
      ready,
    }),
    [locale, setLocale, ready],
  );

  return (
    <UiLocaleContext.Provider value={value}>{children}</UiLocaleContext.Provider>
  );
}

export function useUiLocale() {
  const ctx = useContext(UiLocaleContext);
  if (!ctx) {
    throw new Error("useUiLocale must be used within UiLocaleProvider");
  }
  return ctx;
}
