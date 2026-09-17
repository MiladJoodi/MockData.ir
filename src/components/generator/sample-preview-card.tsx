"use client";

import { useMemo, type ReactNode } from "react";
import { Star } from "lucide-react";
import { resolveLocalePack } from "@/lib/generator/locales";
import { getGeneratorTopic } from "@/lib/generator/registry";
import type { GeneratorTopicId } from "@/lib/generator/types";
import { cn } from "@/lib/utils";

const MEDIA_KEYS = new Set([
  "avatar",
  "image",
  "cover",
  "poster",
  "logo",
  "flag",
]);

const LTR_KEYS = new Set([
  "id",
  "email",
  "username",
  "website",
  "phone",
  "slug",
  "sku",
  "code",
  "isbn",
  "transactionId",
  "trackingNumber",
  "orderId",
  "actionUrl",
  "latitude",
  "longitude",
  "postalCode",
  "createdAt",
  "updatedAt",
  "hiredAt",
  "publishedAt",
  "expiresAt",
  "orderDate",
  "estimatedDelivery",
  "date",
]);

function toFaDigits(value: string): string {
  return value.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]!);
}

function formatValue(value: unknown, isFa: boolean, fieldId?: string): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") {
    return isFa ? (value ? "بله" : "خیر") : value ? "true" : "false";
  }
  if (typeof value === "number") {
    // Years stay without separators; money/counts get locale separators in the card only.
    if (
      fieldId === "founded" ||
      fieldId === "year" ||
      fieldId === "age" ||
      fieldId === "enrollmentYear"
    ) {
      const raw = String(value);
      return isFa ? toFaDigits(raw) : raw;
    }
    return value.toLocaleString(isFa ? "fa-IR" : "en-US");
  }
  if (typeof value === "string") {
    if (fieldId === "id" && isFa && /^\d+$/.test(value)) {
      return toFaDigits(value);
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (
      fieldId === "items" &&
      value.length > 0 &&
      typeof value[0] === "object" &&
      value[0] !== null
    ) {
      return value
        .map((raw) => {
          const it = raw as Record<string, unknown>;
          const qty = it.quantity ?? 1;
          const name = it.name ?? "—";
          const qtyText =
            typeof qty === "number"
              ? qty.toLocaleString(isFa ? "fa-IR" : "en-US")
              : String(qty);
          return `${qtyText} × ${name}`;
        })
        .join(isFa ? "، " : ", ");
    }
    return value
      .map((v) =>
        typeof v === "string" || typeof v === "number" ? String(v) : JSON.stringify(v),
      )
      .join(", ");
  }
  if (typeof value === "object") {
    if (fieldId === "shippingAddress") {
      const o = value as Record<string, unknown>;
      const parts = [o.street, o.city, o.region, o.country, o.postalCode]
        .filter((p) => p !== undefined && p !== null && String(p).length > 0)
        .map(String);
      if (parts.length > 0) return parts.join(isFa ? "، " : ", ");
    }
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`)
      .join(" · ");
  }
  return String(value);
}

function Stars({ value }: { value: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${filled}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < filled
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-muted-foreground/35",
          )}
          aria-hidden
        />
      ))}
      <span className="ms-1.5 text-[12px] tabular-nums text-muted-foreground">
        {filled}
      </span>
    </span>
  );
}

function Media({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={cn("object-cover", className)} loading="lazy" />
  );
}

export function SamplePreviewCard({
  topicId,
  topicName,
  selectedFields,
  fieldLabels,
  fieldOrder,
  isFa,
}: {
  topicId: GeneratorTopicId;
  topicName: string;
  selectedFields: ReadonlySet<string>;
  fieldLabels: Record<string, string>;
  fieldOrder: string[];
  isFa: boolean;
}) {
  const sample = useMemo(() => {
    const topic = getGeneratorTopic(topicId);
    if (!topic || selectedFields.size === 0) return null;
    const uiLocale = isFa ? ("fa" as const) : ("en" as const);
    const country = isFa ? ("IR" as const) : ("all" as const);
    // FA UI always uses Persian-script Iran pack — never Latin "Ali Ahmadi" / foreign packs.
    const pack = resolveLocalePack(country, 0, uiLocale);
    return topic.generateOne(
      {
        index: 0,
        seed: `preview-${topicId}`,
        country,
        pack,
        uiLocale,
      },
      selectedFields,
    );
  }, [topicId, selectedFields, isFa]);

  if (!sample) return null;

  // Hide technical ids in the card, except orders where id is the order code.
  const showIdInCard = topicId === "orders";
  const orderedKeys = fieldOrder.filter(
    (fid) =>
      (fid !== "id" || showIdInCard) &&
      selectedFields.has(fid) &&
      fid in sample,
  );
  const mediaKey = orderedKeys.find((k) => MEDIA_KEYS.has(k));
  const mediaSrc =
    mediaKey && typeof sample[mediaKey] === "string"
      ? (sample[mediaKey] as string)
      : null;
  const textKeys = orderedKeys.filter((k) => k !== mediaKey);
  const isPortrait = mediaKey === "poster" || mediaKey === "cover";
  const isAvatar = mediaKey === "avatar";
  const isFlag = mediaKey === "flag";
  const HEADER_KEYS = new Set([
    "name",
    "title",
    "user",
    "sender",
  ]);
  // Bold header only beside avatar/flag — everything else is a flat label/value list.
  const headerKey =
    isAvatar || isFlag
      ? textKeys.find((k) => HEADER_KEYS.has(k)) ??
        textKeys.find((k) => k === "name") ??
        textKeys[0]
      : undefined;
  const detailKeys = headerKey
    ? textKeys.filter((k) => k !== headerKey)
    : textKeys;

  return (
    <div className="space-y-2">
      <p
        className={cn(
          "text-[12px] text-muted-foreground",
          isFa && "font-fa-label",
        )}
      >
        {topicName}
      </p>
      <article
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-card",
          isFa && "font-fa-label",
        )}
      >
        <div
          className={cn(
            "flex gap-0",
            mediaSrc && !isAvatar && !isFlag && isPortrait && "flex-row",
            mediaSrc && !isAvatar && !isFlag && !isPortrait && "flex-col sm:flex-row",
          )}
        >
          {mediaSrc && !isAvatar && !isFlag ? (
            <Media
              src={mediaSrc}
              className={cn(
                "shrink-0 bg-muted/40",
                isPortrait
                  ? "aspect-[2/3] w-[5.5rem] sm:w-24"
                  : "h-36 w-full sm:h-auto sm:w-36 sm:self-stretch",
              )}
            />
          ) : null}

          <div className="min-w-0 flex-1 p-3.5 sm:p-4">
            {(isAvatar || isFlag) && mediaSrc ? (
              <div className="mb-3 flex items-center gap-3">
                <Media
                  src={mediaSrc}
                  className={cn(
                    "shrink-0 bg-muted/40",
                    isAvatar ? "size-12 rounded-full" : "h-9 w-14 rounded-md",
                  )}
                />
                {headerKey && sample[headerKey] !== undefined ? (
                  <p className="min-w-0 truncate text-[15px] font-semibold tracking-tight text-foreground">
                    {formatValue(sample[headerKey], isFa, headerKey)}
                  </p>
                ) : null}
              </div>
            ) : headerKey && sample[headerKey] !== undefined ? (
              <p className="mb-3 text-[15px] font-semibold tracking-tight text-foreground">
                {formatValue(sample[headerKey], isFa, headerKey)}
              </p>
            ) : null}

            <dl
              className={cn(
                "grid gap-x-3 gap-y-2.5",
                isFa
                  ? "grid-cols-[5.5rem_minmax(0,1fr)] sm:grid-cols-[6.5rem_minmax(0,1fr)]"
                  : "grid-cols-[6.5rem_minmax(0,1fr)] sm:grid-cols-[7.25rem_minmax(0,1fr)]",
              )}
              dir={isFa ? "rtl" : "ltr"}
            >
              {detailKeys.map((key) => (
                <FieldLine
                  key={key}
                  label={fieldLabels[key] ?? key}
                  value={formatValue(sample[key], isFa, key)}
                  fieldId={key}
                  rawValue={sample[key]}
                  isFa={isFa}
                />
              ))}
            </dl>
          </div>
        </div>
      </article>
    </div>
  );
}

function FieldLine({
  label,
  value,
  fieldId,
  rawValue,
  isFa,
  emphasize,
}: {
  label: string;
  value: string;
  fieldId: string;
  rawValue?: unknown;
  isFa: boolean;
  emphasize?: boolean;
}) {
  const forceLtr = LTR_KEYS.has(fieldId) && !looksPersian(value);
  const longText =
    fieldId === "bio" ||
    fieldId === "body" ||
    fieldId === "description" ||
    fieldId === "comment" ||
    fieldId === "message";

  let display: ReactNode = value;
  if (fieldId === "rating" && typeof rawValue === "number") {
    display = <Stars value={rawValue} />;
  } else if (forceLtr) {
    display = (
      <bdi dir="ltr" className="ltr-tech break-all">
        {value}
      </bdi>
    );
  }

  if (emphasize) {
    return (
      <dd
        className={cn(
          "text-[15px] font-semibold tracking-tight text-foreground",
          isFa && "font-fa-label",
        )}
      >
        {display}
      </dd>
    );
  }

  return (
    <>
      <dt
        className={cn(
          "pt-0.5 text-[11px] leading-5 text-muted-foreground",
          isFa && "font-fa-label",
        )}
      >
        {label}
      </dt>
      <dd
        className={cn(
          "min-w-0 text-[13px] leading-5 text-foreground",
          longText && "whitespace-pre-wrap break-words",
          isFa && fieldId !== "rating" && "font-fa-label",
        )}
      >
        {display}
      </dd>
    </>
  );
}

function looksPersian(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}
