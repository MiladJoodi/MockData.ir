import type { Metadata } from "next";
import Link from "next/link";
import { ResetSeedPanel } from "@/components/docs/reset-seed-panel";
import { VsCodeBlock } from "@/components/docs/vscode-block";
import { apiResources, plannedResources } from "@/lib/catalog";
import { RATE_LIMIT } from "@/lib/api/rate-limit";

export const metadata: Metadata = {
  title: "Docs",
  description: "How to use MockData — resources, requests, and errors.",
};

const jsExample = `const res = await fetch('/api/posts?limit=6');
const { data, pagination } = await res.json();
console.log(data, pagination);`;

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

export default function DocsPage() {
  const limitPerMin = RATE_LIMIT.limit;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <nav
            className="sticky top-20 space-y-1 rounded-xl border border-border bg-card p-3 text-[13px]"
            aria-label="Docs"
          >
            <p className="mb-2 px-2 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              Docs
            </p>
            {[
              ["#intro", "Introduction"],
              ["#shared-data", "Shared data"],
              ["#resources", "Resources"],
              ["#openapi", "OpenAPI"],
              ["#requests", "Requests"],
              ["#errors", "Errors"],
              ["#rate-limit", "Rate limit"],
              ["#reset", "Reset seed"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 space-y-14">
          <header className="space-y-3" id="intro">
            <p className="text-[13px] text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span className="mx-2 text-border">/</span>
              Docs
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Documentation
            </h1>
            <p className="max-w-2xl text-[15px] leading-7 text-muted-foreground">
              MockData serves fake REST resources as JSON. Use public resources
              freely, or hit{" "}
              <Link href="/auth" className="text-[var(--request)] hover:underline">
                Auth
              </Link>{" "}
              to practice login success/failure. Try live calls in the{" "}
              <Link
                href="/playground"
                className="text-[var(--request)] hover:underline"
              >
                Playground
              </Link>
              . Production uses one shared database — see{" "}
              <a href="#shared-data" className="text-[var(--request)] hover:underline">
                Shared data
              </a>
              .
            </p>
          </header>

          <section id="shared-data" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Shared data</h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              All visitors share the same live database. Creates, updates, and
              deletes are real and visible to everyone. On production, seed data
              resets automatically once per day via{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                GET /api/cron/reset
              </code>
              . Use this for prototyping and demos — not for storing anything you
              need to keep.
            </p>
          </section>

          <section id="resources" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Resources</h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              Live endpoints you can call today, plus a short roadmap of what is
              next.
            </p>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-border bg-muted font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Resource</th>
                    <th className="px-4 py-2.5 font-medium">Base path</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Docs</th>
                  </tr>
                </thead>
                <tbody>
                  {apiResources.map((resource) => (
                    <tr
                      key={resource.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold">{resource.title}</div>
                        <div className="text-[12px] text-muted-foreground">
                          {resource.category}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px] text-[var(--request)]">
                        {resource.basePath}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded border border-[var(--get)]/30 bg-[var(--get)]/10 px-1.5 py-0.5 font-mono text-[10px] text-[var(--get)]">
                          Live
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={resource.href}
                          className="text-[var(--response)] underline-offset-2 hover:underline"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {plannedResources.map((resource) => (
                    <tr
                      key={resource.id}
                      className="border-b border-border text-muted-foreground last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground/70">
                          {resource.title}
                        </div>
                        <div className="text-[12px]">{resource.category}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px]">
                        {resource.basePath}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            resource.status === "in-development"
                              ? "rounded border border-[var(--patch)]/35 bg-[var(--patch)]/10 px-1.5 py-0.5 font-mono text-[10px] text-[var(--patch)]"
                              : "rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                          }
                        >
                          {resource.status === "in-development"
                            ? "In development"
                            : "Coming soon"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[12px]">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="openapi" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">OpenAPI</h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              Machine-readable catalog of every live endpoint (Auth, Users,
              Posts, Comments, Albums, Photos, Todos, Products, Notifications,
              Countries, and Admin reset). Import into Postman, Swagger UI, or
              AI tools.
            </p>
            <div className="flex flex-wrap items-center gap-3">
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
                className="rounded-md bg-[var(--request)] px-3 py-2 text-[12px] font-semibold text-black"
              >
                Download
              </a>
            </div>
            <VsCodeBlock
              code={`# Import into Postman / Insomnia / Swagger
curl -O http://localhost:3000/openapi.json`}
              language="bash"
            />
          </section>

          <section id="requests" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Requests</h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              Lists return{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-[var(--token)]">
                data
              </code>{" "}
              +{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-[var(--token)]">
                pagination
              </code>
              . Single items return{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                {"{ data }"}
              </code>
              .
            </p>
            <VsCodeBlock code={jsExample} language="javascript" />
          </section>

          <section id="errors" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Errors</h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              Failures use an{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                error
              </code>{" "}
              object. Statuses: 400 validation, 401 unauthorized, 404 missing,
              429 rate limited, 500 server. Pass{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                ?status=500
              </code>{" "}
              (400–599) to force an error for UI demos.
            </p>
            <VsCodeBlock code={errorExample} language="json" />
          </section>

          <section id="rate-limit" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Rate limit</h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              All{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                /api/*
              </code>{" "}
              routes allow about{" "}
              <strong className="font-semibold text-foreground">
                {limitPerMin} requests per IP per minute
              </strong>
              . Responses include{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                X-RateLimit-Limit
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                X-RateLimit-Remaining
              </code>
              , and{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                X-RateLimit-Reset
              </code>
              . Over limit returns{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                429
              </code>{" "}
              with{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                Retry-After
              </code>
              .
            </p>
            <VsCodeBlock code={rateLimitExample} language="json" />
          </section>

          <section id="reset" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Reset seed</h2>
            <p className="text-[14px] leading-6 text-muted-foreground">
              For an immediate reset, use the panel below with the admin secret.
              Production also resets automatically once per day (
              <a href="#shared-data" className="text-[var(--request)] hover:underline">
                Shared data
              </a>
              ).
            </p>
            <ResetSeedPanel />
          </section>
        </article>
      </div>
    </div>
  );
}
