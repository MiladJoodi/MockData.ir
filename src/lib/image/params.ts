import { z } from "zod";

export const IMAGE_MAX_DIM = 4000;

/** Numeric quick chips under the inputs. */
export const IMAGE_DIM_PRESETS = [
  { w: 150, h: 150, label: "150×150" },
  { w: 300, h: 300, label: "300×300" },
  { w: 800, h: 600, label: "800×600" },
  { w: 1200, h: 800, label: "1200×800" },
] as const;

/** Named ready sizes — fill width/height via the dropdown. */
export const IMAGE_SIZE_PRESETS = [
  { id: "avatar", w: 64, h: 64 },
  { id: "thumbnail", w: 150, h: 150 },
  { id: "profile", w: 400, h: 400 },
  { id: "square", w: 600, h: 600 },
  { id: "post", w: 800, h: 600 },
  { id: "cover", w: 1200, h: 630 },
  { id: "banner", w: 1200, h: 400 },
  { id: "story", w: 1080, h: 1920 },
] as const;

export type ImageSizePresetId = (typeof IMAGE_SIZE_PRESETS)[number]["id"];

export type ImageType = "svg" | "real";

const dimSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(IMAGE_MAX_DIM);

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#?[0-9a-fA-F]{6}$/, "Invalid color")
  .transform((v) => v.replace(/^#/, "").toLowerCase());

const seedSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z0-9_-]+$/, "Invalid seed");

export const imageQuerySchema = z.object({
  type: z.enum(["svg", "real"]).default("svg"),
  seed: seedSchema.optional(),
  bg: hexColorSchema.optional(),
  fg: hexColorSchema.optional(),
});

export type ImageQuery = z.infer<typeof imageQuerySchema>;

export function parseImageDims(width: string, height: string) {
  const w = dimSchema.safeParse(width);
  const h = dimSchema.safeParse(height);
  if (!w.success) {
    return { ok: false as const, error: w.error };
  }
  if (!h.success) {
    return { ok: false as const, error: h.error };
  }
  return { ok: true as const, width: w.data, height: h.data };
}

export function parseImageQuery(searchParams: URLSearchParams) {
  return imageQuerySchema.safeParse({
    type: searchParams.get("type") ?? undefined,
    seed: searchParams.get("seed") ?? undefined,
    bg: searchParams.get("bg") ?? undefined,
    fg: searchParams.get("fg") ?? undefined,
  });
}

/** Build public path for one image (relative). */
export function buildImagePath(input: {
  width: number;
  height: number;
  type?: ImageType;
  seed?: string;
  bg?: string;
  fg?: string;
}): string {
  const params = new URLSearchParams();
  const type = input.type ?? "svg";
  if (type !== "svg") params.set("type", type);
  if (input.seed) params.set("seed", input.seed);
  if (input.bg) params.set("bg", input.bg.replace(/^#/, ""));
  if (input.fg) params.set("fg", input.fg.replace(/^#/, ""));
  const qs = params.toString();
  return `/image/${input.width}/${input.height}${qs ? `?${qs}` : ""}`;
}

export function newImageBatchId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Public API path for copy/usage — only the queries the caller needs.
 * Random by default: no `seed`. Pass `seed` only when pinning a stable image.
 */
export function buildPublicImagePath(input: {
  width: number;
  height: number;
  type: ImageType;
  seed?: string;
  bg?: string;
  fg?: string;
}): string {
  return buildImagePath(input);
}

/**
 * Preview-only path. Seed is a UI helper so Generate refreshes the sample —
 * not part of the public copy URL.
 */
export function buildPreviewPath(input: {
  width: number;
  height: number;
  type: ImageType;
  batchId: string;
}): string {
  return buildImagePath({
    width: input.width,
    height: input.height,
    type: input.type,
    seed: input.batchId,
  });
}
