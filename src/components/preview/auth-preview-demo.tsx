"use client";

import { FormEvent, useEffect, useState } from "react";
import { MOCK_PASSWORD } from "@/lib/auth/constants";
import { useApiLocale, withApiLang } from "@/lib/api/use-api-locale";
import { cn } from "@/lib/utils";

type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
};

export function AuthPreviewDemo() {
  const locale = useApiLocale();
  const isFa = locale === "fa";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(MOCK_PASSWORD);
  const [token, setToken] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingUser(true);
    setPassword(MOCK_PASSWORD);
    (async () => {
      try {
        const res = await fetch(
          withApiLang("/api/users?limit=1&sort=name&order=asc", locale),
        );
        const payload = await res.json();
        const first = payload?.data?.[0] as AuthUser | undefined;
        if (!cancelled && first?.username) {
          setUsername(first.username);
        } else if (!cancelled) {
          setUsername("avachen");
        }
      } catch {
        if (!cancelled) setUsername("avachen");
      } finally {
        if (!cancelled) setLoadingUser(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch(withApiLang("/api/auth/login", locale), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload?.error?.message ?? "Login failed");
        setToken("");
        setUser(null);
        return;
      }
      setToken(payload.data?.token ?? "");
      setUser(payload.data?.user ?? null);
    } catch {
      setError("Network error");
    } finally {
      setPending(false);
    }
  }

  async function onMe() {
    if (!token) {
      setError("Login first to get a token");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch(withApiLang("/api/auth/me", locale), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload?.error?.message ?? "Me failed");
        return;
      }
      setUser(payload.data ?? null);
    } catch {
      setError("Network error");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-5" dir={isFa ? "rtl" : undefined}>
      <form
        onSubmit={onLogin}
        className={cn(
          "space-y-3 rounded-xl border border-border bg-card p-5",
          isFa && "font-[family-name:var(--font-vazirmatn)]",
        )}
      >
        <p className="text-[13px] text-muted-foreground">
          Demo password for every seeded user is{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
            {MOCK_PASSWORD}
          </code>
          .
        </p>
        <label className="block space-y-1 text-[12px]">
          <span className="text-muted-foreground">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loadingUser}
            dir="ltr"
            autoComplete="username"
            className="h-9 w-full rounded-md border border-border bg-muted px-3 font-mono text-[13px] outline-none focus-visible:border-[var(--request)]/50 disabled:opacity-60"
          />
        </label>
        <label className="block space-y-1 text-[12px]">
          <span className="text-muted-foreground">Password</span>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            dir="ltr"
            autoComplete="current-password"
            className="h-9 w-full rounded-md border border-border bg-muted px-3 font-mono text-[13px] outline-none focus-visible:border-[var(--request)]/50"
          />
        </label>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="submit"
            disabled={pending || loadingUser || !username}
            className="relative h-9 min-w-[5.5rem] rounded-md bg-[var(--request)] px-3 text-[13px] font-semibold text-white disabled:opacity-80"
          >
            <span className={cn(pending && "invisible")}>Login</span>
            {pending ? (
              <span className="absolute inset-0 grid place-items-center">
                …
              </span>
            ) : null}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => void onMe()}
            className="h-9 rounded-md border border-border px-3 text-[13px] hover:bg-[var(--surface-hover)] disabled:opacity-50"
          >
            GET /me
          </button>
        </div>
      </form>

      {error ? (
        <p className="rounded-md border border-[var(--delete)]/30 bg-[var(--delete)]/10 px-3 py-2 text-[13px] text-[var(--delete)]">
          {error}
        </p>
      ) : null}

      {token ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-1 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
            Token
          </p>
          <code className="block break-all font-mono text-[11px] text-[var(--request)]">
            {token}
          </code>
        </div>
      ) : null}

      {user ? (
        <div
          className={cn(
            "rounded-xl border border-border bg-card p-4 text-[13px]",
            isFa && "font-[family-name:var(--font-vazirmatn)]",
          )}
        >
          <p className="mb-2 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
            User
          </p>
          <p className="font-medium">{user.name}</p>
          <p className="text-muted-foreground" dir="ltr">
            @{user.username} · {user.email} · {user.role}
          </p>
        </div>
      ) : null}
    </div>
  );
}
