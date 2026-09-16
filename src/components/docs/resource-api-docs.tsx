"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { ApiBasePath } from "@/components/docs/api-base-path";
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
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import type { ApiResource } from "@/lib/catalog";

type Props = {
  resource: ApiResource;
  description: string;
  examples: RequestExample[];
  queryParams?: QueryParamRow[];
  responseJson?: string;
};

export function ResourceApiDocs({
  resource,
  description,
  examples,
  queryParams,
  responseJson,
}: Props) {
  const { dict } = useUiLocale();
  const examplesHaveResponses = examples.some((ex) => Boolean(ex.responseJson));
  const cat = dict.catalog[resource.id];
  const title = cat?.title ?? resource.title;
  const blurb = cat?.summary ?? description;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10 space-y-4 border-b border-border pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                {title}
              </h1>
              <LiveBadge />
            </div>
            <p className="mt-3 max-w-xl text-[14px] leading-6 text-muted-foreground">
              {blurb}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ApiBasePath path={resource.basePath} />
            <Link
              href={`/preview/${resource.id}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-[12px] hover:border-[var(--request)]/40"
            >
              <Eye className="size-3.5" strokeWidth={1.75} aria-hidden />
              {dict.resourceDocs.preview}
            </Link>
            <Link
              href={`/playground?resource=${resource.id}`}
              className="rounded-md border border-border bg-muted/40 px-3 py-1.5 text-[12px] hover:border-[var(--request)]/40"
            >
              {dict.resourceDocs.playground}
            </Link>
          </div>
        </div>
      </header>

      <div
        className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10"
        dir="ltr"
      >
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
        </section>
        <section className="min-w-0 space-y-5">
          <RequestPanel examples={examples} />
          {!examplesHaveResponses && responseJson ? (
            <ResponseViewer prettyJson={responseJson} />
          ) : null}
        </section>
      </div>
    </div>
  );
}
