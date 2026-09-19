/**
 * Distinct neutrals (not near-white) so each seed reads as a different
 * placeholder card — cool / warm / stone / slate / olive / charcoal.
 */
const NEUTRAL_PALETTES = [
  { bg: "e8eaed", fg: "5f6368", muted: "80868b" },
  { bg: "dfe3e6", fg: "5c6b73", muted: "84949c" },
  { bg: "e6e2dc", fg: "6b6560", muted: "938c85" },
  { bg: "dde3e0", fg: "556b63", muted: "7a9188" },
  { bg: "e0e0e6", fg: "5c5c6e", muted: "85859a" },
  { bg: "e4e0d8", fg: "6a6458", muted: "948c7c" },
  { bg: "d8dde4", fg: "4a5568", muted: "718096" },
  { bg: "cfd4d8", fg: "4a5560", muted: "718096" },
  { bg: "d6d3d1", fg: "57534e", muted: "78716c" },
  { bg: "cbd5e1", fg: "475569", muted: "64748b" },
  { bg: "d4d4d8", fg: "52525b", muted: "71717a" },
  { bg: "d6d3ce", fg: "5a564e", muted: "7c766c" },
] as const;

/** Simple deterministic hash for seed → number. */
function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Contrast text: white on dark bg, dark on light bg. */
export function contrastFg(bgHex: string): string {
  const hex = bgHex.replace(/^#/, "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma > 0.55 ? "5f6368" : "f3f4f6";
}

function mutedFromFg(fg: string): string {
  const hex = fg.replace(/^#/, "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const mix = (c: number) =>
    Math.round(c + (156 - c) * 0.45)
      .toString(16)
      .padStart(2, "0");
  return `${mix(r)}${mix(g)}${mix(b)}`;
}

export function colorsFromSeed(seed: string): {
  bg: string;
  fg: string;
  muted: string;
} {
  const palette = NEUTRAL_PALETTES[hashSeed(seed) % NEUTRAL_PALETTES.length]!;
  return { ...palette };
}

export function randomColors(): { bg: string; fg: string; muted: string } {
  const seed = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return colorsFromSeed(seed);
}

export function resolveSvgColors(input: {
  seed?: string;
  bg?: string;
  fg?: string;
}): { bg: string; fg: string; muted: string } {
  if (input.bg) {
    const bg = input.bg.replace(/^#/, "");
    const fg = (input.fg ?? contrastFg(bg)).replace(/^#/, "");
    return { bg, fg, muted: mutedFromFg(fg) };
  }
  if (input.seed) return colorsFromSeed(input.seed);
  return randomColors();
}

/** Classic placeholder card: sharp edges; type scales with image size. */
export function buildPlaceholderSvg(input: {
  width: number;
  height: number;
  bg: string;
  fg: string;
  muted?: string;
}): string {
  const w = input.width;
  const h = input.height;
  const bg = input.bg.replace(/^#/, "");
  const fg = input.fg.replace(/^#/, "");
  const muted = (input.muted ?? mutedFromFg(fg)).replace(/^#/, "");
  const minSide = Math.min(w, h);
  // Scale with the image — small canvases stay readable, large ones stay proportional.
  const titleSize = Math.max(7, Math.round(minSide * 0.08));
  const sizeLabelSize = Math.max(6, Math.round(minSide * 0.048));
  const showIcon = minSide >= 64;
  const iconScale = Math.min(minSide * 0.22 / 64, minSide / 280);
  // Match icon frame to canvas orientation (not always landscape).
  const landscape = w >= h;
  const iconW = (landscape ? 64 : 48) * iconScale;
  const iconH = (landscape ? 48 : 64) * iconScale;
  const gap = Math.max(4, titleSize * 0.4);
  const blockH =
    (showIcon ? iconH + gap : 0) + titleSize + gap * 0.65 + sizeLabelSize;
  const blockTop = (h - blockH) / 2;
  const cx = w / 2;
  const iconX = cx - iconW / 2;
  const iconY = blockTop;
  const titleY =
    (showIcon ? iconY + iconH + gap : blockTop) + titleSize * 0.85;
  const sizeY = titleY + gap * 0.7 + sizeLabelSize * 0.85;
  const sizeLabel = `${w} \u00d7 ${h}`;
  const strokeW = Math.max(1, Math.min(4, iconScale * 2));
  const sunCx = (landscape ? 18 : 16) * iconScale;
  const sunCy = (landscape ? 16 : 18) * iconScale;
  const sunR = 5 * iconScale;
  const pathD = landscape
    ? `M${6 * iconScale} ${iconH - 8 * iconScale} L${22 * iconScale} ${28 * iconScale} L${34 * iconScale} ${38 * iconScale} L${46 * iconScale} ${26 * iconScale} L${iconW - 6 * iconScale} ${iconH - 8 * iconScale}`
    : `M${6 * iconScale} ${iconH - 10 * iconScale} L${14 * iconScale} ${36 * iconScale} L${24 * iconScale} ${48 * iconScale} L${34 * iconScale} ${30 * iconScale} L${iconW - 6 * iconScale} ${iconH - 10 * iconScale}`;

  const iconMarkup = showIcon
    ? `<g transform="translate(${iconX} ${iconY})" fill="none" stroke="#${muted}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">
    <rect x="0" y="0" width="${iconW}" height="${iconH}"/>
    <circle cx="${sunCx}" cy="${sunCy}" r="${sunR}" fill="#${muted}" stroke="none" opacity="0.55"/>
    <path d="${pathD}"/>
  </g>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Placeholder ${sizeLabel}">
  <rect width="${w}" height="${h}" fill="#${bg}"/>
  ${iconMarkup}
  <text x="${cx}" y="${titleY}" fill="#${fg}" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="${titleSize}" font-weight="600" text-anchor="middle">Placeholder</text>
  <text x="${cx}" y="${sizeY}" fill="#${muted}" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-size="${sizeLabelSize}" font-weight="500" text-anchor="middle">${sizeLabel}</text>
</svg>`;
}

export const SVG_GENERATE_DELAY_MS = 1000;
