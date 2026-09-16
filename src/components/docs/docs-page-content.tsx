"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { DocsWhatsNew } from "@/components/docs/docs-whats-new";
import { ResetSeedPanel } from "@/components/docs/reset-seed-panel";
import { VsCodeBlock } from "@/components/docs/vscode-block";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { apiResources, plannedResources } from "@/lib/catalog";
import { RATE_LIMIT } from "@/lib/api/rate-limit";
import { cn } from "@/lib/utils";

const jsExample = `const res = await fetch('/api/posts?limit=6');
const { data, pagination } = await res.json();
console.log(data, pagination);`;

const faExample = `// Persian sample data — English is default
const res = await fetch('/api/users?limit=3&lang=fa');
const { data, font } = await res.json();
// font.cssUrl → Vazirmatn stylesheet for Persian text
console.log(data, font);`;

const faCurlExample = `# Same with curl
curl "http://localhost:3000/api/users?limit=3&lang=fa"`;

const errorExample = `{
  "error": {
    "code": "NOT_FOUND",
    "message": "Post not found"
  }
}`;

const rateLimitExample = `{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Try again in 42s."
  }
}`;

export function DocsPageContent() {
  const { locale, dict } = useUiLocale();
  const limitPerMin = RATE_LIMIT.limit;
  const d = dict.docs;
  const isFa = locale === "fa";
  const allResources = [...apiResources, ...plannedResources];

  const toc = [
    ["#intro", d.toc.intro],
    ["#whats-new", d.toc.whatsNew],
    ["#shared-data", d.toc.sharedData],
    ["#language", d.toc.language],
    ["#resources", d.toc.resources],
    ["#openapi", d.toc.openapi],
    ["#requests", d.toc.requests],
    ["#errors", d.toc.errors],
    ["#rate-limit", d.toc.rateLimit],
    ["#reset", d.toc.reset],
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <nav
            className="sticky top-20 space-y-1 rounded-xl border border-border bg-card p-3 text-[13px]"
            aria-label={d.navLabel}
          >
            <p
              className={cn(
                "mb-2 px-2 text-[10px] tracking-[0.16em] text-muted-foreground uppercase",
                isFa ? "font-fa-label tracking-normal normal-case" : "font-mono",
              )}
            >
              {d.navLabel}
            </p>
            {toc.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  isFa && "font-fa-label",
                )}
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 space-y-14">
          <header className="space-y-3" id="intro">
            <Breadcrumbs
              items={[
                { name: dict.common.home, href: "/", path: "/" },
                { name: dict.common.docs, path: "/docs" },
              ]}
            />
            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              {d.title}
            </h1>
            <p className="max-w-2xl text-[15px] leading-7 text-muted-foreground">
              {d.intro}
            </p>
          </header>

          <section id="whats-new" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              {d.whatsNewTitle}
            </h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              {d.whatsNewBlurb}
            </p>
            <DocsWhatsNew />
          </section>

          <section id="shared-data" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              {d.sharedDataTitle}
            </h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              {d.sharedDataBody}
            </p>
          </section>

          <section id="language" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              {d.languageTitle}
            </h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              {d.languageBody}
            </p>
            <ul className="list-inside list-disc space-y-1.5 text-[14px] leading-6 text-muted-foreground">
              {d.languageBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <div dir="ltr" className="space-y-3">
              <VsCodeBlock code={faExample} language="javascript" />
              <VsCodeBlock code={faCurlExample} language="bash" />
            </div>
          </section>

          <section id="resources" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              {d.resourcesTitle}
            </h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              {d.resourcesBlurb}
            </p>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-start text-[13px]">
                <thead
                  className={cn(
                    "border-b border-border bg-muted text-[10px] tracking-wide text-muted-foreground",
                    isFa
                      ? "font-fa-label font-medium"
                      : "font-mono uppercase",
                  )}
                >
                  <tr>
                    <th className="w-10 px-3 py-2.5 font-medium">{d.colIndex}</th>
                    <th className="px-4 py-2.5 font-medium">{d.colResource}</th>
                    <th className="px-4 py-2.5 font-medium">{d.colBasePath}</th>
                    <th className="px-4 py-2.5 font-medium">{d.colStatus}</th>
                    <th className="px-4 py-2.5 font-medium">{d.colDocs}</th>
                  </tr>
                </thead>
                <tbody>
                  {allResources.map((resource, index) => {
                    const isLive = "endpoints" in resource;
                    const cat = isLive
                      ? dict.catalog[resource.id]
                      : undefined;
                    const title = isLive
                      ? (cat?.title ?? resource.title)
                      : resource.title;
                    const statusLabel = isLive
                      ? d.statusLive
                      : resource.status === "in-development"
                        ? d.statusDev
                        : d.statusSoon;

                    return (
                      <tr
                        key={resource.id}
                        className={cn(
                          "border-b border-border last:border-0",
                          !isLive && "text-muted-foreground",
                        )}
                      >
                        <td className="px-3 py-3 font-mono text-[12px] text-muted-foreground tabular-nums">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className={cn(
                              "font-semibold",
                              !isLive && "text-foreground/70",
                              isFa && "font-fa-label",
                            )}
                          >
                            {title}
                          </div>
                          <div className="text-[12px] text-muted-foreground">
                            {resource.category}
                          </div>
                        </td>
                        <td
                          className={cn(
                            "px-4 py-3 font-mono text-[12px] ltr-tech",
                            isLive && "text-[var(--request)]",
                          )}
                          dir="ltr"
                        >
                          {resource.basePath}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "rounded border px-1.5 py-0.5 text-[10px]",
                              isLive
                                ? "border-[var(--get)]/35 bg-[var(--get)]/15 text-[var(--get)]"
                                : resource.status === "in-development"
                                  ? "border-[var(--patch)]/35 bg-[var(--patch)]/10 text-[var(--patch)]"
                                  : "border-border bg-muted text-muted-foreground",
                              isFa ? "font-fa-label font-medium" : "font-mono",
                            )}
                          >
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {isLive ? (
                            <Link
                              href={resource.href}
                              aria-label={title}
                              title={title}
                              className="inline-flex size-8 items-center justify-center rounded-md text-[var(--response)] transition-colors hover:bg-[var(--surface-hover)]"
                            >
                              <Eye className="size-4" strokeWidth={1.75} />
                            </Link>
                          ) : (
                            <span className="text-[12px]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section id="openapi" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              {d.openapiTitle}
            </h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              {d.openapiBody}
            </p>
            <div className="flex flex-wrap items-center gap-3" dir="ltr">
              <a
                href="/openapi.json"
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-[12px] text-[var(--request)] transition-colors hover:border-[var(--request)]/40"
              >
                GET /openapi.json ↗
              </a>
              <a
                href="/openapi.json"
                download="mockdata.openapi.json"
                className="rounded-md bg-[var(--request)] px-3 py-2 text-[12px] font-semibold text-white"
              >
                {d.download}
              </a>
            </div>
            <div dir="ltr">
              <VsCodeBlock
                code={`# Import into Postman / Insomnia / Swagger
curl -O http://localhost:3000/openapi.json`}
                language="bash"
              />
            </div>
          </section>

          <section id="requests" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              {d.requestsTitle}
            </h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              {d.requestsBody}
            </p>
            <div dir="ltr">
              <VsCodeBlock code={jsExample} language="javascript" />
            </div>
            <p className="text-[13px] leading-6 text-muted-foreground">
              {d.requestsFaNote}{" "}
              <a href="#language" className="text-[var(--request)] hover:underline">
                {d.toc.language}
              </a>
              .
            </p>
          </section>

          <section id="errors" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              {d.errorsTitle}
            </h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              {d.errorsBody}
            </p>
            <div dir="ltr">
              <VsCodeBlock code={errorExample} language="json" />
            </div>
          </section>

          <section id="rate-limit" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              {d.rateLimitTitle}
            </h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              {d.rateLimitBody.replace("{limit}", String(limitPerMin))}
            </p>
            <div dir="ltr">
              <VsCodeBlock code={rateLimitExample} language="json" />
            </div>
          </section>

          <section id="reset" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              {d.resetTitle}
            </h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              {d.resetBody}
            </p>
            <ResetSeedPanel />
          </section>
        </article>
      </div>
    </div>
  );
}
