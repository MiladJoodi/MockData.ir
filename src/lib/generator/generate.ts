import { GENERATOR_MAX_RECORDS } from "@/lib/generator/constants";
import {
  createRng,
  id as makeId,
  isoDateTime,
} from "@/lib/generator/helpers";
import {
  resolveLocalePack,
  isGeneratorCountryCode,
} from "@/lib/generator/locales";
import type { GeneratorCountryCode } from "@/lib/generator/locales/types";
import { orderedFieldKeys } from "@/lib/generator/modes";
import {
  allowedFieldIds,
  getGeneratorTopic,
} from "@/lib/generator/registry";
import type { GenerateContext, GeneratorTopic, GeneratorTopicId } from "@/lib/generator/types";

export type GenerateBatchInput = {
  topicId: string;
  fields: string[];
  quantity: number;
  country: string;
  uiLocale: "en" | "fa";
  seed?: string;
};

export type GenerateBatchResult =
  | { ok: true; data: Record<string, unknown>[]; topicId: GeneratorTopicId }
  | {
      ok: false;
      error:
        | "INVALID_TOPIC"
        | "INVALID_FIELDS"
        | "INVALID_QUANTITY"
        | "INVALID_COUNTRY";
    };

export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return 10;
  return Math.min(GENERATOR_MAX_RECORDS, Math.max(1, Math.floor(value)));
}

function fillMetaFields(
  row: Record<string, unknown>,
  fields: ReadonlySet<string>,
  ctx: GenerateContext,
  topic: GeneratorTopic,
): Record<string, unknown> {
  const rng = createRng(ctx.seed, ctx.index + 10_000);
  const out: Record<string, unknown> = { ...row };

  if (fields.has("id") && out.id === undefined) {
    out.id = makeId(ctx.pack.code.toLowerCase(), ctx.index, rng);
  }
  if (fields.has("createdAt") && out.createdAt === undefined) {
    out.createdAt = isoDateTime(rng, 400);
  }
  if (fields.has("updatedAt")) {
    out.updatedAt =
      typeof out.createdAt === "string"
        ? out.createdAt
        : isoDateTime(rng, 60);
  }

  const filtered: Record<string, unknown> = {};
  for (const key of orderedFieldKeys(fields, topic)) {
    if (key in out) filtered[key] = out[key];
  }
  return filtered;
}

export function generateBatch(
  input: GenerateBatchInput,
): GenerateBatchResult {
  const topic = getGeneratorTopic(input.topicId);
  if (!topic) return { ok: false, error: "INVALID_TOPIC" };

  const quantity = clampQuantity(input.quantity);
  if (quantity < 1 || quantity > GENERATOR_MAX_RECORDS) {
    return { ok: false, error: "INVALID_QUANTITY" };
  }

  if (!isGeneratorCountryCode(input.country) && input.uiLocale !== "fa") {
    return { ok: false, error: "INVALID_COUNTRY" };
  }

  const allowed = allowedFieldIds(topic);
  const fields = new Set(input.fields.filter((f) => allowed.has(f)));
  if (fields.size === 0) return { ok: false, error: "INVALID_FIELDS" };

  const seed = input.seed ?? `gen-${topic.id}-${Date.now()}`;
  const country =
    input.uiLocale === "fa"
      ? ("IR" as const)
      : (input.country as GeneratorCountryCode | "all");

  const data: Record<string, unknown>[] = [];
  for (let i = 0; i < quantity; i++) {
    const pack = resolveLocalePack(country, i, input.uiLocale);
    const ctx: GenerateContext = {
      index: i,
      seed,
      country,
      pack,
      uiLocale: input.uiLocale,
    };
    data.push(fillMetaFields(topic.generateOne(ctx, fields), fields, ctx, topic));
  }

  return { ok: true, data, topicId: topic.id };
}

export async function generateBatchChunked(
  input: GenerateBatchInput,
  onProgress?: (done: number, total: number) => void,
): Promise<GenerateBatchResult> {
  const topic = getGeneratorTopic(input.topicId);
  if (!topic) return { ok: false, error: "INVALID_TOPIC" };

  const quantity = clampQuantity(input.quantity);
  if (quantity < 1 || quantity > GENERATOR_MAX_RECORDS) {
    return { ok: false, error: "INVALID_QUANTITY" };
  }
  if (!isGeneratorCountryCode(input.country) && input.uiLocale !== "fa") {
    return { ok: false, error: "INVALID_COUNTRY" };
  }

  const allowed = allowedFieldIds(topic);
  const fields = new Set(input.fields.filter((f) => allowed.has(f)));
  if (fields.size === 0) return { ok: false, error: "INVALID_FIELDS" };

  const seed = input.seed ?? `gen-${topic.id}-${Date.now()}`;
  const country =
    input.uiLocale === "fa"
      ? ("IR" as const)
      : (input.country as GeneratorCountryCode | "all");

  const data: Record<string, unknown>[] = [];
  const chunk = quantity >= 200 ? 100 : quantity;

  for (let i = 0; i < quantity; i++) {
    const pack = resolveLocalePack(country, i, input.uiLocale);
    const ctx: GenerateContext = {
      index: i,
      seed,
      country,
      pack,
      uiLocale: input.uiLocale,
    };
    data.push(fillMetaFields(topic.generateOne(ctx, fields), fields, ctx, topic));
    if ((i + 1) % chunk === 0 || i + 1 === quantity) {
      onProgress?.(i + 1, quantity);
      if (i + 1 < quantity) {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
      }
    }
  }

  return { ok: true, data, topicId: topic.id };
}
