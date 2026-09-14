import Link from "next/link";
import { CopyButton } from "@/components/docs/copy-button";
import { EndpointTable } from "@/components/docs/endpoint-table";
import { LiveBadge } from "@/components/docs/live-badge";
import {
  QueryParamsTable,
  type QueryParamRow,
} from "@/components/docs/query-params-table";
import {
  RequestPanel,
  type RequestExample,
} from "@/components/docs/request-panel";
import { ResponseViewer } from "@/components/docs/response-viewer";
import { TryExample } from "@/components/docs/try-example";
import type { ApiResource } from "@/lib/catalog";

type Props = {
  resource: ApiResource;
  description: string;
  tryHref: string;
  examples: RequestExample[];
  queryParams?: QueryParamRow[];
  /** Fallback response when examples don't include their own `responseJson`. */
  responseJson?: string;
};

export function ResourceApiDocs({
  resource,
  description,
  tryHref,
  examples,
  queryParams,
  responseJson,
}: Props) {
  const examplesHaveResponses = examples.some((ex) => Boolean(ex.responseJson));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10 space-y-4 border-b border-border pb-8">
        <p className="text-[13px] text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2 text-border">/</span>
          <Link href="/docs" className="hover:text-foreground">
            Docs
          </Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-foreground">{resource.title}</span>
        </p>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                {resource.title}
              </h1>
              <LiveBadge />
            </div>
            <p className="mt-3 max-w-xl text-[14px] leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <code className="rounded-md border border-border bg-muted px-2.5 py-1.5 font-mono text-[12px] text-[var(--request)]">
              {resource.basePath}
            </code>
            <CopyButton value={resource.basePath} />
            <Link
              href={`/playground?resource=${resource.id}`}
              className="rounded-md border border-border bg-muted/40 px-3 py-1.5 text-[12px] hover:border-[var(--request)]/40"
            >
              Open Playground
            </Link>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
        <section className="space-y-3">
          <h2 className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            Endpoints
          </h2>
          <EndpointTable rows={resource.endpoints} />

          {queryParams && queryParams.length > 0 ? (
            <div className="space-y-3 pt-4">
              <h2 className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                Query params
              </h2>
              <QueryParamsTable rows={queryParams} />
            </div>
          ) : null}

          <TryExample href={tryHref} />
        </section>
        <section className="space-y-5">
          <RequestPanel examples={examples} />
          {!examplesHaveResponses && responseJson ? (
            <ResponseViewer prettyJson={responseJson} />
          ) : null}
        </section>
      </div>
    </div>
  );
}
