"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleAlert,
  Trash2,
  WandSparkles,
} from "lucide-react";
import { CopyButton } from "@/components/docs/copy-button";
import { HighlightedJsonEditor } from "@/components/playground/highlighted-json-editor";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import {
  loadStoredTemporaryApis,
  mergeServerTemporaryList,
  removeStoredTemporaryApi,
  clearStoredTemporaryApis,
  upsertStoredTemporaryApi,
  type StoredTemporaryApi,
} from "@/lib/temporary/client-store";
import { formatExpiresIn } from "@/lib/temporary/format-expires";
import {
  TEMPORARY_DURATIONS,
  TEMPORARY_LIMITS,
  type TemporaryDuration,
} from "@/lib/temporary/limits";
import {
  validateTemporaryJson,
  type ValidateIssue,
  type ValidateIssueCode,
} from "@/lib/temporary/validate-json";
import { en } from "@/lib/i18n/messages/en";
import { fa } from "@/lib/i18n/messages/fa";
import { cn } from "@/lib/utils";

const SAMPLE_JSON = {
  en: en.temporary.sampleJson,
  fa: fa.temporary.sampleJson,
} as const;

type JsonStatus = "idle" | "ok" | "error" | "fix";

export function TemporaryPageContent() {
  const { dict, locale } = useUiLocale();
  const t = dict.temporary;
  const isFa = locale === "fa";

  const [json, setJson] = useState(
    () => SAMPLE_JSON[locale === "fa" ? "fa" : "en"],
  );
  const [duration, setDuration] = useState<TemporaryDuration>("12h");
  const [fixedText, setFixedText] = useState<string | null>(null);
  const [issueCodes, setIssueCodes] = useState<ValidateIssue[]>([]);
  const [jsonStatus, setJsonStatus] = useState<JsonStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [checking, setChecking] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StoredTemporaryApi | null>(
    null,
  );
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [list, setList] = useState<StoredTemporaryApi[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [justCreated, setJustCreated] = useState<StoredTemporaryApi | null>(
    null,
  );

  useEffect(() => {
    const next = SAMPLE_JSON[locale === "fa" ? "fa" : "en"];
    setJson((current) => {
      if (current === SAMPLE_JSON.en || current === SAMPLE_JSON.fa) {
        return next;
      }
      return current;
    });
    resetJsonFeedback();
  }, [locale]);

  const durationLabels: Record<TemporaryDuration, string> = {
    "1h": t.duration1h,
    "6h": t.duration6h,
    "12h": t.duration12h,
    "24h": t.duration24h,
  };

  function localizeIssue(issue: ValidateIssue): string {
    const template = t.issues[issue.code as ValidateIssueCode] ?? issue.code;
    return template
      .replace("{max}", String(issue.meta?.max ?? ""))
      .replace("{key}", issue.meta?.key ?? "");
  }

  async function syncList() {
    const local = loadStoredTemporaryApis();
    setList(local);
    try {
      const res = await fetch("/api/temporary", { credentials: "include" });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.data) return;
      const merged = mergeServerTemporaryList(
        payload.data as Omit<StoredTemporaryApi, "manageToken">[],
      );
      setList(merged);
    } catch {
      /* keep local */
    }
  }

  useEffect(() => {
    void syncList();
  }, []);

  useEffect(() => {
    if (!highlightId) return;
    const timer = window.setTimeout(() => setHighlightId(null), 2800);
    return () => window.clearTimeout(timer);
  }, [highlightId]);

  const activeCount = useMemo(
    () =>
      list.filter((item) => new Date(item.expiresAt).getTime() > Date.now())
        .length,
    [list],
  );
  const atLimit = activeCount >= TEMPORARY_LIMITS.maxActivePerClient;

  function resetJsonFeedback() {
    setError(null);
    setIssueCodes([]);
    setFixedText(null);
    setJsonStatus("idle");
  }

  function applyValidation(result: ReturnType<typeof validateTemporaryJson>) {
    if (!result.ok) {
      setIssueCodes(result.issues);
      setFixedText(result.fixed && result.fixedText ? result.fixedText : null);
      setJsonStatus(result.fixed && result.fixedText ? "fix" : "error");
      return false;
    }
    if (result.fixed && result.fixedText) {
      setIssueCodes(result.issues);
      setFixedText(result.fixedText);
      setJsonStatus("fix");
      return false;
    }
    setIssueCodes([]);
    setFixedText(null);
    setJsonStatus("ok");
    return true;
  }

  function runCheck() {
    setChecking(true);
    setError(null);
    try {
      applyValidation(validateTemporaryJson(json));
    } finally {
      setChecking(false);
    }
  }

  async function createApi(jsonBody: string, acceptFixFlag: boolean) {
    if (atLimit) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/temporary", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: jsonBody,
          duration,
          acceptFix: acceptFixFlag || undefined,
        }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        if (payload?.error?.code === "LIMIT_REACHED") {
          await syncList();
          return;
        }
        if (payload?.error?.code === "JSON_NEEDS_FIX") {
          const fixed =
            payload.error.details?.fixedText ??
            (typeof payload.error.details?.fixedData !== "undefined"
              ? JSON.stringify(payload.error.details.fixedData, null, 2)
              : null);
          setFixedText(fixed);
          const remoteIssues = (payload.error.details?.issues ??
            []) as ValidateIssue[];
          setIssueCodes(
            remoteIssues.length > 0 ? remoteIssues : [{ code: "AUTO_FIXED" }],
          );
          setJsonStatus("fix");
          return;
        }
        if (payload?.error?.code === "INVALID_JSON") {
          const remoteIssues = (payload.error.details?.issues ??
            []) as ValidateIssue[];
          setIssueCodes(
            remoteIssues.length > 0
              ? remoteIssues
              : [{ code: "INVALID_JSON" }],
          );
          setJsonStatus("error");
          return;
        }
        setError(dict.common.networkError);
        return;
      }

      const created = payload.data as StoredTemporaryApi & {
        manageToken: string;
      };
      const stored: StoredTemporaryApi = {
        publicId: created.publicId,
        name: created.name,
        url: created.url,
        createdAt: created.createdAt,
        expiresAt: created.expiresAt,
        manageToken: created.manageToken,
      };
      upsertStoredTemporaryApi(stored);
      setFixedText(null);
      setIssueCodes([]);
      setJsonStatus("idle");
      setJustCreated(stored);
      setHighlightId(stored.publicId);
      await syncList();
      requestAnimationFrame(() => {
        document
          .getElementById("tmp-success")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch {
      setError(dict.common.networkError);
    } finally {
      setCreating(false);
    }
  }

  async function onCreate() {
    if (fixedText) {
      await createApi(fixedText, true);
      return;
    }
    const ok = applyValidation(validateTemporaryJson(json));
    if (!ok) return;
    await createApi(json, false);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const item = deleteTarget;
    setDeletingId(item.publicId);
    setError(null);
    try {
      const res = await fetch(`/api/temporary/${item.publicId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(item.manageToken ? { "x-manage-token": item.manageToken } : {}),
        },
        body: JSON.stringify(
          item.manageToken ? { manageToken: item.manageToken } : {},
        ),
      });
      if (!res.ok && res.status !== 404) {
        setError(dict.common.networkError);
        return;
      }
      removeStoredTemporaryApi(item.publicId);
      if (highlightId === item.publicId) setHighlightId(null);
      if (justCreated?.publicId === item.publicId) setJustCreated(null);
      setDeleteTarget(null);
      await syncList();
    } catch {
      setError(dict.common.networkError);
    } finally {
      setDeletingId(null);
    }
  }

  async function confirmDeleteAll() {
    if (list.length === 0) return;
    setDeletingAll(true);
    setError(null);
    try {
      await Promise.all(
        list.map(async (item) => {
          try {
            await fetch(`/api/temporary/${item.publicId}`, {
              method: "DELETE",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                ...(item.manageToken
                  ? { "x-manage-token": item.manageToken }
                  : {}),
              },
              body: JSON.stringify(
                item.manageToken ? { manageToken: item.manageToken } : {},
              ),
            });
          } catch {
            /* best-effort; local list is cleared either way */
          }
        }),
      );
      clearStoredTemporaryApis();
      setHighlightId(null);
      setJustCreated(null);
      setDeleteAllOpen(false);
      await syncList();
    } catch {
      setError(dict.common.networkError);
    } finally {
      setDeletingAll(false);
    }
  }

  const statusTone =
    jsonStatus === "ok"
      ? "border-[var(--response)]/25 bg-[var(--response)]/8 text-[var(--response)]"
      : jsonStatus === "error" || jsonStatus === "fix"
        ? "border-[var(--delete)]/25 bg-[var(--delete)]/8 text-[var(--delete)]"
        : "border-border bg-muted/40 text-muted-foreground";

  return (
    <div
      className="mx-auto max-w-2xl px-4 pt-10 pb-[max(7rem,calc(5rem+env(safe-area-inset-bottom,0px)))] sm:px-6 sm:pt-14"
      dir={isFa ? "rtl" : undefined}
    >
      <header className="mb-8 space-y-3">
        <h1
          className={cn(
            "inline-flex min-w-0 items-center gap-2.5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl",
            isFa && "font-fa-label",
          )}
        >
          <Link
            href="/"
            aria-label={dict.common.home}
            title={dict.common.home}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft
              className={cn("size-5 sm:size-6", isFa && "rotate-180")}
              strokeWidth={1.75}
              aria-hidden
            />
          </Link>
          <span className="truncate">{t.title}</span>
        </h1>
        <p
          className={cn(
            "max-w-xl text-[15px] leading-7 text-foreground/80",
            isFa && "font-fa-label",
          )}
        >
          {t.blurb}
        </p>
        <p
          className={cn(
            "max-w-xl whitespace-pre-line text-[14px] leading-6 text-muted-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.privacyNote}
        </p>
      </header>

      {justCreated ? (
        <div
          key={justCreated.publicId}
          id="tmp-success"
          role="status"
          className={cn(
            "mb-8 scroll-mt-20 space-y-3 rounded-xl border border-[var(--response)]/30 bg-[var(--response-bg)] px-3.5 py-4",
            "animate-in fade-in-0 slide-in-from-top-2 duration-300",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--response)] text-white">
              <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
            </span>
            <p
              className={cn(
                "text-[14px] font-medium text-[var(--response)]",
                isFa && "font-fa-label",
              )}
            >
              {t.createdTitle}
            </p>
          </div>
          <div
            className="flex items-center justify-center gap-1"
            dir="ltr"
          >
            <a
              href={justCreated.url}
              target="_blank"
              rel="noopener noreferrer"
              title={justCreated.url}
              className="max-w-[calc(100%-2.25rem)] truncate text-center font-mono text-[14px] text-[var(--response)] underline-offset-2 hover:underline sm:text-[15px]"
            >
              {justCreated.url}
            </a>
            <CopyButton
              value={justCreated.url}
              label={t.copyUrl}
              className="size-8 shrink-0 text-[var(--response)] hover:bg-[var(--response)]/15 hover:text-[var(--response)]"
            />
          </div>
        </div>
      ) : null}

      <section className="space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="tmp-json"
            className={cn(
              "text-[13px] text-muted-foreground",
              isFa && "font-fa-label",
            )}
          >
            {t.jsonLabel}
          </label>

          <div
            className={cn(
              "overflow-hidden rounded-lg border transition-colors",
              jsonStatus === "ok"
                ? "border-[var(--response)]/40"
                : jsonStatus === "error" || jsonStatus === "fix"
                  ? "border-[var(--delete)]/35"
                  : "border-border focus-within:border-[var(--request)]/45",
            )}
          >
            <div className="relative" dir="ltr">
              <HighlightedJsonEditor
                id="tmp-json"
                value={json}
                bare
                padEnd
                persianStrings={isFa}
                onChange={(next) => {
                  setJson(next);
                  resetJsonFeedback();
                }}
                rows={12}
              />
              <button
                type="button"
                disabled={checking}
                onClick={runCheck}
                aria-label={t.checkJson}
                title={t.checkJson}
                className={cn(
                  "absolute end-2 top-2 z-20 grid size-8 place-items-center rounded-md transition-colors disabled:opacity-50",
                  jsonStatus === "ok"
                    ? "bg-[var(--response)]/20 text-[var(--response)] hover:bg-[var(--response)]/28"
                    : jsonStatus === "error" || jsonStatus === "fix"
                      ? "bg-[var(--delete)]/20 text-[var(--delete)] hover:bg-[var(--delete)]/28"
                      : "bg-white/5 text-[#c8c8c8] hover:bg-white/10 hover:text-white",
                )}
              >
                {jsonStatus === "ok" ? (
                  <Check className="size-4" strokeWidth={2.25} aria-hidden />
                ) : jsonStatus === "error" || jsonStatus === "fix" ? (
                  <CircleAlert
                    className="size-4"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                ) : (
                  <WandSparkles
                    className="size-4"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                )}
              </button>
            </div>
            {jsonStatus !== "idle" ? (
              <div
                className={cn(
                  "flex items-start gap-2 border-t px-3 py-2 text-[12px] leading-5",
                  statusTone,
                  isFa && "font-fa-label",
                )}
                role="status"
              >
                {jsonStatus === "ok" ? (
                  <span>{t.jsonValid}</span>
                ) : (
                  <ul className="min-w-0 space-y-0.5">
                    {issueCodes.map((issue, i) => (
                      <li key={`${issue.code}-${i}`}>
                        {localizeIssue(issue)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {fixedText && jsonStatus === "fix" ? (
          <div className="space-y-2.5 rounded-lg border border-border bg-muted/30 px-3 py-3">
            <p
              className={cn(
                "text-[13px] text-muted-foreground",
                isFa && "font-fa-label",
              )}
            >
              {t.fixedPreview}
            </p>
            <pre
              className="max-h-36 overflow-auto rounded-md bg-[var(--vscode-bg)] p-2.5 font-mono text-[11px] leading-5 text-[var(--vscode-fg)]"
              dir="ltr"
            >
              {fixedText}
            </pre>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={creating || atLimit}
                onClick={() => {
                  setJson(fixedText);
                  void createApi(fixedText, true);
                }}
                className={cn(
                  "h-9 flex-1 rounded-md bg-[var(--request-fill)] text-[13px] font-medium text-white disabled:opacity-40",
                  isFa && "font-fa-label",
                )}
              >
                {creating ? t.creating : t.acceptFix}
              </button>
              <button
                type="button"
                onClick={resetJsonFeedback}
                className={cn(
                  "h-9 rounded-md border border-border px-3 text-[13px]",
                  isFa && "font-fa-label",
                )}
              >
                {t.rejectFix}
              </button>
            </div>
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label
            htmlFor="tmp-duration"
            className={cn(
              "text-[13px] text-muted-foreground",
              isFa && "font-fa-label",
            )}
          >
            {t.durationLabel}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative w-[8.5rem] shrink-0 sm:w-[9.5rem]">
              <select
                id="tmp-duration"
                value={duration}
                onChange={(e) =>
                  setDuration(e.target.value as TemporaryDuration)
                }
                className={cn(
                  "h-10 w-full appearance-none rounded-lg border border-border bg-white pe-9 ps-3 text-[14px] outline-none transition-colors focus:border-foreground/35 dark:bg-background",
                  isFa && "font-fa-label",
                )}
              >
                {TEMPORARY_DURATIONS.map((d) => (
                  <option key={d} value={d}>
                    {durationLabels[d]}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.75}
                aria-hidden
              />
            </div>
            {jsonStatus !== "fix" ? (
              <button
                type="button"
                disabled={creating || atLimit}
                onClick={() => void onCreate()}
                className={cn(
                  "h-10 min-w-0 flex-1 rounded-md bg-[var(--request-fill)] text-[14px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40",
                  isFa && "font-fa-label",
                )}
              >
                {creating ? t.creating : t.create}
              </button>
            ) : null}
          </div>
        </div>

        {atLimit ? (
          <div
            role="status"
            className="flex gap-3 rounded-lg border border-border bg-muted/45 px-3.5 py-3"
          >
            <CircleAlert
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden
            />
            <div className="min-w-0 space-y-1">
              <p
                className={cn(
                  "text-[13px] font-medium text-foreground",
                  isFa && "font-fa-label",
                )}
              >
                {t.limitReached}
              </p>
              <p
                className={cn(
                  "text-[13px] leading-5 text-muted-foreground",
                  isFa && "font-fa-label",
                )}
              >
                {t.limitReachedBody}
              </p>
            </div>
          </div>
        ) : null}

        {error ? (
          <p
            className={cn(
              "text-[13px] text-[var(--delete)]",
              isFa && "font-fa-label",
            )}
          >
            {error}
          </p>
        ) : null}
      </section>

      <section id="my-apis" className="mt-12 scroll-mt-20">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2
            className={cn(
              "text-[15px] font-semibold tracking-tight",
              isFa && "font-fa-label",
            )}
          >
            {t.myApis}
          </h2>
          <div className="flex items-center gap-2">
            {list.length > 0 ? (
              <button
                type="button"
                onClick={() => setDeleteAllOpen(true)}
                disabled={deletingAll}
                className={cn(
                  "text-[12px] text-[var(--delete)] transition-opacity hover:opacity-80 disabled:opacity-50",
                  isFa && "font-fa-label",
                )}
              >
                {t.deleteAll}
              </button>
            ) : null}
            <span
              className={cn(
                "text-[12px] tabular-nums text-muted-foreground",
                isFa && "font-fa-label",
              )}
            >
              {t.slotsLabel.replace(
                "{n}",
                isFa
                  ? activeCount.toLocaleString("fa-IR")
                  : String(activeCount),
              )}
            </span>
          </div>
        </div>

        {list.length === 0 ? (
          <p
            className={cn(
              "rounded-lg border border-dashed border-border px-4 py-8 text-center text-[13px] text-muted-foreground",
              isFa && "font-fa-label",
            )}
          >
            {t.emptyList}
          </p>
        ) : (
          <ul className="overflow-hidden rounded-lg border border-border">
            {list.map((item, index) => {
              const remaining = formatExpiresIn(
                item.expiresAt,
                isFa ? "fa" : "en",
              );
              const isNew = highlightId === item.publicId;
              return (
                <li
                  key={item.publicId}
                  className={cn(
                    "px-3 py-2.5 transition-colors",
                    index > 0 && "border-t border-border",
                    isNew && "bg-[var(--request)]/8",
                  )}
                >
                  <div className="flex items-center gap-1.5" dir="ltr">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 flex-1 truncate font-mono text-[12px] text-[var(--request)] underline-offset-2 hover:underline"
                      title={item.url}
                    >
                      {item.url}
                    </a>
                    <CopyButton
                      value={item.url}
                      label={t.copyUrl}
                      className="size-8 shrink-0"
                    />
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      aria-label={t.delete}
                      title={t.delete}
                      className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--delete)]/10 hover:text-[var(--delete)]"
                    >
                      <Trash2 className="size-3.5" strokeWidth={1.75} />
                    </button>
                  </div>
                  <p
                    className={cn(
                      "mt-1 text-[11px] tabular-nums",
                      remaining.expired
                        ? "text-[var(--delete)]"
                        : "text-muted-foreground",
                      isFa && "font-fa-label",
                    )}
                  >
                    <span className="sm:hidden">{remaining.shortLabel}</span>
                    <span className="hidden sm:inline">{remaining.label}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {deleteTarget ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          role="presentation"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tmp-delete-title"
            className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            dir={isFa ? "rtl" : undefined}
          >
            <h3
              id="tmp-delete-title"
              className={cn(
                "text-[16px] font-semibold",
                isFa && "font-fa-label",
              )}
            >
              {t.confirmDelete}
            </h3>
            <p
              className={cn(
                "mt-1.5 text-[13px] leading-5 text-muted-foreground",
                isFa && "font-fa-label",
              )}
            >
              {t.confirmDeleteBody}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className={cn(
                  "h-9 rounded-md border border-border px-3 text-[13px]",
                  isFa && "font-fa-label",
                )}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                disabled={deletingId === deleteTarget.publicId}
                onClick={() => void confirmDelete()}
                className={cn(
                  "h-9 rounded-md bg-[var(--delete)] px-3 text-[13px] font-medium text-white disabled:opacity-50",
                  isFa && "font-fa-label",
                )}
              >
                {deletingId === deleteTarget.publicId
                  ? t.deleting
                  : t.delete}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteAllOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          role="presentation"
          onClick={() => !deletingAll && setDeleteAllOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tmp-delete-all-title"
            className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            dir={isFa ? "rtl" : undefined}
          >
            <h3
              id="tmp-delete-all-title"
              className={cn(
                "text-[16px] font-semibold",
                isFa && "font-fa-label",
              )}
            >
              {t.confirmDeleteAll}
            </h3>
            <p
              className={cn(
                "mt-1.5 text-[13px] leading-5 text-muted-foreground",
                isFa && "font-fa-label",
              )}
            >
              {t.confirmDeleteAllBody}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={deletingAll}
                onClick={() => setDeleteAllOpen(false)}
                className={cn(
                  "h-9 rounded-md border border-border px-3 text-[13px] disabled:opacity-50",
                  isFa && "font-fa-label",
                )}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                disabled={deletingAll}
                onClick={() => void confirmDeleteAll()}
                className={cn(
                  "h-9 rounded-md bg-[var(--delete)] px-3 text-[13px] font-medium text-white disabled:opacity-50",
                  isFa && "font-fa-label",
                )}
              >
                {deletingAll ? t.deleting : t.deleteAll}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
