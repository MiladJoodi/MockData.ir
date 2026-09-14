"use client";

import { useState } from "react";

export function ResetSeedPanel() {
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onReset() {
    if (!key.trim()) {
      setStatus("error");
      setMessage("Enter the admin secret first.");
      return;
    }
      if (
      !window.confirm(
        "This wipes seed tables and reloads default data. Continue?",
      )
    ) {
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
        `Reset complete — users ${d?.users ?? "?"}, posts ${d?.posts ?? "?"}, products ${d?.products ?? "?"}, notifications ${d?.notifications ?? "?"}, countries ${d?.countries ?? "?"}.`,
      );
    } catch {
      setStatus("error");
      setMessage("Network error. Is the server running?");
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <p className="text-[13px] leading-6 text-muted-foreground">
        Enter the admin secret to wipe and reload default seed data.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Admin secret"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-[13px] outline-none focus:border-[var(--request)]/50"
        />
        <button
          type="button"
          onClick={onReset}
          disabled={status === "loading"}
          className="rounded-md border border-[var(--delete)]/40 bg-[var(--delete)]/10 px-3 py-2 text-[13px] font-semibold text-[var(--delete)] transition-colors hover:bg-[var(--delete)]/20 disabled:opacity-50"
        >
          {status === "loading" ? "Resetting…" : "Reset seed"}
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
