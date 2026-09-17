"use client";

import { useEffect, useRef, useState } from "react";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { cn } from "@/lib/utils";

export function ResetSeedPanel() {
  const { dict, locale } = useUiLocale();
  const p = dict.docs.resetPanel;
  const isFa = locale === "fa";
  const [unlocked, setUnlocked] = useState(false);
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!unlocked) return;
    inputRef.current?.focus();
  }, [unlocked]);

  async function onReset() {
    if (!key.trim()) {
      setStatus("error");
      setMessage(p.needSecret);
      return;
    }
    if (!window.confirm(p.confirm)) {
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "x-admin-key": key.trim() },
      });
      const body = (await res.json()) as {
        data?: {
          users?: number;
          posts?: number;
          comments?: number;
          albums?: number;
          photos?: number;
          todos?: number;
          products?: number;
          notifications?: number;
          countries?: number;
        };
        error?: { message: string };
      };

      if (!res.ok) {
        setStatus("error");
        setMessage(body.error?.message ?? `Request failed (${res.status})`);
        return;
      }

      setStatus("ok");
      const d = body.data;
      setMessage(
        `${p.donePrefix} — users ${d?.users ?? "?"}, posts ${d?.posts ?? "?"}, products ${d?.products ?? "?"}, notifications ${d?.notifications ?? "?"}, countries ${d?.countries ?? "?"}.`,
      );
    } catch {
      setStatus("error");
      setMessage(p.networkError);
    }
  }

  function onButtonClick() {
    if (!unlocked) {
      setUnlocked(true);
      setStatus("idle");
      setMessage("");
      return;
    }
    void onReset();
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-end gap-2" dir="ltr">
        {unlocked ? (
          <input
            ref={inputRef}
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void onReset();
            }}
            placeholder={p.placeholder}
            autoComplete="off"
            dir={isFa ? "rtl" : "ltr"}
            className={cn(
              "min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-[var(--request)]/50",
              isFa && "font-fa-label",
            )}
          />
        ) : null}
        <button
          type="button"
          onClick={onButtonClick}
          disabled={status === "loading"}
          className={cn(
            "shrink-0 rounded-md border border-[var(--delete)]/40 bg-[var(--delete)]/10 px-3 py-2 text-[13px] font-semibold text-[var(--delete)] transition-colors hover:bg-[var(--delete)]/20 disabled:opacity-50",
            isFa && "font-fa-label",
          )}
        >
          {status === "loading" ? p.resetting : p.button}
        </button>
      </div>

      {message ? (
        <p
          className={
            status === "ok"
              ? "text-[13px] text-[var(--get)]"
              : "text-[13px] text-[var(--delete)]"
          }
          role="status"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
