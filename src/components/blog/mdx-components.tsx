import Link from "next/link";
import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import { BlogCodeBlock } from "@/components/blog/blog-code-block";
import { resolveBlogMediaSrc } from "@/lib/blog/assets";
import type { UiLocale } from "@/lib/i18n/constants";
import { cn } from "@/lib/utils";

export type BlogMdxComponentsOptions = {
  postId: string;
  locale?: UiLocale;
};

function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//i.test(href);
}

function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function extractFencedCode(children: ReactNode): {
  code: string;
  language?: string;
} | null {
  const child = Children.toArray(children)[0];
  if (!isValidElement(child)) return null;

  const props = child.props as {
    className?: string;
    children?: ReactNode;
  };

  const className = props.className ?? "";
  const match = /language-([\w+-]+)/.exec(className);
  const raw = props.children;
  const code = Array.isArray(raw)
    ? raw.map(String).join("")
    : typeof raw === "string" || typeof raw === "number"
      ? String(raw)
      : Children.toArray(raw).map(String).join("");

  return {
    code: code.replace(/\n$/, ""),
    language: match?.[1],
  };
}

function looksLikeUrlText(text: string): boolean {
  return /^(https?:\/\/|www\.)/i.test(text.trim());
}

/**
 * MDX element map shared by every Blog article.
 * Pass `postId` so relative images resolve to the post asset folder.
 */
