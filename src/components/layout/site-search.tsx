"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { searchResources } from "@/lib/catalog";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";

type SiteSearchProps = {
  large?: boolean;
  autofocus?: boolean;
};

export function SiteSearch({ large = false, autofocus = false }: SiteSearchProps) {
  const router = useRouter();
  const { locale, dict } = useUiLocale();
  const isFa = locale === "fa";
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebouncedValue(value, 160);
  const results = useMemo(
    () => searchResources(debounced, dict.catalog),
    [debounced, dict.catalog],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        rootRef.current?.querySelector("input")?.focus();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (results[0]) {
      router.push(results[0].resource.href);
      setOpen(false);
      return;
    }
    if (value.trim()) {
      router.push(`/docs`);
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <form onSubmit={onSubmit} role="search">
        <label htmlFor={inputId} className="sr-only">
          {dict.home.searchLabel}
        </label>
        <div className="relative">
          <Search
            className={cn(
              "pointer-events-none absolute top-1/2 start-3 -translate-y-1/2 text-muted-foreground",
              large ? "size-4" : "size-3.5",
            )}
            aria-hidden
          />
          <input
            id={inputId}
            type="search"
            autoComplete="off"
            autoFocus={autofocus}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={
              large ? dict.home.searchPlaceholder : dict.common.searchPlaceholder
            }
            className={cn(
              "w-full border border-border bg-card text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/60 focus:border-[var(--request)]/60 focus:ring-2 focus:ring-[var(--request)]/20",
              large
                ? "h-12 rounded-lg pe-4 ps-10 text-[15px]"
                : "h-9 rounded-md pe-3 ps-9 text-[13px]",
              isFa && "font-fa-label",
            )}
            dir={isFa ? "rtl" : "ltr"}
          />
        </div>
      </form>

      {open && debounced.trim() ? (
        <div
          className="absolute top-[calc(100%+6px)] inset-inline-0 z-[100] overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/20 dark:shadow-black/50"
          role="listbox"
        >
          {results.length === 0 ? (
            <p
              className={cn(
                "px-3 py-3.5 text-[13px] text-muted-foreground",
                isFa && "font-fa-label",
              )}
            >
              {dict.common.noResults}
            </p>
          ) : (
            <ul className="max-h-80 overflow-auto py-1">
              {results.map(({ resource, matches }) => {
                const cat = dict.catalog[resource.id];
                return (
                  <li key={resource.id}>
                    <Link
                      href={resource.href}
                      className="block px-3 py-2 hover:bg-[var(--surface-hover)]"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={cn(
                            "text-[13px] font-semibold",
                            isFa && "font-fa-label",
                          )}
                        >
                          {cat?.title ?? resource.title}
                        </span>
                        <span
                          className="shrink-0 font-mono text-[11px] text-[var(--request)] ltr-tech"
                          dir="ltr"
                        >
                          {resource.basePath}
                        </span>
                      </div>
                      {cat?.summary ? (
                        <p
                          className={cn(
                            "mt-0.5 line-clamp-1 text-[11px] text-muted-foreground",
                            isFa && "font-fa-label",
                          )}
                        >
                          {cat.summary}
                        </p>
                      ) : null}
                    </Link>
                    {matches.slice(0, 3).map((endpoint) => (
                      <Link
                        key={`${resource.id}-${endpoint.path}`}
                        href={resource.href}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--surface-hover)]"
                        onClick={() => setOpen(false)}
                        dir="ltr"
                      >
                        <span className="w-10 shrink-0 font-mono text-[10px] font-medium text-[var(--get)]">
                          {endpoint.methods.split(/[\s/]/)[0]}
                        </span>
                        <span className="truncate font-mono text-[11px] text-muted-foreground">
                          {endpoint.path}
                        </span>
                      </Link>
                    ))}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
