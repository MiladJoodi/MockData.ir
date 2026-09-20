/**
 * Thrown when Blog MDX content is missing or fails validation.
 * Callers (build / routes) can surface the message as-is.
 */
export class BlogContentError extends Error {
  readonly postId?: string;
  readonly locale?: string;
  readonly filePath?: string;

  constructor(
    message: string,
    options?: { postId?: string; locale?: string; filePath?: string },
  ) {
    super(message);
    this.name = "BlogContentError";
    this.postId = options?.postId;
    this.locale = options?.locale;
    this.filePath = options?.filePath;
  }
}
