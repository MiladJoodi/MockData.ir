"use client";

import { FormEvent, useEffect, useState, type MouseEvent } from "react";
import { Check } from "lucide-react";
import { MOCK_PASSWORD } from "@/lib/auth/constants";
import { withApiLang } from "@/lib/api/use-api-locale";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { cn } from "@/lib/utils";

type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
};

export function AuthPreviewDemo() {
  const { dict, locale } = useUiLocale();
  const isFa = locale === "fa";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(MOCK_PASSWORD);
  const [token, setToken] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
    setSuccess(null);
    try {
      const res = await fetch(withApiLang("/api/auth/login", locale), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload?.error?.message ?? dict.common.networkError);
        setToken("");
        setUser(null);
        setSuccess(null);
        return;
      }
      setToken(payload.data?.token ?? "");
      setUser(payload.data?.user ?? null);
      setSuccess(dict.preview.loginSuccess);
    } catch {
      setError(dict.preview.networkError);
      setSuccess(null);
    } finally {
      setPending(false);
    }
  }

  function onLogout(e?: MouseEvent<HTMLButtonElement>) {
    e?.preventDefault();
    e?.stopPropagation();
    setPending(false);
    setToken("");
    setUser(null);
    setSuccess(null);
    setError(null);
  }

  async function onMe() {
    if (!token) {
      setError(dict.preview.loginFirst);
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
        setError(payload?.error?.message ?? dict.common.networkError);
        return;
      }
      setUser(payload.data ?? null);
    } catch {
      setError(dict.preview.networkError);
    } finally {
      setPending(false);
    }
  }

  const loggedIn = Boolean(token);

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
          {dict.preview.authDemoPassword}{" "}
          <code
            className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] ltr-tech"
            dir="ltr"
          >
            {MOCK_PASSWORD}
          </code>
          .
        </p>
        <label className="block space-y-1 text-[12px]">
          <span className="text-muted-foreground">{dict.preview.username}</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loadingUser || loggedIn}
            dir="ltr"
            autoComplete="username"
            className="h-9 w-full rounded-md border border-border bg-muted px-3 font-mono text-[13px] outline-none focus-visible:border-[var(--request)]/50 disabled:opacity-60 ltr-tech"
          />
        </label>
        <label className="block space-y-1 text-[12px]">
          <span className="text-muted-foreground">{dict.preview.password}</span>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loggedIn}
            dir="ltr"
            autoComplete="current-password"
            className="h-9 w-full rounded-md border border-border bg-muted px-3 font-mono text-[13px] outline-none focus-visible:border-[var(--request)]/50 disabled:opacity-60 ltr-tech"
          />
        </label>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="submit"
            disabled={pending || loadingUser || !username || loggedIn}
            className={cn(
              "relative h-9 min-w-[5.5rem] rounded-md bg-[var(--request-fill)] px-3 text-[13px] font-semibold text-white disabled:opacity-50",
              isFa && "font-fa-label",
            )}
          >
            <span className={cn(pending && !loggedIn && "invisible")}>
              {dict.preview.login}
            </span>
            {pending && !loggedIn ? (
              <span className="absolute inset-0 grid place-items-center">
                …
              </span>
            ) : null}
          </button>
          <button
            type="button"
            disabled={pending || !loggedIn}
            onClick={() => void onMe()}
            className="h-9 rounded-md border border-border px-3 text-[13px] hover:bg-[var(--surface-hover)] disabled:opacity-50 ltr-tech"
          >
            {dict.preview.getMe}
          </button>
        </div>
      </form>

      {error ? (
        <p
          className={cn(
            "rounded-md border border-[var(--delete)]/30 bg-[var(--delete)]/10 px-3 py-2 text-[13px] text-[var(--delete)]",
            isFa && "font-fa-label",
          )}
        >
          {error}
        </p>
      ) : null}

      {loggedIn ? (
        <div
          className={cn(
            "space-y-4 rounded-xl border border-border bg-card p-5",
            isFa && "font-fa-label",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            {success ? (
              <div
                role="status"
                className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-[var(--response)]"
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[var(--response)] text-white">
                  <Check className="size-3" strokeWidth={2.5} aria-hidden />
                </span>
                {success}
              </div>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={onLogout}
              className={cn(
                "h-9 shrink-0 rounded-md border border-[var(--delete)]/40 bg-[var(--delete)]/10 px-3 text-[13px] font-semibold text-[var(--delete)] transition-colors hover:bg-[var(--delete)]/15",
                isFa && "font-fa-label",
              )}
            >
              {dict.preview.logout}
            </button>
          </div>

          {user ? (
            <div className="space-y-2.5 text-[13px]">
              <p className="text-[12px] font-medium text-foreground">
                {dict.preview.user}
              </p>
              <dl className="space-y-2">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <dt className="shrink-0 text-muted-foreground">
                    {dict.preview.fieldLabels.name}:
                  </dt>
                  <dd className="min-w-0 font-medium text-foreground">
                    {user.name}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <dt className="shrink-0 text-muted-foreground">
                    {dict.preview.username}:
                  </dt>
                  <dd className="min-w-0 font-mono text-[12px] ltr-tech" dir="ltr">
                    @{user.username}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <dt className="shrink-0 text-muted-foreground">
                    {dict.preview.fieldLabels.email}:
                  </dt>
                  <dd className="min-w-0 break-all font-mono text-[12px] ltr-tech" dir="ltr">
                    {user.email}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <dt className="shrink-0 text-muted-foreground">
                    {dict.preview.fieldLabels.role}:
                  </dt>
                  <dd className="min-w-0 text-foreground">
                    {dict.preview.roleLabels[user.role] ?? user.role}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}

          {token ? (
            <div className="space-y-1.5 border-t border-border pt-4">
              <p className="text-[12px] font-medium text-foreground">
                {dict.preview.token}
              </p>
              <code
                className="block break-all rounded-md bg-muted px-3 py-2 font-mono text-[11px] text-[var(--request)] ltr-tech"
                dir="ltr"
              >
                {token}
              </code>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