export function createBlogMdxComponents({
  postId,
  locale = "en",
}: BlogMdxComponentsOptions) {
  const isFa = locale === "fa";
  const faLabel = isFa && "font-fa-label";

  return {
    h1: ({ className, ...props }: ComponentPropsWithoutRef<"h1">) => (
      <h1
        className={cn(
          "mt-10 scroll-mt-24 text-xl font-semibold tracking-[-0.02em] text-foreground first:mt-0 sm:mt-12 sm:text-2xl sm:tracking-[-0.03em]",
          faLabel,
          className,
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
      <h2
        className={cn(
          "mt-9 scroll-mt-24 border-b border-border/60 pb-2 text-lg font-semibold tracking-[-0.02em] text-foreground first:mt-0 sm:mt-12 sm:pb-3 sm:text-xl sm:tracking-[-0.03em]",
          faLabel,
          className,
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
      <h3
        className={cn(
          "mt-7 scroll-mt-24 text-base font-semibold tracking-[-0.01em] text-foreground sm:mt-9 sm:text-lg",
          faLabel,
          className,
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }: ComponentPropsWithoutRef<"h4">) => (
      <h4
        className={cn(
          "mt-6 scroll-mt-24 text-[15px] font-semibold text-foreground sm:mt-7 sm:text-base",
          faLabel,
          className,
        )}
        {...props}
      />
    ),
    h5: ({ className, ...props }: ComponentPropsWithoutRef<"h5">) => (
      <h5
        className={cn(
          "mt-5 scroll-mt-24 text-sm font-semibold text-foreground sm:mt-6 sm:text-base",
          faLabel,
          className,
        )}
        {...props}
      />
    ),
    h6: ({ className, ...props }: ComponentPropsWithoutRef<"h6">) => (
      <h6
        className={cn(
          "mt-5 scroll-mt-24 text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:mt-6 sm:text-sm",
          faLabel,
          className,
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
      <p
        className={cn(
          "my-5 text-[15px] leading-7 text-foreground/90 sm:text-base sm:leading-8",
          className,
        )}
        {...props}
      />
    ),
    ul: ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
      <ul
        className={cn(
          "my-5 list-disc space-y-2 pe-1 ps-5 text-[15px] leading-7 text-foreground/90 sm:ps-6 sm:text-base sm:leading-8",
          "marker:text-[var(--request)]",
          className,
        )}
        {...props}
      />
    ),
    ol: ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
      <ol
        className={cn(
          "my-5 list-decimal space-y-2 pe-1 ps-5 text-[15px] leading-7 text-foreground/90 sm:ps-6 sm:text-base sm:leading-8",
          "marker:text-[var(--request)]",
          className,
        )}
        {...props}
      />
    ),
    li: ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
      <li className={cn("leading-7 sm:leading-8", className)} {...props} />
    ),
    blockquote: ({
      className,
      ...props
    }: ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className={cn(
          "my-7 rounded-e-lg border-s-2 border-[var(--request)] bg-[var(--request-bg)]/60 py-3 ps-4 pe-3 text-[15px] leading-7 text-foreground/85 not-italic sm:leading-8",
          "[&_p]:my-0 [&_p]:text-[inherit] [&_p]:leading-[inherit]",
          className,
        )}
        {...props}
      />
    ),
    hr: ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
      <hr className={cn("my-12 border-border/70", className)} {...props} />
    ),
    strong: ({ className, ...props }: ComponentPropsWithoutRef<"strong">) => (
      <strong
        className={cn("font-semibold text-foreground", className)}
        {...props}
      />
    ),
    em: ({ className, ...props }: ComponentPropsWithoutRef<"em">) => (
      <em className={cn("italic", className)} {...props} />
    ),
    a: ({
      href,
      className,
      children,
      ...props
    }: ComponentPropsWithoutRef<"a">) => {
      const targetHref = href ?? "#";
      const childText =
        typeof children === "string"
          ? children
          : Array.isArray(children)
            ? children.filter((c) => typeof c === "string").join("")
            : "";
      const forceLtr =
        isExternalHref(targetHref) ||
        looksLikeUrlText(childText) ||
        /^[a-z][a-z0-9+.-]*:/i.test(targetHref);

      const linkClass = cn(
        "font-medium text-foreground underline decoration-dotted decoration-muted-foreground/70 underline-offset-[0.25em] transition-colors hover:decoration-foreground hover:decoration-solid",
        forceLtr && "ltr-tech",
        className,
      );

      if (isInternalHref(targetHref)) {
        return (
          <Link
            href={targetHref}
            className={linkClass}
            dir={forceLtr ? "ltr" : undefined}
            title={typeof props.title === "string" ? props.title : undefined}
          >
            {children}
          </Link>
        );
      }

      if (isExternalHref(targetHref)) {
        return (
          <a
            href={targetHref}
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            {...props}
          >
            {children}
          </a>
        );
      }

      return (
        <a href={targetHref} className={linkClass} {...props}>
          {children}
        </a>
      );
    },
    img: ({
      src,
      alt,
      className,
      ...props
    }: ComponentPropsWithoutRef<"img">) => {
      const resolved = resolveBlogMediaSrc(
        postId,
        typeof src === "string" ? src : undefined,
      );
      return (
        // Post-authored content; dimensions unknown until Phase layout polish.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          className={cn(
            "my-8 h-auto max-w-full rounded-2xl border border-border/80 shadow-[0_12px_40px_-28px_rgb(20_21_26_/_0.35)]",
            className,
          )}
          {...props}
        />
      );
    },
    table: ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
      <div className="my-8 w-full overflow-x-auto rounded-xl border border-border/80 bg-card/40 shadow-[0_10px_30px_-28px_rgb(20_21_26_/_0.35)]">
        <table
          className={cn(
            "w-full min-w-[20rem] border-collapse text-start text-[13px] sm:text-sm",
            className,
          )}
          {...props}
        />
      </div>
    ),
    thead: ({ className, ...props }: ComponentPropsWithoutRef<"thead">) => (
      <thead
        className={cn(
          "border-b border-border bg-muted/55 [&_th]:bg-transparent",
          className,
        )}
        {...props}
      />
    ),
    tbody: ({ className, ...props }: ComponentPropsWithoutRef<"tbody">) => (
      <tbody
        className={cn(
          "[&_tr]:border-b [&_tr]:border-border/70 [&_tr:last-child]:border-b-0",
          "[&_tr:nth-child(even)]:bg-muted/25",
          className,
        )}
        {...props}
      />
    ),
    tr: ({ className, ...props }: ComponentPropsWithoutRef<"tr">) => (
      <tr className={cn("border-border", className)} {...props} />
    ),
    th: ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
      <th
        className={cn(
          "px-3.5 py-2.5 text-start text-[12px] font-semibold tracking-wide text-muted-foreground sm:px-4",
          faLabel,
          className,
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
      <td
        className={cn(
          "px-3.5 py-2.5 align-middle text-foreground/90 sm:px-4",
          faLabel,
          className,
        )}
        {...props}
      />
    ),
    pre: ({ children }: ComponentPropsWithoutRef<"pre">) => {
      const fenced = extractFencedCode(children);
      if (fenced) {
        return <BlogCodeBlock code={fenced.code} language={fenced.language} />;
      }
      return (
        <pre
          dir="ltr"
          className="ltr-tech my-6 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-[12.5px] leading-6"
        >
          {children}
        </pre>
      );
    },
    code: ({
      className,
      children,
      ...props
    }: ComponentPropsWithoutRef<"code">) => {
      // Fenced blocks are handled by `pre`; this path is inline code only.
      if (className?.includes("language-")) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
      return (
        <code
          dir="ltr"
          className={cn(
            "ltr-tech rounded-md border border-border/80 bg-muted/60 px-1.5 py-0.5 font-mono text-[0.84em] text-foreground",
            className,
          )}
          {...props}
        >
          {children}
        </code>
      );
    },
  };
}

export type BlogMdxComponents = ReturnType<typeof createBlogMdxComponents>;
