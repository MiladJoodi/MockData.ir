"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { CopyButton } from "@/components/docs/copy-button";
import { VsCodeBlock } from "@/components/docs/vscode-block";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import {
  IMAGE_DIM_PRESETS,
  IMAGE_MAX_DIM,
  IMAGE_SIZE_PRESETS,
  buildPreviewPath,
  buildPublicImagePath,
  newImageBatchId,
  type ImageSizePresetId,
  type ImageType,
} from "@/lib/image/params";
import { cn } from "@/lib/utils";

const segmentBtn =
  "inline-flex h-9 flex-1 items-center justify-center px-2.5 text-[13px] transition-colors sm:flex-none";

type UsageTab = "url" | "html" | "css" | "js" | "curl";

function clampDim(n: number) {
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(IMAGE_MAX_DIM, Math.floor(n));
}

export function ImageGeneratorPageContent() {
  const { dict, locale } = useUiLocale();
  const t = dict.imageGenerator;
  const isFa = locale === "fa";

  const [type, setType] = useState<ImageType>("svg");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [readySizeId, setReadySizeId] = useState<ImageSizePresetId>("post");
  const [batchId, setBatchId] = useState(newImageBatchId);
  const [previewKey, setPreviewKey] = useState(0);
  const [usageTab, setUsageTab] = useState<UsageTab>("html");
  const [origin, setOrigin] = useState("https://mockdata.ir");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const w = clampDim(width);
  const h = clampDim(height);

  const publicPath = useMemo(
    () => buildPublicImagePath({ width: w, height: h, type }),
    [w, h, type],
  );
  const publicUrl = `${origin}${publicPath}`;

  const previewPath = useMemo(
    () =>
      buildPreviewPath({
        width: w,
        height: h,
        type,
        batchId,
      }),
    [w, h, type, batchId],
  );

  function switchType(next: ImageType) {
    setType(next);
    setGenerating(false);
    setBatchId(newImageBatchId());
  }

  function runGenerate() {
    setWidth(w);
    setHeight(h);
    setBatchId(newImageBatchId());
    setGenerating(true);
    setPreviewKey((k) => k + 1);
  }

  const usageSnippets: Record<UsageTab, string> = {
    url: publicUrl,
    html: `<img\n  src="${publicUrl}"\n  alt="Placeholder"\n/>`,
    css: `background-image: url("${publicUrl}");`,
    js: `const src = "${publicUrl}";\nconst img = new Image();\nimg.src = src;`,
    curl: `curl -L "${publicUrl}" -o placeholder.${type === "svg" ? "svg" : "jpg"}`,
  };

  const usageLang: Record<UsageTab, "javascript" | "bash" | "html" | "css"> = {
    url: "bash",
    html: "html",
    css: "css",
    js: "javascript",
    curl: "bash",
  };

  const usageTabs: { id: UsageTab; label: string }[] = [
    { id: "url", label: t.tabUrl },
    { id: "html", label: t.tabHtml },
    { id: "css", label: t.tabCss },
    { id: "js", label: t.tabJs },
    { id: "curl", label: t.tabCurl },
  ];

  const previewSrc = `${origin}${previewPath}${
    previewPath.includes("?") ? "&" : "?"
  }_=${previewKey}`;

  const labelClass = cn(
    "text-[13px] font-medium text-foreground",
    isFa && "font-fa-label",
  );
  const inputClass =
    "box-border h-9 w-full rounded-md border border-border bg-muted px-3 text-[13px] outline-none focus-visible:border-[var(--request)]/50";

  const sizeSelectId = useId();

  function applySize(nextW: number, nextH: number) {
    setWidth(nextW);
    setHeight(nextH);
    const matched = IMAGE_SIZE_PRESETS.find(
      (p) => p.w === nextW && p.h === nextH,
    );
    if (matched) setReadySizeId(matched.id);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-36 sm:px-6 sm:pt-14 sm:pb-28">
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
              className={cn("size-5 sm:size-6", isFa && "rotate-180")}
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
          {t.blurb}
        </p>
      </header>

      <div className="space-y-6">
        <div
          role="group"
          aria-label={t.title}
          className="inline-flex h-9 w-full overflow-hidden rounded-lg border border-border bg-card divide-x sm:w-auto"
          dir="ltr"
        >
          <button
            type="button"
            aria-pressed={type === "svg"}
            onClick={() => switchType("svg")}
            className={cn(
              segmentBtn,
              type === "svg"
                ? "bg-[var(--request)]/15 font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/40",
            )}
          >
            {t.modeSvg}
          </button>
          <button
            type="button"
            aria-pressed={type === "real"}
            onClick={() => switchType("real")}
            className={cn(
              segmentBtn,
              type === "real"
                ? "bg-[var(--request)]/15 font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/40",
            )}
          >
            {t.modeReal}
          </button>
        </div>

        <div className="space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 sm:items-start">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex min-w-0 flex-col gap-1.5">
                  <span className={labelClass}>{t.width}</span>
                  <input
                    type="number"
                    min={1}
                    max={IMAGE_MAX_DIM}
                    value={width}
                    onChange={(e) =>
                      applySize(clampDim(Number(e.target.value)), height)
                    }
                    className={inputClass}
                    dir="ltr"
                  />
                </label>
                <label className="flex min-w-0 flex-col gap-1.5">
                  <span className={labelClass}>{t.height}</span>
                  <input
                    type="number"
                    min={1}
                    max={IMAGE_MAX_DIM}
                    value={height}
                    onChange={(e) =>
                      applySize(width, clampDim(Number(e.target.value)))
                    }
                    className={inputClass}
                    dir="ltr"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                {IMAGE_DIM_PRESETS.map((p) => {
                  const active = width === p.w && height === p.h;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      dir="ltr"
                      onClick={() => applySize(p.w, p.h)}
                      className={cn(
                        "h-8 rounded-md border px-2.5 font-mono text-[12px] transition-colors",
                        active
                          ? "border-[var(--request)]/40 bg-[var(--request)]/15 font-medium text-foreground"
                          : "border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                      )}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor={sizeSelectId} className={labelClass}>
                {t.readySizes}
              </label>
              <div className="relative">
                <select
                  id={sizeSelectId}
                  value={readySizeId}
                  onChange={(e) => {
                    const preset = IMAGE_SIZE_PRESETS.find(
                      (p) => p.id === e.target.value,
                    );
                    if (!preset) return;
                    setReadySizeId(preset.id);
                    setWidth(preset.w);
                    setHeight(preset.h);
                  }}
                  className={cn(
                    "h-9 w-full appearance-none rounded-md border border-border bg-muted pe-9 ps-3 text-[13px] outline-none transition-colors focus-visible:border-[var(--request)]/50",
                    isFa && "font-fa-label",
                  )}
                >
                  {IMAGE_SIZE_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t.sizes[p.id]} · {p.w}×{p.h}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={runGenerate}
            disabled={generating}
            className={cn(
              "h-10 w-full rounded-md bg-[var(--request-fill)] text-[14px] font-semibold text-white disabled:opacity-50",
              isFa && "font-fa-label",
            )}
          >
            {generating ? t.generating : t.generate}
          </button>
        </div>

        <div className="space-y-2 rounded-xl border border-[var(--response)]/30 bg-[var(--response-bg)] px-3.5 py-3">
          <p
            className={cn(
              "text-[12px] font-medium text-[var(--response)]",
              isFa && "font-fa-label",
            )}
          >
            {t.yourUrl}
          </p>
          <div className="flex w-full items-center justify-start gap-1" dir="ltr">
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="max-w-[calc(100%-2rem)] truncate font-mono text-[12px] text-[var(--response)] underline-offset-2 hover:underline"
            >
              {publicUrl}
            </a>
            <CopyButton
              value={publicUrl}
              label={dict.common.copy}
              className="size-7 shrink-0 text-[var(--response)] hover:bg-[var(--response)]/15 hover:text-[var(--response)]"
            />
          </div>
        </div>

        <section className="space-y-3">
          <h2 className={cn("text-[14px] font-medium", isFa && "font-fa-label")}>
            {t.preview}
          </h2>
          <div className="relative overflow-hidden rounded-xl border border-border bg-muted/30">
            <div className="relative flex aspect-[4/3] items-center justify-center p-3 sm:aspect-[16/10]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={previewSrc}
                src={previewSrc}
                alt="Placeholder"
                className={cn(
                  "max-h-full max-w-full rounded-lg object-contain transition-opacity duration-200",
                  generating && "opacity-40",
                )}
                onLoad={() => setGenerating(false)}
                onError={() => setGenerating(false)}
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className={cn("text-[14px] font-medium", isFa && "font-fa-label")}>
            {t.useInProject}
          </h2>
          <div role="tablist" className="flex flex-wrap gap-1" dir="ltr">
            {usageTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={usageTab === tab.id}
                onClick={() => setUsageTab(tab.id)}
                className={cn(
                  "rounded-md px-2.5 py-1.5 font-mono text-[11px] transition-colors",
                  usageTab === tab.id
                    ? "border border-[var(--request)]/40 bg-[var(--request)]/15 text-foreground"
                    : "text-muted-foreground hover:bg-muted/40",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <VsCodeBlock
            code={usageSnippets[usageTab]}
            language={usageLang[usageTab]}
            showLineNumbers={usageTab !== "url"}
          />
        </section>
      </div>
    </div>
  );
}
