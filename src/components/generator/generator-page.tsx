"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FieldSelector } from "@/components/generator/field-selector";
import { GeneratedResult } from "@/components/generator/generated-result";
import { QuantityAndModeRow } from "@/components/generator/quantity-and-mode-row";
import { SamplePreviewCard } from "@/components/generator/sample-preview-card";
import { TopicPicker } from "@/components/generator/topic-picker";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { GENERATOR_MAX_RECORDS } from "@/lib/generator/constants";
import { generateBatchChunked, clampQuantity } from "@/lib/generator/generate";
import { getGeneratorTopic } from "@/lib/generator/registry";
import { fieldsForMode, adjustFieldsForMode, visibleFieldsForMode, type GeneratorOutputMode } from "@/lib/generator/modes";
import { recordToTypeScript } from "@/lib/generator/to-typescript";
import {
  loadGeneratorSession,
  saveGeneratorSession,
} from "@/lib/generator/session-state";
import {
  TEMPORARY_LIMITS,
  type TemporaryDuration,
} from "@/lib/temporary/limits";
import { validateTemporaryJson } from "@/lib/temporary/validate-json";
import {
  upsertStoredTemporaryApi,
  type StoredTemporaryApi,
} from "@/lib/temporary/client-store";
import { cn } from "@/lib/utils";

