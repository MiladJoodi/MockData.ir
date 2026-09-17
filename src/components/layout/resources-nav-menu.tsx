"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { apiResources } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type MenuPos = {
  top: number;
  left?: number;
  right?: number;
};

function positionForButton(
  button: HTMLButtonElement,
  preferEnd: boolean,
): MenuPos {
  const rect = button.getBoundingClientRect();
  const width = 200;
  const pad = 8;
  const top = rect.bottom + 4;
  const fitsStart = rect.left + width <= window.innerWidth - pad;
  const useEnd = preferEnd || !fitsStart;

  if (useEnd) {
    return {
      top,
      right: Math.max(pad, window.innerWidth - rect.right),
    };
  }
  return {
    top,
    left: Math.max(pad, rect.left),
  };
}

export function ResourcesNavMenu({
  className,
  linkClassName,
}: {
  className?: string;
  linkClassName?: string;
}) {
  const { dict, locale } = useUiLocale();
  const isFa = locale === "fa";
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPos | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) {
      setMenuPos(null);
      return;
    }
    setMenuPos(positionForButton(buttonRef.current, isFa));
  }, [open, isFa]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onReposition() {
      if (!buttonRef.current) return;
      setMenuPos(positionForButton(buttonRef.current, isFa));
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, isFa]);

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-[13px] text-muted-foreground whitespace-nowrap transition-colors",
          "hover:bg-[var(--surface-hover)] hover:text-foreground",
          open && "bg-[var(--surface-hover)] text-foreground",
          isFa && "font-fa-label",
          linkClassName,
        )}
      >
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform",
            open && "rotate-180",
          )}
          strokeWidth={2}
          aria-hidden
        />
        {dict.home.resourcesTitle}
      </button>

      {open && menuPos ? (
        <div
          id={menuId}
          role="menu"
          aria-label={dict.home.resourcesTitle}
          style={{
            top: menuPos.top,
            left: menuPos.left,
            right: menuPos.right,
          }}
          className="fixed z-50 max-h-[min(24rem,70vh)] w-[12.5rem] overflow-y-auto rounded-lg border border-border bg-background py-1 shadow-md"
        >
          {apiResources.map((resource) => {
            const title =
              dict.catalog[resource.id]?.title ?? resource.title;
            return (
              <Link
                key={resource.id}
                href={resource.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground",
                  isFa && "font-fa-label",
                )}
              >
                {title}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
