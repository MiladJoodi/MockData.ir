"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Sparkles, Trash2, X } from "lucide-react";
import {
  previewResources,
  type PreviewField,
  type PreviewResourceId,
} from "@/lib/preview/resources";
import { withApiLang } from "@/lib/api/use-api-locale";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { formatApiDate } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";

type Row = Record<string, unknown> & { id: string | number };

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type CacheBucket = { rows: Row[]; pagination: Pagination };

const listCache = new Map<string, CacheBucket>();

function cacheKey(
  resourceId: string,
  locale: string,
  query: string,
  page: number,
) {
  return `${resourceId}|${locale}|${query}|${page}`;
}

function cellText(value: unknown) {
  if (value == null) return "—";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function clampCellText(value: unknown, max = 72) {
  const text = cellText(value);
  if (text === "—" || text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

async function resolveRelations(
  fields: PreviewField[],
  locale: "en" | "fa",
): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    if (!field.relation) continue;
    try {
      const res = await fetch(withApiLang(field.relation.path, locale));
      const payload = await res.json();
      const first = payload?.data?.[0];
      const key = field.relation.valueKey ?? "id";
      if (first && first[key] != null) {
        out[field.key] =
          field.type === "number" ? Number(first[key]) : String(first[key]);
      }
    } catch {
      /* ignore */
    }
  }
  return out;
}

function emptyForm(fields: PreviewField[]): Record<string, string> {
  const form: Record<string, string> = {};
  for (const field of fields) {
    if (field.type === "boolean") form[field.key] = "false";
    else if (field.type === "number") form[field.key] = "";
    else if (field.options?.[0]) form[field.key] = field.options[0].value;
    else form[field.key] = "";
  }
  return form;
}

function formToBody(
  fields: PreviewField[],
  form: Record<string, string>,
  mode: "create" | "edit",
) {
  const body: Record<string, unknown> = {};
  for (const field of fields) {
    const include = mode === "create" ? field.create : field.edit;
    if (!include) continue;
    const raw = form[field.key] ?? "";
    if (field.type === "boolean") {
      body[field.key] = raw === "true";
      continue;
    }
    if (field.type === "number") {
      if (raw === "" && !field.required) continue;
      body[field.key] = Number(raw);
      continue;
    }
    if (raw === "" && !field.required) {
      body[field.key] = null;
      continue;
    }
    body[field.key] = raw;
  }
  return body;
}

export function ResourcePreviewDemo({
  resourceId,
}: {
  resourceId: PreviewResourceId;
}) {
  const config = previewResources[resourceId];
  const { dict, locale } = useUiLocale();
  const isFa = locale === "fa";

  function fieldLabel(key: string, fallback: string) {
    return dict.preview.fieldLabels[key] ?? fallback;
  }

  function roleLabel(value: string) {
    return dict.preview.roleLabels[value] ?? value;
  }

  function displayCell(field: PreviewField, value: unknown) {
    if (field.key === "role" && typeof value === "string") {
      return roleLabel(value);
    }
    return cellText(value);
  }

  const resourceTitle = dict.catalog[config.id]?.title ?? config.title;
  const columnFields = useMemo(
    () => config.fields.filter((f) => f.column),
    [config.fields],
  );
  const extraCols = useMemo(
    () =>
      columnFields.filter(
        (f) =>
          f.key !== config.titleKey &&
          f.key !== config.subtitleKey &&
          f.key !== config.imageKey,
      ),
    [
      columnFields,
      config.titleKey,
      config.subtitleKey,
      config.imageKey,
    ],
  );
  const colCount = 4 + extraCols.length;
  const createFields = useMemo(
    () => config.fields.filter((f) => f.create),
    [config.fields],
  );
  const editFields = useMemo(
    () => config.fields.filter((f) => f.edit),
    [config.fields],
  );

  const [rows, setRows] = useState<Row[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record<string, string>>(() =>
    emptyForm(config.fields),
  );
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(
    async (opts?: { silent?: boolean; signal?: AbortSignal }) => {
      const key = cacheKey(config.id, locale, query.trim(), page);
      const cached = listCache.get(key);
      if (cached) {
        setRows(cached.rows);
        setPagination(cached.pagination);
        if (!opts?.silent) setLoading(false);
      } else {
        // Drop previous-locale rows so EN/FA never flash mixed.
        if (!opts?.silent) {
          setRows([]);
          setPagination(null);
          setLoading(true);
        }
      }

      setError(null);
      try {
        const params = new URLSearchParams({
          limit: "12",
          page: String(page),
          sort: config.sort ?? "createdAt",
          order: config.order ?? "desc",
        });
        if (query.trim()) params.set("search", query.trim());
        const url = withApiLang(`${config.basePath}?${params}`, locale);
        const res = await fetch(url, { signal: opts?.signal });
        const payload = await res.json();
        if (opts?.signal?.aborted) return;
        if (!res.ok) {
          setError(payload?.error?.message ?? "Failed to load");
          return;
        }
        const nextRows = (payload.data ?? []) as Row[];
        const nextPagination = payload.pagination as Pagination;
        listCache.set(key, { rows: nextRows, pagination: nextPagination });
        setRows(nextRows);
        setPagination(nextPagination);
      } catch (err) {
        if (opts?.signal?.aborted) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(dict.preview.networkError);
      } finally {
        if (!opts?.signal?.aborted) setLoading(false);
      }
    },
    [
      config.basePath,
      config.id,
      config.order,
      config.sort,
      dict.preview.networkError,
      locale,
      page,
      query,
    ],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load({ signal: controller.signal });
    return () => controller.abort();
  }, [load]);

  function invalidateCache() {
    for (const key of listCache.keys()) {
      if (key.startsWith(`${config.id}|`)) listCache.delete(key);
    }
  }

  function openCreate() {
    setEditing(null);
    setCreating(true);
    setForm(emptyForm(config.fields));
  }

  function openEdit(row: Row) {
    setCreating(false);
    setEditing(row);
    const next = emptyForm(config.fields);
    for (const field of config.fields) {
      const value = row[field.key];
      if (value == null) next[field.key] = field.type === "boolean" ? "false" : "";
      else if (typeof value === "boolean") next[field.key] = value ? "true" : "false";
      else next[field.key] = String(value);
    }
    setForm(next);
  }

  function closePanel() {
    setEditing(null);
    setCreating(false);
  }

  async function fillSample() {
    const sample = { ...config.sample(locale) };
    const relations = await resolveRelations(createFields, locale);
    Object.assign(sample, relations);
    const next = emptyForm(config.fields);
    for (const [key, value] of Object.entries(sample)) {
      if (typeof value === "boolean") next[key] = value ? "true" : "false";
      else if (value != null) next[key] = String(value);
    }
    // Keep tags etc. in a side channel via JSON fields if needed — posts tags
    if (Array.isArray(sample.tags)) {
      (next as Record<string, string>).__tags = JSON.stringify(sample.tags);
    }
    setForm(next);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(
        withApiLang(`${config.basePath}/${deleteTarget.id}`, locale),
        { method: "DELETE" },
      );
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setError(payload?.error?.message ?? "Delete failed");
        return;
      }
      setDeleteTarget(null);
      invalidateCache();
      await load({ silent: true });
    } catch {
      setError(dict.preview.networkError);
    } finally {
      setDeleting(false);
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const wasCreating = creating;
    const fields = wasCreating ? createFields : editFields;
    const body = formToBody(fields, form, wasCreating ? "create" : "edit");
    if (wasCreating && form.__tags) {
      try {
        body.tags = JSON.parse(form.__tags);
      } catch {
        /* ignore */
      }
    }

    try {
      if (wasCreating) {
        const res = await fetch(withApiLang(config.basePath, locale), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const payload = await res.json().catch(() => null);
        if (!res.ok) {
          setError(payload?.error?.message ?? "Create failed");
          return;
        }
        closePanel();
        invalidateCache();
        if (page !== 1) setPage(1);
        else await load({ silent: true });
      } else if (editing) {
        const editingId = editing.id;
        const res = await fetch(
          withApiLang(`${config.basePath}/${editingId}`, locale),
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          },
        );
        const payload = await res.json().catch(() => null);
        if (!res.ok) {
          setError(payload?.error?.message ?? "Update failed");
          return;
        }
        const updated = (payload?.data ?? null) as Row | null;
        closePanel();
        // Keep row position: merge in place (createdAt sort must not jump).
        if (updated && updated.id != null) {
          setRows((prev) => {
            const next = prev.map((row) =>
              row.id === editingId ? { ...row, ...updated } : row,
            );
            const key = cacheKey(config.id, locale, query.trim(), page);
            const cached = listCache.get(key);
            if (cached) {
              listCache.set(key, { ...cached, rows: next });
            }
            return next;
          });
        } else {
          invalidateCache();
          await load({ silent: true });
        }
      }
    } catch {
      setError(dict.preview.networkError);
    } finally {
      setSaving(false);
    }
  }

  const panelOpen = creating || editing;
  const totalPages = pagination?.totalPages ?? 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const pageSize = pagination?.limit ?? 12;
  const activeFields = creating ? createFields : editFields;

  return (
    <div className="space-y-5" dir={isFa ? "rtl" : undefined}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <form
          className="flex min-w-0 flex-1 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setQuery(search);
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={dict.preview.search}
            className="box-border h-9 min-w-0 flex-1 rounded-md border border-border bg-muted px-3 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
          />
          <button
            type="submit"
            className="box-border h-9 shrink-0 rounded-md border border-border bg-card px-3 text-[13px] font-medium hover:bg-[var(--surface-hover)]"
          >
            {dict.preview.search}
          </button>
        </form>
        <button
          type="button"
          onClick={openCreate}
          className="box-border inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md bg-[var(--request-fill)] px-3 text-[13px] font-semibold text-white"
        >
          <Plus className="size-3.5" aria-hidden />
          {dict.common.new}
        </button>
      </div>

      {error ? (
        <p className="rounded-md border border-[var(--delete)]/30 bg-[var(--delete)]/10 px-3 py-2 text-[13px] text-[var(--delete)]">
          {error}
        </p>
      ) : null}

      <div
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-card",
          isFa && "font-fa-label",
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-[13px]">
            <thead
              className={cn(
                "border-b border-border bg-muted text-[11px] text-muted-foreground",
                isFa
                  ? "font-fa-label font-medium"
                  : "font-mono tracking-wide uppercase",
              )}
            >
              <tr>
                <th className="w-12 px-3 py-2.5 text-start font-medium">#</th>
                <th className="min-w-[10rem] px-3 py-2.5 text-start font-medium">
                  {resourceTitle}
                </th>
                {extraCols.map((f) => (
                  <th
                    key={f.key}
                    className="min-w-[6.5rem] px-3 py-2.5 text-start font-medium"
                  >
                    {fieldLabel(f.key, f.label)}
                  </th>
                ))}
                <th className="min-w-[7.5rem] px-3 py-2.5 text-start font-medium whitespace-nowrap">
                  {dict.preview.createdAt}
                </th>
                <th className="w-24 px-3 py-2.5 text-end font-medium">
                  {dict.common.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={colCount}
                    className="px-3 py-10 text-center text-muted-foreground"
                  >
                    {dict.preview.loading}
                  </td>
                </tr>
              ) : null}
              {!loading && rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={colCount}
                    className="px-3 py-10 text-center text-muted-foreground"
                  >
                    {dict.preview.noRecords}
                  </td>
                </tr>
              ) : null}
              {rows.map((row, index) => {
                const rowNumber = (page - 1) * pageSize + index + 1;
                const image =
                  config.imageKey && typeof row[config.imageKey] === "string"
                    ? String(row[config.imageKey])
                    : null;
                const createdRaw = row.createdAt;
                const createdLabel =
                  typeof createdRaw === "string" && createdRaw
                    ? formatApiDate(createdRaw, locale)
                    : "—";
                return (
                  <tr
                    key={String(row.id)}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-3 py-3 align-middle font-mono text-[12px] text-muted-foreground tabular-nums">
                      {rowNumber}
                    </td>
                    <td className="max-w-[16rem] px-3 py-3 align-middle sm:max-w-[20rem]">
                      <div className="flex min-w-0 items-center gap-3">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt=""
                            className={cn(
                              "size-9 shrink-0 border border-border object-cover",
                              config.imageKey === "avatarUrl"
                                ? "rounded-full"
                                : "rounded-md",
                            )}
                          />
                        ) : null}
                        <div className="min-w-0 flex-1 overflow-hidden text-start">
                          <p className="truncate font-medium text-foreground">
                            {cellText(row[config.titleKey])}
                          </p>
                          {config.subtitleKey ? (
                            <p className="truncate text-[11px] text-muted-foreground">
                              {clampCellText(row[config.subtitleKey], 64)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    {extraCols.map((f) => (
                      <td
                        key={f.key}
                        className="max-w-[10rem] truncate px-3 py-3 align-middle text-start text-muted-foreground"
                      >
                        {displayCell(f, row[f.key])}
                      </td>
                    ))}
                    <td
                      className={cn(
                        "px-3 py-3 align-middle text-start text-[12px] whitespace-nowrap text-muted-foreground",
                        isFa && "font-fa-label",
                      )}
                      dir={isFa ? "rtl" : "ltr"}
                    >
                      {createdLabel}
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-[var(--surface-hover)] hover:text-foreground"
                          aria-label={dict.preview.edit}
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(row)}
                          className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-[var(--delete)]/10 hover:text-[var(--delete)]"
                          aria-label={dict.preview.delete}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2.5">
          <p className="font-mono text-[11px] text-muted-foreground">
            {pagination
              ? `${pagination.total} · GET ${config.basePath}${isFa ? "?lang=fa" : ""}`
              : null}
          </p>
          {totalPages > 1 ? (
            <div className="flex items-center gap-1">
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={cn(
                    "grid size-8 place-items-center rounded-md font-mono text-[12px] transition-colors",
                    page === n
                      ? "bg-[var(--request)]/15 font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-[var(--surface-hover)] hover:text-foreground",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {panelOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <form
            onSubmit={onSave}
            className={cn(
              "max-h-[90vh] w-full max-w-md space-y-4 overflow-y-auto rounded-xl border border-border bg-card p-5 shadow-lg",
              isFa && "font-fa-label",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[15px] font-semibold">
                {creating
                  ? `${dict.preview.create} ${resourceTitle}`
                  : dict.preview.edit}
              </h2>
              <button
                type="button"
                onClick={closePanel}
                className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-[var(--surface-hover)]"
                aria-label={dict.common.close}
              >
                <X className="size-4" />
              </button>
            </div>

            {creating ? (
              <button
                type="button"
                onClick={() => void fillSample()}
                className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-border bg-muted px-3 text-[12px] font-medium hover:bg-[var(--surface-hover)]"
              >
                <Sparkles className="size-3.5" aria-hidden />
                {dict.preview.fillSample}
              </button>
            ) : null}

            <div className="grid gap-3">
              {activeFields.map((field) => (
                <label key={field.key} className="space-y-1 text-[12px]">
                  <span className="text-muted-foreground">
                    {fieldLabel(field.key, field.label)}
                  </span>
                  {field.type === "textarea" ? (
                    <textarea
                      required={field.required}
                      value={form[field.key] ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field.key]: e.target.value }))
                      }
                      rows={3}
                      className="w-full resize-none rounded-md border border-border bg-muted px-3 py-2 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                    />
                  ) : field.type === "boolean" ? (
                    <select
                      value={form[field.key] ?? "false"}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field.key]: e.target.value }))
                      }
                      className="h-9 w-full rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none"
                    >
                      <option value="false">false</option>
                      <option value="true">true</option>
                    </select>
                  ) : field.type === "select" ? (
                    <select
                      value={form[field.key] ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field.key]: e.target.value }))
                      }
                      className="h-9 w-full rounded-md border border-border bg-muted px-2.5 text-[13px] outline-none"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {field.key === "role"
                            ? roleLabel(opt.value)
                            : opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      required={field.required}
                      type={field.type === "number" ? "number" : "text"}
                      value={form[field.key] ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field.key]: e.target.value }))
                      }
                      className="h-9 w-full rounded-md border border-border bg-muted px-3 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                disabled={saving}
                onClick={closePanel}
                className="h-9 rounded-md border border-border px-3 text-[13px] hover:bg-[var(--surface-hover)] disabled:opacity-50"
              >
                {dict.preview.cancel}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="relative h-9 min-w-[5.5rem] rounded-md bg-[var(--request-fill)] px-3 text-[13px] font-semibold text-white disabled:opacity-80"
              >
                <span className={cn(saving && "invisible")}>{dict.preview.save}</span>
                {saving ? (
                  <span className="absolute inset-0 grid place-items-center">
                    {dict.preview.saving}
                  </span>
                ) : null}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div
            role="alertdialog"
            className={cn(
              "w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-5 shadow-lg",
              isFa && "font-fa-label",
            )}
          >
            <div className="space-y-1.5">
              <h2 className="text-[15px] font-semibold">
                {dict.preview.confirmDelete}
              </h2>
              <p
                className="truncate text-[14px] font-medium text-foreground"
                dir="auto"
              >
                {cellText(deleteTarget[config.titleKey])}
              </p>
              <p className="text-[13px] leading-6 text-muted-foreground">
                {dict.preview.confirmDeleteBody}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="h-9 rounded-md border border-border px-3 text-[13px] hover:bg-[var(--surface-hover)] disabled:opacity-50"
              >
                {dict.preview.cancel}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void confirmDelete()}
                className="relative h-9 min-w-[5.5rem] rounded-md bg-[var(--delete)] px-3 text-[13px] font-semibold text-white disabled:opacity-50"
              >
                <span className={cn(deleting && "invisible")}>
                  {dict.preview.delete}
                </span>
                {deleting ? (
                  <span className="absolute inset-0 grid place-items-center">
                    {dict.preview.deleting}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