export function GeneratorPageContent() {
  const { dict, locale } = useUiLocale();
  const t = dict.generator;
  const tmp = dict.temporary;
  const isFa = locale === "fa";

  const initial = loadGeneratorSession();
  const [topicId, setTopicId] = useState<string | null>(initial.topicId);
  const [mode, setMode] = useState<GeneratorOutputMode>(initial.mode);
  const [fields, setFields] = useState<Set<string>>(
    () => new Set(initial.fields),
  );
  const [quantity, setQuantity] = useState(initial.quantity);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [records, setRecords] = useState<Record<string, unknown>[] | null>(
    initial.records,
  );
  const [error, setError] = useState<string | null>(initial.error);
  const [status, setStatus] = useState<string | null>(initial.status);
  const [duration, setDuration] = useState<TemporaryDuration>(initial.duration);
  const [creating, setCreating] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(
    initial.createdUrl,
  );
  const [, startTransition] = useTransition();

  useEffect(() => {
    saveGeneratorSession({
      topicId,
      mode,
      fields: [...fields],
      quantity,
      records,
      duration,
      createdUrl,
      status,
      error,
    });
  }, [
    topicId,
    mode,
    fields,
    quantity,
    records,
    duration,
    createdUrl,
    status,
    error,
  ]);

  const topic = topicId ? getGeneratorTopic(topicId) : undefined;
  const visibleFields = topic ? visibleFieldsForMode(topic, mode) : [];

  function selectTopic(id: string) {
    const next = getGeneratorTopic(id);
    if (!next) return;
    setTopicId(id);
    setFields(fieldsForMode(next, mode));
    setRecords(null);
    setCreatedUrl(null);
    setError(null);
    setStatus(null);
  }

  function selectMode(nextMode: GeneratorOutputMode) {
    setMode(nextMode);
    if (topic) {
      setFields((prev) => adjustFieldsForMode(topic, prev, nextMode));
    }
  }

  function toggleField(id: string) {
    setFields((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size <= 1) return next;
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function onGenerate() {
    if (!topicId) {
      setError(t.errors.pickTopic);
      return;
    }
    setGenerating(true);
    setError(null);
    setStatus(null);
    setCreatedUrl(null);
    setProgress(0);
    try {
      const result = await generateBatchChunked(
        {
          topicId,
          fields: [...fields],
          quantity: clampQuantity(quantity),
          country: isFa ? "IR" : "all",
          uiLocale: isFa ? "fa" : "en",
        },
        (done, total) => setProgress(done / total),
      );
      if (!result.ok) {
        setError(t.errors[result.error] ?? t.errors.GENERATE_FAILED);
        setRecords(null);
        return;
      }
      startTransition(() => {
        setRecords(result.data);
      });
      setStatus(null);
    } catch {
      setError(t.errors.GENERATE_FAILED);
      setRecords(null);
    } finally {
      setGenerating(false);
      setProgress(null);
    }
  }

  const jsonText = useMemo(
    () => (records ? JSON.stringify(records, null, 2) : ""),
    [records],
  );

  const createGate = useMemo(() => {
    if (!records) return { ok: false as const, reason: null };
    if (records.length > TEMPORARY_LIMITS.maxArrayLength) {
      return { ok: false as const, reason: t.createBlockedArray };
    }
    const validation = validateTemporaryJson(jsonText);
    if (!validation.ok) {
      const code = validation.issues[0]?.code;
      if (code === "TOO_LARGE") {
        return { ok: false as const, reason: t.createBlockedSize };
      }
      if (code === "ARRAY_TOO_LONG") {
        return { ok: false as const, reason: t.createBlockedArray };
      }
      return { ok: false as const, reason: t.errors.CREATE_FAILED };
    }
    return { ok: true as const, reason: null };
  }, [records, jsonText, t]);

  function onDownload(format: "json" | "ts") {
    if (!records || !topicId) return;
    try {
      const text =
        format === "json"
          ? jsonText
          : recordToTypeScript(topicId, records[0] ?? {});
      const blob = new Blob([text], {
        type: format === "json" ? "application/json" : "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${topicId}-${records.length}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(t.errors.DOWNLOAD_FAILED);
    }
  }

  async function onCreateApi() {
    if (!records || !createGate.ok) return;
    setCreating(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/temporary", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: jsonText, duration }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        const code = payload?.error?.code as string | undefined;
        if (code === "LIMIT_REACHED") {
          setError(t.errors.LIMIT_REACHED);
          return;
        }
        if (code === "RATE_LIMITED") {
          setError(t.errors.RATE_LIMITED);
          return;
        }
        if (code === "TOO_LARGE" || code === "ARRAY_TOO_LONG") {
          setError(t.createBlockedSize);
          return;
        }
        setError(t.errors.CREATE_FAILED);
        return;
      }
      const created = payload.data as StoredTemporaryApi & {
        manageToken: string;
      };
      upsertStoredTemporaryApi({
        publicId: created.publicId,
        name: created.name,
        url: created.url,
        createdAt: created.createdAt,
        expiresAt: created.expiresAt,
        manageToken: created.manageToken,
      });
      setCreatedUrl(created.url);
      setStatus(null);
      requestAnimationFrame(() => {
        document
          .getElementById("generator-tmp-success")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch {
      setError(t.errors.CREATE_FAILED);
    } finally {
      setCreating(false);
    }
  }

  const qtyLabel = quantity.toLocaleString(isFa ? "fa-IR" : "en-US", {
    useGrouping: false,
  });
  const generateLabel = t.generate.replace("{n}", qtyLabel);
  const generatingLabel = t.generating.replace("{n}", qtyLabel);

  const fieldLabels = useMemo(() => {
    if (topic?.id === "orders") {
      return {
        ...t.fields,
        id: isFa ? "کد سفارش" : "Order code",
      };
    }
    return t.fields;
  }, [topic?.id, t.fields, isFa]);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-36 sm:px-6 sm:pb-14 sm:pt-14">
      <header className="mb-8 space-y-2">
        <h1
          className={cn(
            "inline-flex min-w-0 items-center gap-2.5 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl",
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
              className="size-5 rotate-180 sm:size-6"
              strokeWidth={1.75}
              aria-hidden
            />
          </Link>
          <span className="truncate">{t.title}</span>
        </h1>
        <p
          className={cn(
            "max-w-2xl text-[15px] leading-7 text-muted-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.subtitle}
        </p>
      </header>

      <div className="space-y-6">
        <TopicPicker
          value={topicId}
          onChange={selectTopic}
          topicLabels={t.topics}
          categoryLabels={t.categories}
          placeholder={t.selectPlaceholder}
          searchPlaceholder={t.searchPlaceholder}
          label={t.chooseType}
          isFa={isFa}
          emptySearchLabel={t.noTopics}
        />

        {topic ? (
          <SamplePreviewCard
            topicId={topic.id}
            topicName={t.topics[topic.id]?.name ?? topic.id}
            selectedFields={fields}
            fieldLabels={fieldLabels}
            fieldOrder={visibleFields.map((f) => f.id)}
            isFa={isFa}
          />
        ) : (
          <div
            className={cn(
              "rounded-2xl border border-dashed border-border px-4 py-10 text-center",
              isFa && "font-fa-label",
            )}
          >
            <p className="text-[15px] font-medium text-foreground">
              {t.emptyTitle}
            </p>
            {t.emptyBody ? (
              <p className="mt-1 text-[13px] text-muted-foreground">
                {t.emptyBody}
              </p>
            ) : null}
          </div>
        )}

        {topic ? (
          <section className="space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-5">
            <FieldSelector
              fields={visibleFields}
              selected={fields}
              onToggle={toggleField}
              fieldLabels={fieldLabels}
              legend={t.fieldsLegend}
              isFa={isFa}
            />
            <QuantityAndModeRow
              quantity={quantity}
              onQuantityChange={(n) => setQuantity(clampQuantity(n))}
              mode={mode}
              onModeChange={selectMode}
              recordsLabel={t.records}
              customLabel={t.customQty}
              modeLabel={t.outputMode}
              modePayload={t.modePayload}
              modeApi={t.modeApi}
              modeHint={
                mode === "payload" ? t.modePayloadHint : t.modeApiHint
              }
              isFa={isFa}
            />
            <GenerateButton
              label={generating ? generatingLabel : generateLabel}
              loading={generating}
              progress={progress}
              onClick={onGenerate}
              isFa={isFa}
              fullWidth
            />
          </section>
        ) : null}

        {error ? (
          <p
            className={cn(
              "text-[13px] text-red-600 dark:text-red-400",
              isFa && "font-fa-label",
            )}
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {records ? (
          <GeneratedResult
            count={records.length}
            records={records}
            topicId={topicId ?? "data"}
            topicLabel={t.topics[topicId ?? ""]?.name ?? topicId ?? "data"}
            isFa={isFa}
            copyLabel={dict.common.copy}
            downloadLabel={t.download}
            createApiLabel={tmp.create}
            creatingLabel={tmp.creating}
            createdTitle={tmp.createdTitle}
            durationLabel={tmp.durationLabel}
            viewJsonLabel={t.viewJson}
            viewTypeLabel={t.viewType}
            creating={creating}
            createDisabled={!createGate.ok}
            createBlockedReason={createGate.reason}
            duration={duration}
            onDurationChange={setDuration}
            durationLabels={{
              "1h": tmp.duration1h,
              "6h": tmp.duration6h,
              "12h": tmp.duration12h,
              "24h": tmp.duration24h,
            }}
            onDownload={onDownload}
            onCreateApi={onCreateApi}
            createdUrl={createdUrl}
            generatedLabel={t.generated.replace(
              "{n}",
              records.length.toLocaleString(isFa ? "fa-IR" : "en-US"),
            )}
          />
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite">
        {generating
          ? generatingLabel
          : records
            ? t.generated.replace("{n}", String(records.length))
            : ""}
      </p>
      <p className="sr-only">max {GENERATOR_MAX_RECORDS}</p>
    </div>
  );
}

function GenerateButton({
  label,
  loading,
  progress,
  onClick,
  isFa,
  fullWidth,
}: {
  label: string;
  loading: boolean;
  progress: number | null;
  onClick: () => void;
  isFa: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div className={cn("space-y-1.5", fullWidth && "w-full")}>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-[var(--request-fill)] px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40",
          fullWidth && "w-full",
          isFa && "font-fa-label",
        )}
      >
        {label}
      </button>
      {loading && progress !== null ? (
        <div
          className="h-1 overflow-hidden rounded-full bg-border"
          aria-hidden
        >
          <div
            className="h-full bg-foreground/70 transition-[width] duration-200"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
