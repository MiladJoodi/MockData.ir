const WORDS_PER_MINUTE = 200;

/**
 * Approximate reading time from MDX/Markdown body text (frontmatter excluded).
 * Uses a simple whitespace word count; minimum 1 minute.
 */
export function estimateReadingTimeMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 1;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
